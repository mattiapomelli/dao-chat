import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@components/basic/button";
import { Input } from "@components/basic/input";
import { useMessages } from "@lib/conversation/use-messages";
import { useSendMessage } from "@lib/conversation/use-send-message";
import { useStreamMessages } from "@lib/conversation/use-stream-messages";
import { ConversationWithTitle } from "types/xmtp";

import { Message } from "./message";
import { ProposalForm } from "./proposal-form";

interface ConversationMessagesProps {
  conversation: ConversationWithTitle;
}

export const ConversationMessages = ({
  conversation,
}: ConversationMessagesProps) => {
  const [showProposalForm, setShowProposalForm] = useState(false);
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

  return (
    <div>
      <h1 className="my-6 text-xl font-bold">{conversation.title}</h1>
      <div className="flex flex-col gap-2">
        {messages?.map((message) => (
          <Message message={message} key={message.id} />
        ))}
      </div>
      {showProposalForm ? (
        <>
          <ProposalForm conversation={conversation} refetch={refetch} />
          <Button onClick={() => setShowProposalForm(false)}>Cancel</Button>
        </>
      ) : (
        <>
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
          <Button onClick={() => setShowProposalForm(true)}>
            Make Proposal
          </Button>
        </>
      )}
    </div>
  );
};
