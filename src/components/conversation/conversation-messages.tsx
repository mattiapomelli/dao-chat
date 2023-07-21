import { useMessages } from "@hooks/xmtp/use-messages";
import { ConversationWithTitle } from "types/xmtp";

import { Message } from "./message";

interface ConversationMessagesProps {
  conversation: ConversationWithTitle;
}

export const ConversationMessages = ({
  conversation,
}: ConversationMessagesProps) => {
  const { data: messages } = useMessages({
    conversation,
  });

  console.log("Messages:", messages);

  return (
    <div>
      <h1 className="my-6 text-xl font-bold">{conversation.title}</h1>
      {messages?.map((message) => (
        <div key={message.id}>
          <Message message={message} />
        </div>
      ))}
    </div>
  );
};
