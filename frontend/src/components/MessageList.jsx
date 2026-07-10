import MessageBubble from "./MessageBubble";
import {
  Code2,
  Globe,
  FileText,
  Presentation,
  Image,
  Sparkles
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../features/message.api";
import { setArtifacts, setMessages } from "../redux/message.slice";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
function NeuralPulse() {
  return (
    <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
      {[0, 0.45, 0.9].map((delay, i) => (
        <motion.span
          key={i}
          className="absolute inset-0 rounded-full border border-cyan-400/30"
          initial={{ scale: 0.3, opacity: 0.55 }}
          animate={{ scale: 1.7, opacity: 0 }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay,
            ease: "easeOut",
          }}
        />
      ))}
      <motion.span
        className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-cyan-300 to-violet-400"
        style={{ boxShadow: "0 0 14px rgba(125,211,252,0.55)" }}
        animate={{ scale: [1, 1.25, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

const THINKING_LABELS = ["Thinking", "Analyzing", "Reasoning", "Generating"];

function GeneratingIndicator() {
  const [labelIndex, setLabelIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLabelIndex((prev) => (prev + 1) % THINKING_LABELS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const label = THINKING_LABELS[labelIndex];

  return (
    <div className="flex items-center gap-3 max-w-[72%] py-1">
      <NeuralPulse />
      <div className="flex overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={label}
            className="flex"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {label.split("").map((ch, i) => (
              <motion.span
                key={i}
                className="text-[13px] font-medium tracking-wide text-slate-400"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.07,
                }}
              >
                {ch}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function MessageList() {

  const bottomRef = useRef(null);
  const { messages, isLoading } = useSelector(state => state.message);
  const { selectedConversation } = useSelector(state => state.conversation);
  const dispatch = useDispatch();
useEffect(() => {

  requestAnimationFrame(() => {

    bottomRef.current?.scrollIntoView({

      behavior: "smooth",

      block: "end"

    });

  });

}, [messages.length, isLoading]);
  useEffect(() => {
    if (selectedConversation?.title === "New Chat") return;
    const get = async () => {
      const data = await getMessages(selectedConversation?._id);
      dispatch(setMessages(data));
      const latestArtifactMessage =
  [...data]
    .reverse()
    .find(
      msg =>
        msg.artifacts &&
        msg.artifacts.length > 0
    );

if (latestArtifactMessage) {

  dispatch(
    setArtifacts(
      latestArtifactMessage.artifacts
    )
  );

}
    };
    get();
  }, [selectedConversation?._id]);

  return (
<div className="relative flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-gradient-to-br from-white via-slate-50 to-blue-50 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {messages.length === 0 && !isLoading ? (
    <div
className="
relative
h-full
w-full
max-w-[1100px]
mx-auto

flex
flex-col
items-center

pt-10

text-center

overflow-hidden
"
>
        <div className="absolute inset-0 -z-10">



<div className="absolute top-0 right-0 w-[700px] h-[500px] rounded-full bg-blue-100 blur-[120px]" />

<div className="absolute -left-40 top-24 w-[420px] h-[420px] rounded-full bg-sky-100 blur-[120px]" />

<div className="absolute bottom-0 right-0 w-[520px] h-[520px] rounded-full border border-white/50 rounded-full" />
<div
  className="
    absolute
    left-8
    top-32
    grid
    grid-cols-10
    gap-3
    opacity-40
  "
>
  {Array.from({ length: 80 }).map((_, i) => (
    <div
      key={i}
      className="w-1 h-1 rounded-full bg-blue-200"
    />
  ))}
</div>
</div>



  {/* Logo */}
  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow-xl shadow-blue-300/40">
    <span className="text-4xl font-bold text-white">W</span>
  </div>

  {/* Heading */}
  <h1 className="mt-3 text-4xl font-extrabold text-slate-900">
    Welcome to{" "}
    <span className="text-blue-600">
      WorkBenchAI
    </span>
  </h1>

  <p className="mt-2 max-w-xl text-base text-slate-600">
    Your AI Workspace for coding, web search, PDF generation,
    presentations, image generation and much more.
  </p>

  {/* Feature Cards */}
  <div className="grid grid-cols-3 gap-5 mt-14">

    {[
      {
        icon: <Code2 size={28} />,
        title: "Code",
        desc: "Generate & Debug Code",
      },
      {
        icon: <Globe size={28} />,
        title: "Search",
        desc: "Search the Web",
      },
      {
        icon: <FileText size={28} />,
        title: "PDF",
        desc: "Create PDF Files",
      },
      {
        icon: <Presentation size={28} />,
        title: "PPT",
        desc: "Generate Slides",
      },
      {
        icon: <Image size={28} />,
        title: "Images",
        desc: "Generate Images",
      },
      {
        icon: <Sparkles size={28} />,
        title: "Ask Anything",
        desc: "AI Assistant",
      },
    ].map((item) => (
      <button
        key={item.title}
        className="
group

w-[290px]
h-[96px]

rounded-[24px]

bg-white/80
backdrop-blur-xl

border
border-blue-100

px-6
py-5

flex
items-center
justify-between

shadow-[0_8px_30px_rgba(59,130,246,0.08)]

hover:shadow-[0_18px_45px_rgba(59,130,246,0.18)]
hover:-translate-y-1

transition-all
duration-300

text-left
"
      >
        <>
  {/* Left Icon */}
  <div
    className="
      w-14
      h-14
      rounded-2xl
      bg-blue-50
      text-blue-600
      flex
      items-center
      justify-center
      shrink-0
    "
  >
    {item.icon}
  </div>

  {/* Text */}
  <div className="flex-1 ml-4">
    <h2 className="text-[22px] font-bold text-slate-900">
      {item.title}
    </h2>

    <p className="mt-1 text-sm text-slate-500 leading-5">
      {item.desc}
    </p>
  </div>
</>
      </button>
    ))}

  </div>

</div>
      ) : (
        <>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <MessageBubble role={msg.role} content={msg.content} images={msg?.images || []}/>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <GeneratingIndicator />
            </motion.div>
          )}
        
        </>
      )}
        <div ref={bottomRef} />
    </div>
  );
}