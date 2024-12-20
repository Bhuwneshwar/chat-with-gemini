import React, { useEffect, useRef } from "react";
import "../styles/MainContent.css";
import { useRebybRedux } from "rebyb-redux";
import { InitialState } from "../Store";
import Prism from "prismjs";
import { marked } from "marked";
import DOMPurify from "dompurify";
import "../styles/MarkdownEditor.css";
import "prismjs/themes/prism.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const MainContent: React.FC = () => {
  const {
    store: { markdown, markdowns, user },
    dispatch,
  } = useRebybRedux<InitialState>();
  const navigate = useNavigate();
  const { id } = useParams();
  // const [renderedText, setRenderedText] = useState<string>("<h1>Markdown</h1>");
  const markdownOutputRef = useRef<HTMLDivElement | null>(null); // React ref for the markdown output container

  const renderMarkdown = (): void => {
    if (markdown) {
      // const rawHTML: any = marked.parse(markdown);
      // const sanitizedHTML: string = DOMPurify.sanitize(rawHTML);
      // setRenderedText(sanitizedHTML);
    }
  };
  const MarkdownToHtml = (markdown: string): string => {
    const rawHTML: any = marked.parse(markdown);
    return DOMPurify.sanitize(rawHTML);
  };

  useEffect(() => {
    // Prism.highlightAll(); // Prism.js will highlight all code blocks
    // alert("Highlight");
    if (markdown) {
      renderMarkdown();
    }
  }, [markdown]);

  const chatsById = async (id: string) => {
    try {
      dispatch("markdowns", [
        {
          user: "...",
          model: "## Loading...",
          createdAt: new Date(),
        },
      ]);

      const { data } = await axios.get(`/api/chats/${id}`);
      // console.log({ data });
      if (data.success) {
        const conversation = JSON.parse(data.chat.conversations);
        // const question = JSON.parse(ch.conversations)[0].parts[0].text;
        // console.log({ conversation });
        const arr = [];
        for (let index = 0; index < conversation.length; index += 2) {
          const user = conversation[index].parts[0].text;
          const model = conversation[index + 1].parts[0].text;
          // console.log({ user, model });
          arr.push({
            user,
            model,
            createdAt: new Date(),
          });
        }

        // console.log({ arr });

        dispatch("markdowns", [...arr]);
      }
    } catch (error) {
      console.log(error);
      navigate("/unauthorized");
    }
  };

  useEffect(() => {
    if (id) {
      chatsById(id);
    }
  }, [id]);

  useEffect(() => {
    // alert(renderedText);
    if (markdownOutputRef.current) {
      const codeBlocks = markdownOutputRef.current.querySelectorAll(
        "pre code"
      ) as NodeListOf<HTMLElement>;

      codeBlocks.forEach((node) => {
        const code = node.textContent || "";
        const language = node.className.split("-")[1] || "javascript"; // Default to JavaScript if language is not specified

        const html = Prism.highlight(
          code,
          Prism.languages[language] || Prism.languages.javascript,
          language
        );
        node.innerHTML = html;

        const preNode = node.parentNode as HTMLElement; // This is <pre>

        const codePlace = document.createElement("div");
        codePlace.className =
          "codePlace border-2 border-blue-500 rounded-lg  w-";
        codePlace.innerHTML = `<div class="top flex justify-between items-center bg-gray-200 text-black text-sm px-4 py-2 rounded-t-lg"><span>${language}</span><button class="copy-button bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition">Copy Code</button></div><pre class=" bg-gray-100 font-mono text-sm p-4 rounded-b-lg overflow-x-auto max-w-full"><code class="language-${language}">${html}</code></pre>`;

        preNode.replaceWith(codePlace);

        // Attach event listener for the copy button
        const copyButton = codePlace.querySelector(
          ".copy-button"
        ) as HTMLButtonElement;
        copyButton.addEventListener("click", () => {
          copyToClipboard(code, copyButton); // Call the copy function
        });
      });
    }
  }, [markdowns, user]);

  useEffect(() => {
    // scroll to bottom
    markdownOutputRef.current?.scrollTo({
      top: markdownOutputRef.current?.scrollHeight,
      behavior: "smooth",
    });
  }, [markdowns]);

  const copyToClipboard = (text: string, btn: HTMLButtonElement): void => {
    navigator.clipboard
      .writeText(text) // Copy text to clipboard
      .then(() => {
        btn.innerText = "Copied!"; // Change button text temporarily
        setTimeout(() => (btn.innerText = "Copy Code"), 2000); // Revert after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err); // Handle errors
        btn.innerText = "Failed!";
        setTimeout(() => (btn.innerText = "Copy Code"), 2000);
      });
  };
  // console.log({ user });

  return (
    <div ref={markdownOutputRef} className="flex-1 p-2 h-full overflow-auto">
      {markdowns.map((markdown, i) => {
        return (
          <div key={i} className="conversation w-screen">
            <div className="user flex my-8">
              <div className=" w-full">
                <p className="date-time text-center text-teal-700">
                  {new Date(markdown.createdAt).toLocaleString()}
                </p>

                <div
                  // id="markdown-output"
                  className="markdown markdown-output"
                  // ref={markdownOutputRef} // Attach ref to this div
                  dangerouslySetInnerHTML={{
                    __html: MarkdownToHtml(markdown.user),
                  }}
                ></div>
              </div>
              <div className="icon w-9 h-9 relative bottom-2">
                <img
                  className="w-full h-full rounded-full border-gray-900 border-2 overflow-hidden"
                  src={user?.picture}
                  alt="user"
                />
              </div>
            </div>
            <div className="model flex my-8">
              <div className="icon w-9 h-9 relative bottom-4">
                <img
                  className="w-full h-full rounded-full border-gray-900 border-2"
                  src={
                    "https://png.pngtree.com/png-clipart/20230326/original/pngtree-chip-ai-human-brain-intelligence-technology-chip-high-tech-circuit-board-png-image_9004997.png"
                  }
                  alt="model"
                />
              </div>

              <div
                // id="markdown-output"
                className="markdown markdown-output"
                // ref={markdownOutputRef} // Attach ref to this div
                dangerouslySetInnerHTML={{
                  __html: MarkdownToHtml(markdown.model),
                }}
              ></div>
            </div>
          </div>
        );
      })}
      {/* center text */}
      {markdowns.length === 0 && (
        <div className="h-full grid place-items-center">
          <h2 className="text-2xl font-medium text-center mb-4">
            ASK ANYTHING...
          </h2>
        </div>
      )}
    </div>
  );
};

export default MainContent;
