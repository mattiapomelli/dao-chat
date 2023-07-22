import { useMutation } from "@tanstack/react-query";
import { ISuccessResult } from "@worldcoin/idkit";
import { useAccount } from "wagmi";

import { env } from "env.mjs";

export const useVerifyWithWorldcoin = () => {
  const { address } = useAccount();

  return useMutation(async (result: ISuccessResult) => {
    const reqBody = {
      merkle_root: result.merkle_root,
      nullifier_hash: result.nullifier_hash,
      proof: result.proof,
      credential_type: result.credential_type,
      action: env.NEXT_PUBLIC_WLD_ACTION_NAME,
      signal: "",
      userAddress: address,
    };
    fetch("/api/verify-worldcoin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    }).then(async (res: Response) => {
      if (res.status == 200) {
        console.log("Successfully verified credential.");
      } else {
        throw (
          new Error("Error: " + (await res.json()).code) ?? "Unknown error."
        );
      }
    });
  });
};
