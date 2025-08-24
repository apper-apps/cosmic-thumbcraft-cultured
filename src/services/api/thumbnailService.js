import thumbnailData from "@/services/mockData/thumbnails.json";

const SIMULATED_DELAY = 300;

// Mock API response for image generation
const generateMockImageUrl = (title, style, colorScheme) => {
  const seed = title.toLowerCase().replace(/\s+/g, '-');
  return `https://picsum.photos/800/450?random=${seed}-${style}-${colorScheme}`;
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

  async generateThumbnail(thumbnailData) {
    await delay(2000); // Longer delay to simulate AI generation
    
    // Simulate occasional API failures
    if (Math.random() < 0.1) {
      throw new Error("AI image generation service is temporarily unavailable. Please try again.");
    }

    const newThumbnail = {
      Id: Math.max(...thumbnailData.map(t => t.Id)) + 1,
      title: thumbnailData.title,
      description: thumbnailData.description,
      style: thumbnailData.style,
      colorScheme: thumbnailData.colorScheme,
      imageUrl: generateMockImageUrl(thumbnailData.title, thumbnailData.style, thumbnailData.colorScheme),
      format: thumbnailData.format || "png",
      createdAt: new Date().toISOString(),
      dimensions: {
        width: 800,
        height: 450
      }
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