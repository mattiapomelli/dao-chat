import { DecodedMessage } from "@xmtp/xmtp-js";
import { useState } from "react";

import { RadioGroup } from "@components/basic/radio-group/radio-group";

interface PollMessageProps {
  message: DecodedMessage;
}

export const PollMessage = ({ message }: PollMessageProps) => {
  const [selected, setSelected] = useState<string | undefined>();

  return (
    <div className="rounded-box bg-primary p-4">
      <h4>{message.content.question}</h4>
      <RadioGroup
        items={message.content.options}
        value={selected}
        onValueChange={setSelected}
      />
    </div>
  );
};
