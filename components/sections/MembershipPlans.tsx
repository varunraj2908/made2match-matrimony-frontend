// export default function MembershipPlans(){
//     return(
//          <section className="bg-[#fdf5f7] px-8 py-12">
//         <p className="text-[#c0174c] text-xs font-bold tracking-widest uppercase mb-2">
//           ✦ Upgrade Your Experience
//         </p>
//         <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
//           Membership Plans
//         </h2>
//         <p className="text-gray-500 text-sm mb-10">
//           Choose the plan that works best for your journey to love.
//         </p>

//         <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto items-center">
//           {/* Free */}
//           <div className="animated-border">
//             <div className="bg-white rounded-2xl p-7 flex flex-col">
//               <h3 className="text-xl font-bold text-gray-800 mb-1">Free</h3>
//               <p className="text-gray-400 text-xs mb-5">
//                 Get started and explore profiles at no cost.
//               </p>
//               <p className="text-3xl font-extrabold text-gray-900 mb-1">
//                 ₹0{" "}
//                 <span className="text-sm font-normal text-gray-400">
//                   / forever
//                 </span>
//               </p>
//               <ul className="flex flex-col gap-2 my-5 flex-1">
//                 {[
//                   "Create your profile",
//                   "Browse 50 profiles/day",
//                   "Send 5 interests/day",
//                   "Basic search filters",
//                 ].map((f) => (
//                   <li
//                     key={f}
//                     className="flex items-center gap-2 text-xs text-gray-600"
//                   >
//                     <span className="text-[#c0174c] font-bold">✓</span> {f}
//                   </li>
//                 ))}
//               </ul>
//               <button className="w-full border-2 border-[#c0174c] text-[#c0174c] font-bold py-2.5 rounded-xl text-sm hover:bg-[#c0174c] hover:text-white transition">
//                 Get Started
//               </button>
//             </div>
//           </div>

//           {/* Gold — always animated, scaled */}
//           <div
//             className="animated-border"
//             style={{ transform: "scale(1.04)", zIndex: 2 }}
//           >
//             <div className="bg-white rounded-2xl p-7 flex flex-col relative">
//               <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#c0174c] text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-widest whitespace-nowrap">
//                 ★ MOST POPULAR
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 mt-4 mb-1">
//                 Gold
//               </h3>
//               <p className="text-gray-400 text-xs mb-5">
//                 Perfect for serious seekers — maximum visibility.
//               </p>
//               <p className="text-3xl font-extrabold text-gray-900 mb-1">
//                 ₹1,499{" "}
//                 <span className="text-sm font-normal text-gray-400">
//                   / 3 months
//                 </span>
//               </p>
//               <ul className="flex flex-col gap-2 my-5 flex-1">
//                 {[
//                   "Unlimited profile views",
//                   "Direct messaging",
//                   "Advanced search filters",
//                   "Profile highlighted in search",
//                   "WhatsApp contact sharing",
//                 ].map((f) => (
//                   <li
//                     key={f}
//                     className="flex items-center gap-2 text-xs text-gray-600"
//                   >
//                     <span className="text-[#c0174c] font-bold">✓</span> {f}
//                   </li>
//                 ))}
//               </ul>
//               <button className="w-full bg-[#c0174c] hover:bg-[#a01040] text-white font-bold py-2.5 rounded-xl text-sm transition">
//                 Choose Gold
//               </button>
//             </div>
//           </div>

//           {/* Platinum */}
//           <div className="animated-border">
//             <div className="bg-white rounded-2xl p-7 flex flex-col">
//               <h3 className="text-xl font-bold text-gray-800 mb-1">Platinum</h3>
//               <p className="text-gray-400 text-xs mb-5">
//                 Complete package with dedicated matchmaker support.
//               </p>
//               <p className="text-3xl font-extrabold text-gray-900 mb-1">
//                 ₹2,999{" "}
//                 <span className="text-sm font-normal text-gray-400">
//                   / 6 months
//                 </span>
//               </p>
//               <ul className="flex flex-col gap-2 my-5 flex-1">
//                 {[
//                   "All Gold features",
//                   "Personal matchmaker",
//                   "Profile boost weekly",
//                   "Video calling",
//                   "Priority customer support",
//                 ].map((f) => (
//                   <li
//                     key={f}
//                     className="flex items-center gap-2 text-xs text-gray-600"
//                   >
//                     <span className="text-[#c0174c] font-bold">✓</span> {f}
//                   </li>
//                 ))}
//               </ul>
//               <button className="w-full border-2 border-[#c0174c] text-[#c0174c] font-bold py-2.5 rounded-xl text-sm hover:bg-[#c0174c] hover:text-white transition">
//                 Choose Platinum
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>
//     )
// }


