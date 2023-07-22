import {
  AcademicCapIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/solid";
import { ReactNode } from "react";

interface ComponentCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

const FeatureCard = ({ title, description, icon }: ComponentCardProps) => {
  return (
    <div className="rounded-box flex max-w-[24rem] flex-col gap-4 bg-base-300 p-8 text-left">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary">
        <span className="h-8 w-8 text-primary-content">{icon}</span>
      </div>
      <h4 className="text-3xl font-bold text-base-content">{title}</h4>
      <p className="text-xl text-base-content-neutral">{description}</p>
    </div>
  );
};

export const IntroductionSecion = () => {
  return (
    <section className="rounded-box flex flex-col items-center gap-10 bg-primary px-5 py-20 text-center text-primary-content">
      <h2 className="mt-4 text-center text-6xl font-bold">Meet DAOChat</h2>
      <p className="max-w-[46rem] text-4xl">
        Governance in the one place everyone goes: the group chat
      </p>
      <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2">
        <FeatureCard
          icon={<AcademicCapIcon />}
          title="Discuss"
          description="Discuss and engage with the other members."
        />
        <FeatureCard
          icon={<UserGroupIcon />}
          title="Create proposals"
          description="Create proposals directly through the chat."
        />
        <FeatureCard
          icon={<ChatBubbleLeftRightIcon />}
          title="Vote"
          description="Vote on proposals directly through the chat."
        />
        <FeatureCard
          icon={<CurrencyDollarIcon />}
          title="Attest"
          description="Get attestations for the votes you casted."
        />
      </div>
      <ArrowDownIcon className="h-32 w-32 text-primary-content" />
      <p className="mt-4 text-center text-4xl">
        Your DAO deserves better. It deserves DAOChat! 🚀
      </p>
    </section>
  );
};
