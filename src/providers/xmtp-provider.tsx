import { Client } from "@xmtp/xmtp-js";
import { createContext, ReactNode, useContext, useState } from "react";
import { useSigner } from "wagmi";

import { PollCodec } from "@lib/conversation/poll-codec";

interface XmptContextValue {
  client: Client | null;
  initClient: () => void;
}

const XmtpContext = createContext<XmptContextValue | undefined>(undefined);

export const XmtpProvider = ({ children }: { children: ReactNode }) => {
  const { data: signer } = useSigner();
  const [client, setClient] = useState<Client | null>(null);

  const initClient = async () => {
    if (!signer) return;

    // Get the keys using a valid Signer. Save them somewhere secure.
    const keys = await Client.getKeys(signer);
    // Create a client using keys returned from getKeys
    const client = await Client.create(null, {
      privateKeyOverride: keys,
      codecs: [new PollCodec()],
    });

    client.enableGroupChat();

    setClient(client);
  };

  return (
    <XmtpContext.Provider value={{ client, initClient }}>
      {children}
    </XmtpContext.Provider>
  );
};

export const useXmtp = () => {
  const context = useContext(XmtpContext);

  if (context === undefined) {
    throw new Error("useXmtp must be used within a XmtpProvider");
  }

  return context;
};
