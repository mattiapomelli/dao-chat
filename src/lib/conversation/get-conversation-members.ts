import { fetchQuery } from "@airstack/airstack-react";
import { gql } from "graphql-request";

const getTokenBalances = gql`
  query CheckTokenBalance(
    $tokenAddress: Address!
    $blockchain: TokenBlockchain!
  ) {
    TokenBalances(
      input: {
        filter: { tokenAddress: { _eq: $tokenAddress } }
        blockchain: $blockchain
        limit: 200
      }
    ) {
      TokenBalance {
        owner {
          addresses
          xmtp {
            isXMTPEnabled
          }
        }
        amount
      }
    }
  }
`;

interface TokenBalancesResult {
  data: {
    TokenBalances: {
      TokenBalance:
        | {
            tokenAddress: string;
            tokenId: string;
            owner: {
              addresses: string[];
              xmtp: {
                isXMTPEnabled: boolean;
              }[];
            };
            amount: string;
          }[]
        | null;
    };
  };
}

type Blockchain = "ethereum" | "polygon";

interface GetConversationMembersParams {
  blockchain: Blockchain;
  tokenAddress: string;
  minAmount?: number;
}

// Returns an array of members of a conversation, given a token address
export const getConversationMembers = async (
  params: GetConversationMembersParams,
) => {
  const { blockchain, tokenAddress, minAmount = 1 } = params;

  const result: TokenBalancesResult = await fetchQuery(getTokenBalances, {
    tokenAddress,
    blockchain,
  });

  // Get only the addresses that hold the minimum amount of tokens
  const holders =
    result.data.TokenBalances.TokenBalance?.filter(
      (account) => Number(account.amount) >= minAmount,
    ) ?? [];

  // Get only the addresses that have XMTP enabled
  const addressesWithXmtpEnabled = holders
    .filter((account) => account.owner.xmtp?.[0]?.isXMTPEnabled)
    .map((account) => account.owner.addresses[0]);

  return addressesWithXmtpEnabled;
};
