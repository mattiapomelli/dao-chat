import Link from "next/link";

import { Button } from "@components/basic/button";

export const Hero = () => {
  return (
    <section className="relative flex flex-col items-center gap-6 py-28 text-center">
      <h1 className="max-w-[50rem] text-6xl font-bold md:text-6xl">
        Manage your DAO as a group chat
      </h1>
      <p className="max-w-[26rem] text-2xl text-base-content-neutral sm:max-w-[40rem]">
        DAOChat helps you increase participation in your DAO by managing
        everything in the one place everyone goes: the group chat.
      </p>
      <Link href="/chat">
        <Button size="lg" className="h-14 min-w-[10rem] px-8 text-xl">
          Make Your Chat
        </Button>
      </Link>
    </section>
  );
};
