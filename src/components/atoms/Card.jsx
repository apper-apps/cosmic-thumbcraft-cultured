import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  children,
  hover = false,
  ...props 
}, ref) => {
  const Component = hover ? motion.div : "div";
  const motionProps = hover ? {
    whileHover: { scale: 1.02 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component
      ref={ref}
      className={cn(
        "bg-surface rounded-xl glass-effect p-6 border border-white/10",
        hover && "cursor-pointer hover:border-primary/30",
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.displayName = "Card";

export default Card;