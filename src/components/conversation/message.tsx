import { DecodedMessage } from "@xmtp/xmtp-js";

import { PollMessage } from "./poll-message";
import { TextMessage } from "./text-message";

interface MessageProps {
  message: DecodedMessage;
}

export const Message = ({ message }: MessageProps) => {
  if (message.contentType.typeId === "poll") {
    return <PollMessage message={message} />;
  }

  return <TextMessage message={message} />;
};
