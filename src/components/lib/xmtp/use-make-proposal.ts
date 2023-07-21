import { Conversation } from "@xmtp/xmtp-js";
import { useMutation } from "wagmi";

import { useXmtp } from "@providers/xmtp-provider";

import { ContentTypePollKey } from "./poll-codec";

interface MakeProposalOptions {
  conversation: Conversation;
  onSuccess?: () => void;
}

interface MakeProposalParams {
  proposal: string;
  options: string[];
}

export const useMakeProposal = ({
  conversation,
  onSuccess,
}: MakeProposalOptions) => {
  const { client } = useXmtp();

  return useMutation(
    async ({ proposal, options }: MakeProposalParams) => {
      if (!client) return;

      const message = await conversation.send(
        {
          question: proposal,
          options,
        },
        {
          contentType: ContentTypePollKey,
          contentFallback: "This is an audio recording",
        },
      );
      console.log("Sent Message", message);
    },
    {
      onSuccess,
    },
  );
};
