import cx from "classnames";
import Blockies from "react-blockies";

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
        seed={"0x8d960334c2EF30f425b395C1506Ef7c5783789F3"}
        scale={5}
        size={8}
        className="rounded-full"
      />
      <h4 className="text-lg font-bold">{conversation.title}</h4>
    </div>
  );
};
