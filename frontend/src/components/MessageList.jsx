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
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {messages.length === 0 && !isLoading ? (
        <div className="h-full flex flex-col items-center justify-center text-center px-6">

  {/* Logo */}
  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow-xl shadow-blue-300/40">
    <span className="text-4xl font-bold text-white">W</span>
  </div>

  {/* Heading */}
  <h1 className="mt-8 text-5xl font-extrabold text-slate-900">
    Welcome to{" "}
    <span className="text-blue-600">
      WorkBenchAI
    </span>
  </h1>

  <p className="mt-4 max-w-2xl text-lg text-slate-600">
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
        className="w-56 rounded-3xl bg-white border border-slate-200 p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left"
      >
        <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
          {item.icon}
        </div>

        <h2 className="mt-5 text-lg font-bold text-slate-900">
          {item.title}
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {item.desc}
        </p>
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