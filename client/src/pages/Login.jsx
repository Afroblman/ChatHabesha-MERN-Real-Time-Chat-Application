import { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { loginRegister } = useContext(AuthContext);

  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const result =
      currState === "Sign up"
        ? await loginRegister("signup", { fullName, email, password, bio })
        : await loginRegister("login", { email, password });

    if (result) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1f2937] to-[#020617] px-4">
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <h1 className="text-4xl font-bold">ChatHabesha</h1>

        {/* Form Card */}
        <form
          onSubmit={onSubmitHandler}
          className="w-full bg-[#111827] text-white sm:p-8 rounded-xl shadow-2xl flex flex-col gap-5 border border-gray-800"
        >
          <h2 className="text-2xl font-semibold text-center tracking-wide">
            {currState}
          </h2>

          {currState === "Sign up" && (
            <input
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              placeholder="Full Name"
              value={fullName}
              required
              className="p-3 rounded-md bg-[#020617] border border-gray-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition"
            />
          )}

          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email Address"
            value={email}
            required
            className="p-3 rounded-md bg-[#020617] border border-gray-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition"
          />

          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            value={password}
            required
            className="p-3 rounded-md bg-[#020617] border border-gray-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition"
          />

          {currState === "Sign up" && (
            <textarea
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              rows={2}
              placeholder="Provide a short bio..."
              required
              className="p-3 rounded-md bg-[#020617] border border-gray-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition"
            />
          )}

          <button
            type="submit"
            className="py-3 rounded-md bg-violet-600 hover:bg-violet-700 transition font-medium cursor-pointer"
          >
            {currState === "Sign up" ? "Create Account" : "Login"}
          </button>

          {currState === "Sign up" ? (
            <div className="flex flex-col gap-3 text-sm text-gray-300">
              <p>
                Already have an account?{" "}
                <span
                  className="text-violet-500 cursor-pointer hover:underline"
                  onClick={() => setCurrState("Login")}
                >
                  Login here
                </span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-300 text-center">
              Don’t have an account?{" "}
              <span
                className="text-violet-500 cursor-pointer hover:underline"
                onClick={() => setCurrState("Sign up")}
              >
                Click here
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
