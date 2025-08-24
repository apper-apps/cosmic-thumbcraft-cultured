import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No thumbnails yet", 
  description = "Create your first thumbnail to get started",
  actionText = "Get Started",
  onAction,
  type = "default"
}) => {
  const getIcon = () => {
    switch (type) {
      case "thumbnails":
        return "Image";
      case "presets":
        return "Palette";
      default:
        return "Sparkles";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl glass-effect p-12 text-center"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="w-20 h-20 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <ApperIcon name={getIcon()} className="w-10 h-10 text-primary" />
      </motion.div>
      
      <h3 className="text-2xl font-bold text-white mb-3 gradient-text">
        {title}
      </h3>
      
      <p className="text-white/70 mb-8 max-w-md mx-auto text-lg">
        {description}
      </p>
      
      {onAction && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAction}
          className="px-8 py-4 bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center gap-3 mx-auto text-lg animate-gradient bg-200%"
        >
          <ApperIcon name="Sparkles" className="w-5 h-5" />
          {actionText}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;