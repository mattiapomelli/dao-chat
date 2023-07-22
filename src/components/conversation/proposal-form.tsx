import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "@tanstack/react-query";
import { DecodedMessage } from "@xmtp/xmtp-js";
import cx from "classnames";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@components/basic/button";
import { Input } from "@components/basic/input";
import { TextArea } from "@components/basic/textarea/textarea";
import { useMakeProposal } from "@lib/conversation/use-make-proposal";
import { DEFAULT_SPACE, PROPOSAL_DAYS } from "@utils/constants";
import { ConversationWithTitle } from "types/xmtp";

interface IFormInput {
  // space: string;
  title: string;
  description: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  startDate: string;
  endDate: string;
}

interface ConversationMessagesProps {
  conversation: ConversationWithTitle;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<QueryObserverResult<DecodedMessage[], unknown>>;
  onCancel?: () => void;
  className?: string;
}

export const ProposalForm = ({
  conversation,
  refetch,
  onCancel,
  className,
}: ConversationMessagesProps) => {
  const { register, handleSubmit } = useForm<IFormInput>({
    defaultValues: {
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(
        new Date().setDate(new Date().getDate() + PROPOSAL_DAYS),
      )
        .toISOString()
        .split("T")[0],
    },
  });

  const { mutate: makeProposal, isLoading } = useMakeProposal({
    conversation,
    onSuccess() {
      refetch();
      onCancel?.();
    },
  });

  const createProposal: SubmitHandler<IFormInput> = async (data) => {
    makeProposal({
      space: DEFAULT_SPACE, // TODO: change with DAO space
      title: data.title,
      body: data.description,
      choices: [data.choice1, data.choice2, data.choice3, data.choice4],
      start: Math.floor(new Date(data.startDate).getTime() / 1000),
      end: Math.floor(new Date(data.endDate).getTime() / 1000),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(createProposal)}
      className={cx("flex flex-col gap-2", className)}
    >
      <Input
        {...register("title", { required: true })}
        autoComplete="off"
        type="text"
        label="Title"
      />
      <TextArea {...register("description")} label="Description" />
      <div className="flex w-full gap-2">
        <Input
          {...register("choice1", { required: true })}
          label="Choice #1"
          autoComplete="off"
          defaultValue={"One"}
          className="flex-1"
        />
        <Input
          {...register("choice2", { required: true })}
          label="Choice #2"
          autoComplete="off"
          defaultValue={"Two"}
          className="flex-1"
        />
      </div>
      <div className="flex w-full gap-2">
        <Input
          {...register("choice3", { required: true })}
          label="Choice #3"
          autoComplete="off"
          defaultValue={"Three"}
          className="flex-1"
        />
        <Input
          {...register("choice4", { required: true })}
          label="Choice #4"
          autoComplete="off"
          defaultValue={"Four"}
          className="flex-1"
        />
      </div>

      <div className="flex w-full gap-2">
        <Input
          {...register("startDate", { required: true })}
          label="Start Date"
          autoComplete="off"
          className="flex-1"
          type="date"
        />
        <Input
          {...register("endDate", { required: true })}
          label="End Date"
          autoComplete="off"
          className="flex-1"
          type="date"
        />
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <Button onClick={() => onCancel?.()} color="neutral">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} loading={isLoading}>
          Create proposal
        </Button>
      </div>
    </form>
  );
};
