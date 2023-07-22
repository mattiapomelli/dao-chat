import { Conversation, DecodedMessage } from "@xmtp/xmtp-js";
import cx from "classnames";

import { useSnapshotVote } from "@lib/conversation/use-snapshot-vote";

const getVoteCount = (
  pollId: string,
  allMessages: DecodedMessage[],
  choice: number,
): [number, number] => {
  const voteMessages = allMessages.filter(
    (message) =>
      message.contentType.typeId === "pollVote" &&
      message.content.pollId === pollId,
  );
  const totalVotes = voteMessages.length;

  const choiceVoteMessages = voteMessages.filter(
    (message) => message.content.voteIndex === choice,
  );

  const percentage = (choiceVoteMessages.length / totalVotes) * 100;

  return [choiceVoteMessages.length, percentage];
};

interface PollChoiceProps {
  conversation: Conversation;
  allMessages: DecodedMessage[];
  choice: string;
  disabled: boolean;
  pollId: string;
  proposalId: string;
  onVote?(): void;
  voteIndex: number;
}

export const PollChoice = ({
  conversation,
  allMessages,
  choice,
  pollId,
  voteIndex,
  disabled,
  proposalId,
  onVote,
}: PollChoiceProps) => {
  const { mutate: snapshotVote } = useSnapshotVote({
    conversation,
    onSuccess() {
      onVote?.();
    },
  });

  const voteCount = getVoteCount(pollId, allMessages, voteIndex)[0];
  const percentage = getVoteCount(pollId, allMessages, voteIndex)[1];

  return (
    <button
      key={choice}
      onClick={() =>
        snapshotVote({
          pollId,
          proposalId: proposalId,
          vote: voteIndex + 1,
        })
      }
      className={cx(
        "rounded-box w-full py-2 px-4 disabled:cursor-not-allowed bg-base-300",
        {
          "hover:cursor-pointer hover:bg-base-200": !disabled,
        },
      )}
      disabled={disabled}
    >
      <div className="flex justify-between">
        <div className="text-start text-sm font-semibold">{choice}</div>
        <div>
          {voteCount} votes ({percentage}%)
        </div>
      </div>
      <progress
        className="progress progress-primary"
        value={percentage}
        max="100"
      ></progress>
    </button>
  );
};
