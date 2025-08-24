import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  className, 
  children,
  error,
  placeholder = "Select an option",
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <select
        className={cn(
          "w-full px-4 py-3 bg-surface text-white rounded-lg border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 appearance-none cursor-pointer",
          error && "border-error focus:border-error focus:ring-error/20",
          className
        )}
        ref={ref}
        {...props}
      >
        <option value="" disabled className="text-white/50">
          {placeholder}
        </option>
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ApperIcon name="ChevronDown" className="w-5 h-5 text-white/50" />
      </div>
    </div>
  );
});

Select.displayName = "Select";

export default Select;