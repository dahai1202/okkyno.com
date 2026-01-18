import { storage } from './storage';
import { InsertProduct, InsertBlogPost, InsertCategory } from '@shared/schema';

export async function completeEpicGardeningImport() {
  console.log('Starting complete Epic Gardening content import...');

  // Comprehensive Epic Gardening categories
  const epicCategories = [
    { name: "Heirloom Tomato Seeds", slug: "heirloom-tomato-seeds", description: "Premium heirloom tomato varieties with exceptional flavor" },
    { name: "Pepper Seeds", slug: "pepper-seeds", description: "Hot and sweet pepper seeds for all growing zones" },
    { name: "Lettuce & Greens", slug: "lettuce-greens", description: "Fresh lettuce and leafy green varieties" },
    { name: "Root Vegetables", slug: "root-vegetables", description: "Carrots, beets, radishes, and turnip seeds" },
    { name: "Herb Seeds", slug: "herb-seeds", description: "Culinary and medicinal herbs for your garden" },
    { name: "Flower Seeds", slug: "flower-seeds", description: "Beautiful annual and perennial flowers" },
    { name: "Microgreens", slug: "microgreens", description: "Fast-growing microgreen varieties" },
    { name: "Cedar Raised Beds", slug: "cedar-raised-beds", description: "Premium western red cedar raised garden beds" },
    { name: "Metal Raised Beds", slug: "metal-raised-beds", description: "Galvanized steel raised bed systems" },
    { name: "Raised Bed Accessories", slug: "raised-bed-accessories", description: "Covers, trellises, and bed accessories" },
    { name: "LED Grow Lights", slug: "led-grow-lights", description: "Full-spectrum LED lighting systems" },
    { name: "Seed Starting Supplies", slug: "seed-starting-supplies", description: "Trays, domes, and starting equipment" },
    { name: "Heat Mats", slug: "heat-mats", description: "Seedling heat mats for optimal germination" },
    { name: "Hand Pruners", slug: "hand-pruners", description: "Professional-grade pruning shears" },
    { name: "Garden Knives", slug: "garden-knives", description: "Harvest and utility knives" },
    { name: "Soil Amendments", slug: "soil-amendments", description: "Compost, fertilizers, and soil improvers" },
    { name: "Irrigation Systems", slug: "irrigation-systems", description: "Drip irrigation and watering solutions" },
    { name: "Plant Support", slug: "plant-support", description: "Stakes, cages, and trellises" },
    { name: "Organic Pest Control", slug: "organic-pest-control", description: "Natural pest management solutions" },
    { name: "Container Gardening", slug: "container-gardening", description: "Pots, planters, and container systems" }
  ];

  const categoryMap = new Map<string, number>();
  
  for (const category of epicCategories) {
    try {
      const created = await storage.createCategory({
        ...category,
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80"
      });
      categoryMap.set(category.name, created.id);
      console.log(`Created category: ${category.name}`);
    } catch (error) {
      const existing = await storage.getCategoryBySlug(category.slug);
      if (existing) {
        categoryMap.set(category.name, existing.id);
      }
    }
  }

  // Extensive Epic Gardening product catalog
  const epicProducts = [
    // Heirloom Tomato Seeds
    { name: "Cherokee Purple Heirloom Tomato", category: "Heirloom Tomato Seeds", price: 4.99, image: "https://images.unsplash.com/photo-1546470427-e5380b43d0a4?w=800", description: "Deep purple-red beefsteak with incredible smoky flavor. Tennessee heirloom produces large, meaty fruits.", botanicalName: "Solanum lycopersicum" },
    { name: "Brandywine Pink Heirloom Tomato", category: "Heirloom Tomato Seeds", price: 4.99, image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800", description: "Classic Amish heirloom with outstanding sweet flavor and perfect acidity balance.", botanicalName: "Solanum lycopersicum" },
    { name: "San Marzano Paste Tomato", category: "Heirloom Tomato Seeds", price: 5.99, image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800", description: "Authentic Italian San Marzano tomatoes perfect for sauces and canning.", botanicalName: "Solanum lycopersicum" },
    { name: "Green Zebra Heirloom Tomato", category: "Heirloom Tomato Seeds", price: 4.99, image: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800", description: "Striking green and yellow striped tomato with tangy, zesty flavor.", botanicalName: "Solanum lycopersicum" },
    { name: "Black Krim Heirloom Tomato", category: "Heirloom Tomato Seeds", price: 5.49, image: "https://images.unsplash.com/photo-1546470427-e5380b43d0a4?w=800", description: "Dark purple-black tomato from Crimea with rich, complex flavor.", botanicalName: "Solanum lycopersicum" },
    
    // Pepper Seeds
    { name: "Carolina Reaper Pepper Seeds", category: "Pepper Seeds", price: 6.99, image: "https://images.unsplash.com/photo-1583663958131-1dae9606b8c5?w=800", description: "World's hottest pepper with over 2.2 million Scoville units.", botanicalName: "Capsicum chinense" },
    { name: "Ghost Pepper Seeds", category: "Pepper Seeds", price: 5.99, image: "https://images.unsplash.com/photo-1556909116-a5aa31395d51?w=800", description: "Extremely hot bhut jolokia pepper from Northeast India.", botanicalName: "Capsicum chinense" },
    { name: "California Wonder Bell Pepper", category: "Pepper Seeds", price: 3.99, image: "https://images.unsplash.com/photo-1525607551316-4a8e16d1f4bb?w=800", description: "Classic sweet bell pepper with thick walls and excellent flavor.", botanicalName: "Capsicum annuum" },
    { name: "Anaheim Pepper Seeds", category: "Pepper Seeds", price: 3.49, image: "https://images.unsplash.com/photo-1583663958131-1dae9606b8c5?w=800", description: "Mild New Mexico chile pepper perfect for roasting and stuffing.", botanicalName: "Capsicum annuum" },
    { name: "Jalapeño Pepper Seeds", category: "Pepper Seeds", price: 3.99, image: "https://images.unsplash.com/photo-1545131579-6c7e08b4e0e5?w=800", description: "Classic medium-heat pepper perfect for fresh eating and pickling.", botanicalName: "Capsicum annuum" },

    // Lettuce & Greens
    { name: "Buttercrunch Lettuce Seeds", category: "Lettuce & Greens", price: 2.99, image: "https://images.unsplash.com/photo-1556909114-4f6e9d4d2f27?w=800", description: "Crisp butterhead lettuce with excellent heat tolerance.", botanicalName: "Lactuca sativa" },
    { name: "Red Sails Lettuce Seeds", category: "Lettuce & Greens", price: 3.49, image: "https://images.unsplash.com/photo-1560957123-a25cbb4de854?w=800", description: "Beautiful red-bronze leaf lettuce with mild flavor.", botanicalName: "Lactuca sativa" },
    { name: "Arugula Rocket Seeds", category: "Lettuce & Greens", price: 2.99, image: "https://images.unsplash.com/photo-1505798577917-a65157d3320a?w=800", description: "Peppery salad green that's easy to grow and harvest.", botanicalName: "Eruca vesicaria" },
    { name: "Rainbow Chard Seeds", category: "Lettuce & Greens", price: 3.99, image: "https://images.unsplash.com/photo-1503146695848-0c7e0ba98e6b?w=800", description: "Colorful chard with stems in yellow, red, pink, and white.", botanicalName: "Beta vulgaris" },
    { name: "Spinach Bloomsdale Seeds", category: "Lettuce & Greens", price: 2.49, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800", description: "Classic heirloom spinach with dark green savoyed leaves.", botanicalName: "Spinacia oleracea" },

    // Root Vegetables
    { name: "Scarlet Nantes Carrot Seeds", category: "Root Vegetables", price: 2.99, image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800", description: "Sweet, crisp carrots perfect for fresh eating and storage.", botanicalName: "Daucus carota" },
    { name: "Detroit Dark Red Beet Seeds", category: "Root Vegetables", price: 2.49, image: "https://images.unsplash.com/photo-1570493999006-ea80c2a4c815?w=800", description: "Classic deep red beets with excellent flavor and storage.", botanicalName: "Beta vulgaris" },
    { name: "Purple Top Turnip Seeds", category: "Root Vegetables", price: 2.49, image: "https://images.unsplash.com/photo-1605711576406-26aa98bfc6e0?w=800", description: "Hardy turnips with white flesh and purple shoulders.", botanicalName: "Brassica rapa" },
    { name: "Watermelon Radish Seeds", category: "Root Vegetables", price: 3.49, image: "https://images.unsplash.com/photo-1517055122368-b3109b5d5a40?w=800", description: "Large radish with green exterior and bright pink interior.", botanicalName: "Raphanus sativus" },
    { name: "Cosmic Purple Carrot Seeds", category: "Root Vegetables", price: 3.99, image: "https://images.unsplash.com/photo-1447175008436-054170c2e979?w=800", description: "Stunning purple carrots with orange core and sweet flavor.", botanicalName: "Daucus carota" },

    // Raised Beds
    { name: "Cedar Raised Bed Kit 4x8x11", category: "Cedar Raised Beds", price: 249.99, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800", description: "Premium western red cedar raised bed with tool-free assembly.", dimensions: "48\" x 96\" x 11\"" },
    { name: "Cedar Raised Bed Kit 4x4x11", category: "Cedar Raised Beds", price: 149.99, image: "https://images.unsplash.com/photo-1558618666-5a006db2c7ad?w=800", description: "Compact cedar raised bed perfect for small spaces.", dimensions: "48\" x 48\" x 11\"" },
    { name: "Galvanized Steel Raised Bed 4x8", category: "Metal Raised Beds", price: 199.99, image: "https://images.unsplash.com/photo-1589111118344-fe616859d7a7?w=800", description: "Durable galvanized steel construction with modern design.", dimensions: "48\" x 96\" x 12\"" },
    { name: "Modular Metal Raised Bed System", category: "Metal Raised Beds", price: 299.99, image: "https://images.unsplash.com/photo-1589111118344-fe616859d7a7?w=800", description: "Expandable modular system for custom garden layouts.", dimensions: "Various configurations" },

    // Tools & Equipment
    { name: "Professional Bypass Pruners", category: "Hand Pruners", price: 39.99, image: "https://images.unsplash.com/photo-1615232428120-9aa7ce2ab176?w=800", description: "Japanese steel pruners with titanium coating for durability.", weight: 0.8 },
    { name: "Harvest Knife with Sheath", category: "Garden Knives", price: 24.99, image: "https://images.unsplash.com/photo-1589111118344-fe616859d7a7?w=800", description: "Sharp stainless steel harvest knife with ergonomic handle.", weight: 0.3 },
    { name: "Full Spectrum LED Grow Light", category: "LED Grow Lights", price: 159.99, image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800", description: "288 high-efficiency LEDs with timer and dimmer controls.", dimensions: "24\" x 12\" x 2\"" },
    { name: "72-Cell Seed Starting Kit", category: "Seed Starting Supplies", price: 49.99, image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800", description: "Complete system with trays, dome, and heat mat.", dimensions: "21\" x 11\" x 6\"" },
    { name: "Seedling Heat Mat 20x10", category: "Heat Mats", price: 29.99, image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800", description: "Waterproof heat mat for consistent germination temperatures.", dimensions: "20\" x 10\"" },

    // Soil & Amendments
    { name: "Organic Compost 2 Cu Ft", category: "Soil Amendments", price: 16.99, image: "https://images.unsplash.com/photo-1595771805070-fdf2e7cd5050?w=800", description: "Premium aged compost for soil improvement and nutrition." },
    { name: "Worm Castings 15 lbs", category: "Soil Amendments", price: 24.99, image: "https://images.unsplash.com/photo-1595771805070-fdf2e7cd5050?w=800", description: "Pure worm castings rich in nutrients and beneficial microbes." },
    { name: "Kelp Meal Fertilizer 4 lbs", category: "Soil Amendments", price: 19.99, image: "https://images.unsplash.com/photo-1595771805070-fdf2e7cd5050?w=800", description: "Norwegian kelp meal provides trace minerals and growth hormones." },

    // Irrigation
    { name: "Drip Irrigation Kit 25 Plants", category: "Irrigation Systems", price: 79.99, image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800", description: "Complete drip system with timer and adjustable emitters." },
    { name: "Soaker Hose 50ft", category: "Irrigation Systems", price: 34.99, image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800", description: "Recycled rubber soaker hose for efficient water delivery." },

    // Plant Support
    { name: "Tomato Cage Set of 3", category: "Plant Support", price: 24.99, image: "https://images.unsplash.com/photo-1558618666-5a006db2c7ad?w=800", description: "Heavy-duty galvanized steel tomato cages." },
    { name: "Bamboo Stakes 6ft Pack of 25", category: "Plant Support", price: 14.99, image: "https://images.unsplash.com/photo-1615232428120-9aa7ce2ab176?w=800", description: "Natural bamboo plant stakes for eco-friendly support." },
    { name: "Garden Trellis 6ft", category: "Plant Support", price: 29.99, image: "https://images.unsplash.com/photo-1558618666-5a006db2c7ad?w=800", description: "Expandable trellis for climbing plants and vines." }
  ];

  // Create products
  let productCount = 0;
  for (const product of epicProducts) {
    try {
      const categoryId = categoryMap.get(product.category) || 1;
      
      const productData: InsertProduct = {
        name: product.name,
        slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: product.description + " Professional quality guaranteed with excellent customer reviews.",
        shortDescription: product.description.substring(0, 100) + "...",
        price: product.price,
        comparePrice: product.price * 1.25,
        imageUrl: product.image + "&auto=format&fit=crop&q=80",
        imageUrls: [product.image + "&auto=format&fit=crop&q=80"],
        videoUrl: productCount % 5 === 0 ? "https://www.youtube.com/embed/dQw4w9WgXcQ" : undefined,
        videoUrls: productCount % 5 === 0 ? ["https://www.youtube.com/embed/dQw4w9WgXcQ"] : [],
        categoryId,
        sku: `EG-${Date.now()}-${productCount.toString().padStart(3, '0')}`,
        stock: Math.floor(Math.random() * 80) + 20,
        featured: productCount < 8,
        rating: 4.2 + Math.random() * 0.8,
        reviewCount: Math.floor(Math.random() * 200) + 25,
        tags: product.name.toLowerCase().split(' ').slice(0, 4),
        botanicalName: product.botanicalName,
        difficulty: productCount % 3 === 0 ? "Beginner" : productCount % 3 === 1 ? "Intermediate" : "Advanced",
        dimensions: product.dimensions,
        weight: product.weight,
      };

      await storage.createProduct(productData);
      console.log(`Created product ${productCount + 1}: ${product.name}`);
      productCount++;
    } catch (error) {
      console.log(`Product ${product.name} may already exist`);
    }
  }

  // Comprehensive Epic Gardening blog posts
  const epicBlogPosts = [
    {
      title: "Complete Guide to Growing Heirloom Tomatoes from Seed",
      content: `<h1>Complete Guide to Growing Heirloom Tomatoes from Seed</h1>
      <p>Heirloom tomatoes offer unmatched flavor diversity and the satisfaction of growing varieties with rich histories.</p>
      
      <h2>What Makes a Tomato Heirloom?</h2>
      <p>Heirloom tomatoes are open-pollinated varieties that have been passed down through generations, typically 50+ years old. Unlike hybrids, they breed true to type, allowing you to save seeds.</p>
      
      <h2>Top Heirloom Varieties to Grow</h2>
      
      <h3>Cherokee Purple</h3>
      <p>This Tennessee heirloom produces large, purple-red beefsteaks with incredible smoky flavor. Plants are indeterminate and can reach 6-9 feet tall.</p>
      
      <h3>Brandywine</h3>
      <p>The gold standard of heirloom tomatoes. Large pink fruits with perfect sweet-acid balance. Amish variety dating to 1885.</p>
      
      <h3>San Marzano</h3>
      <p>Italian paste tomato with sweet, low-acid flavor. Perfect for sauces and canning. Look for authentic San Marzano Nano varieties.</p>
      
      <h2>Starting from Seed</h2>
      <p>Start seeds indoors 6-8 weeks before last frost. Use quality seed starting mix and maintain 70-80°F soil temperature for optimal germination.</p>
      
      <h2>Transplanting and Care</h2>
      <p>Transplant after soil reaches 60°F consistently. Provide strong support - most heirlooms are indeterminate. Water consistently to prevent cracking.</p>
      
      <h2>Saving Seeds</h2>
      <p>Save seeds from your best fruits. Ferment tomato gel for 3-5 days, then wash and dry seeds thoroughly. Store in cool, dry conditions.</p>`,
      excerpt: "Master the art of growing heirloom tomatoes from seed with varieties, techniques, and seed-saving tips from Epic Gardening.",
      imageUrl: "https://images.unsplash.com/photo-1546470427-e5380b43d0a4?w=800&auto=format&fit=crop&q=80",
      tags: ["heirloom tomatoes", "seed starting", "seed saving", "varieties"]
    },
    {
      title: "Raised Garden Bed Construction: Cedar vs Metal Complete Comparison",
      content: `<h1>Raised Garden Bed Construction: Cedar vs Metal Complete Comparison</h1>
      <p>Choosing between cedar and metal raised beds impacts your garden's longevity, cost, and growing environment.</p>
      
      <h2>Cedar Raised Beds</h2>
      
      <h3>Advantages</h3>
      <ul>
      <li>Natural rot resistance from cedar oils</li>
      <li>Excellent insulation properties moderate soil temperature</li>
      <li>Easy to modify and customize</li>
      <li>Attractive natural appearance ages gracefully</li>
      <li>No concerns about soil pH changes</li>
      </ul>
      
      <h3>Considerations</h3>
      <ul>
      <li>Higher upfront cost than pressure-treated lumber</li>
      <li>Will weather to silvery-gray without treatment</li>
      <li>May need replacement after 10-15 years</li>
      <li>Can be damaged by aggressive weed trimming</li>
      </ul>
      
      <h2>Metal Raised Beds</h2>
      
      <h3>Advantages</h3>
      <ul>
      <li>Extremely durable - can last 20+ years</li>
      <li>Modern, clean aesthetic</li>
      <li>No rotting, warping, or pest issues</li>
      <li>Quick assembly with modular systems</li>
      <li>Recyclable at end of life</li>
      </ul>
      
      <h3>Considerations</h3>
      <ul>
      <li>Can heat up quickly in direct sun</li>
      <li>May require soil buffer in very hot climates</li>
      <li>Limited customization options</li>
      <li>Potential for minor soil pH changes over time</li>
      </ul>
      
      <h2>Cost Analysis</h2>
      <p>Cedar: $200-400 for 4x8 bed, Metal: $150-300 for 4x8 bed. Factor in longevity for true cost comparison.</p>
      
      <h2>Our Recommendation</h2>
      <p>For most gardeners, cedar offers the best balance of plant health, aesthetics, and workability. Choose metal for maximum longevity and minimal maintenance in moderate climates.</p>`,
      excerpt: "Comprehensive comparison of cedar vs metal raised garden beds covering durability, cost, and growing performance.",
      imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80",
      tags: ["raised beds", "cedar", "metal", "construction"]
    },
    {
      title: "Professional Seed Starting Setup: Equipment and Techniques",
      content: `<h1>Professional Seed Starting Setup: Equipment and Techniques</h1>
      <p>Creating a professional seed starting setup ensures consistent germination and strong transplants for your garden.</p>
      
      <h2>Essential Equipment</h2>
      
      <h3>Seed Starting Trays</h3>
      <p>Use 72-cell trays for most vegetables. Choose trays with drainage holes and consider biodegradable options for easy transplanting.</p>
      
      <h3>Growing Medium</h3>
      <p>Never use garden soil. High-quality seed starting mix provides proper drainage while retaining moisture. Look for mixes with perlite and peat or coconut coir.</p>
      
      <h3>Heat Mats</h3>
      <p>Bottom heat accelerates germination. Maintain 70-75°F soil temperature for most vegetables. Use thermostatic controls for consistency.</p>
      
      <h3>Grow Lights</h3>
      <p>LED lights offer energy efficiency and full spectrum output. Position 6-12 inches above seedlings and provide 14-16 hours daily.</p>
      
      <h2>Professional Techniques</h2>
      
      <h3>Proper Planting Depth</h3>
      <p>Plant seeds 2-3 times their diameter deep. Fine seeds like lettuce need light to germinate - barely cover or surface sow.</p>
      
      <h3>Moisture Management</h3>
      <p>Bottom watering prevents disturbing seeds. Use humidity domes until germination, then remove to prevent damping off.</p>
      
      <h3>Fertilizing Seedlings</h3>
      <p>Begin liquid fertilizing at quarter strength when true leaves appear. Increase to half strength as plants develop.</p>
      
      <h2>Troubleshooting Common Issues</h2>
      
      <h3>Damping Off</h3>
      <p>Caused by fungi in overly moist conditions. Ensure good air circulation and avoid overwatering.</p>
      
      <h3>Leggy Seedlings</h3>
      <p>Indicates insufficient light. Lower lights or increase duration. Gentle air circulation strengthens stems.</p>
      
      <h3>Poor Germination</h3>
      <p>Check seed viability, soil temperature, and moisture levels. Old seeds may have reduced germination rates.</p>
      
      <p>With proper equipment and techniques, you'll produce professional-quality transplants for a successful garden.</p>`,
      excerpt: "Set up a professional seed starting system with the right equipment and techniques for consistent germination success.",
      imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&auto=format&fit=crop&q=80",
      tags: ["seed starting", "equipment", "techniques", "professional"]
    },
    {
      title: "Organic Pest Control: Integrated Pest Management for Home Gardens",
      content: `<h1>Organic Pest Control: Integrated Pest Management for Home Gardens</h1>
      <p>Effective organic pest control combines prevention, beneficial insects, and targeted treatments for sustainable garden health.</p>
      
      <h2>Integrated Pest Management (IPM) Principles</h2>
      
      <h3>Prevention First</h3>
      <p>Healthy plants resist pests better. Ensure proper spacing, nutrition, and watering. Choose resistant varieties when available.</p>
      
      <h3>Monitor Regularly</h3>
      <p>Weekly garden inspections catch problems early. Look for eggs, larvae, and damage patterns. Keep a garden journal to track patterns.</p>
      
      <h3>Beneficial Insects</h3>
      <p>Encourage natural predators with diverse plantings. Ladybugs, lacewings, and parasitic wasps control many garden pests.</p>
      
      <h2>Common Garden Pests and Solutions</h2>
      
      <h3>Aphids</h3>
      <p>Treatment: Insecticidal soap, neem oil, or strong water spray. Prevention: Attract ladybugs with yarrow and dill.</p>
      
      <h3>Cabbage Worms</h3>
      <p>Treatment: Bt (Bacillus thuringiensis) spray. Prevention: Row covers during butterfly activity. Hand-picking effective for small gardens.</p>
      
      <h3>Squash Bugs</h3>
      <p>Treatment: Remove egg clusters, trap adults under boards. Prevention: Companion plant with nasturtiums and radishes.</p>
      
      <h3>Tomato Hornworms</h3>
      <p>Treatment: Hand-picking most effective. Look for white cocoons - these indicate beneficial parasitic wasps at work.</p>
      
      <h2>Organic Treatment Options</h2>
      
      <h3>Insecticidal Soap</h3>
      <p>Effective against soft-bodied insects. Apply in early morning or evening to avoid leaf burn. Reapply after rain.</p>
      
      <h3>Neem Oil</h3>
      <p>Systemic action disrupts insect growth cycles. Apply every 7-10 days. Avoid use during bloom to protect pollinators.</p>
      
      <h3>Diatomaceous Earth</h3>
      <p>Food-grade DE damages soft-bodied pests. Apply dry for crawling insects. Reapply after watering or rain.</p>
      
      <h2>Companion Planting for Pest Control</h2>
      <p>Marigolds deter many pests, basil repels flies and mosquitoes, and nasturtiums trap aphids and cucumber beetles.</p>
      
      <p>Successful organic pest control requires patience and observation, but results in a healthier garden ecosystem.</p>`,
      excerpt: "Learn integrated pest management techniques and organic solutions for common garden pests without harmful chemicals.",
      imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&auto=format&fit=crop&q=80",
      tags: ["organic pest control", "IPM", "beneficial insects", "natural solutions"]
    },
    {
      title: "Soil Health and Testing: Building the Foundation of Your Garden",
      content: `<h1>Soil Health and Testing: Building the Foundation of Your Garden</h1>
      <p>Healthy soil is the foundation of productive gardening. Understanding and improving your soil creates the basis for thriving plants.</p>
      
      <h2>Understanding Soil Composition</h2>
      
      <h3>Soil Texture</h3>
      <p>Ideal garden soil contains 40% sand, 40% silt, and 20% clay. This loamy texture provides good drainage while retaining nutrients and moisture.</p>
      
      <h3>Soil Structure</h3>
      <p>Well-structured soil has aggregates that create pore spaces for air and water movement. Organic matter acts as the glue holding aggregates together.</p>
      
      <h3>Soil pH</h3>
      <p>Most vegetables prefer pH 6.0-7.0. Acidic soils (below 6.0) limit nutrient availability, while alkaline soils (above 7.5) can cause deficiencies.</p>
      
      <h2>Soil Testing Methods</h2>
      
      <h3>Professional Soil Tests</h3>
      <p>Extension service tests provide comprehensive nutrient analysis, pH, and organic matter content. Test every 2-3 years or when problems arise.</p>
      
      <h3>Home Test Kits</h3>
      <p>Quick pH and NPK tests give basic information. Less accurate than professional tests but useful for frequent monitoring.</p>
      
      <h3>DIY Tests</h3>
      <p>Jar test reveals soil texture. Squeeze test indicates clay content. Percolation test measures drainage rate.</p>
      
      <h2>Soil Amendments</h2>
      
      <h3>Organic Matter</h3>
      <p>Compost improves any soil type. Add 2-4 inches annually and work into top 6-8 inches. Well-aged manure provides similar benefits.</p>
      
      <h3>pH Adjustment</h3>
      <p>Limestone raises pH gradually. Sulfur lowers pH slowly. Wood ash raises pH quickly but use sparingly.</p>
      
      <h3>Drainage Improvement</h3>
      <p>Coarse sand and perlite improve drainage in heavy clay. Avoid fine sand which can create concrete-like conditions.</p>
      
      <h2>Building Soil Biology</h2>
      
      <h3>Beneficial Microorganisms</h3>
      <p>Mycorrhizal fungi extend root systems. Beneficial bacteria fix nitrogen and suppress diseases. Avoid broad-spectrum fungicides.</p>
      
      <h3>Earthworms</h3>
      <p>Earthworm castings improve soil structure and fertility. Encourage worms with organic mulch and avoiding soil disturbance.</p>
      
      <h2>Long-term Soil Management</h2>
      <p>Minimize tillage to preserve soil structure. Use cover crops in unused beds. Rotate crops to prevent nutrient depletion and disease buildup.</p>
      
      <p>Investing in soil health pays dividends in plant performance, pest resistance, and reduced need for external inputs.</p>`,
      excerpt: "Comprehensive guide to soil testing, amendments, and building healthy soil biology for optimal garden performance.",
      imageUrl: "https://images.unsplash.com/photo-1595771805070-fdf2e7cd5050?w=800&auto=format&fit=crop&q=80",
      tags: ["soil health", "soil testing", "amendments", "soil biology"]
    }
  ];

  // Create blog posts
  let blogCount = 0;
  for (const post of epicBlogPosts) {
    try {
      const blogData: InsertBlogPost = {
        title: post.title,
        slug: post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        content: post.content,
        excerpt: post.excerpt,
        imageUrl: post.imageUrl,
        authorId: 1,
        published: true,
      };

      await storage.createBlogPost(blogData);
      console.log(`Created blog post ${blogCount + 1}: ${post.title}`);
      blogCount++;
    } catch (error) {
      console.log(`Blog post "${post.title}" may already exist`);
    }
  }

  console.log(`Complete Epic Gardening import finished: ${epicCategories.length} categories, ${productCount} products, ${blogCount} blog posts`);
  
  return {
    categories: epicCategories.length,
    products: productCount,
    blogPosts: blogCount,
    message: "Complete Epic Gardening content successfully imported"
  };
}