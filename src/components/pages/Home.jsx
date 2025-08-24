import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { thumbnailService } from "@/services/api/thumbnailService";
import ThumbnailForm from "@/components/organisms/ThumbnailForm";
import ThumbnailPreview from "@/components/molecules/ThumbnailPreview";
import StylePresetSelector from "@/components/organisms/StylePresetSelector";

const Home = () => {
const [currentThumbnail, setCurrentThumbnail] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [liveMode, setLiveMode] = useState(true);
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });
const autoGenerate = async (formData) => {
    if (!liveMode || !formData.title.trim()) return;
    
    try {
      setError("");
      let finalFormData = { 
        ...formData, 
        textPosition,
        liveMode: true 
      };
      
      if (selectedPreset) {
        finalFormData = {
          ...finalFormData,
          style: selectedPreset.name.toLowerCase(),
          presetSettings: selectedPreset.settings
        };
      }
      
      const thumbnail = await thumbnailService.generateThumbnail(finalFormData);
      setCurrentThumbnail(thumbnail);
    } catch (err) {
      setError(err.message || "Auto-generation failed");
    }
  };

  const handleGenerateThumbnail = async (formData) => {
    try {
      setLoading(true);
      setError("");
      
      // Apply preset settings if selected
      let finalFormData = { 
        ...formData, 
        textPosition,
        liveMode: false 
      };
      if (selectedPreset) {
        finalFormData = {
          ...finalFormData,
          style: selectedPreset.name.toLowerCase(),
          presetSettings: selectedPreset.settings
        };
      }
      
      const thumbnail = await thumbnailService.generateThumbnail(finalFormData);
      setCurrentThumbnail(thumbnail);
      toast.success("Thumbnail generated successfully!");
    } catch (err) {
      setError(err.message || "Failed to generate thumbnail");
      toast.error("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTextPositionChange = (newPosition) => {
    setTextPosition(newPosition);
    if (liveMode && currentThumbnail) {
      // Trigger auto-generation with new position
      const formData = {
        title: currentThumbnail.title,
        description: currentThumbnail.description,
        style: currentThumbnail.style,
        colorScheme: currentThumbnail.colorScheme,
        format: currentThumbnail.format,
        imageSize: currentThumbnail.imageSize,
        textEffects: currentThumbnail.textEffects
      };
      autoGenerate(formData);
    }
  };

  const handleDownload = async (format) => {
    if (!currentThumbnail) return;
    
    try {
      const downloadData = await thumbnailService.downloadThumbnail(currentThumbnail.Id, format);
      
      // Create download link
      const link = document.createElement("a");
      link.href = downloadData.downloadUrl;
      link.download = downloadData.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Downloaded as ${format.toUpperCase()}`);
    } catch (err) {
      toast.error("Download failed. Please try again.");
    }
  };

  const handleRetry = () => {
    setError("");
    setCurrentThumbnail(null);
  };

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
    toast.info(`Applied ${preset.name} style preset`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Create Stunning Thumbnails
          </h1>
          <p className="text-xl text-white/80 mb-2">
            Transform your ideas into eye-catching thumbnails with AI
          </p>
          <p className="text-white/60">
            Professional thumbnail generator for content creators, marketers, and designers
          </p>
        </motion.div>

        {/* Style Presets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <StylePresetSelector
            selectedPreset={selectedPreset}
            onPresetSelect={handlePresetSelect}
          />
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
<ThumbnailForm
              onSubmit={handleGenerateThumbnail}
              onAutoGenerate={autoGenerate}
              loading={loading}
              liveMode={liveMode}
              onLiveModeChange={setLiveMode}
            />
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
<ThumbnailPreview
              thumbnail={currentThumbnail}
              loading={loading}
              error={error}
              onDownload={handleDownload}
              onRetry={handleRetry}
              textEffects={currentThumbnail?.textEffects}
              textPosition={textPosition}
              onTextPositionChange={handleTextPositionChange}
              showPositioning={true}
            />
          </motion.div>
        </div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="text-center p-6 bg-surface/30 rounded-xl glass-effect">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-2">AI-Powered</h3>
            <p className="text-white/70 text-sm">Advanced AI generates unique thumbnails based on your description</p>
          </div>

          <div className="text-center p-6 bg-surface/30 rounded-xl glass-effect">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-2">Multiple Formats</h3>
            <p className="text-white/70 text-sm">Download in PNG or JPEG formats optimized for different platforms</p>
          </div>

          <div className="text-center p-6 bg-surface/30 rounded-xl glass-effect">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-2">Instant Results</h3>
            <p className="text-white/70 text-sm">Generate professional thumbnails in seconds, not hours</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;