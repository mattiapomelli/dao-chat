import { gql, request } from "graphql-request";

import { SNAPSHOT_GRAPHQL_URL } from "@utils/constants";

const querySpace = gql`
  query Spaces($ens: String!) {
    space(id: $ens) {
      id
      name
      about
      network
      symbol
      members
      strategies {
        name
        network
        params
      }
      voteValidation {
        params
      }
    }
  }
`;

interface GetSpaceParams {
  spaceId: string;
}

export const getSpace = async (params: GetSpaceParams) => {
  const result = await request(SNAPSHOT_GRAPHQL_URL, querySpace, {
    ens: params.spaceId,
  });
  return result;
};
