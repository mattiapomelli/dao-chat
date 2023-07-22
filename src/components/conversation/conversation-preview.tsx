import cx from "classnames";
import Blockies from "react-blockies";

import { useConversationSpace } from "@lib/conversation/get-conversation-space";
import { ConversationWithTitle } from "types/xmtp";

interface ConversationMessagesProps {
  conversation: ConversationWithTitle;
  onClick?: () => void;
  active?: boolean;
}

export const ConversationPreview = ({
  conversation,
  onClick,
  active,
}: ConversationMessagesProps) => {
  const { data: space } = useConversationSpace({
    conversation,
  });

  return (
    <div
      className={cx(
        "flex items-center gap-4 cursor-pointer px-4 py-4 border-b-base-300 border-b hover:bg-base-300",
        {
          "bg-base-300": active,
        },
      )}
      onClick={onClick}
    >
      <Blockies
        data-testid="avatar"
        seed={space}
        scale={5}
        size={8}
        className="rounded-full"
      />
      <div
      // className="flex flex-1 items-center justify-between"
      >
        <p className="text-lg font-bold">{conversation.title}</p>
        <a
          href={`https://demo.snapshot.org/#/${space}/`}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 underline"
        >
          View on Snapshot
        </a>
      </div>
    </div>
  );
};
