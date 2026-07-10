import { Share2, MoreHorizontal, Zap, ChartBar, MessageCircle, MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";

export default function Navbar() {
  const { conversations, selectedConversation } = useSelector(state => state.conversation);
  const {messages} = useSelector(state => state.message);
  return (
   <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-white">

      {/* Left — chat title */}
      <div className="flex items-center gap-2.5">
       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-100 border border-blue-200">
          <MessageSquare size={15} className="text-blue-600" />
        </div>
       <h2 className="text-[16px] font-bold text-slate-900 tracking-tight">
          {selectedConversation?.title || "New Chat"}
        </h2>
      <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 border border-blue-200 px-3 py-1 rounded-full">
          {messages.length} Messages
        </span>
      </div>

      {/* Right — actions */}
     

    </div>
  );
}