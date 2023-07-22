import { CredentialType, IDKitWidget } from "@worldcoin/idkit";
import { DecodedMessage } from "@xmtp/xmtp-js";
import { useState } from "react";

import { Button } from "@components/basic/button";
import { RadioGroup } from "@components/basic/radio-group/radio-group";
import WorldcoinIcon from "@icons/worldcoin.svg";
import { useIsVerifiedWithWorldcoin } from "@lib/worldcoin/use-is-verified-worldcoin";
import { useVerifyWithWorldcoin } from "@lib/worldcoin/use-verify-worldcoin";
import { useXmtp } from "@providers/xmtp-provider";
import { env } from "env.mjs";

interface PollProps {
  message: DecodedMessage;
}

export const Poll = ({ message }: PollProps) => {
  const { userAddress } = useXmtp();
  const [selected, setSelected] = useState<string | undefined>();

  const { data: isVerified, refetch } = useIsVerifiedWithWorldcoin();
  const { mutate: verify } = useVerifyWithWorldcoin();

  const isSender = message.senderAddress === userAddress;

  return (
    <>
      <h4 className="font-bold">{message.content.title}</h4>
      <p className="mb-2 text-base-content-neutral">{message.content.body}</p>
      <div>
        <RadioGroup
          items={message.content.choices}
          value={selected}
          onValueChange={setSelected}
        />
        {!isSender && (
          <>
            {isVerified ? (
              <div className="mt-3 flex justify-end">
                <Button size="sm">Vote</Button>
              </div>
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
          </>
        )}
      </div>
    </>
  );
};
