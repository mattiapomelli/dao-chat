import { useQuery } from "@tanstack/react-query";
import { Conversation } from "@xmtp/xmtp-js";

import { useXmtp } from "@providers/xmtp-provider";

interface UseMessageOptions {
  conversation: Conversation;
}

export const useMessages = ({ conversation }: UseMessageOptions) => {
  const { client } = useXmtp();

  return useQuery({
    queryKey: ["messages", conversation.context?.conversationId],
    queryFn: async () => {
      if (!client) return [];

      const messages = await conversation.messages();

      return messages.filter(
        (message) => message.contentType.typeId !== "groupChatTitleChanged",
      );
    },
    enabled: !!client,
  });
};
