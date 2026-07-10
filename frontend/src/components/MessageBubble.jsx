import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiExternalLink, FiX } from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";

function MessageBubble({
  role,
  content,
  images = []
}) {
  const isUser = role === "user";
  const [lightboxSrc, setLightboxSrc] = useState(null);
const [copiedCode, setCopiedCode] = useState("");
const copyCode = async (code) => {
  await navigator.clipboard.writeText(code);

  setCopiedCode(code);

  setTimeout(() => {
    setCopiedCode("");
  }, 2000);
};

const markdown = (content || "")
  .replace(/```review/gi, "```")
  .replace(/```text/gi, "```")
  .replace(/```[a-zA-Z0-9_-]+\s+id="[^"]*"/g, "```");
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`w-fit max-w-[92vw] md:max-w-[72%]
  px-4 py-2.5 rounded-2xl
  break-words overflow-hidden
  leading-relaxed
        ${
          isUser
? `
bg-[#2563EB]
text-white
rounded-tr-sm
border
border-blue-700/20
shadow-lg
shadow-blue-300/30
`
          : `
bg-gradient-to-br
from-white/85
to-blue-50/80
backdrop-blur-xl
border
border-blue-200/70
shadow-lg
shadow-blue-200/40
text-slate-800
rounded-tl-sm
`
        }`}
      >
        {images.length > 0 && (
    <div className="flex flex-wrap gap-3 mt-4">
        {images.map((img, i) => (
            <img
                key={i}
                src={img}
                loading="lazy"
                onClick={() => setLightboxSrc(img)}
                onError={(e)=>e.currentTarget.remove()}
                className="w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition"
            />
        ))}
    </div>
)}<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold mt-5 mb-3">{children}</h1>
    ),

    h2: ({ children }) => (
      <h2 className="text-xl font-semibold mt-4 mb-2">{children}</h2>
    ),

    h3: ({ children }) => (
      <h3 className="text-lg font-semibold mt-3 mb-2">{children}</h3>
    ),

    p: ({ children }) => (
      <p className="mb-3 whitespace-pre-wrap break-words">
        {children}
      </p>
    ),

    ul: ({ children }) => (
      <ul className="list-disc pl-5 space-y-1 my-2">
        {children}
      </ul>
    ),

    ol: ({ children }) => (
      <ol className="list-decimal pl-5 space-y-1 my-2">
        {children}
      </ol>
    ),

    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
       <table className="min-w-full border border-blue-100">
          {children}
        </table>
      </div>
    ),

    th: ({ children }) => (
      <th className="border border-blue-100 bg-gradient-to-r
from-blue-50
to-cyan-50 px-3 py-2 text-left text-slate-900">
        {children}
      </th>
    ),

    td: ({ children }) => (
      <td className="border border-blue-100 px-3 py-2 text-slate-700">
        {children}
      </td>
    ),

   a: ({ href, children }) => {
  const isPdf = href?.toLowerCase().endsWith(".pdf");

  return (
    <a
      href={href}
      target={isPdf ? "_self" : "_blank"}
      rel="noreferrer"
      download={isPdf}
     className="text-blue-600 hover:text-cyan-500 underline inline-flex items-center gap-1 transition-colors"
    >
      {children}
      <FiExternalLink size={11} />
    </a>
  );
},

    img: ({ src }) => {
      if (!src) return null;

      return (
        <img
          src={src}
          loading="lazy"
          onClick={() => setLightboxSrc(src)}
          onError={(e) => e.currentTarget.remove()}
         className="
w-40
h-28
rounded-xl
object-cover
cursor-pointer
transition-all
duration-300
hover:scale-105
hover:shadow-xl
hover:shadow-blue-300/40
"
        />
      );
    },

    code({ className, children }) {
      console.log(children)
      const value = String(children)
  .replace(/^\s*```[^\n]*\n/, "")
  .replace(/\n```\s*$/, "")
  .trim();

      if (!className) {
        return (
        <code
className="
px-2
py-1
rounded-lg
bg-gradient-to-r
from-blue-50
to-cyan-50
border
border-blue-100
text-blue-700
font-semibold
"
>
            {value}
          </code>
        );
      }

      const language = className.replace("language-", "");

      return (
        <div className="my-4 overflow-hidden rounded-xl border border-white/10 bg-[#111318]">

         <div
className="
flex
items-center
justify-between
px-4
py-2
bg-gradient-to-r
from-slate-800
to-slate-900
border-b
border-slate-700
"
>

            <span className="uppercase text-xs text-slate-400">
              {language}
            </span>

            <button
              onClick={() => copyCode(value)}
           className="
flex
items-center
gap-1
text-xs
px-2
py-1
rounded-lg
hover:bg-white/10
transition-all
duration-300
"
            >
              {copiedCode === value ? (
                <>
                  <Check size={14} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy
                </>
              )}
            </button>

          </div>

          <SyntaxHighlighter
            language={language}
            style={oneDark}
            wrapLongLines
            showLineNumbers
            customStyle={{
              margin: 0,
              padding: "16px",
              background: "#0d1117",
              fontSize: "13px",
            }}
          >
            {value}
          </SyntaxHighlighter>

        </div>
      );
    },
  }}
>
  {markdown}
</ReactMarkdown>
      </div>

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxSrc(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2"
          >
            <FiX size={20} />
          </button>
          <img
            src={lightboxSrc}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
}

export default MessageBubble;