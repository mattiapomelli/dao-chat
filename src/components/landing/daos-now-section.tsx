import Image from "next/image";

export const DaosNowSection = () => {
  return (
    <section className="flex flex-col items-center gap-10 pb-10 pt-32">
      <h3 className="max-w-[30rem] text-center text-6xl font-bold">DAOs now</h3>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-center gap-10 md:flex-row">
          <p className="text-center text-4xl md:text-left">
            Communication happens on chat apps like Discord, where members hang
            out.
          </p>
          <Image
            src={"/discord.png"}
            width={2036 / 4}
            height={1670 / 4}
            alt="Discord"
          />
        </div>
        <div className="flex flex-col items-center gap-10 md:flex-row">
          <Image
            src={"/snapshot.png"}
            width={2150 / 4}
            height={1472 / 4}
            alt="Snapshot"
            className="order-2 md:order-1"
          />
          <p className="order-1 text-center text-4xl md:text-left">
            Proposals happen on platforms like Snapshot, where members vote.
          </p>
        </div>
        <div className="flex flex-col items-center gap-10 md:flex-row">
          <p className="text-center text-4xl md:text-left">
            Governance discussions happen on dedicated forums, where members
            share ideas.
          </p>
          <Image
            src={"/forum.png"}
            width={2242 / 4}
            height={1438 / 4}
            alt="Forum"
          />
        </div>
      </div>
    </section>
  );
};
