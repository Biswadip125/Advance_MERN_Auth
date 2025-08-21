import { delay, motion } from "motion/react";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import toast from "react-hot-toast";
const Homepage = () => {
  const { user, logout } = useAuthStore();
  const handleLogout = async () => {
    const res = await logout();

    if (res.success) {
      toast.success(res.message);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto mt-10 p-8 bg-gray-900/80 backdrop-filter backdrop-blur-lg rounded-xl shadowl-2xl border border-gray-800"
    >
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text">
        Dashboard
      </h2>
      <div className="space-y-6">
        <motion.div
          className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-green-500 mb-3">
            Profile Information
          </h3>
          <p className="text-gray-300">
            <span className="font-bold">Name: </span>
            {user.fullname}
          </p>
          <p className="text-gray-300">
            <span className="font-bold">Email: </span>
            {user.email}
          </p>
        </motion.div>
        <motion.div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-green-500 mb-3">
            Account Activity
          </h3>
          <p className="text-gray-300">
            <span className="font-bold">Joined: </span>{" "}
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-gray-300">
            <span className="font-bold">Last Login: </span>
            {user.lastLogin
              ? formatDate(user.lastLogin)
              : "You just signed in!"}
          </p>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        onClick={handleLogout}
        className="mt-4"
      >
        <motion.button className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 cursor-pointer">
          Logout
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Homepage;
