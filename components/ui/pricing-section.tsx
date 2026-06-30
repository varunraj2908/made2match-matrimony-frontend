"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import NumberFlow from "@number-flow/react";
import {
  Eye,
  Heart,
  MessageCircle,
  Search,
  Crown,
  CheckCheck,
  Phone,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState, type ReactNode } from "react";

const plans = [
  {
    name: "Silver",
    description: "Everything you need to start your search.",
    price: 1499,
    yearlyPrice: 1499,
    originalPrice: 2499,
    periodLabel: "1 month",
    badge: "Best Value",
    buttonText: "Choose Silver",
    buttonVariant: "outline" as const,
    features: [
      { text: "View up to 20 contact numbers", icon: <Phone size={20} /> },
      { text: "Browse unlimited profiles", icon: <Eye size={20} /> },
      { text: "Send unlimited interests/day", icon: <Heart size={20} /> },
      { text: "AI-powered compatibility score for every match", icon: <Search size={20} />, available: false },
    ],
    includes: [
      "Silver includes:",
      "Basic search filters",
      "Photo upload",
      "Email support",
    ],
  },
  {
    name: "Gold",
    description: "Perfect for serious seekers — maximum visibility.",
    price: 2499,
    originalPrice: 4540,
    badge: "Best Offer",
    yearlyPrice: 4999,
    buttonText: "Choose Gold",
    buttonVariant: "default" as const,
    popular: true,
    features: [
      { text: "View up to 80 contact numbers", icon: <Phone size={20} /> },
      { text: "AI-powered compatibility score for every match", icon: <Search size={20} />, available: false },
      { text: "Unlimited profile views", icon: <Eye size={20} /> },
      { text: "Direct messaging", icon: <MessageCircle size={20} /> },
    ],
    includes: [
      "Everything in Silver, plus:",
      "Profile highlighted in search",
      "WhatsApp contact sharing",
      "See who viewed you",
    ],
    // Second tab shown inside the Gold card.
    premium: {
      price: 2999,
      originalPrice: 5750,
      yearlyPrice: 6999,
      buttonText: "Choose Gold Plus",
      features: [
        { text: "View up to 150 contact numbers", icon: <Phone size={20} /> },
        { text: "Everything in Gold", icon: <Crown size={20} /> },
        { text: "AI-powered compatibility score for every match", icon: <Search size={20} /> },
        { text: "Unlimited interests/day", icon: <Heart size={20} /> },
      ],
      includes: [
        "Everything in Gold, plus:",
        "5x more profile visibility",
        "Verified badge on profile",
        "Priority chat support",
      ],
    },
  },
  {
    name: "Platinum",
    description: "Complete package with dedicated matchmaker support.",
    price: 3499,
    originalPrice: 8750,
    badge: "Best Offer",
    periodLabel: "6 months",
    yearlyPrice: 8999,
    buttonText: "Choose Platinum",
    buttonVariant: "outline" as const,
    features: [
      { text: "View up to 200 contact numbers", icon: <Phone size={20} /> },
      { text: "AI-powered compatibility score for every match", icon: <Search size={20} /> },
      { text: "Personal matchmaker", icon: <Crown size={20} /> },
      { text: "Weekly profile boost", icon: <Heart size={20} /> },
    ],
    includes: [
      "Everything in Gold, plus:",
      "Dedicated relationship manager",
      "Priority customer support",
      "Background verification",
    ],
    // Second tab shown inside the Platinum card.
    premium: {
      price: 3999,
      originalPrice: 11425,
      yearlyPrice: 12999,
      buttonText: "Choose Platinum Plus",
      features: [
        { text: "View up to 300 contact numbers", icon: <Phone size={20} /> },
        { text: "AI-powered compatibility score for every match", icon: <Search size={20} /> },
        { text: "Everything in Platinum", icon: <Crown size={20} /> },
        { text: "Handpicked daily matches", icon: <Heart size={20} /> },
      ],
      includes: [
        "Everything in Platinum, plus:",
        "Dedicated senior matchmaker",
        "Profile spotlight on homepage",
        "24/7 priority support",
      ],
    },
  },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-50 mx-auto flex w-fit rounded-full bg-white border border-[#c0174c]/20 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={`relative z-10 w-fit sm:h-12 h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors ${
            selected === "0" ? "text-white" : "text-gray-500 hover:text-black"
          }`}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-4 shadow-sm shadow-[#c0174c]/40 border-[#c0174c] bg-gradient-to-t from-[#a01040] via-[#e03a6d] to-[#c0174c]"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Regular</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={`relative z-10 w-fit sm:h-12 h-8 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors ${
            selected === "1" ? "text-white" : "text-gray-500 hover:text-black"
          }`}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-4 shadow-sm shadow-[#c0174c]/40 border-[#c0174c] bg-gradient-to-t from-[#a01040] via-[#e03a6d] to-[#c0174c]"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            Premium
            {/* <span className="rounded-full bg-[#fde4ec] px-2 py-0.5 text-xs font-medium text-[#c0174c]">
              Save 20%
            </span> */}
          </span>
        </button>
      </div>
    </div>
  );
};

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  // Per-plan inner tab ("base" | "premium") for plans that have a premium variant.
  const [tabs, setTabs] = useState<Record<string, "base" | "premium">>({});
  const setTab = (name: string, t: "base" | "premium") =>
    setTabs((s) => ({ ...s, [name]: t }));
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <div
      className="px-4 py-16 mx-auto relative bg-[#fdf5f7] overflow-hidden"
      ref={pricingRef}
    >
      <div
        className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, #c0174c 0%, transparent 70%)`,
          opacity: 0.18,
          mixBlendMode: "multiply",
        }}
      />

      <div className="relative z-10 text-center mb-6 max-w-3xl mx-auto">
        <p className="text-[#c0174c] text-xs font-bold tracking-widest uppercase mb-3">
          ✦ Upgrade Your Experience
        </p>

        <TimelineContent
          as="h2"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="md:text-5xl sm:text-4xl text-3xl font-extrabold text-gray-900 mb-4"
        >
          Membership plans for your journey to{" "}
          <TimelineContent
            as="span"
            animationNum={1}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="border border-dashed border-[#c0174c] px-2 py-1 rounded-xl bg-[#fde4ec] text-[#c0174c] capitalize inline-block"
          >
            love
          </TimelineContent>
        </TimelineContent>

        <TimelineContent
          as="p"
          animationNum={2}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="sm:text-base text-sm text-gray-600 sm:w-[70%] w-[80%] mx-auto"
        >
          Trusted by thousands of happy matches. Choose the plan that works best
          for your journey to love.
        </TimelineContent>
      </div>

      <TimelineContent
        as="div"
        animationNum={3}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="relative z-10"
      >
        <PricingSwitch onSwitch={togglePricingPeriod} />
      </TimelineContent>

      <div className="relative z-10 grid md:grid-cols-3 max-w-6xl gap-4 py-6 mx-auto">
        {plans.map((plan, index) => {
          const premium = (plan as any).premium;
          const usePremium = premium && (tabs[plan.name] ?? "base") === "premium";
          const eff = usePremium ? { ...plan, ...premium } : plan;
          const displayName = usePremium ? `${plan.name} Plus` : plan.name;
          const tabList: ("base" | "premium")[] = premium ? ["base", "premium"] : ["base"];
          const amount = isYearly ? eff.yearlyPrice : eff.price;
          const origPrice = (eff as any).originalPrice as number | undefined;
          const badge = (eff as any).badge as string | undefined;
          const showDiscount = origPrice != null && amount < origPrice;
          const period =
            (eff as any).periodLabel ??
            (eff.price === 0 ? "forever" : isYearly ? "year" : "3 months");

          return (
            <TimelineContent
              key={plan.name}
              as="div"
              animationNum={4 + index}
              timelineRef={pricingRef}
              customVariants={revealVariants}
            >
              <Card
                className={`relative h-full ${
                  plan.popular
                    ? "ring-2 ring-[#c0174c] bg-[#fff5f8]"
                    : "bg-white border-[#c0174c]/15"
                }`}
              >
                <CardHeader className="text-left">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`${premium ? "text-2xl" : "text-3xl"} whitespace-nowrap font-semibold mb-2 inline-block px-3 py-0.5 rounded-lg shadow-sm ${
                        plan.name === "Silver"
                          ? "text-white"
                          : plan.name === "Gold"
                            ? "text-[#5e4400]"
                            : "text-[#2f3a4a]"
                      }`}
                      style={{
                        background:
                          plan.name === "Silver"
                            ? "linear-gradient(135deg,#b4b8bf,#7d828b 60%,#a7abb3)"
                            : plan.name === "Gold"
                              ? "linear-gradient(135deg,#f6d878,#d4a017 60%,#e8c547)"
                              : "linear-gradient(135deg,#e8ebf0,#aeb6c2 60%,#cfd6df)",
                      }}
                    >
                      {displayName}
                    </h3>
                    {plan.popular && (
                      <div>
                        <span className="bg-[#c0174c] text-white px-3 py-1 rounded-full text-sm font-medium">
                          Popular
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Inner tabs: <Plan> | <Plan> Premium (single button when no premium) */}
                  <div className="inline-flex self-start w-fit rounded-full bg-[#fbeef2] border border-[#c0174c]/20 p-0.5 mb-3">
                    {tabList.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTab(plan.name, t)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                          (tabs[plan.name] ?? "base") === t
                            ? "bg-[#c0174c] text-white"
                            : "text-gray-500 hover:text-[#c0174c]"
                        }`}
                      >
                        {t === "base" ? plan.name : `${plan.name} Plus`}
                      </button>
                    ))}
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-2">
                    {showDiscount && origPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        ₹{origPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                    <span className="text-4xl font-semibold text-gray-900">
                      ₹
                      <NumberFlow
                        value={amount}
                        className="text-4xl font-semibold"
                      />
                    </span>
                    <span className="ml-2 self-center text-xs font-bold text-[#c0174c] bg-[#fde4ec] px-2 py-0.5 rounded-full">
                      {period}
                    </span>
                  </div>
                  {showDiscount && origPrice && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold">
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        {Math.round((1 - amount / origPrice) * 100)}% OFF
                      </span>
                      {badge && (
                        <span className="px-2 py-0.5 rounded-full bg-[#fde4ec] text-[#c0174c]">
                          {badge}
                        </span>
                      )}
                    </div>
                  )}
                </CardHeader>

                <CardContent className="pt-0">
                  <button
                    className={`w-full mb-6 p-3 text-lg font-bold rounded-xl transition ${
                      plan.popular
                        ? "btn-primary"
                        : "border-2 border-[#c0174c] text-[#c0174c] hover:bg-[#c0174c] hover:text-white"
                    }`}
                  >
                    {eff.buttonText}
                  </button>
                  <ul className="space-y-2 font-semibold py-5">
                    {eff.features.map((feature: { text: string; icon: ReactNode; available?: boolean }, featureIndex: number) => {
                      const unavailable = feature.available === false;
                      return (
                        <li key={featureIndex} className="flex items-center">
                          <span className={`grid place-content-center mt-0.5 mr-3 ${unavailable ? "text-gray-300" : "text-[#c0174c]"}`}>
                            {feature.icon}
                          </span>
                          <span className={`text-sm ${unavailable ? "text-gray-400 line-through" : "text-gray-600"}`}>
                            {feature.text}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="space-y-3 pt-4 border-t border-[#c0174c]/15">
                    <h4 className="font-medium text-base text-gray-900 mb-3">
                      {eff.includes[0]}
                    </h4>
                    <ul className="space-y-2 font-semibold">
                      {eff.includes.slice(1).map((feature: string, featureIndex: number) => (
                        <li key={featureIndex} className="flex items-center">
                          <span className="h-6 w-6 bg-[#fde4ec] border border-[#c0174c] rounded-full grid place-content-center mt-0.5 mr-3">
                            <CheckCheck className="h-4 w-4 text-[#c0174c]" />
                          </span>
                          <span className="text-sm text-gray-600">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TimelineContent>
          );
        })}
      </div>
    </div>
  );
}
