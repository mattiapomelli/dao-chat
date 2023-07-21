import { GroupChat } from "@xmtp/xmtp-js";
import React, { useState } from "react";

import { Button } from "@components/basic/button";
import { ConversationMessages } from "@components/conversation/conversation-messages";
import { useConversations } from "@lib/xmtp/use-conversations";
import { useXmtp } from "@providers/xmtp-provider";
import { ConversationWithTitle } from "types/xmtp";

import type { NextPage } from "next";

const Home: NextPage = () => {
  const { initClient, client } = useXmtp();
  const { data: conversations } = useConversations();

  const [selectedConversation, setselectedConversation] =
    useState<ConversationWithTitle | null>(null);

  // console.log("Cons:", conversations);

  const startConversation = async () => {
    if (!client) return;

    const isOnXmtp1 = await client.canMessage(
      "0x997b456Be586997A2F6d6D650FC14bF5843c92B2",
    );
    const isOnXmtp2 = await client.canMessage(
      "0x26FddC1C2c84e61457734a17C6818a6E063644ec",
    );
    console.log("Is on xmtp 1:", isOnXmtp1);
    console.log("Is on xmtp 2:", isOnXmtp2);

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
    await groupChat.changeTitle("My DAO");

    console.log("New conversation:", groupConversation);
  };

  return (
    <div>
      <div>{client?.address}</div>
      <Button onClick={initClient}>Connect</Button>
      <Button onClick={startConversation}>Start conversation</Button>

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
