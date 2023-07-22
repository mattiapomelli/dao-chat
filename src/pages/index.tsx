import React, { useState } from "react";

import { ConversationMessages } from "@components/conversation/conversation-messages";
import { ConversationsList } from "@components/conversation/conversations-list";
import { ConversationWithTitle } from "types/xmtp";

import type { NextPage } from "next";

const Home: NextPage = () => {
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationWithTitle | null>(null);

  return (
    <div className="flex">
      <ConversationsList
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
        className="h-screen basis-1/3 overflow-auto"
      />
      <div className="h-screen flex-1">
        {selectedConversation ? (
          <ConversationMessages conversation={selectedConversation} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center py-40">
            <p>No group chat selected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
