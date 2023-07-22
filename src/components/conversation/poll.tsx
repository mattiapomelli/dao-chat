import { DecodedMessage } from "@xmtp/xmtp-js";
import { useState } from "react";

import { RadioGroup } from "@components/basic/radio-group/radio-group";

interface PollProps {
  message: DecodedMessage;
}

export const Poll = ({ message }: PollProps) => {
  const [selected, setSelected] = useState<string | undefined>();

  return (
    <>
      <h4 className="font-bold">{message.content.title}</h4>
      <p className="mb-2 text-base-content-neutral">{message.content.body}</p>
      <RadioGroup
        items={message.content.choices}
        value={selected}
        onValueChange={setSelected}
      />
    </>
  );
};
