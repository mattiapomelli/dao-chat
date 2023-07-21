import { GroupChat } from "@xmtp/xmtp-js";
import { useMutation } from "wagmi";

import { useXmtp } from "@providers/xmtp-provider";

interface SendMessageOptions {
  onSuccess?: () => void;
}

interface SendMessageParams {
  title: string;
}

export const useCreateConversation = (options?: SendMessageOptions) => {
  const { client } = useXmtp();

  return useMutation(
    async ({ title }: SendMessageParams) => {
      if (!client) return;

      const memberAddresses = [
        "0x997b456Be586997A2F6d6D650FC14bF5843c92B2",
        "0x498c3DdbEe3528FB6f785AC150C9aDb88C7d372c",
      ];
      const groupConversation = await client.conversations.newGroupConversation(
        memberAddresses,
      );

      const groupChat = await GroupChat.fromConversation(
        client,
        groupConversation,
      );
      await groupChat.changeTitle(title);
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
