import { Transition } from "@headlessui/react";
import { useAccount } from "wagmi";

import { Logo } from "@components/basic/logo";
import { ThemeToggle } from "@components/basic/theme-toggle";
// import { ChainSwitch } from "@components/chain-switch";
// import { WalletStatus } from "@components/wallet/wallet-status";
import { useTransitionControl } from "@hooks/use-transition-control";

import { Container } from "./container";

export const Navbar = () => {
  const { isConnecting, isReconnecting } = useAccount();

  const [show] = useTransitionControl(isReconnecting || isConnecting);

  return (
    <header className="flex h-20 items-center">
      <Container className="flex w-full items-center justify-between">
        <Logo className="hidden sm:block" />
        <Transition
          show={show}
          enter="transition-opacity duration-250"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {/* <ChainSwitch /> */}
            {/* <WalletStatus /> */}
          </div>
        </Transition>
      </Container>
    </header>
  );
};
