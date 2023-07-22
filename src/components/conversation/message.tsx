import { Conversation, DecodedMessage } from "@xmtp/xmtp-js";
import cx from "classnames";
import Blockies from "react-blockies";

import { Address } from "@components/address";
import { useXmtp } from "@providers/xmtp-provider";

import { EasMessage } from "./eas-message";
import { Poll } from "./poll";

interface MessageProps {
  conversation: Conversation;
  message: DecodedMessage;
  allMessages: DecodedMessage[];
  onVote?(): void;
}

const supportedContentTypes = ["poll", "text", "EasAttestation"];

export const Message = ({
  allMessages,
  message,
  conversation,
  onVote,
}: MessageProps) => {
  const { userAddress } = useXmtp();

  const isSender = message.senderAddress === userAddress;

  if (!supportedContentTypes.includes(message.contentType.typeId)) return null;

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
        {message.contentType.typeId === "poll" && (
          <Poll
            message={message}
            conversation={conversation}
            allMessages={allMessages}
            onVote={onVote}
          />
        )}
        {message.contentType.typeId === "EasAttestation" && (
          <EasMessage attestationUid={message.content.attestationUid} />
        )}
        {message.contentType.typeId === "text" && <p>{message.content}</p>}
      </div>
    </div>
  );
};
