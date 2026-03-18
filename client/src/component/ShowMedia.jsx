import { useContext } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { ChatContext } from "../context/ChatContext";

const videosDummyData = [
  "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
];
const filesDummyData = [
  { name: "Resume.pdf", url: "#" },
  { name: "Notes.txt", url: "#" },
];

const linksDummyData = [{ name: "Google", url: "https://google.com" }];

const ShowMedia = ({ type, onBack, style, isOverlayMode }) => {
  const { messages } = useContext(ChatContext);

  return (
    <aside
      style={style ? style : null}
      // Show only on XL screens if not overlay mode
      className={`bg-[#1F2937] text-white w-full h-full overflow-y-scroll px-1 ${!isOverlayMode ? "hidden xl:block" : ""}`}
    >
      {/* Header with back button and media type label */}
      <header className="p-2 sticky top-0 z-20 bg-[#1F2937]">
        <button
          onClick={onBack}
          className="text-sm text-shadow-white m-1 cursor-pointer w-7"
        >
          <FaArrowLeft />
        </button>
        <span className="ml-1.5">{type}</span>
      </header>

      {/* Media grid */}
      <ul
        className={`grid ${
          type !== "videos" ? "grid-cols-2" : "grid-cols-1"
        } gap-1 `}
      >
        {type === "photos" &&
          messages
            .filter((msg) => msg.image)
            .map((msg, index) => (
              <li
                key={index}
                onClick={() => window.open(msg.image)}
                className="cursor-pointer rounded"
              >
                <img
                  src={msg.image}
                  alt="Shared media"
                  className="h-full rounded-md"
                />
              </li>
            ))}

        {type === "videos" &&
          videosDummyData.map((url, index) => (
            <li key={index}>
              <video src={url} controls className="rounded-md w-full" />
            </li>
          ))}
      </ul>
    </aside>
  );
};

export default ShowMedia;
