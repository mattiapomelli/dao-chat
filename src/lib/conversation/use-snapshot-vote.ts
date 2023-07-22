import snapshot from "@snapshot-labs/snapshot.js";
import { useMutation } from "@tanstack/react-query";
import { providers } from "ethers";

import { APP_NAME, DEFAULT_SPACE, SNAPSHOT_URL } from "@utils/constants";

interface VoteProposalOptions {
  onSuccess?: () => void;
}

interface VoteProposalParams {
  proposalId: string;
  vote: number;
}

export const useSnapshotVote = (options?: VoteProposalOptions) => {
  return useMutation(
    async ({ proposalId, vote }: VoteProposalParams) => {
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

        const receipt = await client.vote(provider, address, {
          space: DEFAULT_SPACE,
          proposal: proposalId,
          type: "single-choice",
          choice: vote,
          app: APP_NAME,
        });

        console.log(receipt);
      }
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
