import Link from "next/link";

import { Button } from "@components/basic/button";

export const Hero = () => {
  return (
    <section className="relative flex flex-col items-center gap-6 py-36 text-center">
      <h1 className="max-w-[60rem] text-6xl font-bold md:text-6xl">
        Manage DAOs in a group chat.
      </h1>
      <p className="max-w-[26rem] text-2xl text-base-content-neutral sm:max-w-[40rem]">
        DAOChat aims to increase interaction and participation in DAOs by
        managing everything in the place where the community already is: a group
        chat.
      </p>
      <Link href="/chat">
        <Button size="lg" className="h-14 min-w-[10rem] px-8 text-xl">
          Chat
        </Button>
      </Link>
    </section>
  );
};
