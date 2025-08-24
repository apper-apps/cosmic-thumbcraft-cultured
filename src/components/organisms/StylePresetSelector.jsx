import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { stylePresetService } from "@/services/api/stylePresetService";
import StylePresetCard from "@/components/molecules/StylePresetCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const StylePresetSelector = ({ selectedPreset, onPresetSelect }) => {
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPresets = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await stylePresetService.getAll();
      setPresets(data);
    } catch (err) {
      setError(err.message || "Failed to load style presets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPresets();
  }, []);

  if (loading) {
    return <Loading type="presets" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadPresets} />;
  }

  if (presets.length === 0) {
    return (
      <Empty 
        title="No Style Presets Available"
        description="Style presets help you quickly apply professional designs"
        type="presets"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Quick Style Presets</h3>
        <p className="text-white/70 text-sm">
          Choose a preset to quickly apply professional styling to your thumbnail
        </p>
      </div>
      
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {presets.map((preset, index) => (
          <motion.div
            key={preset.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StylePresetCard
              preset={preset}
              selected={selectedPreset?.Id === preset.Id}
              onSelect={onPresetSelect}
            />
          </motion.div>
        ))}
      </motion.div>
      
      {selectedPreset && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-surface/50 rounded-lg p-4 border border-primary/20"
        >
          <h4 className="font-medium text-white mb-2">
            Selected: {selectedPreset.name}
          </h4>
          <div className="text-sm text-white/70 space-y-1">
            <p>Font: {selectedPreset.settings.font}</p>
            <p>Spacing: {selectedPreset.settings.spacing}</p>
            {selectedPreset.settings.effects?.length > 0 && (
              <p>Effects: {selectedPreset.settings.effects.join(", ")}</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StylePresetSelector;