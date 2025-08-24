import { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";

const ThumbnailForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    style: "",
    colorScheme: "",
    format: "png"
  });

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
    setFormData(prev => ({ ...prev, [field]: value }));
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
      format: "png"
    });
    setErrors({});
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