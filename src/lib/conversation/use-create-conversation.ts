import { GroupChat } from "@xmtp/xmtp-js";
import { useMutation } from "wagmi";

import { useXmtp } from "@providers/xmtp-provider";

import { getConversationMembers } from "./get-conversation-members";
import { getSpace } from "./get-space";

interface SendMessageOptions {
  onSuccess?: () => void;
}

interface SendMessageParams {
  title: string;
}

interface SnapshotStrategy {
  name: string;
  params: {
    address: string;
  };
}

interface SnapshotSpaceResult {
  space: {
    name: string;
    strategies: SnapshotStrategy[];
  };
}

export const useCreateConversation = (options?: SendMessageOptions) => {
  const { client } = useXmtp();

  return useMutation(
    async ({ title }: SendMessageParams) => {
      if (!client) return;

      const result = (await getSpace({
        spaceId: title,
      })) as SnapshotSpaceResult;
      if (result.space.strategies && result.space.strategies.length) {
        const spaceName = result.space.name;
        const minScore = result.space.voteValidation.params.minScore;
        const tokenAddresses = result.space.strategies.map(
          (strategy) => strategy.params.address,
        );

        const addressesWithXmtpEnabled = await getConversationMembers({
          blockchain: "polygon",
          tokenAddresses,
          minScore,
        });

        // Remove the current user from the list of addresses
        const memberAddresses = addressesWithXmtpEnabled.filter(
          (address) => address.toLowerCase() !== client.address.toLowerCase(),
        );

        const groupConversation =
          await client.conversations.newGroupConversation(memberAddresses);

        const groupChat = await GroupChat.fromConversation(
          client,
          groupConversation,
        );
        await groupChat.changeTitle(spaceName);
      }
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
