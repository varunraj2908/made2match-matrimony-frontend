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
  Video,
  CheckCheck,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";

const plans = [
  {
    name: "Free",
    description: "Get started and explore profiles at no cost.",
    price: 0,
    yearlyPrice: 0,
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    features: [
      { text: "Create your profile", icon: <Heart size={20} /> },
      { text: "Browse 50 profiles/day", icon: <Eye size={20} /> },
      { text: "Send 5 interests/day", icon: <Search size={20} /> },
    ],
    includes: [
      "Free includes:",
      "Basic search filters",
      "Photo upload",
      "Email support",
    ],
  },
  {
    name: "Gold",
    description: "Perfect for serious seekers — maximum visibility.",
    price: 1499,
    yearlyPrice: 4999,
    buttonText: "Choose Gold",
    buttonVariant: "default" as const,
    popular: true,
    features: [
      { text: "Unlimited profile views", icon: <Eye size={20} /> },
      { text: "Direct messaging", icon: <MessageCircle size={20} /> },
      { text: "Advanced search filters", icon: <Search size={20} /> },
    ],
    includes: [
      "Everything in Free, plus:",
      "Profile highlighted in search",
      "WhatsApp contact sharing",
      "See who viewed you",
    ],
  },
  {
    name: "Platinum",
    description: "Complete package with dedicated matchmaker support.",
    price: 2999,
    yearlyPrice: 8999,
    buttonText: "Choose Platinum",
    buttonVariant: "outline" as const,
    features: [
      { text: "Personal matchmaker", icon: <Crown size={20} /> },
      { text: "Weekly profile boost", icon: <Heart size={20} /> },
      { text: "Video calling", icon: <Video size={20} /> },
    ],
    includes: [
      "Everything in Gold, plus:",
      "Dedicated relationship manager",
      "Priority customer support",
      "Background verification",
    ],
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
          <span className="relative">Quarterly</span>
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
            Yearly
            <span className="rounded-full bg-[#fde4ec] px-2 py-0.5 text-xs font-medium text-[#c0174c]">
              Save 20%
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
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
          const amount = isYearly ? plan.yearlyPrice : plan.price;
          const period =
            plan.price === 0 ? "forever" : isYearly ? "year" : "quarter";

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
                  <div className="flex justify-between">
                    <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    {plan.popular && (
                      <div>
                        <span className="bg-[#c0174c] text-white px-3 py-1 rounded-full text-sm font-medium">
                          Popular
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-semibold text-gray-900">
                      ₹
                      <NumberFlow
                        value={amount}
                        className="text-4xl font-semibold"
                      />
                    </span>
                    <span className="text-gray-600 ml-1">/{period}</span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <button
                    className={`w-full mb-6 p-3 text-lg font-bold rounded-xl transition ${
                      plan.popular
                        ? "bg-gradient-to-t from-[#a01040] to-[#c0174c] shadow-lg shadow-[#c0174c]/40 border border-[#c0174c] text-white hover:from-[#8a0d36] hover:to-[#a01040]"
                        : "border-2 border-[#c0174c] text-[#c0174c] hover:bg-[#c0174c] hover:text-white"
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                  <ul className="space-y-2 font-semibold py-5">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <span className="text-[#c0174c] grid place-content-center mt-0.5 mr-3">
                          {feature.icon}
                        </span>
                        <span className="text-sm text-gray-600">
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-3 pt-4 border-t border-[#c0174c]/15">
                    <h4 className="font-medium text-base text-gray-900 mb-3">
                      {plan.includes[0]}
                    </h4>
                    <ul className="space-y-2 font-semibold">
                      {plan.includes.slice(1).map((feature, featureIndex) => (
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
