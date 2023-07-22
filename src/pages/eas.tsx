import {
  AttestationShareablePackageObject,
  EAS,
  SchemaEncoder,
} from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { useEffect } from "react";
import { useAccount, useSigner } from "wagmi";

import { Button } from "@components/basic/button";
import { EAS_CONFIG } from "@lib/eas/config";
import { submitSignedAttestation } from "@lib/eas/submit-attestation";

const privateKey =
  "8b627bd03db5a0f05cfd2154361e2468db36cfae67986252c55e13e351f2d1e2";

const eas = new EAS(EAS_CONFIG.address);

export default function EasPage() {
  const { address } = useAccount();
  const { data: signer } = useSigner();

  useEffect(() => {
    if (!signer) return;

    // Connects an ethers style provider/signingProvider to perform read/write functions.
    // MUST be a signer to do write operations!
    eas.connect(signer);
  }, [signer]);

  const createAttestation = async () => {
    if (!address || !signer) return;

    const offchain = await eas.getOffchain();
    const provider = ethers.providers.getDefaultProvider("sepolia");
    const wallet = new ethers.Wallet(privateKey, provider);

    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder(
      "string snapshotProposalId,uint8 choice",
    );
    const encodedData = schemaEncoder.encodeData([
      { name: "snapshotProposalId", value: "abcd", type: "string" },
      { name: "choice", value: 1, type: "uint8" },
    ]);

    const offchainAttestation = await offchain.signOffchainAttestation(
      {
        recipient: "0x0F45421E8DC47eF9edd8568a9D569b6fc7Aa7AC6",
        // Unix timestamp of when attestation expires. (0 for no expiration)
        expirationTime: 0,
        // Unix timestamp of current time
        time: Math.floor(Date.now() / 1000),
        revocable: false,
        version: 1,
        nonce: 0,
        schema:
          "0x32e5d6d35c252c5d52d72a8e989d460c78816386fa20478a0464fa46de775267",
        refUID:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        data: encodedData,
      },
      wallet,
    );

    const pkg: AttestationShareablePackageObject = {
      signer: wallet.address,
      sig: offchainAttestation,
    };

    await submitSignedAttestation(pkg);

    console.log(
      "link",
      `https://sepolia.easscan.org/offchain/attestation/view/${offchainAttestation.uid}`,
    );
  };

  return (
    <div>
      <Button onClick={createAttestation}>Create Attestation</Button>
    </div>
  );
}
