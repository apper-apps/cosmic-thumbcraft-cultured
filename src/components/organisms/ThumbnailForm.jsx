import { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import { ApperIcon } from "@/components/ApperIcon";
const ThumbnailForm = ({ onSubmit, loading = false }) => {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    style: "",
    colorScheme: "",
    format: "png",
    textEffects: {
      gradient: {
        enabled: false,
        colors: ["#ffffff", "#e5e5e5"],
        direction: "to-br"
      },
      shadow: {
        enabled: true,
        blur: 4,
        offsetX: 2,
        offsetY: 2,
        color: "#000000",
        opacity: 0.7
      },
      outline: {
        enabled: false,
        width: 2,
        color: "#ffffff",
        style: "solid"
      }
    }
  });

  const [showTextEffects, setShowTextEffects] = useState(false);

  const [errors, setErrors] = useState({});

  const colorSchemes = [
    { value: "vibrant", label: "Vibrant Colors" },
    { value: "professional", label: "Professional" },
    { value: "monochrome", label: "Monochrome" },
    { value: "corporate", label: "Corporate" },
    { value: "rainbow", label: "Rainbow" },
    { value: "pastel", label: "Pastel" }
  ];

  const styles = [
    { value: "minimalist", label: "Minimalist" },
    { value: "vibrant", label: "Vibrant" },
    { value: "professional", label: "Professional" },
    { value: "gaming", label: "Gaming" },
    { value: "tech", label: "Tech" },
    { value: "corporate", label: "Corporate" }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.style) {
      newErrors.style = "Please select a style";
    }

    if (!formData.colorScheme) {
      newErrors.colorScheme = "Please select a color scheme";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child, subchild] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: subchild ? {
            ...prev[parent][child],
            [subchild]: value
          } : value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleClear = () => {
setFormData({
      title: "",
      description: "",
      style: "",
      colorScheme: "",
      format: "png",
      textEffects: {
        gradient: {
          enabled: false,
          colors: ["#ffffff", "#e5e5e5"],
          direction: "to-br"
        },
        shadow: {
          enabled: true,
          blur: 4,
          offsetX: 2,
          offsetY: 2,
          color: "#000000",
          opacity: 0.7
        },
        outline: {
          enabled: false,
          width: 2,
          color: "#ffffff",
          style: "solid"
        }
      }
    });
    setErrors({});
    setShowTextEffects(false);
  };

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Create Thumbnail</h2>
        <p className="text-white/70">
          Describe your thumbnail and we'll generate it using AI
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Title"
          required
          error={errors.title}
        >
          <Input
            placeholder="Enter your thumbnail title..."
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            error={errors.title}
            maxLength={60}
          />
          <p className="text-xs text-white/50 mt-1">
            {formData.title.length}/60 characters
          </p>
        </FormField>

        <FormField
          label="Description (Optional)"
          error={errors.description}
        >
          <Textarea
            placeholder="Brief description of your content..."
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            error={errors.description}
            rows={3}
            maxLength={150}
          />
          <p className="text-xs text-white/50 mt-1">
            {formData.description.length}/150 characters
          </p>
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Style"
            required
            error={errors.style}
          >
            <Select
              value={formData.style}
              onChange={(e) => handleInputChange("style", e.target.value)}
              error={errors.style}
              placeholder="Choose a style"
            >
              {styles.map(style => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Color Scheme"
            required
            error={errors.colorScheme}
          >
            <Select
              value={formData.colorScheme}
              onChange={(e) => handleInputChange("colorScheme", e.target.value)}
              error={errors.colorScheme}
              placeholder="Choose colors"
            >
              {colorSchemes.map(scheme => (
                <option key={scheme.value} value={scheme.value}>
                  {scheme.label}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
<FormField label="Output Format">
          <Select
            value={formData.format}
            onChange={(e) => handleInputChange("format", e.target.value)}
          >
            <option value="png">PNG (Transparent Background)</option>
            <option value="jpeg">JPEG (Smaller File Size)</option>
          </Select>
        </FormField>

        {/* Text Effects Panel */}
        <div className="border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={() => setShowTextEffects(!showTextEffects)}
            className="flex items-center justify-between w-full text-left mb-4 text-white hover:text-white/80 transition-colors"
          >
            <div>
              <h3 className="text-lg font-semibold">Text Effects</h3>
              <p className="text-sm text-white/60">Customize gradients, shadows, and outlines</p>
            </div>
            <ApperIcon 
              name={showTextEffects ? "ChevronUp" : "ChevronDown"} 
              size={20} 
            />
          </button>

          {showTextEffects && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              {/* Gradient Controls */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-white">Text Gradient</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.textEffects.gradient.enabled}
                      onChange={(e) => handleInputChange("textEffects.gradient.enabled", e.target.checked)}
                      className="w-4 h-4 rounded border-white/30 bg-white/10 checked:bg-primary"
                    />
                    <span className="text-sm text-white/70">Enable</span>
                  </label>
                </div>
                
                {formData.textEffects.gradient.enabled && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Start Color">
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={formData.textEffects.gradient.colors[0]}
                            onChange={(e) => {
                              const newColors = [...formData.textEffects.gradient.colors];
                              newColors[0] = e.target.value;
                              handleInputChange("textEffects.gradient.colors", newColors);
                            }}
                            className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                          />
                          <Input
                            value={formData.textEffects.gradient.colors[0]}
                            onChange={(e) => {
                              const newColors = [...formData.textEffects.gradient.colors];
                              newColors[0] = e.target.value;
                              handleInputChange("textEffects.gradient.colors", newColors);
                            }}
                            className="flex-1 text-sm"
                          />
                        </div>
                      </FormField>
                      
                      <FormField label="End Color">
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={formData.textEffects.gradient.colors[1]}
                            onChange={(e) => {
                              const newColors = [...formData.textEffects.gradient.colors];
                              newColors[1] = e.target.value;
                              handleInputChange("textEffects.gradient.colors", newColors);
                            }}
                            className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                          />
                          <Input
                            value={formData.textEffects.gradient.colors[1]}
                            onChange={(e) => {
                              const newColors = [...formData.textEffects.gradient.colors];
                              newColors[1] = e.target.value;
                              handleInputChange("textEffects.gradient.colors", newColors);
                            }}
                            className="flex-1 text-sm"
                          />
                        </div>
                      </FormField>
                    </div>
                    
                    <FormField label="Direction">
                      <Select
                        value={formData.textEffects.gradient.direction}
                        onChange={(e) => handleInputChange("textEffects.gradient.direction", e.target.value)}
                      >
                        <option value="to-r">Left to Right</option>
                        <option value="to-l">Right to Left</option>
                        <option value="to-b">Top to Bottom</option>
                        <option value="to-t">Bottom to Top</option>
                        <option value="to-br">Top-Left to Bottom-Right</option>
                        <option value="to-bl">Top-Right to Bottom-Left</option>
                        <option value="to-tr">Bottom-Left to Top-Right</option>
                        <option value="to-tl">Bottom-Right to Top-Left</option>
                      </Select>
                    </FormField>
                  </div>
                )}
              </div>

              {/* Shadow Controls */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-white">Text Shadow</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.textEffects.shadow.enabled}
                      onChange={(e) => handleInputChange("textEffects.shadow.enabled", e.target.checked)}
                      className="w-4 h-4 rounded border-white/30 bg-white/10 checked:bg-primary"
                    />
                    <span className="text-sm text-white/70">Enable</span>
                  </label>
                </div>
                
                {formData.textEffects.shadow.enabled && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label={`Blur: ${formData.textEffects.shadow.blur}px`}>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={formData.textEffects.shadow.blur}
                          onChange={(e) => handleInputChange("textEffects.shadow.blur", parseInt(e.target.value))}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </FormField>
                      
                      <FormField label={`Opacity: ${Math.round(formData.textEffects.shadow.opacity * 100)}%`}>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={formData.textEffects.shadow.opacity}
                          onChange={(e) => handleInputChange("textEffects.shadow.opacity", parseFloat(e.target.value))}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </FormField>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label={`Offset X: ${formData.textEffects.shadow.offsetX}px`}>
                        <input
                          type="range"
                          min="-10"
                          max="10"
                          value={formData.textEffects.shadow.offsetX}
                          onChange={(e) => handleInputChange("textEffects.shadow.offsetX", parseInt(e.target.value))}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </FormField>
                      
                      <FormField label={`Offset Y: ${formData.textEffects.shadow.offsetY}px`}>
                        <input
                          type="range"
                          min="-10"
                          max="10"
                          value={formData.textEffects.shadow.offsetY}
                          onChange={(e) => handleInputChange("textEffects.shadow.offsetY", parseInt(e.target.value))}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </FormField>
                    </div>
                    
                    <FormField label="Shadow Color">
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.textEffects.shadow.color}
                          onChange={(e) => handleInputChange("textEffects.shadow.color", e.target.value)}
                          className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                        />
                        <Input
                          value={formData.textEffects.shadow.color}
                          onChange={(e) => handleInputChange("textEffects.shadow.color", e.target.value)}
                          className="flex-1 text-sm"
                        />
                      </div>
                    </FormField>
                  </div>
                )}
              </div>

              {/* Outline Controls */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-white">Text Outline</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.textEffects.outline.enabled}
                      onChange={(e) => handleInputChange("textEffects.outline.enabled", e.target.checked)}
                      className="w-4 h-4 rounded border-white/30 bg-white/10 checked:bg-primary"
                    />
                    <span className="text-sm text-white/70">Enable</span>
                  </label>
                </div>
                
                {formData.textEffects.outline.enabled && (
                  <div className="space-y-4">
                    <FormField label={`Width: ${formData.textEffects.outline.width}px`}>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        value={formData.textEffects.outline.width}
                        onChange={(e) => handleInputChange("textEffects.outline.width", parseInt(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </FormField>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Outline Color">
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={formData.textEffects.outline.color}
                            onChange={(e) => handleInputChange("textEffects.outline.color", e.target.value)}
                            className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                          />
                          <Input
                            value={formData.textEffects.outline.color}
                            onChange={(e) => handleInputChange("textEffects.outline.color", e.target.value)}
                            className="flex-1 text-sm"
                          />
                        </div>
                      </FormField>
                      
                      <FormField label="Style">
                        <Select
                          value={formData.textEffects.outline.style}
                          onChange={(e) => handleInputChange("textEffects.outline.style", e.target.value)}
                        >
                          <option value="solid">Solid</option>
                          <option value="dashed">Dashed</option>
                          <option value="dotted">Dotted</option>
                        </Select>
                      </FormField>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon="Sparkles"
            className="flex-1"
          >
            Generate Thumbnail
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            onClick={handleClear}
            icon="RotateCcw"
            disabled={loading}
          >
            Clear
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ThumbnailForm;