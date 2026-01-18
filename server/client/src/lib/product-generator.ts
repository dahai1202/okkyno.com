import { sampleFeaturedProducts, productImages } from "./data";
import type { Product } from "@shared/schema";

export interface ExtendedProduct extends Product {
  salePrice?: number | null;
  inStock?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  isOrganic?: boolean;
}

// Generate more products (in a real app these would come from the backend)
export const generateProducts = (): ExtendedProduct[] => {
  const allProducts: ExtendedProduct[] = [...sampleFeaturedProducts];

  // Names for different product types
  const toolNames = [
    "Premium Garden Shears", "Ergonomic Pruning Scissors", "Durable Garden Trowel",
    "Extendable Rake", "Comfortable Garden Gloves", "Automatic Watering Can",
    "Professional Hedge Trimmer", "Multi-Purpose Garden Knife", "Garden Hose Nozzle",
    "Stainless Steel Weeder"
  ];

  const plantNames = [
    "Peace Lily", "Spider Plant", "Snake Plant", "Pothos",
    "Monstera Deliciosa", "Fiddle Leaf Fig", "Rubber Plant", "Aloe Vera",
    "ZZ Plant", "Bird of Paradise", "Boston Fern", "Chinese Money Plant"
  ];

  const seedNames = [
    "Organic Tomato Seeds", "Heirloom Carrot Seeds", "Premium Lettuce Mix",
    "Organic Pepper Seeds", "Basil Seed Collection", "Sunflower Seeds",
    "Zucchini Seeds", "Cucumber Seeds", "Kale Seeds", "Herb Garden Mix"
  ];

  const planterNames = [
    "Self-Watering Planter", "Ceramic Pot with Drainage", "Hanging Basket",
    "Terracotta Pot Set", "Modern Rectangular Planter", "Wooden Raised Bed",
    "Vertical Garden Planter", "Decorative Stone Pot", "Window Box Planter",
    "Plant Stand with Pots"
  ];

  // Generate 50 tools
  for (let i = 5; i <= 50; i++) {
    const name = toolNames[Math.floor(Math.random() * toolNames.length)];
    const price = parseFloat((5 + Math.random() * 45).toFixed(2));
    const hasSale = Math.random() > 0.7;
    const salePrice = hasSale ? parseFloat((price * 0.8).toFixed(2)) : null;

    allProducts.push({
      id: i,
      name: `${name} ${i}`,
      slug: `garden-tool-${i}`,
      description: "High-quality gardening tool for your garden needs.",
      price,
      salePrice,
      imageUrl: productImages.gardenTools[Math.floor(Math.random() * productImages.gardenTools.length)],
      categoryId: 1,
      inStock: Math.random() > 0.1,
      isFeatured: Math.random() > 0.8,
      isNew: Math.random() > 0.8,
      isBestseller: Math.random() > 0.8,
      isOrganic: false,
      rating: parseFloat((3 + Math.random() * 2).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 100),
      createdAt: new Date()
    });
  }

  // Generate 50 plants
  for (let i = 51; i <= 100; i++) {
    const name = plantNames[Math.floor(Math.random() * plantNames.length)];
    const price = parseFloat((10 + Math.random() * 40).toFixed(2));
    const hasSale = Math.random() > 0.7;
    const salePrice = hasSale ? parseFloat((price * 0.8).toFixed(2)) : null;

    allProducts.push({
      id: i,
      name: `${name} ${i}`,
      slug: `plant-${i}`,
      description: "Beautiful indoor plant to enhance your living space.",
      price,
      salePrice,
      imageUrl: productImages.gardenPlants[Math.floor(Math.random() * productImages.gardenPlants.length)],
      categoryId: 2,
      inStock: Math.random() > 0.1,
      isFeatured: Math.random() > 0.8,
      isNew: Math.random() > 0.8,
      isBestseller: Math.random() > 0.8,
      isOrganic: Math.random() > 0.5,
      rating: parseFloat((3 + Math.random() * 2).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 100),
      createdAt: new Date()
    });
  }

  // Generate 50 seeds
  for (let i = 101; i <= 150; i++) {
    const name = seedNames[Math.floor(Math.random() * seedNames.length)];
    const price = parseFloat((3 + Math.random() * 12).toFixed(2));
    const hasSale = Math.random() > 0.7;
    const salePrice = hasSale ? parseFloat((price * 0.8).toFixed(2)) : null;

    allProducts.push({
      id: i,
      name: `${name} ${i}`,
      slug: `seed-${i}`,
      description: "High-quality seeds for a bountiful harvest.",
      price,
      salePrice,
      imageUrl: productImages.vegetableGardens[Math.floor(Math.random() * productImages.vegetableGardens.length)],
      categoryId: 3,
      inStock: Math.random() > 0.1,
      isFeatured: Math.random() > 0.8,
      isNew: Math.random() > 0.8,
      isBestseller: Math.random() > 0.8,
      isOrganic: Math.random() > 0.3,
      rating: parseFloat((3 + Math.random() * 2).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 100),
      createdAt: new Date()
    });
  }

  // Generate 50 planters
  for (let i = 151; i <= 200; i++) {
    const name = planterNames[Math.floor(Math.random() * planterNames.length)];
    const price = parseFloat((8 + Math.random() * 32).toFixed(2));
    const hasSale = Math.random() > 0.7;
    const salePrice = hasSale ? parseFloat((price * 0.8).toFixed(2)) : null;

    allProducts.push({
      id: i,
      name: `${name} ${i}`,
      slug: `planter-${i}`,
      description: "Stylish and practical planters for your indoor and outdoor plants.",
      price,
      salePrice,
      imageUrl: productImages.gardenAccessories[Math.floor(Math.random() * productImages.gardenAccessories.length)],
      categoryId: 4,
      inStock: Math.random() > 0.1,
      isFeatured: Math.random() > 0.8,
      isNew: Math.random() > 0.8,
      isBestseller: Math.random() > 0.8,
      isOrganic: false,
      rating: parseFloat((3 + Math.random() * 2).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 100),
      createdAt: new Date()
    });
  }

  return allProducts;
};

export default generateProducts;
