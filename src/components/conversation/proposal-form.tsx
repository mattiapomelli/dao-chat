import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "@tanstack/react-query";
import { DecodedMessage } from "@xmtp/xmtp-js";
// @ts-ignore
import DatePicker from "react-datepicker";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { useMakeProposal } from "@lib/conversation/use-make-proposal";
import { DEFAULT_SPACE, PROPOSAL_DAYS } from "@utils/constants";
import { ConversationWithTitle } from "types/xmtp";

interface IFormInput {
  space: string;
  title: string;
  description: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  startDate: Date;
  endDate: Date;
}

interface ConversationMessagesProps {
  conversation: ConversationWithTitle;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<QueryObserverResult<DecodedMessage[], unknown>>;
}

export const ProposalForm = ({
  conversation,
  refetch,
}: ConversationMessagesProps) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<IFormInput>();

  const { mutate: makeProposal } = useMakeProposal({
    conversation,
    onSuccess() {
      refetch();
    },
  });

  const createProposal: SubmitHandler<IFormInput> = async (data) => {
    makeProposal({
      title: data.title,
      body: data.description,
      choices: [data.choice1, data.choice2, data.choice3, data.choice4],
      start: Math.floor(data.startDate.getTime() / 1000),
      end: Math.floor(data.endDate.getTime() / 1000),
    });
  };

  return (
    <form onSubmit={handleSubmit(createProposal)} className="space-y-3">
      <div>
        <label htmlFor="space" className="block text-sm font-medium">
          Space
        </label>
        <input
          {...register("space", { required: true })}
          autoComplete="off"
          defaultValue={DEFAULT_SPACE}
          type="text"
          name="space"
          id="space"
          className="input-bordered input-primary input input-sm focus:outline-0 focus:ring-1 focus:ring-inset focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          {...register("title", { required: true })}
          autoComplete="off"
          type="text"
          name="title"
          id="title"
          className="input-bordered input-primary input input-sm focus:outline-0 focus:ring-1 focus:ring-inset focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description (Optional)
        </label>
        <textarea
          {...register("description")}
          name="description"
          id="description"
          className="textarea-bordered textarea-primary textarea textarea-sm focus:outline-0 focus:ring-1 focus:ring-inset focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="choice1" className="block text-sm font-medium">
          Choice #1
        </label>
        <input
          {...register("choice1", { required: true })}
          autoComplete="off"
          defaultValue={"One"}
          type="text"
          name="choice1"
          id="choice1"
          className="input-bordered input-primary input input-sm focus:outline-0 focus:ring-1 focus:ring-inset focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="choice2" className="block text-sm font-medium">
          Choice #2
        </label>
        <input
          {...register("choice2", { required: true })}
          autoComplete="off"
          defaultValue={"Two"}
          type="text"
          name="choice2"
          id="choice2"
          className="input-bordered input-primary input input-sm focus:outline-0 focus:ring-1 focus:ring-inset focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="choice3" className="block text-sm font-medium">
          Choice #3
        </label>
        <input
          {...register("choice3", { required: true })}
          autoComplete="off"
          defaultValue={"Three"}
          type="text"
          name="choice3"
          id="choice3"
          className="input-bordered input-primary input input-sm focus:outline-0 focus:ring-1 focus:ring-inset focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="choice4" className="block text-sm font-medium">
          Choice #3
        </label>
        <input
          {...register("choice4", { required: true })}
          autoComplete="off"
          defaultValue={"Four"}
          type="text"
          name="choice4"
          id="choice4"
          className="input-bordered input-primary input input-sm focus:outline-0 focus:ring-1 focus:ring-inset focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium">
          Start date
        </label>
        <Controller
          control={control}
          name="startDate"
          defaultValue={new Date()}
          render={({ field }) => (
            <DatePicker
              placeholderText="Select the start date"
              className="input-bordered input-primary input input-sm focus:outline-0 focus:ring-1 focus:ring-inset focus:ring-primary"
              onChange={(startDate: Date) => field.onChange(startDate)}
              selected={field.value}
              showTimeSelect
              dateFormat="Pp"
            />
          )}
        />
      </div>
      <div>
        <label htmlFor="endDate" className="block text-sm font-medium">
          End date
        </label>
        <Controller
          control={control}
          name="endDate"
          defaultValue={
            new Date(new Date().setDate(new Date().getDate() + PROPOSAL_DAYS))
          }
          render={({ field }) => (
            <DatePicker
              placeholderText="Select the end date"
              className="input-bordered input-primary input input-sm focus:outline-0 focus:ring-1 focus:ring-inset focus:ring-primary"
              onChange={(endDate: Date) => field.onChange(endDate)}
              selected={field.value}
              showTimeSelect
              dateFormat="Pp"
            />
          )}
        />
      </div>
      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="btn-primary btn-sm btn normal-case"
      >
        Create proposal
      </button>
    </form>
  );
};
