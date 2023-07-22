import cx from "classnames";
import Image from "next/image";
import Link from "next/link";

export interface LogoProps {
  href?: string;
  className?: string;
}

export const Logo = ({ href = "/", className }: LogoProps) => {
  return (
    <Link href={href} className="flex items-center gap-3">
      <Image src={"/logo.png"} height={50} width={50} alt="DAOChat" />

      <span
        className={cx(
          "font-black text-2xl hidden sm:block md:hidden lg:block",
          className,
        )}
      >
        DAOChat
      </span>
    </Link>
  );
};
