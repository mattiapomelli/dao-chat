import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import cx from "classnames";
import { Fragment, useState } from "react";
import Blockies from "react-blockies";
import { useForm } from "react-hook-form";

import { Address } from "@components/address";
import { Button } from "@components/basic/button";
import { Input } from "@components/basic/input";
import { useConversationSpace } from "@lib/conversation/get-conversation-space";
import { useMessages } from "@lib/conversation/use-messages";
import { useSendMessage } from "@lib/conversation/use-send-message";
import { useStreamMessages } from "@lib/conversation/use-stream-messages";
import { ConversationWithTitle } from "types/xmtp";

import { Message } from "./message";
import { ProposalForm } from "./proposal-form";

interface ConversationMessagesProps {
  conversation: ConversationWithTitle;
  className?: string;
  onBack?(): void;
}

export const ConversationMessages = ({
  conversation,
  className,
  onBack,
}: ConversationMessagesProps) => {
  const { data: space } = useConversationSpace({
    conversation,
  });
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

  const conversationMembers =
    conversation.context?.metadata.initialMembers.split(",").splice(0, 4) || [];

  return (
    <div className={cx("flex flex-col h-screen", className)}>
      <div className="flex items-center gap-4 border-b border-b-base-300 p-4">
        <button
          className="rounded-btn bg-base-300 p-2 md:hidden"
          onClick={onBack}
        >
          <ArrowLeftIcon className="h-5 w-5 shrink-0" />
        </button>
        <Blockies
          data-testid="avatar"
          seed={space}
          scale={5}
          size={8}
          className="rounded-full"
        />
        <div>
          <h1 className="text-xl font-bold">{conversation.title}</h1>
          <p>
            Members:{" "}
            {conversationMembers.map((member, index) => (
              <Fragment key={member}>
                <Address address={member as `0x${string}`} key={member} />
                {index !== conversationMembers.length - 1 ? ", " : ", ..."}
              </Fragment>
            ))}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-auto p-4">
        {messages?.map((message) => (
          <Message
            message={message}
            allMessages={messages}
            key={message.id}
            conversation={conversation}
            onVote={refetch}
          />
        ))}
      </div>

      <div className="relative px-4 pb-4">
        {showProposalForm ? (
          <ProposalForm
            conversation={conversation}
            refetch={refetch}
            className="rounded-box absolute bottom-full w-[calc(100%-2rem)] bg-base-200 p-4"
            onCancel={() => setShowProposalForm(false)}
          />
        ) : (
          <>
            <form onSubmit={onSubmit} className="mt-10 flex flex-row gap-2">
              <Input
                placeholder="Write a message"
                className="flex-1"
                block
                {...register("content", { required: "Content is required" })}
                error={errors.content?.message}
                size="lg"
              />
              <Button size="lg">Send</Button>
            </form>
            <Button onClick={() => setShowProposalForm(true)} className="mt-4">
              Make Proposal
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
