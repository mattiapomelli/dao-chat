import {
  AttestationShareablePackageObject,
  EAS,
  SchemaEncoder,
  createOffchainURL,
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
    if (!address || !signer) return;

    const connectEas = async () => {
      // Initialize the sdk with the address of the EAS Schema contract address

      // Gets a default provider (in production use something else like infura/alchemy)
      const provider = ethers.providers.getDefaultProvider("sepolia");

      // Connects an ethers style provider/signingProvider to perform read/write functions.
      // MUST be a signer to do write operations!
      eas.connect(signer);

      console.log("Connected to EAS");

      // const uid =
      //   "0x10e4079bc6309830f6ea958adc9623b4cdb42d0e93d2ddc27f77cd17a8155863";
      // const attestation = await eas.getAttestation(uid);

      // console.log("Attestation: ", attestation);
    };

    connectEas();
  }, [address, signer]);

  const createAttestation = async () => {
    if (!address || !signer) return;

    eas.connect(signer);

    const offchain = await eas.getOffchain();

    const schemaEncoder = new SchemaEncoder("bool confirm");
    const encodedData = schemaEncoder.encodeData([
      { name: "confirm", type: "bool", value: true },
    ]);

    const CUSTOM_SCHEMAS = {
      MET_IRL_SCHEMA:
        "0xc59265615401143689cbfe73046a922c975c99d97e4c248070435b1104b2dea7",
      CONFIRM_SCHEMA:
        "0x4eb603f49d68888d7f8b1fadd351b35a252f287ba465408ceb2b1e1e1efd90d5",
    };
    const signedOffchainAttestation = await offchain.signOffchainAttestation(
      {
        schema: CUSTOM_SCHEMAS.CONFIRM_SCHEMA,
        recipient: ethers.constants.AddressZero,
        refUID: data.id,
        data: encoded,
        time: dayjs().unix(),
        revocable: true,
        expirationTime: 0,
        version: 1,
        nonce: 0,
      },
      signer as unknown as TypedDataSigner, // Wagmi doesnt believe signer is typeddatasigner
    );

    const pkg: AttestationShareablePackageObject = {
      signer: address,
      sig: signedOffchainAttestation,
    };

    const result = await submitSignedAttestation(pkg);

    // _________

    // Initialize SchemaEncoder with the schema string
    // const schemaEncoder = new SchemaEncoder(
    //   "string snapshotProposalId,uint8 choice",
    // );
    // const encodedData = schemaEncoder.encodeData([
    //   { name: "snapshotProposalId", value: "abcd", type: "string" },
    //   { name: "choice", value: 1, type: "uint8" },
    // ]);

    // const wallet = ethers.Wallet.createRandom();
    // const provider = ethers.providers.getDefaultProvider("sepolia");
    // const wallet = new ethers.Wallet(privateKey, provider);

    // console.log("Wallet: ", wallet.address);

    // const offchainAttestation = await offchain.signOffchainAttestation(
    //   {
    //     recipient: "0x0F45421E8DC47eF9edd8568a9D569b6fc7Aa7AC6",
    //     // Unix timestamp of when attestation expires. (0 for no expiration)
    //     expirationTime: 0,
    //     // Unix timestamp of current time
    //     time: Math.floor(Date.now() / 1000),
    //     revocable: false,
    //     version: 1,
    //     nonce: 0,
    //     schema:
    //       "0x32e5d6d35c252c5d52d72a8e989d460c78816386fa20478a0464fa46de775267",
    //     refUID:
    //       "0x0000000000000000000000000000000000000000000000000000000000000000",
    //     data: encodedData,
    //   },
    //   wallet,
    // );
    // console.log("offchainAttestation", offchainAttestation);

    // const url = createOffchainURL({
    //   signer: wallet.address,
    //   sig: offchainAttestation,
    // });

    // console.log("url", url);

    // const pkg: AttestationShareablePackageObject = {
    //   signer: address,
    //   sig: offchainAttestation,
    // };

    // const result = await submitSignedAttestation(pkg);
    // console.log("Result: ", result);

    const attestation = await eas.getAttestation(offchainAttestation.uid);
    console.log("Created attestation", attestation);

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
