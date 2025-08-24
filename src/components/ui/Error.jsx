import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, type = "default" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl glass-effect p-8 text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        {type === "generation" ? "Generation Failed" : "Oops!"}
      </h3>
      
      <p className="text-white/70 mb-6 max-w-md mx-auto">
        {message}
      </p>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetry}
          className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 flex items-center gap-2 mx-auto"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;