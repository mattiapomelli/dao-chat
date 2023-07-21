import { Conversation } from "@xmtp/xmtp-js";
import { useMutation } from "wagmi";

import { useXmtp } from "@providers/xmtp-provider";

interface SendMessageOptions {
  conversation: Conversation;
  onSuccess?: () => void;
}

interface SendMessageParams {
  content: string;
}

export const useSendMessage = ({
  conversation,
  onSuccess,
}: SendMessageOptions) => {
  const { client } = useXmtp();

  return useMutation(
    async ({ content }: SendMessageParams) => {
      if (!client) return;

      const message = await conversation.send(content);
      console.log("Sent Message", message);
    },
    {
      onSuccess,
    },
  );
};
