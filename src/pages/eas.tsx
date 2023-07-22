import {
  EAS,
  // Offchain,
  SchemaEncoder,
  // SchemaRegistry,
} from "@ethereum-attestation-service/eas-sdk";
// import axios from "axios";
import { ethers } from "ethers";
import { useEffect } from "react";
import { useAccount } from "wagmi";

import { Button } from "@components/basic/button";
// import { CHAINS } from "@constants/chains";

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

const privateKey =
  "8b627bd03db5a0f05cfd2154361e2468db36cfae67986252c55e13e351f2d1e2";

const eas = new EAS(EASContractAddress);

// export type EASChainConfig = {
//   chainId: number;
//   chainName: string;
//   version: string;
//   contractAddress: string;
//   schemaRegistryAddress: string;
//   etherscanURL: string;
//   /** Must contain a trailing dot (unless mainnet). */
//   subdomain: string;
//   contractStartBlock: number;
//   rpcProvider: string;
// };

// export const EAS_CHAIN_CONFIGS: EASChainConfig[] = [
//   {
//     chainId: 11155111,
//     chainName: "sepolia",
//     subdomain: "sepolia.",
//     version: "0.26",
//     contractAddress: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
//     schemaRegistryAddress: "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0",
//     etherscanURL: "https://sepolia.etherscan.io",
//     contractStartBlock: 2958570,
//     rpcProvider: `https://sepolia.infura.io/v3/`,
//   },
// ];

// export const activeChainConfig = EAS_CHAIN_CONFIGS[0];

// export const baseURL = `https://${activeChainConfig.subdomain}easscan.org`;

// export async function getAttestation(uid: string): Promise<any> {
//   const response = await axios.post(
//     `${baseURL}/graphql`,
//     {
//       query:
//         "query Query($where: AttestationWhereUniqueInput!) {\n  attestation(where: $where) {\n    id\n    attester\n    recipient\n    revocationTime\n    expirationTime\n    time\n    txid\n    data\n  }\n}",
//       variables: {
//         where: {
//           id: uid,
//         },
//       },
//     },
//     {
//       headers: {
//         "content-type": "application/json",
//       },
//     },
//   );
//   return response.data.data.attestation;
// }

export default function EasPage() {
  const { address } = useAccount();

  useEffect(() => {
    const connectEas = async () => {
      // Initialize the sdk with the address of the EAS Schema contract address

      // Gets a default provider (in production use something else like infura/alchemy)
      const provider = ethers.providers.getDefaultProvider("sepolia");

      // Connects an ethers style provider/signingProvider to perform read/write functions.
      // MUST be a signer to do write operations!
      eas.connect(provider);

      console.log("Connected to EAS");

      // const uid =
      //   "0x10e4079bc6309830f6ea958adc9623b4cdb42d0e93d2ddc27f77cd17a8155863";

      // const attestation = await eas.getAttestation(uid);

      // console.log("Attestation: ", attestation);
    };

    connectEas();
  }, []);

  const createAttestation = async () => {
    if (!address) return;

    const offchain = await eas.getOffchain();

    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder(
      "string snapshotProposalId, uint8 choice",
    );
    const encodedData = schemaEncoder.encodeData([
      { name: "snapshotProposalId", value: "abcd", type: "string" },
      { name: "choice", value: 1, type: "uint8" },
    ]);

    // const wallet = ethers.Wallet.createRandom();
    const provider = ethers.providers.getDefaultProvider("sepolia");
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log("Wallet: ", wallet.address);

    const offchainAttestation = await offchain.signOffchainAttestation(
      {
        recipient: "0x0F45421E8DC47eF9edd8568a9D569b6fc7Aa7AC6",
        // Unix timestamp of when attestation expires. (0 for no expiration)
        expirationTime: 0,
        // Unix timestamp of current time
        time: Math.floor(new Date().getTime() / 1000),
        revocable: true,
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

    console.log("offchainAttestation", offchainAttestation);

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
