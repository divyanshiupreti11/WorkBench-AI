import { AnimatePresence, motion } from "framer-motion";
import { X, Crown, Zap } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { createOrder } from "../features/billing.api";
import api from "../utils/axios";

export default function BillingDrawer({
  open,
  onClose
}) {

  const {userData}=useSelector(state=>state.user)
  const handleUpgrade = async (plan) => {

    try {

        const data =
            await createOrder(plan);

        const options = {

            key: import.meta.env.VITE_RAZORPAY_KEY,

            amount: data.order.amount,

            currency: data.order.currency,

            name: "WorkBenchAI",

            description: `${data.plan.name} Plan`,

            order_id: data.order.id,

            handler: async (response) => {

    try {

      const {data}=await api.post(

            "/api/billing/verify-payment",

            response

        );

      console.log(data)

    }

    catch (error) {

        console.log(error);

    }

},

            theme: {

                color: "#2563EB"

            }

        };

        const razorpay =
            new window.Razorpay(options);

        razorpay.open();

    }

    catch (error) {

        console.log(error);

    }

};
 console.log((
(userData?.credits || 0) /
(userData?.totalCredits || 1)
) * 100)
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: .5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Drawer */}

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: .25 }}
           className="fixed right-0 top-0 z-50 h-screen w-[420px] bg-gradient-to-br from-white via-slate-50 to-blue-50 border-l border-slate-200 shadow-2xl flex flex-col"
          >

            {/* Header */}

            <div className="flex items-center justify-between p-5 border-b border-slate-200">

              <div>

             <h2
className="
text-4xl
font-extrabold
bg-gradient-to-r
from-blue-700
via-blue-500
to-cyan-400
bg-clip-text
text-transparent
tracking-tight
"
>

                  Billing

                </h2>

             <p
className="
text-lg
font-bold
bg-gradient-to-r
from-blue-700
to-cyan-400
bg-clip-text
text-transparent
tracking-wide
"
>

                  Plans & Credits

                </p>

              </div>

              <button
                onClick={onClose}
               className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center transition-all"
              >
               <X size={18} className="text-slate-600"/>
              </button>

            </div>

            {/* Current Plan */}

            <div className="p-5">

         <div
className="
rounded-3xl
border
border-blue-300
bg-sky-50
p-6
relative
shadow-xl
shadow-blue-200/40
hover:-translate-y-2
hover:scale-[1.02]
hover:shadow-2xl
hover:shadow-cyan-300/50
transition-all
duration-300
cursor-pointer
"
>

                <div className="flex justify-between items-center">

                  <div>

                 <p className="text-slate-500 text-base font-medium">

                      Current Plan

                    </p>

                  <h3
className="
text-5xl
font-black
bg-gradient-to-r
from-blue-700
via-blue-500
to-cyan-400
bg-clip-text
text-transparent
leading-none
"
>

                     {userData?.plan ?? "Pro"}

                    </h3>

                  </div>

                  <Crown
size={30}
className="
text-yellow-500
drop-shadow-md
"
/>

                </div>

                <div className="mt-5">

                  <div className="flex justify-between text-xs text-slate-800 mb-2">

                    <span>Credits</span>

                    <span>{userData?.credits || 0}/{userData?.totalCredits || 0}</span>

                  </div>

                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">

                  <div
  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500"
  style={{
    width: `${
      (
        (userData?.credits || 0) /
        (userData?.totalCredits || 1)
      ) * 100
    }%`
  }}
/>

                  </div>

                </div>

              </div>

            </div>

            {/* Plans */}

            <div className="px-5 flex-1 overflow-auto space-y-4">

              {/* Starter */}

              <div
className="
rounded-3xl
bg-sky-50
border
border-blue-300
p-6
shadow-xl
shadow-blue-200/40
hover:-translate-y-2
hover:scale-[1.02]
hover:shadow-2xl
hover:shadow-cyan-300/50
transition-all
duration-300
cursor-pointer
"
>
  

                <h3 className="text-slate-900 text-2xl font-bold">

                  Starter

                </h3>

                <p className="text-blue-600 text-4xl font-extrabold mt-3">

                  ₹199

                </p>

                <p className="text-slate-500 text-base mt-2">

                  500 Credits

                </p>

                <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 hover:opacity-90 py-2.5 text-white font-medium shadow-md shadow-blue-300/30 transition-all" onClick={()=>handleUpgrade("starter")}>

                  Upgrade

                </button>

              </div>

              {/* Pro */}

              <div
className="
rounded-3xl
border
border-blue-300
bg-sky-50
p-6
relative
shadow-xl
shadow-blue-200/40
hover:-translate-y-2
hover:scale-[1.02]
hover:shadow-2xl
hover:shadow-cyan-300/50
transition-all
duration-300
cursor-pointer
"
>

                <span className="
absolute
right-4
top-4
px-3
py-1
rounded-full
text-xs
font-semibold
bg-gradient-to-r
from-blue-600
to-cyan-400
text-white
shadow-md
">

                  Popular

                </span>

               <h3 className="text-slate-900 text-2xl font-bold flex items-center gap-2">

                  Pro

                  <Zap
                    size={24}
                    className="text-yellow-400"
                  />

                </h3>

                <p className="text-blue-600 text-4xl font-extrabold mt-3">

                  ₹499

                </p>

                <p className="text-slate-500 text-base mt-2">

                  1000 Credits

                </p>

                <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 hover:opacity-90 py-2.5 text-white font-medium shadow-md shadow-blue-300/30 transition-all" onClick={()=>handleUpgrade("pro")}>

                  Upgrade

                </button>

              </div>

            </div>

            {/* Footer */}

            <div className="p-5 border-t border-slate-200">

              <p className="text-xs text-slate-500">

                Credits are used for Image, PDF, PPT and AI Generation.

              </p>

            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}