import { useState } from "react";
import LeftSidebar from "../component/LeftSidebar";
import ChatContainer from "../component/ChatContainer";
import RightSidebar from "../component/RightSidebar";
import ShowMedia from "../component/ShowMedia";
import { useEffect } from "react";
import { useContext } from "react";
import { ContactContext } from "../context/ContactContext";
import DeleteChatPage from "../component/DeleteChatPage";

const rightSidebarOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: "100%",
  width: "100%",
  maxWidth: "400px",
  zIndex: 800,
  borderRadius: "10px",
  margin: "0 auto",
};

// Background layer used to dim the UI behind overlays
const overlayBackground = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  zIndex: 700,
  cursor: "default",
};

const overlayBackgroundDeletePage = {
  position: "fixed",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0,0,0,0.5)",
  zIndex: 900,
};

const Home = () => {
  const { selectedUser } = useContext(ContactContext);
  const [activeMedia, setActiveMedia] = useState(null);
  const [openRightSidebarOverlay, setOpenRightSidebarOverlay] = useState(false);
  const [openRightSidebarInline, setOpenRightSidebarInline] = useState(true);
  const [showMediaRenderMode, setShowMediaRenderMode] = useState(null);

  const [openDeleteChatPage, setOpenDeleteChatPage] = useState(false);

  // Toggle inline RightSidebar (desktop layout)
  const toggleRightSidebar = () => {
    setOpenRightSidebarInline((prev) => !prev);
  };

  // Prevent background scrolling when overlay sidebar is open
  useEffect(() => {
    document.body.style.overflow = openRightSidebarOverlay ? "hidden" : "auto";
  }, [openRightSidebarOverlay]);

  // Reset sidebar and media states when no user is selected
  useEffect(() => {
    if (!selectedUser) {
      setOpenRightSidebarOverlay(false);
      setActiveMedia(null);
      setShowMediaRenderMode(null);
    }
  }, [selectedUser]);

  return (
    <main className="border w-full h-screen">
      <section
        className={`h-full grid grid-cols-1 relative ${
          selectedUser
            ? `md:grid-cols-[1.5fr_2.5fr] ${
                openRightSidebarInline
                  ? "xl:grid-cols-[1fr_2fr_1fr]"
                  : "xl:grid-cols-[1fr_3fr]"
              }`
            : "md:grid-cols-[1fr_3fr]"
        }`}
      >
        <LeftSidebar style={overlayBackground} />

        <ChatContainer
          onOpenRightSidebar={() => setOpenRightSidebarOverlay(true)}
          onToggleRightSidebar={toggleRightSidebar}
          isRightSidebarInlineOpen={openRightSidebarInline}
          setOpenDeleteChatPage={setOpenDeleteChatPage}
        />

        {/* RightSidebar or ShowMedia in inline mode */}
        {openRightSidebarInline &&
          (showMediaRenderMode === "inline" && activeMedia ? (
            <ShowMedia
              type={activeMedia}
              onBack={() => {
                setActiveMedia(null);
                setShowMediaRenderMode(null);
              }}
            />
          ) : (
            <RightSidebar
              onMediaClick={(type) => {
                setShowMediaRenderMode("inline");
                setActiveMedia(type);
              }}
              onCloseRightSidebarInline={() => setOpenRightSidebarInline(false)}
              setOpenDeleteChatPage={setOpenDeleteChatPage}
            />
          ))}
      </section>

      {/* RightSidebar or ShowMedia in overlay mode*/}
      {openRightSidebarOverlay && selectedUser && (
        <>
          {/* Clicking background closes overlay sidebar */}
          <div
            style={overlayBackground}
            onClick={() => {
              setOpenRightSidebarOverlay(false);
              setActiveMedia(null);
              setShowMediaRenderMode(null);
            }}
          />

          {showMediaRenderMode !== "overlay" ? (
            <RightSidebar
              isOverlayMode
              style={rightSidebarOverlay}
              onMediaClick={(type) => {
                setShowMediaRenderMode("overlay");
                setActiveMedia(type);
              }}
              onCloseRightSidebarOverlay={() =>
                setOpenRightSidebarOverlay(false)
              }
              setOpenDeleteChatPage={setOpenDeleteChatPage}
            />
          ) : (
            <ShowMedia
              type={activeMedia}
              isOverlayMode
              style={rightSidebarOverlay}
              onBack={() => {
                setActiveMedia(null);
                setShowMediaRenderMode(null);
              }}
            />
          )}
        </>
      )}

      {/* Delete chat confirmation modal */}
      {openDeleteChatPage && (
        <div
          style={overlayBackgroundDeletePage}
          onClick={() => setOpenDeleteChatPage(false)}
        >
          <DeleteChatPage
            onCloseDeleteChatPage={() => setOpenDeleteChatPage(false)}
            selectedUser={selectedUser}
          />
        </div>
      )}
    </main>
  );
};

export default Home;
