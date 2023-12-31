import snapshot from "@snapshot-labs/snapshot.js";
import { useMutation } from "@tanstack/react-query";
import { Conversation } from "@xmtp/xmtp-js";
import { providers } from "ethers";

import { APP_NAME, SNAPSHOT_URL } from "@utils/constants";

import { ContentTypeVotePollKey } from "./poll-vote-codex";

interface VoteProposalOptions {
  conversation: Conversation;
  onSuccess?: () => void;
}

interface VoteProposalParams {
  space: string;
  pollId: string;
  proposalId: string;
  vote: number;
}

export const useVote = ({ onSuccess, conversation }: VoteProposalOptions) => {
  return useMutation(
    async ({ space, pollId, proposalId, vote }: VoteProposalParams) => {
      const hub = SNAPSHOT_URL;
      const client = new snapshot.Client712(hub);

      if (window.ethereum) {
        // @ts-ignore
        await window.ethereum.enable();
        const provider = new providers.Web3Provider(
          window.ethereum as providers.ExternalProvider,
        );
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        console.log("pid", proposalId);
        console.log("vote", vote);

        // Vote on Snapshot
        const receipt = await client.vote(provider, address, {
          space,
          proposal: proposalId,
          type: "single-choice",
          choice: vote,
          app: APP_NAME,
        });
        console.log("Vote result: ", receipt);

        // Send vote message on XMTP
        const message = await conversation.send(
          {
            pollId,
            voteIndex: vote - 1,
          },
          {
            contentType: ContentTypeVotePollKey,
            contentFallback: "This is a vote for a poll.",
          },
        );

        console.log("Vote Message: ", message);
      }
    },
    {
      onSuccess,
    },
  );
};
