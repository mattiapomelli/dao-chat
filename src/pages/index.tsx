import React, { useState } from "react";

import { Button } from "@components/basic/button";
import { ConversationMessages } from "@components/conversation/conversation-messages";
import { useConversations } from "@lib/conversation/use-conversations";
import { useCreateConversation } from "@lib/conversation/use-create-conversation";
import { useXmtp } from "@providers/xmtp-provider";
import { ConversationWithTitle } from "types/xmtp";

import type { NextPage } from "next";

const Home: NextPage = () => {
  const { initClient, client } = useXmtp();
  const { data: conversations, refetch } = useConversations();

  const [selectedConversation, setselectedConversation] =
    useState<ConversationWithTitle | null>(null);

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
    <div>
      <div>{client?.address}</div>
      <Button onClick={initClient}>Connect</Button>
      <Button onClick={onCreateConversation}>Start conversation</Button>

      <div className="flex gap-6">
        <div className="flex-1">
          <h1 className="my-6 text-xl font-bold">Your DAOs</h1>
          <div className="flex flex-col gap-4">
            {conversations?.map((conversation) => (
              <div
                key={conversation.context?.conversationId}
                className="cursor-pointer rounded-md bg-base-200 p-4"
                onClick={() => setselectedConversation(conversation)}
              >
                {conversation.title}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1">
          {selectedConversation && (
            <ConversationMessages conversation={selectedConversation} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
