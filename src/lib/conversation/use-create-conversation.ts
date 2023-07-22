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
      console.log("Space:", result);
      if (
        result.space.strategies &&
        result.space.strategies.length &&
        result.space.strategies[0].name === "erc721"
      ) {
        const tokenAddress = result.space.strategies[0].params.address;
        const spaceName = result.space.name;

        const addressesWithXmtpEnabled = await getConversationMembers({
          blockchain: "polygon",
          tokenAddress: tokenAddress,
        });

        // Remove the current user from the list of addresses
        const memberAddresses = addressesWithXmtpEnabled.filter(
          (address) => address !== client.address,
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
