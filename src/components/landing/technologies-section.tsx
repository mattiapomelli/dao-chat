import Image from "next/image";
import { ReactNode } from "react";

interface TechnologyCardProps {
  logo: ReactNode;
  text: string;
}

const TechnologyCard = ({ logo, text }: TechnologyCardProps) => {
  return (
    <div className="flex flex-col items-center gap-x-10 gap-y-4 md:h-20 md:flex-row">
      {logo}
      <p className="text-center text-3xl">{text}</p>
    </div>
  );
};

export const TechnologiesSecion = () => {
  return (
    <section className="flex flex-col items-center gap-10 py-32">
      <h3 className="mb-6 max-w-[30rem] text-center text-6xl font-bold">
        Powered by
      </h3>
      <div className="flex flex-col items-center gap-x-8 gap-y-14">
        <TechnologyCard
          logo={
            <Image
              src="/xmtp-logo.svg"
              width={54 * 3}
              height={73 * 3}
              alt="XMTP"
            />
          }
          text="Wallet-to-wallet encrypted group chats"
        />
        <TechnologyCard
          logo={
            <Image
              src="/airstack-logo.png"
              width={168}
              height={40}
              alt="Airstack"
            />
          }
          text="Query token balances, social profiles, XMTP"
        />
        <TechnologyCard
          logo={
            <Image
              src="/worldcoin-logo.svg"
              height={24 * 1.5}
              width={141 * 1.5}
              alt="Worldcoin"
            />
          }
          text="Verify that only humans can vote"
        />
        <TechnologyCard
          logo={
            <Image
              src="/eas-logo.svg"
              width={875 / 4}
              height={319 / 4}
              alt="EAS"
            />
          }
          text="Attestations for voting"
        />
      </div>
    </section>
  );
};
