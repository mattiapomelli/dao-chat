import { AttestationShareablePackageObject } from "@ethereum-attestation-service/eas-sdk";
import axios from "axios";

import { EAS_CONFIG } from "./config";
import { StoreAttestationRequest, StoreIPFSActionReturn } from "./types";

export async function submitSignedAttestation(
  pkg: AttestationShareablePackageObject,
) {
  const data: StoreAttestationRequest = {
    filename: `eas.txt`,
    textJson: JSON.stringify(pkg),
  };

  console.log(JSON.stringify(pkg));

  return await axios.post<StoreIPFSActionReturn>(
    `${EAS_CONFIG.baseUrl}/offchain/store`,
    data,
  );
}
