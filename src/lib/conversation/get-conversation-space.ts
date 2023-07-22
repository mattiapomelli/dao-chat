import { useQuery } from "@tanstack/react-query";
import { Conversation } from "@xmtp/xmtp-js";

import { useXmtp } from "@providers/xmtp-provider";

import { useMessages } from "./use-messages";

interface UseMessageOptions {
  conversation: Conversation;
}

export const useConversationSpace = ({ conversation }: UseMessageOptions) => {
  const { client } = useXmtp();
  const { data: messages } = useMessages({
    conversation,
  });

  return useQuery({
    queryKey: ["conversation-space", conversation.context?.conversationId],
    queryFn: async () => {
      if (!client || !messages) return [];

      const updateMetadataMessage = messages.find(
        (message) => message.contentType.typeId === "updateMetadata",
      );

      return updateMetadataMessage?.content.metadata.space;
    },
    enabled: !!client,
  });
};
