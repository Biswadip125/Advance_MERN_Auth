import { motion } from "motion/react";
import { useState } from "react";
import Input from "../components/Input";
import { Loader, Lock } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isLoading, resetPassword, error, message } = useAuthStore();

  const { token } = useParams();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Both Passwords should match");
      return;
    }
    try {
      await resetPassword(token, password);
      toast.success(
        "Password Reset Successfully, redirecting to login page...."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.log("Error during resetting password: ", err);
    }
  };
  return (
    <motion.div
      className="max-w-md w-full  bg-gray-800/50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-center text-transparent bg-clip-text mb-6">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit}>
          <Input
            icon={Lock}
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <motion.button
            className="bg-gradient-to-r from-green-500 to-emerald-600 w-full px-4 py-3 rounded-lg text-white cursor-pointer font-bold shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Set New Password"
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default ResetPasswordPage;
