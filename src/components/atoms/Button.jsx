import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  loading = false,
  icon,
  children,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary via-secondary to-accent text-white hover:shadow-lg hover:shadow-primary/25 animate-gradient bg-200%",
    secondary: "bg-surface text-white border border-white/20 hover:border-primary/50 glass-effect",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-white hover:bg-white/10",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:shadow-lg hover:shadow-error/25"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        loading && "cursor-wait",
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
          />
          Loading...
        </>
      ) : (
        <>
          {icon && <ApperIcon name={icon} className="w-4 h-4 mr-2" />}
          {children}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;