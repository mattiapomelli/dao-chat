import cx from "classnames";
import { Space_Grotesk } from "next/font/google";

import { DaosNowSection } from "@components/landing/daos-now-section";
import { Hero } from "@components/landing/hero";
import { IntroductionSecion } from "@components/landing/introduction-section";
import { ProblemSection } from "@components/landing/problem-secion";
import { TechnologiesSecion } from "@components/landing/technologies-section";
import { Container } from "@components/layout/container";
import { Footer } from "@components/layout/footer";
import { Navbar } from "@components/layout/navbar";
import { ExtendedPage } from "@types";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

const Home: ExtendedPage = () => {
  return (
    <>
      <Hero />
      <DaosNowSection />
      <ProblemSection />
      <IntroductionSecion />
      <TechnologiesSecion />
    </>
  );
};

Home.getLayout = (page) => (
  <div className={cx("flex min-h-screen flex-col", spaceGrotesk.className)}>
    <Navbar />
    <main className="flex-1 overflow-x-hidden pb-20 pt-8">
      <Container>{page}</Container>
    </main>
    <Footer />
  </div>
);

export default Home;
