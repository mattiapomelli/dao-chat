import { DecodedMessage } from "@xmtp/xmtp-js";
import cx from "classnames";
import Blockies from "react-blockies";

import { Address } from "@components/address";
import { useXmtp } from "@providers/xmtp-provider";

import { Poll } from "./poll";

interface MessageProps {
  message: DecodedMessage;
}

export const Message = ({ message }: MessageProps) => {
  const { userAddress } = useXmtp();

  const isSender = message.senderAddress === userAddress;

  return (
    <div className={cx("flex", "max-w-[400px]", isSender ? "ml-auto" : "")}>
      <div className="rounded-box bg-base-300 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Blockies
            data-testid="avatar"
            seed={message.senderAddress}
            scale={4}
            size={6}
            className="rounded-full"
          />
          <Address
            address={message.senderAddress as `0x${string}`}
            className="font-bold"
          />
        </div>
        {message.contentType.typeId === "poll" ? (
          <Poll message={message} />
        ) : (
          <p>{message.content}</p>
        )}
      </div>
    </div>
  );
};
