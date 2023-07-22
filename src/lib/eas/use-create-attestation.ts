import { useMutation } from "@tanstack/react-query";
import { Conversation } from "@xmtp/xmtp-js";

import { ContentTypeEasAttestationKey } from "@lib/conversation/eas-attestation-codec";
import { useXmtp } from "@providers/xmtp-provider";

interface UseCreateAttestationOptions {
  conversation: Conversation;
  onSuccess?: (attestationUid: string) => void;
}

interface UseCreateAttestationParams {
  proposalId: string;
  choice: number;
}

export const useCreateAttestation = ({
  conversation,
  onSuccess,
}: UseCreateAttestationOptions) => {
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

      // Send vote message on XMTP
      await conversation.send(
        {
          attestationUid: data.data.attestationUid,
        },
        {
          contentType: ContentTypeEasAttestationKey,
          contentFallback: "This is an EAS Attestation",
        },
      );

      return data.data.attestationUid;
    },
    {
      onSuccess,
    },
  );
};
