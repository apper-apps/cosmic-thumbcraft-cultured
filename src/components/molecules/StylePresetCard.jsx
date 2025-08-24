import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StylePresetCard = ({ 
  preset, 
  selected = false, 
  onSelect,
  className 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn("relative cursor-pointer", className)}
      onClick={() => onSelect(preset)}
    >
      <Card
        className={cn(
          "p-4 transition-all duration-200",
          selected && "ring-2 ring-primary border-primary/50"
        )}
      >
        <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
          <img
            src={preset.preview}
            alt={preset.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMUUyOTNCIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjYwIiByPSIyMCIgZmlsbD0iIzYzNjZGMSIvPgo8L3N2Zz4K";
            }}
          />
        </div>
        
        <h3 className="font-semibold text-white text-center">
          {preset.name}
        </h3>
        
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
          >
            <ApperIcon name="Check" className="w-4 h-4 text-white" />
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default StylePresetCard;