import snapshot from "@snapshot-labs/snapshot.js";
import { Conversation } from "@xmtp/xmtp-js";
import { providers } from "ethers";
import { useMutation } from "wagmi";

import { useXmtp } from "@providers/xmtp-provider";
import {
  APP_NAME,
  DEFAULT_SPACE,
  NETWORK_ID,
  SNAPSHOT_URL,
} from "@utils/constants";

import { ContentTypePollKey } from "./poll-codec";

interface MakeProposalOptions {
  conversation: Conversation;
  onSuccess?: () => void;
}

interface MakeProposalParams {
  title: string;
  body: string;
  choices: string[];
  start: number;
  end: number;
}

export const useMakeProposal = ({
  conversation,
  onSuccess,
}: MakeProposalOptions) => {
  const { client } = useXmtp();

  return useMutation(
    async ({ title, body, choices, start, end }: MakeProposalParams) => {
      if (!client) return;

      const hub = SNAPSHOT_URL;
      const snapshotClient = new snapshot.Client712(hub);

      if (window.ethereum) {
        // @ts-ignore
        await window.ethereum.enable();
        const provider = new providers.Web3Provider(
          window.ethereum as providers.ExternalProvider,
        );
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        const receipt = await snapshotClient.proposal(provider, address, {
          space: DEFAULT_SPACE,
          type: "single-choice",
          title,
          body,
          choices,
          start,
          end,
          snapshot: 17745695, //(await provider.getBlockNumber()) - 128,
          // @ts-ignore
          network: NETWORK_ID,
          plugins: JSON.stringify({}),
          app: APP_NAME,
        });

        const message = await conversation.send(
          {
            title,
            body,
            choices,
            start,
            end,
            metadata: {
              space: DEFAULT_SPACE,
              // @ts-ignore
              id: receipt.id,
            },
          },
          {
            contentType: ContentTypePollKey,
            contentFallback: "This is a poll",
          },
        );
        console.log("Sent Message", message);
      }
    },
    {
      onSuccess,
    },
  );
};