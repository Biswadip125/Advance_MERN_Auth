import { motion } from "motion/react";
import Input from "../components/Input";
import { Loader, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);

      if (res.success) {
        navigate("/");
        toast.success(res.message);
      }
    } catch (err) {
      console.log("Error during login:", err);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800/50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="font-bold text-3xl text-center bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-6">
          Welcome Back{" "}
        </h2>
        <form onSubmit={handleLogin}>
          <Input
            icon={Mail}
            type={"email"}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            type={"password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/*Error Message */}
          {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}

          <div className="flex items-center mb-6">
            <Link
              to={"/forgot-password"}
              className="text-sm text-green-400 hover:underline"
            >
              Forgot Passowrd?
            </Link>
          </div>
          <motion.button
            className="bg-gradient-to-r from-green-500 to-emerald-600 w-full px-4 py-3 rounded-lg text-white cursor-pointer font-bold shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              " Login"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900/50 text-white flex items-center justify-center">
        <Link to={"/signup"} className="text-gray-400 text-sm">
          Don't have any account?{" "}
          <span className="text-green-400 hover:underline text-sm">Signup</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default LoginPage;
