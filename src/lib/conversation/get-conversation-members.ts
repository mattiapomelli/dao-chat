import { fetchQuery } from "@airstack/airstack-react";
import { gql } from "graphql-request";

const getTokenBalances = gql`
  query CheckTokenBalance(
    $tokenAddresses: [Address!]
    $blockchain: TokenBlockchain!
  ) {
    TokenBalances(
      input: {
        filter: { tokenAddress: { _in: $tokenAddresses } }
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
        tokenAddress
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
  tokenAddresses: string[];
  minScore?: number;
}

// Returns an array of members of a conversation, given a token address
export const getConversationMembers = async (
  params: GetConversationMembersParams,
) => {
  const { blockchain, tokenAddresses, minScore = 1 } = params;

  const result: TokenBalancesResult = await fetchQuery(getTokenBalances, {
    tokenAddresses,
    blockchain,
  });

  // Create an object to store the count of different token addresses for each owner's address
  const ownerCountMap = {};

  if (result.data.TokenBalances.TokenBalance) {
    // Iterate through the TokenBalance array and update the ownerCountMap for items with "isXMTPEnabled": true
    result.data.TokenBalances.TokenBalance.forEach((item) => {
      const isXMTPEnabled = item.owner.xmtp[0]?.isXMTPEnabled || false; // Default to false if xmtp array is empty
      if (isXMTPEnabled) {
        const ownerAddress = item.owner.addresses[0];
        // @ts-ignore
        if (!ownerCountMap[ownerAddress]) {
          // @ts-ignore
          ownerCountMap[ownerAddress] = 1;
        } else {
          // @ts-ignore
          ownerCountMap[ownerAddress]++;
        }
      }
    });

    // Convert the ownerCountMap into the desired result format
    const ownership = Object.keys(ownerCountMap).map((ownerAddress) => ({
      owner: ownerAddress,
      // @ts-ignore
      count: ownerCountMap[ownerAddress],
    }));

    // Get only the addresses with a minimum score
    const addressesWithXmtpEnabled = ownership
      .filter((item) => item.count === minScore)
      .map((item) => item.owner);

    return addressesWithXmtpEnabled;
  }
  return undefined;
};
