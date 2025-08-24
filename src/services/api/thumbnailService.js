import thumbnailData from "@/services/mockData/thumbnails.json";

// Freepik API configuration
const FREEPIK_API_URL = 'https://api.freepik.com/v1/ai/mystic';
const FREEPIK_API_KEY = import.meta.env.VITE_FREEPIK_API_KEY;

const SIMULATED_DELAY = 300;
const LIVE_MODE_DELAY = 100;

// Initialize Apper SDK for Flux API
// Freepik API integration
const callFreepikAPI = async (prompt, dimensions, liveMode = false) => {
  if (!FREEPIK_API_KEY) {
    throw new Error('Freepik API key not configured');
  }

  // Map dimensions to Freepik aspect ratios
  const getAspectRatio = (width, height) => {
    const ratio = width / height;
    if (Math.abs(ratio - 1) < 0.1) return 'square_1_1';
    if (Math.abs(ratio - (16/9)) < 0.1) return 'landscape_16_9';
    if (Math.abs(ratio - (4/3)) < 0.1) return 'landscape_4_3';
    if (Math.abs(ratio - (9/16)) < 0.1) return 'portrait_9_16';
    if (Math.abs(ratio - (3/4)) < 0.1) return 'portrait_3_4';
    return 'landscape_16_9'; // default
  };

  const aspectRatio = getAspectRatio(dimensions.width, dimensions.height);
  const resolution = Math.max(dimensions.width, dimensions.height) >= 1920 ? '2k' : '1k';

  const requestBody = {
    prompt: prompt,
    aspect_ratio: aspectRatio,
    resolution: resolution,
    model: 'realism',
    creative_detailing: 33,
    engine: 'automatic',
    fixed_generation: false,
    filter_nsfw: true,
    hdr: 50
  };

  try {
    const response = await fetch(FREEPIK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-freepik-api-key': FREEPIK_API_KEY
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Freepik API error: ${response.status} ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Handle different response formats
    if (data.imageUrl) {
      return data.imageUrl;
    } else if (data.image_url) {
      return data.image_url;
    } else if (data.url) {
      return data.url;
    } else if (data.data && data.data.length > 0) {
      return data.data[0].url || data.data[0].image_url;
    } else {
      throw new Error('No image URL found in Freepik API response');
    }
  } catch (error) {
    console.error('Freepik API call failed:', error);
    throw error;
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
      let imageUrl;
      let isAIGenerated = false;
      
      // Try Freepik API first if API key is available
      if (FREEPIK_API_KEY) {
        // Create comprehensive prompt for Freepik API
        const stylePrompts = {
          minimalist: "clean, simple, modern design with plenty of white space, minimalist aesthetic",
          vibrant: "bright, energetic colors with bold typography and dynamic elements, vibrant and eye-catching",
          professional: "corporate, clean, sophisticated design with professional fonts, business-like appearance",
          gaming: "futuristic, neon colors, gaming aesthetic with bold graphics, digital art style",
          tech: "modern tech design with gradients, geometric shapes, and tech elements, futuristic look",
          corporate: "business professional, clean lines, corporate colors, executive presentation style"
        };

        const colorPrompts = {
          vibrant: "bright, saturated, vivid colors with high contrast",
          professional: "muted, professional color palette with subtle tones",
          monochrome: "black and white with subtle grays, monochromatic scheme",
          corporate: "corporate blue, gray, and white colors, business color scheme",
          rainbow: "rainbow gradient colors with spectrum effects",
          pastel: "soft pastel colors with gentle, light tones"
        };

        const prompt = `Create a stunning ${formData.imageSize.replace('-', ' ')} thumbnail design for "${formData.title}". ${formData.description ? `Content: ${formData.description}.` : ''} Visual style: ${stylePrompts[formData.style] || formData.style}. Color palette: ${colorPrompts[formData.colorScheme] || formData.colorScheme}. High quality, professional design, eye-catching composition, perfect for social media.`;

        try {
          imageUrl = await callFreepikAPI(prompt, dimensions, formData.liveMode);
          isAIGenerated = true;
        } catch (apiError) {
          console.warn("Freepik API failed, falling back to mock generation:", apiError);
          await delay(delayTime);
          imageUrl = generateMockImageUrl(formData.title, formData.style, formData.colorScheme, dimensions);
        }
      } else {
        // Fallback to mock generation
        console.warn("No Freepik API key configured, using mock generation");
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