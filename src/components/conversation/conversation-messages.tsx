import { useForm } from "react-hook-form";

import { Button } from "@components/basic/button";
import { Input } from "@components/basic/input";
import { useMakeProposal } from "@lib/xmtp/use-make-proposal";
import { useMessages } from "@lib/xmtp/use-messages";
import { useSendMessage } from "@lib/xmtp/use-send-message";
import { useStreamMessages } from "@lib/xmtp/use-stream-messages";
import { ConversationWithTitle } from "types/xmtp";

import { Message } from "./message";

interface ConversationMessagesProps {
  conversation: ConversationWithTitle;
}

export const ConversationMessages = ({
  conversation,
}: ConversationMessagesProps) => {
  const { data: messages, refetch } = useMessages({
    conversation,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ content: string }>();

  const { mutate: sendMessage } = useSendMessage({
    conversation,
    onSuccess() {
      refetch();
      reset();
    },
  });

  const { mutate: makeProposal } = useMakeProposal({
    conversation,
    onSuccess() {
      refetch();
    },
  });

  useStreamMessages({
    conversation,
    onMessage() {
      refetch();
    },
  });

  const onSubmit = handleSubmit((data) => {
    sendMessage({
      content: data.content,
    });
  });

  const sendProposal = () => {
    makeProposal({
      proposal: "Proposal title",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    });
  };

  return (
    <div>
      <h1 className="my-6 text-xl font-bold">{conversation.title}</h1>
      <div className="flex flex-col gap-2">
        {messages?.map((message) => (
          <Message message={message} key={message.id} />
        ))}
      </div>
      <form onSubmit={onSubmit} className="mt-10 flex flex-row gap-2">
        <Input
          placeholder="Write a message"
          className="flex-1"
          block
          {...register("content", { required: "Content is required" })}
          error={errors.content?.message}
        />
        <Button>Send</Button>
      </form>
      <Button onClick={sendProposal}>Make Proposal</Button>
    </div>
  );
};
