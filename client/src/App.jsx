import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { ContactProvider } from "./context/ContactContext";

const App = () => {
  const { authUser, loading } = useContext(AuthContext);

  if (loading)
    return (
      <div className="bg-[#111827] text-white w-full min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <ContactProvider>
                <ChatProvider>
                  <Home />
                </ChatProvider>
              </ContactProvider>
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default App;
