import FeaturesSection from "@/components/features-8";
import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
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
      userId
    }
  });
  hasSubs = subs.length > 0; // true إذا كان عنده اشتراك
}

  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <div className="w-[90%] mx-auto">
      <GlowingEffectDemoSecond/>

      </div>
      <Pricing userId={userId} hasSubscription={hasSubs} />
      <FooterSection/>
    </div>
  );
}
