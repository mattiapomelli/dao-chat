import { CredentialType, IDKitWidget } from "@worldcoin/idkit";
import { Conversation, DecodedMessage } from "@xmtp/xmtp-js";

import { Button } from "@components/basic/button";
import WorldcoinIcon from "@icons/worldcoin.svg";
import { useIsVerifiedWithWorldcoin } from "@lib/worldcoin/use-is-verified-worldcoin";
import { useVerifyWithWorldcoin } from "@lib/worldcoin/use-verify-worldcoin";
import { formatDateTime, toSeconds } from "@utils/dates";
import { env } from "env.mjs";

import { PollChoice } from "./poll-choice";

interface PollProps {
  message: DecodedMessage;
  allMessages: DecodedMessage[];
  conversation: Conversation;
  onVote?(): void;
}

export const Poll = ({
  message,
  conversation,
  allMessages,
  onVote,
}: PollProps) => {
  const { data: isVerified, refetch } = useIsVerifiedWithWorldcoin();
  const { mutate: verify } = useVerifyWithWorldcoin();

  const pollId = message.content.id;
  const isExpired = toSeconds(Date.now()) > message.content.end;
  const snapshotUrl = `https://demo.snapshot.org/#/${message.content?.metadata?.space}/proposal/${message.content?.metadata?.proposalId}`;

  return (
    <>
      <p className="font-bold">{message.content.title} ( )</p>
      <p className="mb-3 text-base-content-neutral">{message.content.body}</p>
      <p className="mb-2">Ends at: {formatDateTime(message.content.end)}</p>
      <div>
        {message.content.choices?.map((choice: string, index: number) => (
          <PollChoice
            key={choice}
            allMessages={allMessages}
            conversation={conversation}
            choice={choice}
            disabled={!isVerified || isExpired}
            pollId={pollId}
            proposalId={message.content.metadata.proposalId}
            voteIndex={index}
            onVote={onVote}
          />
        ))}
        {!isVerified && (
          <div>
            <p>
              In order to vote, we need to verify you are a human. No bots or
              aliens allowed.
            </p>
            <IDKitWidget
              action={env.NEXT_PUBLIC_WLD_ACTION_NAME}
              onSuccess={() => {
                refetch();
              }}
              handleVerify={verify}
              app_id={env.NEXT_PUBLIC_WLD_APP_ID}
              credential_types={[CredentialType.Orb, CredentialType.Phone]}
            >
              {({ open }) => (
                <Button
                  onClick={open}
                  leftIcon={<WorldcoinIcon className="h-5 w-5 text-white" />}
                  size="sm"
                  className="mt-3"
                >
                  Verify with World ID
                </Button>
              )}
            </IDKitWidget>
          </div>
        )}
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
          href={snapshotUrl}
        >
          View on Snapshot
        </a>
      </div>
    </>
  );
};
