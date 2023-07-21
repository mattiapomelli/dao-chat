import { Conversation } from "@xmtp/xmtp-js";
import { useEffect } from "react";

import { useXmtp } from "@providers/xmtp-provider";

interface UseMessageOptions {
  conversation: Conversation;
  onMessage: (message: any) => void;
}

export const useStreamMessages = ({
  conversation,
  onMessage,
}: UseMessageOptions) => {
  const { client } = useXmtp();

  useEffect(() => {
    if (!client) return;

    const streamMessages = async () => {
      for await (const message of await conversation.streamMessages()) {
        if (message.senderAddress === client.address) {
          // This message was sent from me
          continue;
        }
        console.log(
          `New message from ${message.senderAddress}: ${message.content}`,
        );
        onMessage(message);
      }
    };

    streamMessages();
  }, [client, conversation, onMessage]);
};
