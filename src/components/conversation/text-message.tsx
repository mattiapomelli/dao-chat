import { DecodedMessage } from "@xmtp/xmtp-js";

interface TextMessageProps {
  message: DecodedMessage;
}

export const TextMessage = ({ message }: TextMessageProps) => {
  return <div className="rounded-box bg-primary p-4">{message.content}</div>;
};
