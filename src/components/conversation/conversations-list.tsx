import cx from "classnames";

import { Button } from "@components/basic/button";
import { useConversations } from "@lib/conversation/use-conversations";
import { useCreateConversation } from "@lib/conversation/use-create-conversation";
import { useXmtp } from "@providers/xmtp-provider";
import { ConversationWithTitle } from "types/xmtp";

import { ConversationPreview } from "./conversation-preview";

interface ConversationsListProps {
  selectedConversation: ConversationWithTitle | null;
  onSelectConversation: (conversation: ConversationWithTitle) => void;
  className?: string;
}

export const ConversationsList = ({
  onSelectConversation,
  selectedConversation,
  className,
}: ConversationsListProps) => {
  const { isConnected, connect } = useXmtp();
  const { data: conversations, refetch } = useConversations();

  const { mutate: createConversation } = useCreateConversation({
    onSuccess() {
      refetch();
    },
  });

  const onCreateConversation = async () => {
    createConversation({
      title: "Test",
    });
  };

  return (
    <div className={cx("bg-base-200", className)}>
      <div className="flex items-center justify-between px-4">
        <h1 className="my-6 text-xl font-bold">Your DAOs</h1>
        <Button onClick={onCreateConversation}>New DAO Chat</Button>
      </div>
      <div className="flex flex-col">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center gap-4 px-4 py-20">
            <p className="text-center text-base-content-neutral">
              Connect to XMTP to see your DAO group chats
            </p>
            <Button onClick={connect}>Connect</Button>
          </div>
        ) : (
          <>
            {conversations?.map((conversation) => (
              <ConversationPreview
                key={conversation.context?.conversationId}
                conversation={conversation}
                onClick={() => onSelectConversation(conversation)}
                active={
                  selectedConversation?.context?.conversationId ===
                  conversation.context?.conversationId
                }
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};
