import { useMutation } from "@tanstack/react-query";

import { useXmtp } from "@providers/xmtp-provider";

interface UseCreateAttestationOptions {
  onSuccess?: (attestationUid: string) => void;
}

interface UseCreateAttestationParams {
  proposalId: string;
  choice: number;
}

export const useCreateAttestation = (options?: UseCreateAttestationOptions) => {
  const { userAddress } = useXmtp();

  return useMutation(
    async ({ choice, proposalId }: UseCreateAttestationParams) => {
      const res = await fetch("/api/eas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: userAddress,
          proposalId,
          choice,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      return data.data.attestationUid;
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
