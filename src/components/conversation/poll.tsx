import { CredentialType, IDKitWidget } from "@worldcoin/idkit";
import { DecodedMessage } from "@xmtp/xmtp-js";

import { Button } from "@components/basic/button";
import WorldcoinIcon from "@icons/worldcoin.svg";
import { useSnapshotVote } from "@lib/conversation/use-snapshot-vote";
import { useIsVerifiedWithWorldcoin } from "@lib/worldcoin/use-is-verified-worldcoin";
import { useVerifyWithWorldcoin } from "@lib/worldcoin/use-verify-worldcoin";
import { env } from "env.mjs";

interface PollProps {
  message: DecodedMessage;
}

export const Poll = ({ message }: PollProps) => {
  const { mutate: snapshotVote } = useSnapshotVote();

  const { data: isVerified, refetch } = useIsVerifiedWithWorldcoin();
  const { mutate: verify } = useVerifyWithWorldcoin();

  return (
    <>
      <h4 className="font-bold">{message.content.title}</h4>
      <p className="mb-2 text-base-content-neutral">{message.content.body}</p>
      <div>
        {isVerified ? (
          message.content.choices &&
          message.content.choices.map((choice: string, index: number) => (
            <button
              key={choice}
              onClick={() =>
                snapshotVote({
                  proposalId: message.content.metadata.proposalId,
                  vote: index + 1,
                })
              }
              className="w-full rounded p-3 hover:bg-gray-100"
            >
              <div className="text-start text-sm font-semibold">{choice}</div>
              <progress
                className="progress progress-primary"
                value={0}
                max="100"
              ></progress>
            </button>
          ))
        ) : (
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
        )}
      </div>
    </>
  );
};
