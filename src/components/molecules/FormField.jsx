import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  error, 
  children, 
  required = false,
  className 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-error text-sm mt-1 flex items-center gap-1">
          <span className="w-1 h-1 bg-error rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;