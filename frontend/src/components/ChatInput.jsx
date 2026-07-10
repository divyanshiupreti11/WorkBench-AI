import { useState } from "react";
import { Send, Paperclip,  Square, Zap, MessageSquare, Code2, Presentation, Image as ImageIcon, Globe, FileText,X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setArtifacts, setIsLoading } from "../redux/message.slice";
import { sendPrompt } from "../features/agent.api";
import { Mic, MicOff } from "lucide-react";
import { useEffect } from "react";
import { createConversation, updateConversations } from "../features/conversation.api";
import { addConversation, setConvTitle, setSelectedConversation } from "../redux/conversation.slice";
import { useRef } from "react";

export default function ChatInput({
  setBanner
}) {
  const [selectedAgent, setSelectedAgent] =useState("auto");
  const [value, setValue] = useState("");
const [isListening, setIsListening] = useState(false);

const recognitionRef = useRef(null);
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector(state => state.conversation);
   const { isLoading } = useSelector(state => state.message);
const fileRef = useRef(null);

const [

selectedFile,

setSelectedFile

]=useState(null);

   const placeholders={

auto:"Ask WorkBenchAI...",

chat:"Chat with WorkBenchAI...",

coding:"Describe the software you want...",

pdf:"Generate a PDF about...",

ppt:"Create a presentation about...",

image:"Describe the image...",

search:"Search the web..."

};

   const agents = [

  {
    id:"auto",
    icon:Zap,
    label:"Auto"
  },

  {
    id:"chat",
    icon:MessageSquare,
    label:"Chat"
  },

  {
    id:"coding",
    icon:Code2,
    label:"Coding"
  },

  {
    id:"pdf",
    icon:FileText,
    label:"PDF"
  },

  {
    id:"ppt",
    icon:Presentation,
    label:"PPT"
  },

  {
    id:"image",
    icon:ImageIcon,
    label:"Image"
  },

  {
    id:"search",
    icon:Globe,
    label:"Search"
  }

];

useEffect(() => {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) return;

  const recognition = new SpeechRecognition();

  recognition.lang = "en-IN";

  recognition.interimResults = true;

  recognition.continuous = true;

  recognition.onresult = (event) => {

    let transcript = "";

    for (

      let i = event.resultIndex;

      i < event.results.length;

      i++

    ) {

      transcript += event.results[i][0].transcript;

    }

    setValue(transcript);

  };

  recognition.onend = () => {

    setIsListening(false);

  };

  recognitionRef.current = recognition;

}, []);

