import Features10 from "@/components/features-10";
import FeaturesSection from "@/components/features-8";
import FeaturesSection2 from "@/components/features-9";
import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import LogoCloud from "@/components/logo-cloud";
import Pricing from "@/components/pricing";
import { GlowingEffectDemoSecond } from "@/components/soloution";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  let hasSubs = false;

  if (userId) {
    const subs = await prisma.subscription.findMany({
      where: {
        userId,
      },
    });
    hasSubs = subs.length > 0; // true إذا كان عنده اشتراك
  }

  return (
    <div>
      <HeroSection />
      <LogoCloud/>
      <div className="w-[95%] lg:w-[80%] mx-auto flex flex-col gap-5 mt-15">
      <h1 className=" text-3xl lg:text-5xl font-bold text-center mt-8 mb-2">
          Capture, Organize, and Find Your Notes Effortlessly
        </h1>
        <p className="text-muted-foreground text-center text-lg max-w-2xl mx-auto ">
          Discover seamless note management with smart search, instant syncing, and powerful organization tools. Rivorea Notes helps you turn fleeting thoughts into lasting knowledge—anytime, anywhere.
        </p>
        <FeaturesSection />
      </div>

      <div className="w-[95%] lg:w-[80%] mx-auto flex flex-col gap-5 mt-16 mb-2">
        <h2 className="text-3xl lg:text-5xl font-bold text-center mt-8 mb-2">
          Why Choose Rivorea Notes?
        </h2>
        <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
          Supercharge your productivity with powerful search, seamless syncing, and an effortless experience—everything you need, always at your fingertips.
        </p>
      </div>
      <Features10 />
      
      <div className="w-[95%] lg:w-[80%] mx-auto flex flex-col gap-3">
        <h1 className=" text-3xl lg:text-5xl font-bold text-center mt-8 mb-2">
          Effortless Sync, Exceptional Security
        </h1>
        <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto mb-4">
          Enjoy seamless note syncing across all your devices, with enterprise-grade protection for your privacy and data. Rivorea Notes keeps your thoughts accessible and protected, everywhere and always.
        </p>
        <GlowingEffectDemoSecond />
      </div>
      <div className="w-[95%] lg:w-[80%] mx-auto flex flex-col gap-5 mt-16 mb-2">
        <h2 className="text-3xl lg:text-5xl font-bold text-center">
          Advanced Features for Productive Note-Taking
        </h2>
        <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
          Unlock a new level of efficiency: seamless organization, instant support, reliable sync, and activity monitoring to boost your workflow with Rivorea Notes.
        </p>
      </div>
      <FeaturesSection2/>
      <Pricing userId={userId} hasSubscription={hasSubs} />
      <FooterSection />
    </div>
  );
}
