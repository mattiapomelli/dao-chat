import { fetchQuery } from "@airstack/airstack-react";
import { GroupChat } from "@xmtp/xmtp-js";
import { gql } from "graphql-request";
import { useMutation } from "wagmi";

import { useXmtp } from "@providers/xmtp-provider";

interface SendMessageOptions {
  onSuccess?: () => void;
}

interface SendMessageParams {
  title: string;
}

const getXmtpEnabledQuery = gql`
  query CheckXmtpQuery($addresses: [Identity!]) {
    XMTPs(input: { blockchain: ALL, filter: { owner: { _in: $addresses } } }) {
      XMTP {
        isXMTPEnabled
        owner {
          addresses
          domains {
            name
          }
          socials {
            dappName
            profileName
          }
        }
      }
    }
  }
`;

interface XmtpResult {
  data: {
    XMTPs: {
      XMTP: {
        isXMTPEnabled: boolean;
        owner: {
          addresses: string[];
        };
      }[];
    };
  };
}

export const useCreateConversation = (options?: SendMessageOptions) => {
  const { client } = useXmtp();

  return useMutation(
    async ({ title }: SendMessageParams) => {
      if (!client) return;

      const memberAddresses = [
        "0x997b456Be586997A2F6d6D650FC14bF5843c92B2",
        "0x498c3DdbEe3528FB6f785AC150C9aDb88C7d372c",
        // "0x8d960334c2EF30f425b395C1506Ef7c5783789F3",
        // "0x0F45421E8DC47eF9edd8568a9D569b6fc7Aa7AC6",
      ];

      const result: XmtpResult = await fetchQuery(getXmtpEnabledQuery, {
        addresses: memberAddresses,
      });

      const addressesWithXmtpEnabled = result.data.XMTPs.XMTP.filter(
        (account) => account.isXMTPEnabled,
      ).map((account) => account.owner.addresses[0]);

      const groupConversation = await client.conversations.newGroupConversation(
        addressesWithXmtpEnabled,
      );

      const groupChat = await GroupChat.fromConversation(
        client,
        groupConversation,
      );
      await groupChat.changeTitle(title);
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
};
