import { DecodedMessage } from "@xmtp/xmtp-js";

interface MessageProps {
  message: DecodedMessage;
}

export const Message = ({ message }: MessageProps) => {
  return <div className="rounded-box bg-primary p-4">{message.content}</div>;
};
