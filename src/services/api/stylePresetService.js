import stylePresetData from "@/services/mockData/stylePresets.json";

const SIMULATED_DELAY = 200;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const stylePresetService = {
  async getAll() {
    await delay(SIMULATED_DELAY);
    return [...stylePresetData];
  },

  async getById(id) {
    await delay(SIMULATED_DELAY);
    const preset = stylePresetData.find(item => item.Id === parseInt(id));
    if (!preset) {
      throw new Error(`Style preset with id ${id} not found`);
    }
    return { ...preset };
  },

  async create(presetData) {
    await delay(SIMULATED_DELAY);
    const newPreset = {
      Id: Math.max(...stylePresetData.map(p => p.Id)) + 1,
      ...presetData
    };
    
    stylePresetData.push(newPreset);
    return { ...newPreset };
  },

  async update(id, updatedData) {
    await delay(SIMULATED_DELAY);
    const index = stylePresetData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Style preset with id ${id} not found`);
    }
    
    stylePresetData[index] = {
      ...stylePresetData[index],
      ...updatedData,
      Id: parseInt(id)
    };
    
    return { ...stylePresetData[index] };
  },

  async delete(id) {
    await delay(SIMULATED_DELAY);
    const index = stylePresetData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Style preset with id ${id} not found`);
    }
    
    const deleted = stylePresetData.splice(index, 1)[0];
    return { ...deleted };
  }
};