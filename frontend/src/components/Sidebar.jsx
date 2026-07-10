import { useEffect, useState } from "react";
import {
  Plus,
  MessageSquare,
  Search,
  Settings,
  LogOut,
  User,
  PenSquare,
  Menu,
  X,
  Coins,
  Trash2,
  CoinsIcon
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/axios";
import { setUserData } from "../redux/user.slice";
import {
  createConversation,
  getConversations,
  deleteConversation
} from "../features/conversation.api";
import { addConversation, setConversations, setSelectedConversation } from "../redux/conversation.slice";
import { getMessages } from "../features/message.api";
import { setArtifacts, setMessages } from "../redux/message.slice";
  import BillingDrawer from "./BillingDrawer";

export default function Sidebar() {
  const [hovered, setHovered]     = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
 const [imageError,setImageError]=useState(false)
  const { userData } = useSelector(state => state.user);
  const { conversations, selectedConversation } = useSelector(state => state.conversation);
  const dispatch = useDispatch();
const [showBilling, setShowBilling] =useState(false);
  const logout = async () => {
    try {
      await api.get("/api/auth/logout");
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        dispatch(setConversations(data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchConversations();
  }, [userData?._id]);

  const handleCreateConversation = () => {
    dispatch(setSelectedConversation(null));
    dispatch(setMessages([]));
    dispatch(setArtifacts([]));
    setMobileOpen(false);
  };

  const handleSelectConversation = async (conversation) => {
    setMobileOpen(false);
    dispatch(setSelectedConversation(conversation));
    const messages = await getMessages(conversation._id);
    dispatch(setMessages(messages));
     dispatch(setArtifacts(messages.artifacts));
  };
  const handleDeleteConversation = async (id) => {
  try {
    await deleteConversation(id);

    const data = await getConversations();

    dispatch(setConversations(data));

    if (selectedConversation?._id === id) {
      dispatch(setSelectedConversation(null));
      dispatch(setMessages([]));
      dispatch(setArtifacts([]));
    }
  } catch (err) {
    console.log(err);
  }
};

  const PanelIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/>
    </svg>
  );

  /* ── Collapsed rail — desktop only ── */
  const CollapsedRail = () => (
    <div className="hidden lg:flex flex-col items-center w-[56px] h-screen bg-white border-r border-slate-200 py-4 gap-1 shrink-0">
      <button
        onClick={() => setCollapsed(false)}
        className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-600 hover:text-slate-200 hover:bg-slate-100 transition-colors duration-150 bg-transparent border-none cursor-pointer mb-1"
      >
        <PanelIcon />
      </button>

      <button
        onClick={handleCreateConversation}
        className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-600 hover:text-slate-200 hover:bg-slate-100 transition-colors duration-150 bg-transparent border-none cursor-pointer"
      >
        <Plus size={17} />
      </button>

      <div className="flex-1 flex flex-col items-center gap-1 overflow-y-auto w-full px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mt-1">
        {conversations.map((chat) => {
          const isActive = selectedConversation?._id === chat._id;
          return (
            <button
              key={chat._id}
              onClick={() => handleSelectConversation(chat)}
              title={chat.title}
              className={`flex items-center justify-center w-9 h-9 rounded-xl transition-colors duration-150 border-none cursor-pointer
                ${isActive ? "bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600" : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-300"}`}
            >
              <MessageSquare size={15} />
            </button>
          );
        })}
      </div>

      <div className="mt-auto">
        {userData && (
          <div className="relative">
            {userData.avatar
              ? <img src={userData.avatar} alt={userData.name} className="w-8 h-8 rounded-[8px] object-cover border-2 border-blue-400/40 shadow-sm shadow-blue-200" />
              : <div className="w-8 h-8 rounded-[8px] bg-white/[0.06] flex items-center justify-center"><User size={14} className="text-slate-400" /></div>
            }
            <span className="absolute -bottom-px -right-px w-2 h-2 bg-green-500 rounded-full border-[1.5px] border-slate-100 block" />
          </div>
        )}
      </div>
    </div>
  );

  /* ── Full sidebar content ── */
  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Header */}
     <div className="flex items-center gap-2.5 px-5 py-5 border-b border-blue-200/70">
        {/* Desktop collapse */}
        <button
          onClick={() => setCollapsed(true)}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-600 hover:text-slate-200 hover:bg-slate-100 transition-colors duration-150 bg-transparent border-none cursor-pointer"
        >
          <PanelIcon />
        </button>

        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg text-slate-600 hover:text-slate-200 hover:bg-slate-100 transition-colors duration-150 bg-transparent border-none cursor-pointer"
        >
          <X size={15} />
        </button>

       <div className="flex items-center gap-3 flex-1">

  <div className="
w-11
h-11
rounded-2xl
bg-gradient-to-br
from-blue-600
to-sky-500
flex
items-center
justify-center
text-white
font-bold
text-xl
shadow-xl
shadow-blue-300/40
">
    W
  </div>

  <div>
  <h1 className="text-[18px] font-bold text-slate-900">
      WorkBenchAI
    </h1>

   <p className="text-xs text-slate-500 mt-0.5">
      Professional AI Workspace
    </p>
  </div>

</div>

        <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-full tracking-wide">
  {userData?.plan ?? "Free"}
</span>

        <button
          onClick={handleCreateConversation}
          className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-600 hover:text-slate-200 hover:bg-slate-100 transition-colors duration-150 bg-transparent border-none cursor-pointer"
        >
          <PenSquare size={14} />
        </button>
      </div>

      {/* New Chat */}
      <div className="px-4 pt-4 pb-1">
        <button
          onClick={handleCreateConversation}
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 rounded-2xl py-3 shadow-lg shadow-blue-400/20 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-400/40"
        >
          <Plus size={15} />
          New Chat
        </button>
      </div>
     

     <div className="px-4 mt-3">

  <div className="relative">

    <Search
      size={16}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
    />

    <input
      type="text"
      placeholder="Search chats..."
      className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-700 placeholder:text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
    />

  </div>

</div>
      {
        conversations.length==0? (
        
            <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-700">
                 No recent conversations
            </div>
          )
        :
        (
             
 <p className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-700">
        Recents
      </p>

        )
      }

      {/* Section label */}
     
      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {conversations.map((chat) => {
          const isActive = selectedConversation?._id === chat._id;
          const isHov    = hovered === chat._id;
       return (
  <div
    key={chat._id}
    onClick={() => handleSelectConversation(chat)}
    onMouseEnter={() => setHovered(chat._id)}
    onMouseLeave={() => setHovered(null)}
    className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150
      ${
        isActive
          ? "bg-blue-50 border-blue-300"
          : isHov
          ? "bg-slate-100 border-transparent"
          : "bg-transparent border-transparent"
      }`}
  >
    <div
      className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-colors duration-150
      ${
        isActive
          ? "bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      <MessageSquare size={13} />
    </div>

    <p
      className={`flex-1 text-[13px] font-medium truncate ${
        isActive ? "text-slate-1000" : "text-slate-700"
      }`}
    >
      {chat.title}
    </p>

    {isHov && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteConversation(chat._id);
        }}
        className="p-1 rounded hover:bg-red-500/20 text-red-400"
      >
        <Trash2 size={14} />
      </button>
    )}
  </div>
);
        })}
      </div>

      {/* Divider */}
      <div className="mx-2.5 h-px bg-slate-200" />

      {/* Footer */}
      <div className="px-3.5 py-3.5">
        {userData ? (
          <div className="flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 hover:bg-slate-100 transition-colors duration-150">
            <div className="relative shrink-0">
              {
  !userData?.avatar || imageError ? (
    <div className="w-9 h-9 rounded-[10px] bg-slate-200 flex items-center justify-center">
      <User size={15} className="text-slate-700" />
    </div>
  ) : (
    <img
      src={userData.avatar}
      alt={userData.name}
    className="w-9 h-9 rounded-[10px] object-cover border-2 border-blue-400/40 shadow-sm shadow-blue-200"
      onError={() => setImageError(true)}
    />
  )
}
              <span className="absolute -bottom-px -right-px w-[9px] h-[9px] bg-green-500 rounded-full border-2 border-white block" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-semibold text-slate-900 truncate">{userData.name}</p>
              <p className="text-[11px] text-slate-700 mt-px">{userData.plan || "Free Plan"}</p>
            </div>
            <div className="flex gap-1">
              <button
    onClick={() => setShowBilling(true)}
    className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-yellow-600 cursor-pointer hover:bg-white/[0.08] hover:text-slate-400 transition-all duration-150"
>
    <CoinsIcon size={16}/>
</button>
              <button onClick={logout} className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-slate-700 cursor-pointer hover:bg-white/[0.08] hover:text-slate-400 transition-all duration-150">
                <LogOut size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="px-1">
            <button className="w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-200 bg-slate-100 border border-white/[0.08] rounded-xl py-[11px] cursor-pointer hover:bg-white/[0.08] transition-colors duration-150">
              Login
            </button>
          </div>
        )}
      </div>

    </div>
  );

  if (collapsed) return <CollapsedRail />;

  return (
    <>
      {/* ── Mobile hamburger ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3.5 left-4 z-50 flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-200 transition-colors duration-150 cursor-pointer"
      >
        <Menu size={16} />
      </button>

      {/* ── Mobile backdrop ── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        />
      )}

      {/* ── Sidebar panel ── */}
     <div className={`
  fixed lg:static inset-y-0 left-0 z-50
  w-[330px] h-screen shrink-0

  bg-gradient-to-b
  from-[#EEF7FF]
  via-[#E7F3FF]
  to-[#DDEEFF]

  border-r
  border-blue-200/70

  shadow-xl
  shadow-blue-200/30

  transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <SidebarContent />
      </div>

<BillingDrawer

    open={showBilling}

    onClose={()=>
        setShowBilling(false)
    }

/>
    </>
  );
}