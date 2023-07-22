import cx from "classnames";
import React, { useState } from "react";

import { ConversationMessages } from "@components/conversation/conversation-messages";
import { ConversationsList } from "@components/conversation/conversations-list";
import { ConversationWithTitle } from "types/xmtp";

import type { NextPage } from "next";

const ChatPage: NextPage = () => {
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationWithTitle | null>(null);

  return (
    <div className="flex">
      <ConversationsList
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
        className={cx("h-screen basis-full overflow-auto md:basis-1/3", {
          "hidden md:block": selectedConversation !== null,
        })}
      />
      <div
        className={cx("h-screen flex-1", {
          "hidden md:block": selectedConversation === null,
        })}
      >
        {selectedConversation ? (
          <ConversationMessages
            conversation={selectedConversation}
            onBack={() => setSelectedConversation(null)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center py-40">
            <p>No group chat selected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
