import snapshot from "@snapshot-labs/snapshot.js";
import { useMutation } from "@tanstack/react-query";
import { Conversation } from "@xmtp/xmtp-js";
import { ethers, providers } from "ethers";
import { v4 as uuidv4 } from "uuid";

import { useXmtp } from "@providers/xmtp-provider";
import {
  APP_NAME,
  DEFAULT_SPACE,
  // NETWORK_ID,
  SNAPSHOT_APP_ID,
  SNAPSHOT_URL,
} from "@utils/constants";

import { ContentTypePollKey } from "./poll-codec";

interface MakeProposalOptions {
  conversation: Conversation;
  onSuccess?: () => void;
}

interface MakeProposalParams {
  space: string;
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
    async ({ space, title, body, choices, start, end }: MakeProposalParams) => {
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

        const ethereumProvider = new ethers.providers.JsonRpcProvider(
          // "https://eth.llamarpc.com	",
          "https://polygon-rpc.com/",
        );
        const lastBlock = await ethereumProvider.getBlockNumber();

        const receipt = await snapshotClient.proposal(provider, address, {
          space,
          type: "single-choice",
          title,
          body,
          choices,
          start,
          end,
          snapshot: lastBlock - 128,
          // @ts-ignore
          network: 1,
          plugins: JSON.stringify({}),
          app: APP_NAME,
        });

        const message = await conversation.send(
          {
            id: uuidv4(),
            title,
            body,
            choices,
            start,
            end,
            appId: SNAPSHOT_APP_ID,
            metadata: {
              space: DEFAULT_SPACE,
              // @ts-ignore
              proposalId: receipt.id,
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