export default function MembershipPlans() {
  return (
    <section className="bg-[#fdf5f7] px-4 sm:px-6 lg:px-8 py-12">
      {/* HEADER */}
      <div className="text-center mb-10">
        <p className="text-[#c0174c] text-xs font-bold tracking-widest uppercase mb-2">
          ✦ Upgrade Your Experience
        </p>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          Membership Plans
        </h2>

        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Choose the plan that works best for your journey to love.
        </p>
      </div>

      {/* PLANS */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-6
          max-w-6xl
          mx-auto
        "
      >
        {/* FREE */}
        <div className="animated-border w-full">
          <div className="bg-white rounded-2xl p-6 flex flex-col h-full">
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              Free
            </h3>

            <p className="text-gray-400 text-xs mb-5">
              Get started and explore profiles at no cost.
            </p>

            <p className="text-3xl font-extrabold text-gray-900 mb-1">
              ₹0{" "}
              <span className="text-sm font-normal text-gray-400">
                / forever
              </span>
            </p>

            <ul className="flex flex-col gap-3 my-6 flex-1">
              {[
                "Create your profile",
                "Browse 50 profiles/day",
                "Send 5 interests/day",
                "Basic search filters",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="text-[#c0174c] font-bold">
                    ✓
                  </span>

                  {f}
                </li>
              ))}
            </ul>

            <button className="w-full border-2 border-[#c0174c] text-[#c0174c] font-bold py-3 rounded-xl text-sm hover:bg-[#c0174c] hover:text-white transition">
              Get Started
            </button>
          </div>
        </div>

        {/* GOLD */}
        <div
          className="
            animated-border
            w-full
            md:scale-[1.02]
            lg:scale-[1.05]
            z-10
          "
        >
          <div className="bg-white rounded-2xl p-6 flex flex-col relative h-full">
            <div
              className="
                absolute
                -top-4
                left-1/2
                -translate-x-1/2
                bg-[#c0174c]
                text-white
                text-[10px]
                sm:text-xs
                font-bold
                px-4
                py-1.5
                rounded-full
                tracking-widest
                whitespace-nowrap
              "
            >
              ★ MOST POPULAR
            </div>

            <h3 className="text-xl font-bold text-gray-800 mt-4 mb-1">
              Gold
            </h3>

            <p className="text-gray-400 text-xs mb-5">
              Perfect for serious seekers — maximum visibility.
            </p>

            <p className="text-3xl font-extrabold text-gray-900 mb-1">
              ₹1,499{" "}
              <span className="text-sm font-normal text-gray-400">
                / 3 months
              </span>
            </p>

            <ul className="flex flex-col gap-3 my-6 flex-1">
              {[
                "Unlimited profile views",
                "Direct messaging",
                "Advanced search filters",
                "Profile highlighted in search",
                "WhatsApp contact sharing",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="text-[#c0174c] font-bold">
                    ✓
                  </span>

                  {f}
                </li>
              ))}
            </ul>

            <button className="w-full bg-[#c0174c] hover:bg-[#a01040] text-white font-bold py-3 rounded-xl text-sm transition">
              Choose Gold
            </button>
          </div>
        </div>

        {/* PLATINUM */}
        <div className="animated-border w-full">
          <div className="bg-white rounded-2xl p-6 flex flex-col h-full">
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              Platinum
            </h3>

            <p className="text-gray-400 text-xs mb-5">
              Complete package with dedicated matchmaker support.
            </p>

            <p className="text-3xl font-extrabold text-gray-900 mb-1">
              ₹2,999{" "}
              <span className="text-sm font-normal text-gray-400">
                / 6 months
              </span>
            </p>

            <ul className="flex flex-col gap-3 my-6 flex-1">
              {[
                "All Gold features",
                "Personal matchmaker",
                "Profile boost weekly",
                "Video calling",
                "Priority customer support",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="text-[#c0174c] font-bold">
                    ✓
                  </span>

                  {f}
                </li>
              ))}
            </ul>

            <button className="w-full border-2 border-[#c0174c] text-[#c0174c] font-bold py-3 rounded-xl text-sm hover:bg-[#c0174c] hover:text-white transition">
              Choose Platinum
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}