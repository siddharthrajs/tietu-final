import BentoGrid from "@/components/BentoGrid";
import { Hero } from "@/components/hero";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="flex flex-col gap-16 items-center">
      <Navbar />
      <Hero />
      <BentoGrid />
      Marquee
      <br />
      Footer
    </main>
  );
}
