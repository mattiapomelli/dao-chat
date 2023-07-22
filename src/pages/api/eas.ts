import {
  AttestationShareablePackageObject,
  EAS,
  SchemaEncoder,
} from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";

import { EAS_CONFIG } from "@lib/eas/config";
import { submitSignedAttestation } from "@lib/eas/submit-attestation";
import { env } from "env.mjs";

import type { NextApiRequest, NextApiResponse } from "next";

const eas = new EAS(EAS_CONFIG.address);
const privateKey = env.EAS_SIGNER_PRIVATE_KEY;

const SCHEMA_UID =
  "0x32e5d6d35c252c5d52d72a8e989d460c78816386fa20478a0464fa46de775267";
const REF_UID =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

export type Reply = {
  message?: string;
  data?: any;
};

interface RequestBody {
  address?: string;
  proposalId?: string;
  choice?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Reply>,
) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Method not allowed" });
  }

  const { address, proposalId, choice } = req.body as RequestBody;

  // Check if the request body is valid
  if (!address || !proposalId || !choice) {
    return res.status(400).send({ message: "Invalid request" });
  }

  const provider = ethers.providers.getDefaultProvider("sepolia");
  const wallet = new ethers.Wallet(privateKey, provider);

  eas.connect(wallet);
  const offchain = await eas.getOffchain();

  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder(
    "string snapshotProposalId,uint8 choice",
  );
  const encodedData = schemaEncoder.encodeData([
    { name: "snapshotProposalId", value: proposalId, type: "string" },
    { name: "choice", value: choice, type: "uint8" },
  ]);

  const offchainAttestation = await offchain.signOffchainAttestation(
    {
      recipient: address,
      // Unix timestamp of when attestation expires. (0 for no expiration)
      expirationTime: 0,
      // Unix timestamp of current time
      time: Math.floor(Date.now() / 1000),
      revocable: false,
      version: 1,
      nonce: 0,
      schema: SCHEMA_UID,
      refUID: REF_UID,
      data: encodedData,
    },
    wallet,
  );

  const pkg: AttestationShareablePackageObject = {
    signer: wallet.address,
    sig: offchainAttestation,
  };

  await submitSignedAttestation(pkg);

  return res
    .status(200)
    .send({ data: { attestationUid: offchainAttestation.uid } });
}
