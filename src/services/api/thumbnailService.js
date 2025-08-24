import thumbnailData from "@/services/mockData/thumbnails.json";

const SIMULATED_DELAY = 300;

// Mock API response for image generation
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
    await delay(2000); // Longer delay to simulate AI generation
    
    // Simulate occasional API failures
    if (Math.random() < 0.1) {
      throw new Error("AI image generation service is temporarily unavailable. Please try again.");
    }

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

    const newThumbnail = {
      Id: Math.max(...thumbnailData.map(t => t.Id)) + 1,
      title: formData.title,
      description: formData.description,
      style: formData.style,
      colorScheme: formData.colorScheme,
      imageUrl: generateMockImageUrl(formData.title, formData.style, formData.colorScheme, dimensions),
      format: formData.format || "png",
      imageSize: formData.imageSize,
      textEffects: formData.textEffects,
      createdAt: new Date().toISOString(),
      dimensions
    };

    // Add to mock data
    thumbnailData.unshift(newThumbnail);
    
    return { ...newThumbnail };
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
    
    // In a real implementation, this would handle the actual file download
    return {
      downloadUrl: thumbnail.imageUrl,
      filename: `${thumbnail.title.replace(/\s+/g, '-').toLowerCase()}.${format}`,
      format: format
    };
  }
};