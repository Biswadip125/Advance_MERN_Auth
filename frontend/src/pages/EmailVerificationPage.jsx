import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const { isLoading, verifyEmail, error } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];

    // ** Handle Pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");

      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      // **Focus on the last non empty or the first empty one
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      // ** Focus on the next input if current is filled
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    try {
      const response = await verifyEmail(verificationCode);

      if (response.success) {
        navigate("/");
        toast.success(response.message);
      }
    } catch (err) {
      console.log("Error in login: ", err);
      toast.error(err.response?.data?.message || "Error verifying email");
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);
  return (
    <motion.div
      className="max-w-md  bg-gray-800/50 backdrop-filter rounded-2xl backdrop-blur-xl shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-8">
        <h2 className="text-transparent bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-3xl font-bold mb-6 text-center">
          Verify Your Email
        </h2>

        <p className="text-center text-gray-400 mb-6">
          Enter the 6-digit code sent to your email address
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(eL) => (inputRefs.current[index] = eL)}
                type="text"
                maxLength="6"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 border-2 border-gray-600 text-white rounded-lg focus:border-green-500 focus:outline-none"
              />
            ))}
          </div>
          {error && (
            <p className="font-semibold text-red-500 mt-2 text-center">
              {" "}
              {error}
            </p>
          )}
          <motion.button
            className="bg-gradient-to-r from-green-500 to-emerald-600 w-full px-4 py-3 rounded-lg text-white cursor-pointer font-bold shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Verify Email"
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default EmailVerificationPage;
