import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ 
  className, 
  rows = 4,
  error,
  ...props 
}, ref) => {
  return (
    <textarea
      rows={rows}
      className={cn(
        "w-full px-4 py-3 bg-surface text-white rounded-lg border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 placeholder:text-white/50 resize-vertical",
        error && "border-error focus:border-error focus:ring-error/20",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;