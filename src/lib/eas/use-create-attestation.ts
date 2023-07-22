import { useMutation } from "@tanstack/react-query";

interface UseCreateAttestationOptions {
  onSuccess?: (attestationUid: string) => void;
}

export const useCreateAttestation = (options?: UseCreateAttestationOptions) => {
  return useMutation(
    async () => {
      const res = await fetch("/api/eas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: "0x123",
          proposalId: "0x456",
          choice: 1,
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
