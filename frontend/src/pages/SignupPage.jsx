import { motion } from "motion/react";
import Input from "../components/Input";
import { Loader, Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signup(email, password, fullname);
      if (res.success) {
        navigate("/verify-email");
        toast.success(res.message);
      }
    } catch (err) {
      console.log("Error during signup:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Create Account
        </h2>
        <form onSubmit={handleSubmit}>
          <Input
            icon={User}
            type={"text"}
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
          />
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
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

          {/*Password strength meter */}
          <PasswordStrengthMeter password={password} />
          <motion.button
            className="mt-5 bg-gradient-to-r from-green-500 to-emerald-600 w-full px-4 py-3 rounded-lg text-white cursor-pointer font-bold shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <Loader className="mx-auto animate-spin" size={24} />
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>
      </div>

      <div className="px-8 py-4 bg-gray-900/50 text-white flex items-center justify-center">
        <p className="text-sm text-gray-400 ">
          Already have an account?{" "}
          <Link to={"/login"} className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};
export default SignupPage;
