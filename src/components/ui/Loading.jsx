import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "thumbnail") {
    return (
      <div className="w-full h-[280px] bg-surface rounded-xl glass-effect overflow-hidden">
        <motion.div 
          className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 animate-pulse"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))",
              "linear-gradient(45deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2), rgba(99, 102, 241, 0.2))",
              "linear-gradient(45deg, rgba(236, 72, 153, 0.2), rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-4"
            />
            <p className="text-white/80 font-medium">Generating thumbnail...</p>
            <p className="text-white/60 text-sm mt-1">This may take a few moments</p>
          </div>
        </div>
      </div>
    );
  }

  if (type === "presets") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            className="h-20 bg-surface rounded-lg glass-effect animate-pulse"
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.1
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full"
      />
      <span className="ml-3 text-white/80">Loading...</span>
    </div>
  );
};

export default Loading;