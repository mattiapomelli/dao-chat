import { useQuery } from "@tanstack/react-query";
import { Conversation } from "@xmtp/xmtp-js";
import { useAccount } from "wagmi";

import { useXmtp } from "@providers/xmtp-provider";
import { ConversationWithTitle } from "types/xmtp";

const getConversationTitle = async (conversation: Conversation) => {
  const lastMessages = await conversation.messages({
    limit: 1,
  });
  const lastMessage = lastMessages[0];
  if (!lastMessage) return "Untitled";

  if (lastMessage.contentType.typeId !== "groupChatTitleChanged")
    return "Untitled";
  return lastMessage.content.newTitle;
};

export const useConversations = () => {
  const { address } = useAccount();
  const { client } = useXmtp();

  return useQuery({
    queryKey: ["conversations", address],
    queryFn: async () => {
      if (!client) return [];
      const conversations = await client.conversations.list();

      const groupConversations = conversations.filter((c) =>
        c.context?.conversationId.startsWith("xmtp.org/groups/"),
      );

      const conversationsWithTitles: ConversationWithTitle[] =
        await Promise.all(
          groupConversations.map(async (conversation) => {
            const title = await getConversationTitle(conversation);
            return Object.assign(conversation, { title });
          }),
        );

      // console.log("conversationsWithTitles", conversationsWithTitles);

      return conversationsWithTitles.reverse();
    },
    enabled: !!client,
  });
};
