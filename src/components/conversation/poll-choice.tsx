import { Conversation, DecodedMessage } from "@xmtp/xmtp-js";
import cx from "classnames";

import { useSnapshotVote } from "@lib/conversation/use-snapshot-vote";
import { useXmtp } from "@providers/xmtp-provider";

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

  const percentage =
    totalVotes > 0 ? (choiceVoteMessages.length / totalVotes) * 100 : 0;

  return [choiceVoteMessages.length, percentage];
};

const getVotedChoice = (
  pollId: string,
  allMessages: DecodedMessage[],
  address?: string,
) => {
  if (!address) return [false, -1];

  const voteMessages = allMessages.filter(
    (message) =>
      message.contentType.typeId === "pollVote" &&
      message.content.pollId === pollId,
  );

  const votedMessage = voteMessages.find(
    (message) => message.senderAddress === address,
  );
  const hasVoted = !!votedMessage;

  if (!hasVoted) return [false, -1];

  const votedIndex = votedMessage?.content.voteIndex;
  return [true, votedIndex];
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
  const { userAddress } = useXmtp();
  const { mutate: snapshotVote } = useSnapshotVote({
    conversation,
    onSuccess() {
      onVote?.();
    },
  });

  const voteCountResult = getVoteCount(pollId, allMessages, voteIndex);
  const voteCount = voteCountResult[0];
  const percentage = voteCountResult[1].toFixed(2);

  const hasVotedResult = getVotedChoice(pollId, allMessages, userAddress);
  const hasVoted = hasVotedResult[0];
  const votedIndex = hasVotedResult[1];

  const isDisabled = disabled || hasVoted;

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
        "rounded-box w-full py-2 px-4 disabled:cursor-not-allowed",
        {
          "hover:cursor-pointer hover:bg-base-200": !isDisabled,
        },
        {
          "bg-base-100": votedIndex === voteIndex,
        },
      )}
      disabled={isDisabled}
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
      />
    </button>
  );
};