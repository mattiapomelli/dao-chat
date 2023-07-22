import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { init } from "@airstack/airstack-react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Space_Grotesk } from "next/font/google";
import { DefaultSeo } from "next-seo";
import { ThemeProvider } from "next-themes";
import { configureChains, createClient, WagmiConfig } from "wagmi";
// import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

import { CHAINS } from "@constants/chains";
import { DefaultLayout } from "@layouts/default-layout";
import { env } from "env.mjs";
import { XmtpProvider } from "providers/xmtp-provider";

import SEO from "../../next-seo.config";

import type { ExtendedPage } from "@types";
import type { AppProps } from "next/app";

const { chains, provider } = configureChains(CHAINS, [
  // alchemyProvider({ apiKey: env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
  jsonRpcProvider({
    rpc: () => ({
      http: `https://eth-sepolia.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
    }),
  }),
  publicProvider(),
]);

init(env.NEXT_PUBLIC_AIRSTACK_API_KEY);

const { connectors } = getDefaultWallets({
  appName: "Web3 Boilerplate",
  chains,
});

const queryClient = new QueryClient();

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  persister: null,
});

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

function MyApp({ Component, pageProps }: AppProps) {
  const getLayout =
    (Component as ExtendedPage).getLayout ||
    ((page) => (
      <DefaultLayout className={spaceGrotesk.className}>{page}</DefaultLayout>
    ));

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}

      <WagmiConfig client={client}>
        <RainbowKitProvider chains={chains}>
          <ThemeProvider>
            <XmtpProvider>
              <DefaultSeo {...SEO} />
              {getLayout(<Component {...pageProps} />)}
            </XmtpProvider>
          </ThemeProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}

export default MyApp;
