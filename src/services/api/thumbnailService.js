import thumbnailData from "@/services/mockData/thumbnails.json";

const SIMULATED_DELAY = 300;
const LIVE_MODE_DELAY = 100;

// Initialize Apper SDK for Flux API
let apperSDK = null;
const initializeApperSDK = async () => {
  if (apperSDK) return apperSDK;
  
  try {
    if (typeof window !== 'undefined' && window.Apper) {
      apperSDK = new window.Apper({
        projectId: import.meta.env.VITE_APPER_PROJECT_ID,
        publicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      return apperSDK;
    }
    throw new Error('Apper SDK not loaded');
  } catch (error) {
    console.warn('Failed to initialize Apper SDK, falling back to mock generation:', error);
    return null;
  }
};

// Fallback mock image generation
const generateMockImageUrl = (title, style, colorScheme, dimensions = { width: 800, height: 450 }) => {
  const seed = title.toLowerCase().replace(/\s+/g, '-');
  return `https://picsum.photos/${dimensions.width}/${dimensions.height}?random=${seed}-${style}-${colorScheme}`;
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const thumbnailService = {
  async getAll() {
    await delay(SIMULATED_DELAY);
    return [...thumbnailData];
  },

  async getById(id) {
    await delay(SIMULATED_DELAY);
    const thumbnail = thumbnailData.find(item => item.Id === parseInt(id));
    if (!thumbnail) {
      throw new Error(`Thumbnail with id ${id} not found`);
    }
    return { ...thumbnail };
  },

async generateThumbnail(formData) {
    // Use shorter delay for live mode
    const delayTime = formData.liveMode ? LIVE_MODE_DELAY : 2000;
    
    // Get dimensions based on selected image size
    const imageSizeMap = {
      "youtube-thumbnail": { width: 1280, height: 720 },
      "instagram-post": { width: 1080, height: 1080 },
      "instagram-story": { width: 1080, height: 1920 },
      "facebook-post": { width: 1200, height: 630 },
      "facebook-cover": { width: 1640, height: 859 },
      "twitter-post": { width: 1024, height: 512 },
      "linkedin-post": { width: 1200, height: 627 },
      "blog-header": { width: 1200, height: 600 }
    };

    const dimensions = imageSizeMap[formData.imageSize] || { width: 800, height: 450 };
    
    try {
      // Initialize Apper SDK
      const sdk = await initializeApperSDK();
      
      let imageUrl;
      let isAIGenerated = false;
      
      if (sdk) {
        // Create comprehensive prompt for Flux API
        const stylePrompts = {
          minimalist: "clean, simple, modern design with plenty of white space",
          vibrant: "bright, energetic colors with bold typography and dynamic elements",
          professional: "corporate, clean, sophisticated design with professional fonts",
          gaming: "futuristic, neon colors, gaming aesthetic with bold graphics",
          tech: "modern tech design with gradients, geometric shapes, and tech elements",
          corporate: "business professional, clean lines, corporate colors"
        };

        const colorPrompts = {
          vibrant: "bright, saturated colors",
          professional: "muted, professional color palette",
          monochrome: "black and white with subtle grays",
          corporate: "corporate blue, gray, and white colors",
          rainbow: "rainbow gradient colors",
          pastel: "soft pastel colors"
        };

        const prompt = `Create a ${formData.imageSize.replace('-', ' ')} thumbnail image for "${formData.title}". ${formData.description ? `Description: ${formData.description}.` : ''} Style: ${stylePrompts[formData.style] || formData.style}. Colors: ${colorPrompts[formData.colorScheme] || formData.colorScheme}. High quality, professional design, ${dimensions.width}x${dimensions.height} resolution.`;

        try {
          // Call Flux API through Apper SDK
          const response = await sdk.ai.generateImage({
            prompt,
            width: dimensions.width,
            height: dimensions.height,
            model: "flux-dev",
            steps: formData.liveMode ? 20 : 30,
            guidance_scale: 7.5
          });

          if (response && response.imageUrl) {
            imageUrl = response.imageUrl;
            isAIGenerated = true;
          } else {
            throw new Error("No image URL returned from API");
          }
        } catch (apiError) {
          console.warn("Flux API failed, falling back to mock generation:", apiError);
          imageUrl = generateMockImageUrl(formData.title, formData.style, formData.colorScheme, dimensions);
        }
      } else {
        // Fallback to mock generation
        await delay(delayTime);
        imageUrl = generateMockImageUrl(formData.title, formData.style, formData.colorScheme, dimensions);
      }

      const newThumbnail = {
        Id: Math.max(...thumbnailData.map(t => t.Id)) + 1,
        title: formData.title,
        description: formData.description,
        style: formData.style,
        colorScheme: formData.colorScheme,
        imageUrl,
        format: formData.format || "png",
        imageSize: formData.imageSize,
        textEffects: formData.textEffects || {},
        textPosition: formData.textPosition || { x: 50, y: 50 },
        liveGenerated: formData.liveMode || false,
        isAIGenerated,
        createdAt: new Date().toISOString(),
        dimensions
      };

      // Only add to persistent data if not live mode
      if (!formData.liveMode) {
        thumbnailData.unshift(newThumbnail);
      }
      
      return { ...newThumbnail };
    } catch (error) {
      console.error("Thumbnail generation failed:", error);
      throw new Error("AI image generation service is temporarily unavailable. Please try again.");
    }
  },

  async updateThumbnail(id, updatedData) {
    await delay(SIMULATED_DELAY);
    const index = thumbnailData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Thumbnail with id ${id} not found`);
    }
    
    thumbnailData[index] = {
      ...thumbnailData[index],
      ...updatedData,
      Id: parseInt(id)
    };
    
    return { ...thumbnailData[index] };
  },

  async deleteThumbnail(id) {
    await delay(SIMULATED_DELAY);
    const index = thumbnailData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Thumbnail with id ${id} not found`);
    }
    
    const deleted = thumbnailData.splice(index, 1)[0];
    return { ...deleted };
  },

async downloadThumbnail(thumbnailId, format = "png") {
    await delay(SIMULATED_DELAY);
    const thumbnail = thumbnailData.find(item => item.Id === parseInt(thumbnailId));
    if (!thumbnail) {
      throw new Error(`Thumbnail with id ${thumbnailId} not found`);
    }
    
    try {
      // For AI-generated images, we need to fetch and convert
      if (thumbnail.isAIGenerated && thumbnail.imageUrl) {
        const response = await fetch(thumbnail.imageUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        
        return {
          downloadUrl: objectUrl,
          filename: `${thumbnail.title.replace(/\s+/g, '-').toLowerCase()}.${format}`,
          format: format,
          isBlob: true
        };
      }
      
      // Fallback for mock images
      return {
        downloadUrl: thumbnail.imageUrl,
        filename: `${thumbnail.title.replace(/\s+/g, '-').toLowerCase()}.${format}`,
        format: format,
        isBlob: false
      };
    } catch (error) {
      console.error("Download preparation failed:", error);
      // Fallback to direct URL
      return {
        downloadUrl: thumbnail.imageUrl,
        filename: `${thumbnail.title.replace(/\s+/g, '-').toLowerCase()}.${format}`,
        format: format,
        isBlob: false
      };
    }
  }
};