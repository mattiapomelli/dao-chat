import { ArrowDownIcon } from "@heroicons/react/24/solid";

export const ProblemSection = () => {
  return (
    <section className="flex flex-col items-center gap-10 py-32">
      <ArrowDownIcon className="h-32 w-32 text-primary" />
      <p className="mt-4 text-center text-4xl">
        Due to the fragmentation of tools,{" "}
        <b>participation and engagement in DAOs is extremely low 😢</b>
      </p>
    </section>
  );
};
