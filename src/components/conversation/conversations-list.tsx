import cx from "classnames";
import { useState } from "react";
import { useAccount } from "wagmi";

import { Button } from "@components/basic/button";
import { Spinner } from "@components/basic/spinner";
import { CreateChatModal } from "@components/create-chat-modal";
import { WalletStatus } from "@components/wallet/wallet-status";
import { useConversations } from "@lib/conversation/use-conversations";
import { useXmtp } from "@providers/xmtp-provider";
import { ConversationWithTitle } from "types/xmtp";

import { ConversationPreview } from "./conversation-preview";

interface ConversationListInnerProps {
  conversations: ConversationWithTitle[];
  selectedConversation: ConversationWithTitle | null;
  onSelectConversation: (conversation: ConversationWithTitle) => void;
}

const ConversationListInner = ({
  conversations,
  selectedConversation,
  onSelectConversation,
}: ConversationListInnerProps) => {
  const { isConnected, isReconnecting, isConnecting } = useAccount();
  const { isConnected: isConnectedToXmtp, connect } = useXmtp();

  if (isReconnecting || isConnecting) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-20">
        <Spinner />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-20">
        <p className="text-center text-base-content-neutral">
          Connect your wallet
        </p>
        <WalletStatus />
      </div>
    );
  }

  if (!isConnectedToXmtp) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-20">
        <p className="text-center text-base-content-neutral">
          Connect to XMTP to see your DAO group chats
        </p>
        <Button onClick={connect}>Connect</Button>
      </div>
    );
  }

  return (
    <>
      {conversations?.length === 0 && (
        <div className="flex h-full flex-col items-center justify-center py-40">
          <p className="text-center">
            You are not a member of any group chat yet
          </p>
        </div>
      )}
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
  );
};

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
  const [modalOpen, setModalOpen] = useState(false);

  const { data: conversations, refetch } = useConversations();

  return (
    <div className={cx("bg-base-200", className)}>
      <div className="flex items-center justify-between px-4">
        <h1 className="my-6 text-xl font-bold">Your DAOs</h1>
        <CreateChatModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={refetch}
        />
        <Button onClick={() => setModalOpen(true)}>New DAO Chat</Button>
      </div>
      <div className="flex flex-col">
        <ConversationListInner
          conversations={conversations || []}
          selectedConversation={selectedConversation}
          onSelectConversation={onSelectConversation}
        />
      </div>
    </div>
  );
};