const toggleMic = () => {

  if (!recognitionRef.current) {

    alert("Speech Recognition not supported");

    return;

  }

  if (isListening) {

    recognitionRef.current.stop();

    setIsListening(false);

  } else {

    recognitionRef.current.start();

    setIsListening(true);

  }

};


  const handleSend = async () => {
    const prompt = value.trim();
    if (!prompt) return;

    dispatch(setIsLoading(true));

    try {


      let conversation = selectedConversation;

      if (!conversation) {
        const newConversation = await createConversation();
        dispatch(addConversation(newConversation));
        dispatch(setSelectedConversation(newConversation));
        conversation = newConversation;
      }

      if (conversation.title === "New Chat") {
        await updateConversations(conversation._id, prompt.slice(0, 40));
        dispatch(setConvTitle({ conversationId: conversation._id, title: prompt.slice(0, 40) }));
      }

      dispatch(addMessage({ role: "user", content: prompt }));
      setValue("");

      const formData = new FormData();

formData.append(
    "conversationId",
    conversation._id
);

formData.append(
    "prompt",
    prompt
);

formData.append(
    "agent",
    selectedAgent
);

if(selectedFile){

    formData.append(
        "file",
        selectedFile
    );

}

setSelectedFile(null)

      const data = await sendPrompt(formData);
    console.log(data)
     dispatch(
  addMessage({
    role: "assistant",
    content: data.answer,
    images:data.images
  })
);

console.log(data)

if(data.artifacts){
  dispatch(
    setArtifacts(
      data.artifacts
    )
  );
}}
catch(error){

  setBanner({

    open:true,

    title:
      error.response?.data?.title ||
      "Something went wrong",

    message:
      error.response?.data?.message ||
      "Please try again."

  });

}
  finally {
       dispatch(setIsLoading(false));
    }
  };

  return (
  <div className="w-full overflow-hidden px-6 py-6 bg-transparent">
<div
className="
relative
flex
flex-col
gap-3

overflow-hidden

rounded-[28px]

border
border-blue-200/70

bg-white/75
backdrop-blur-2xl

px-6
py-4

shadow-[0_20px_60px_rgba(59,130,246,0.10)]
"
>
<div
className="
absolute
top-[-120px]
right-[-120px]

w-[320px]
h-[320px]

rounded-full

bg-blue-300/20

blur-3xl

pointer-events-none
"
/>
<div
className="
absolute
bottom-[-120px]
left-[-100px]

w-[260px]
h-[260px]

rounded-full

bg-sky-200/20

blur-3xl

pointer-events-none
"
/>
    <div className="relative z-10">
    <div className="flex flex-wrap gap-2">


    {agents.map((agent) => {

      const Icon = agent.icon;
      const isActive = selectedAgent === agent.id;

      return (

        <button
          key={agent.id}
          onClick={() => setSelectedAgent(agent.id)}
          className={`
            flex-shrink-0
            
            inline-flex
            items-center
            gap-1.5
           px-3.5
py-2

rounded-xl

text-[12px]

font-semibold
            font-medium
            border
            transition-all

            ${
  isActive
    ? "bg-blue-600 text-white border-transparent shadow-lg shadow-blue-300/40"
   : "bg-blue-50/70 text-slate-700 border border-slate-300 hover:bg-blue-100 hover:border-blue-400 hover:text-blue-600"
}
          `}
        >

          <Icon
            size={14}
            className={
              isActive
                ? "text-white"
                : "text-slate-500"
            }
          />

          {agent.label}

        </button>

      );

    })}


</div>

{

selectedFile && (

<div className="my-2">

<div
className="
inline-flex
items-center
gap-3

rounded-2xl

border
border-blue-200

bg-gradient-to-r
from-blue-50
to-white

px-4
py-3

shadow-md
shadow-blue-100/50
"
>

{

selectedFile.type==="application/pdf"

?

<FileText

size={22}

className="text-red-400"

/>

:



selectedFile?.type.startsWith("image/")

&&

<img

src={URL.createObjectURL(selectedFile)}

className="h-10 w-10 rounded-xl object-cover"

/>



}

<div>

<p className="text-sm font-semibold text-slate-800">

{

selectedFile.name

}

</p>

<p className="text-xs text-slate-500">

{

Math.ceil(

selectedFile.size/

1024

)

}

KB

</p>

</div>

<button

onClick={()=>{

setSelectedFile(null);

fileRef.current.value="";

}}

className="ml-2"

>

<X
size={15}
className="text-slate-500 hover:text-red-500 transition-colors"
/>

</button>

</div>

</div>

)
}


        {/* Textarea */}
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={
placeholders[selectedAgent]
}
          rows={1}
          disabled={isLoading}
          className="
w-full
min-h-[50px]
max-h-[90px]
bg-transparent
outline-none
resize-none
text-[17px]
font-medium
text-slate-800
placeholder:text-slate-500
leading-8
min-h-[36px]
[scrollbar-width:none]
[&::-webkit-scrollbar]:hidden
disabled:opacity-50
"
        />

        {/* Bottom row */}
        <div className="flex items-center justify-between">

          {/* Left — attach + mic */}
          <div className="flex items-center gap-1">
  <input

ref={fileRef}

type="file"

hidden

accept=".pdf,image/*"

onChange={(e)=>{

const file =
e.target.files[0];

if(file){

setSelectedFile(file);

}

}}

/>
            <button className="
flex
items-center
justify-center

w-10
h-10

rounded-2xl

border
border-blue-200

bg-white/70

text-slate-600

hover:bg-blue-50
hover:border-blue-400
hover:text-blue-600

transition-all
duration-200

cursor-pointer
"
            onClick={()=>
fileRef.current.click()
}
            >
              <Paperclip size={14} />
            </button>
           <button

onClick={toggleMic}

className={`
flex
items-center
justify-center
w-10
h-10
rounded-2xl
border
transition-all
cursor-pointer
${
isListening
? "bg-red-500 text-white border-red-500"
: "border-blue-200 text-slate-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
}
`}

>

{

isListening

?

<MicOff size={14}/>

:

<Mic size={14}/>

}

</button>
          </div>

          {/* Right — send / stop */}
          <button
            onClick={handleSend}
            disabled={!isLoading && !value.trim()}
          className={`flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-200 cursor-pointer
  ${
    isLoading
      ? "bg-slate-900 text-white border-slate-900"
      : value.trim()
      ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-400/50 hover:bg-blue-700 hover:scale-105 hover:shadow-blue-500/50"
      : "bg-blue-50 border-blue-100 text-slate-400   cursor-not-allowed"
  }`}
          >
            {isLoading ? <Square size={12} fill="currentColor" /> : <Send size={20} strokeWidth={2.4} />}
          </button>

        </div>
        </div>
      </div>

      <p className="relative z-10 text-center text-[11px] text-slate-500 mt-2">
        WorkBenchAI can make mistakes. Verify important info.
      </p>
    </div>
  );
}