import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

export const useIsVerifiedWithWorldcoin = () => {
  const { address } = useAccount();

  return useQuery<boolean>({
    queryKey: ["isVerified", address],
    queryFn: async () => {
      const res = await fetch(`/api/is-verified?address=${address}`);
      const data = await res.json();
      return data.verified;
    },
  });
};
