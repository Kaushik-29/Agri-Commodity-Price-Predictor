// Map of commodity names to their image URLs
// Using placeholder images from Unsplash for demonstration
export const commodityImages: Record<string, string> = {
  // Use lowercase commodity names as keys for easier matching
  wheat: "https://images.unsplash.com/photo-1535912069815-70f8ec563d71?auto=format&fit=crop&w=500&q=80", // Updated wheat field
  rice: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=500&q=80",
  corn: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=500&q=80",
  tea: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=500&q=80", // Fresh tea leaves on plantation
  bananas: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=500&q=80",
  "dap fertilizer": "https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?auto=format&fit=crop&w=500&q=80", // Updated fertilizer image
  "robusta coffee": "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=500&q=80", // Updated coffee beans image
  sugar: "https://images.unsplash.com/photo-1550082779-d5a0d3a74fca?auto=format&fit=crop&w=500&q=80", // Added sugar image
  // Default image if no match is found
  default: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=500&q=80"
};

/**
 * Gets the image URL for a commodity
 * @param commodityName The name of the commodity
 * @returns The URL of the image for the commodity
 */
export const getCommodityImageUrl = (commodityName: string): string => {
  const normalizedName = commodityName?.toLowerCase().trim() || "";
  return commodityImages[normalizedName] || commodityImages.default;
};

/**
 * Commodity description mapping
 */
export const commodityDescriptions: Record<string, string> = {
  wheat: "Wheat is a cereal grain grown globally as a staple food. Price trends are influenced by seasonal harvests, global demand, and weather conditions.",
  rice: "Rice is a primary food staple for over half the world's population. Prices fluctuate based on seasonal production, export policies, and climate factors.",
  corn: "Corn (maize) is used for food, feed, and industrial products. Market prices respond to livestock demand, ethanol production, and global trade policies.",
  tea: "Tea is one of the most consumed beverages worldwide. Prices are affected by harvest quality, specialty varieties, and consumer preferences.",
  bananas: "Bananas are among the world's most important fruit crops. Prices vary based on global transportation costs, disease outbreaks, and weather patterns.",
  "dap fertilizer": "DAP (Diammonium Phosphate) is a widely used phosphorus fertilizer essential for crop production. Prices are heavily influenced by energy costs, raw material availability, and agricultural demand cycles.",
  "robusta coffee": "Robusta coffee beans are known for their strong flavor and higher caffeine content. Prices fluctuate based on production in Vietnam and Brazil, weather patterns, and changing global consumption trends.",
  sugar: "Sugar is produced globally from sugarcane and sugar beets. Prices are influenced by production volumes, consumption trends, and government policies.",
  default: "Commodity prices are influenced by a variety of factors including supply chain disruptions, seasonal patterns, and changes in global demand."
};

/**
 * Gets the description for a commodity
 * @param commodityName The name of the commodity
 * @returns A description of the commodity
 */
export const getCommodityDescription = (commodityName: string): string => {
  const normalizedName = commodityName?.toLowerCase().trim() || "";
  return commodityDescriptions[normalizedName] || commodityDescriptions.default;
}; 