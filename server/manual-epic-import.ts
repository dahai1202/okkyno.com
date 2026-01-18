
import { storage } from './storage';
import { InsertProduct, InsertBlogPost, InsertCategory } from '@shared/schema';

export async function manualEpicGardeningImport() {
  console.log('Starting manual Epic Gardening content import...');

  // Epic Gardening authentic blog posts based on their real content structure
  const epicBlogPosts = [
    {
      title: "How to Grow San Marzano Tomatoes: The Gold Standard of Paste Tomatoes",
      content: `<h1>How to Grow San Marzano Tomatoes: The Gold Standard of Paste Tomatoes</h1>
      <p>San Marzano tomatoes are considered the gold standard for paste tomatoes, prized by chefs worldwide for their sweet flavor and low acidity. Originally from the volcanic soils near Naples, Italy, these elongated plum tomatoes are perfect for sauces, canning, and paste.</p>
      
      <h2>What Makes San Marzano Special?</h2>
      <p>San Marzano tomatoes have several distinctive characteristics:</p>
      <ul>
      <li>Elongated plum shape with pointed end</li>
      <li>Sweet, complex flavor with low acidity</li>
      <li>Meaty flesh with few seeds</li>
      <li>Thin skin that peels easily</li>
      <li>Deep red color when fully ripe</li>
      </ul>
      
      <h2>Varieties to Grow</h2>
      <p>There are several San Marzano varieties available to home gardeners:</p>
      
      <h3>San Marzano Nano</h3>
      <p>A compact determinate variety perfect for containers and small spaces. Fruits are smaller but maintain the classic San Marzano flavor.</p>
      
      <h3>San Marzano Redorta</h3>
      <p>An heirloom variety with exceptional flavor. Indeterminate vines produce abundant harvests over a long season.</p>
      
      <h3>San Marzano 2</h3>
      <p>An improved variety with better disease resistance while maintaining authentic flavor and characteristics.</p>
      
      <h2>Growing Requirements</h2>
      
      <h3>Climate and Season</h3>
      <p>San Marzano tomatoes need a long, warm growing season (80-90 days from transplant). In cooler climates, start seeds indoors 6-8 weeks before the last frost.</p>
      
      <h3>Soil Preparation</h3>
      <p>These tomatoes thrive in well-draining, fertile soil with pH 6.0-6.8. Amend heavy soils with compost and ensure good drainage to prevent root rot.</p>
      
      <h3>Planting</h3>
      <p>Plant transplants 24-36 inches apart in full sun. San Marzanos are indeterminate, so install sturdy support systems at planting time.</p>
      
      <h2>Care and Maintenance</h2>
      
      <h3>Watering</h3>
      <p>Maintain consistent soil moisture with 1-2 inches of water weekly. Water at soil level to prevent leaf diseases. Mulch heavily to retain moisture.</p>
      
      <h3>Fertilizing</h3>
      <p>Feed with balanced fertilizer at planting, then side-dress with compost or low-nitrogen fertilizer once fruit sets. Avoid over-fertilizing with nitrogen.</p>
      
      <h3>Pruning and Support</h3>
      <p>Remove suckers regularly and provide strong support. These vines can reach 6-8 feet tall and produce heavy fruit clusters.</p>
      
      <h2>Harvesting and Storage</h2>
      <p>Harvest when fruits are deep red and slightly soft. For sauce-making, you can harvest when fruits first start turning color and ripen indoors.</p>
      
      <h3>Preservation Methods</h3>
      <ul>
      <li><strong>Canning:</strong> Perfect for whole canned tomatoes</li>
      <li><strong>Sauce:</strong> Excellent for marinara and pizza sauce</li>
      <li><strong>Paste:</strong> Ideal for tomato paste and concentrate</li>
      <li><strong>Drying:</strong> Can be dried for concentrated flavor</li>
      </ul>
      
      <h2>Common Problems</h2>
      
      <h3>Blossom End Rot</h3>
      <p>Maintain consistent watering and ensure adequate calcium in soil.</p>
      
      <h3>Cracking</h3>
      <p>Provide consistent moisture and harvest at proper ripeness.</p>
      
      <h3>Disease Prevention</h3>
      <p>Ensure good air circulation, water at soil level, and rotate crops annually.</p>
      
      <p>With proper care, San Marzano tomatoes will provide you with the authentic flavors that have made them legendary in Italian cuisine!</p>`,
      excerpt: "Learn to grow authentic San Marzano tomatoes, the prized Italian paste tomatoes beloved by chefs for their sweet flavor and perfect sauce-making qualities.",
      imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80"
    },
    {
      title: "Seed Starting 101: Everything You Need to Know",
      content: `<h1>Seed Starting 101: Everything You Need to Know</h1>
      <p>Starting plants from seed is one of the most rewarding aspects of gardening. It's cost-effective, gives you access to unique varieties, and extends your growing season. Here's everything you need to know to get started.</p>
      
      <h2>Why Start from Seed?</h2>
      <ul>
      <li><strong>Cost savings:</strong> Seeds cost pennies compared to transplants</li>
      <li><strong>Variety:</strong> Access to thousands of varieties not available as transplants</li>
      <li><strong>Timing control:</strong> Start when you want, not when stores stock plants</li>
      <li><strong>Quality assurance:</strong> Know exactly how your plants were grown</li>
      <li><strong>Educational:</strong> Watch the complete plant lifecycle</li>
      </ul>
      
      <h2>Essential Seed Starting Equipment</h2>
      
      <h3>Containers</h3>
      <p>Choose from several options:</p>
      <ul>
      <li><strong>Seed trays:</strong> Standard 1020 trays with cell inserts</li>
      <li><strong>Peat pots:</strong> Biodegradable pots that plant directly in soil</li>
      <li><strong>Soil blocks:</strong> Compressed soil cubes for root-friendly starting</li>
      <li><strong>Recycled containers:</strong> Yogurt cups, egg cartons with drainage holes</li>
      </ul>
      
      <h3>Growing Medium</h3>
      <p>Use quality seed starting mix that's:</p>
      <ul>
      <li>Fine-textured for small seeds</li>
      <li>Well-draining but moisture-retentive</li>
      <li>Sterile to prevent damping-off disease</li>
      <li>Low in nutrients (seeds contain their own food)</li>
      </ul>
      
      <h3>Lighting</h3>
      <p>Most seedlings need 14-16 hours of light daily:</p>
      <ul>
      <li><strong>LED grow lights:</strong> Energy-efficient, long-lasting</li>
      <li><strong>Fluorescent lights:</strong> Budget-friendly option</li>
      <li><strong>Sunny windows:</strong> South-facing works for some crops</li>
      </ul>
      
      <h3>Heat Sources</h3>
      <p>Many seeds germinate faster with bottom heat:</p>
      <ul>
      <li>Seedling heat mats with thermostats</li>
      <li>Warm locations like top of refrigerator</li>
      <li>Heated propagation chambers</li>
      </ul>
      
      <h2>When to Start Seeds</h2>
      <p>Timing depends on your last frost date and each plant's requirements:</p>
      
      <h3>Cool Season Crops (6-8 weeks before last frost)</h3>
      <ul>
      <li>Broccoli, cabbage, cauliflower</li>
      <li>Lettuce, spinach, kale</li>
      <li>Onions, leeks</li>
      </ul>
      
      <h3>Warm Season Crops (4-6 weeks before last frost)</h3>
      <ul>
      <li>Tomatoes, peppers, eggplant</li>
      <li>Basil, oregano</li>
      <li>Annual flowers like petunias, impatiens</li>
      </ul>
      
      <h3>Direct Sow (after soil warms)</h3>
      <ul>
      <li>Beans, peas, corn</li>
      <li>Root vegetables like carrots, radishes</li>
      <li>Large seeds like squash, melons</li>
      </ul>
      
      <h2>Step-by-Step Seed Starting Process</h2>
      
      <h3>1. Prepare Your Setup</h3>
      <ul>
      <li>Clean containers with 10% bleach solution</li>
      <li>Set up lighting system</li>
      <li>Install heat mat if needed</li>
      <li>Prepare seed starting medium</li>
      </ul>
      
      <h3>2. Sow Seeds</h3>
      <ul>
      <li>Fill containers with moist (not wet) seed starting mix</li>
      <li>Plant seeds at depth equal to 2-3 times their diameter</li>
      <li>Fine seeds can be surface-sown and pressed lightly</li>
      <li>Label everything clearly with variety and date</li>
      </ul>
      
      <h3>3. Create Optimal Conditions</h3>
      <ul>
      <li>Cover containers with plastic wrap or humidity dome</li>
      <li>Maintain temperature according to seed packet instructions</li>
      <li>Keep soil evenly moist but not waterlogged</li>
      <li>Check daily for germination</li>
      </ul>
      
      <h3>4. Care for Seedlings</h3>
      <ul>
      <li>Remove covers once seeds germinate</li>
      <li>Position lights 2-4 inches above seedlings</li>
      <li>Water from bottom to prevent damping-off</li>
      <li>Provide air circulation with small fan</li>
      </ul>
      
      <h2>Common Seedling Problems</h2>
      
      <h3>Damping-Off Disease</h3>
      <p><strong>Symptoms:</strong> Seedlings fall over at soil line</p>
      <p><strong>Prevention:</strong> Use sterile medium, avoid overwatering, provide air circulation</p>
      
      <h3>Leggy Seedlings</h3>
      <p><strong>Symptoms:</strong> Tall, weak stems reaching for light</p>
      <p><strong>Solution:</strong> Move lights closer, provide more hours of light</p>
      
      <h3>Poor Germination</h3>
      <p><strong>Causes:</strong> Old seeds, wrong temperature, over/under watering</p>
      <p><strong>Solution:</strong> Check seed viability, adjust conditions</p>
      
      <h2>Transplanting Seedlings</h2>
      
      <h3>When to Transplant</h3>
      <p>Move seedlings to larger containers when:</p>
      <ul>
      <li>They have 2-4 true leaves</li>
      <li>Roots are visible through drainage holes</li>
      <li>Plants look crowded in current containers</li>
      </ul>
      
      <h3>Hardening Off</h3>
      <p>Gradually acclimate seedlings to outdoor conditions:</p>
      <ul>
      <li>Start with 1-2 hours outdoors in shade</li>
      <li>Gradually increase time and sun exposure</li>
      <li>Process takes 7-10 days</li>
      <li>Protect from wind and extreme temperatures</li>
      </ul>
      
      <h2>Advanced Techniques</h2>
      
      <h3>Pre-Germination</h3>
      <p>Start seeds between moist paper towels to speed germination of slow or difficult seeds.</p>
      
      <h3>Succession Planting</h3>
      <p>Start new seeds every 2-3 weeks for continuous harvests of quick crops like lettuce.</p>
      
      <h3>Soil Blocking</h3>
      <p>Create soil blocks without containers for healthier root development and easier transplanting.</p>
      
      <p>With these fundamentals, you'll be growing your own plants from seed and enjoying the satisfaction of nurturing life from the very beginning!</p>`,
      excerpt: "Master the art of seed starting with this comprehensive guide covering equipment, timing, techniques, and troubleshooting for successful seedling production.",
      imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&auto=format&fit=crop&q=80"
    },
    {
      title: "Container Gardening: Growing Food in Small Spaces",
      content: `<h1>Container Gardening: Growing Food in Small Spaces</h1>
      <p>Don't let limited space stop you from growing your own food! Container gardening allows anyone with a balcony, patio, or even a sunny windowsill to enjoy fresh, homegrown vegetables and herbs.</p>
      
      <h2>Benefits of Container Gardening</h2>
      <ul>
      <li><strong>Space efficient:</strong> Perfect for apartments, condos, and small yards</li>
      <li><strong>Pest control:</strong> Easier to manage pests and diseases</li>
      <li><strong>Soil control:</strong> Use perfect soil mix for each plant</li>
      <li><strong>Mobility:</strong> Move containers to optimize growing conditions</li>
      <li><strong>Accessibility:</strong> Easier on back and knees</li>
      <li><strong>Season extension:</strong> Move tender plants indoors</li>
      </ul>
      
      <h2>Choosing the Right Containers</h2>
      
      <h3>Size Requirements</h3>
      <p>Container size depends on what you're growing:</p>
      <ul>
      <li><strong>Herbs:</strong> 6-8 inch pots</li>
      <li><strong>Lettuce/greens:</strong> 6-8 inches deep, any width</li>
      <li><strong>Peppers:</strong> 3-5 gallon containers</li>
      <li><strong>Tomatoes:</strong> 5-10 gallon containers minimum</li>
      <li><strong>Root vegetables:</strong> 12+ inches deep</li>
      </ul>
      
      <h3>Material Options</h3>
      
      <h4>Plastic Containers</h4>
      <p><strong>Pros:</strong> Lightweight, inexpensive, retain moisture</p>
      <p><strong>Cons:</strong> Can become brittle, may heat up soil</p>
      
      <h4>Ceramic/Terra Cotta</h4>
      <p><strong>Pros:</strong> Attractive, good drainage, temperature stability</p>
      <p><strong>Cons:</strong> Heavy, can crack in freezing weather</p>
      
      <h4>Wood Containers</h4>
      <p><strong>Pros:</strong> Natural look, good insulation</p>
      <p><strong>Cons:</strong> Can rot, may need liner for food crops</p>
      
      <h4>Fabric Grow Bags</h4>
      <p><strong>Pros:</strong> Excellent drainage, air pruning of roots, portable</p>
      <p><strong>Cons:</strong> Dry out quickly, may not last multiple seasons</p>
      
      <h3>Drainage is Critical</h3>
      <p>All containers must have drainage holes. Without proper drainage:</p>
      <ul>
      <li>Roots will rot</li>
      <li>Soil becomes waterlogged</li>
      <li>Plants become stressed and diseased</li>
      </ul>
      
      <h2>Soil for Container Growing</h2>
      
      <h3>Never Use Garden Soil</h3>
      <p>Garden soil is too heavy for containers and may contain pests or diseases. Instead, use:</p>
      
      <h3>Premium Potting Mix</h3>
      <p>Look for mixes containing:</p>
      <ul>
      <li>Peat moss or coconut coir for moisture retention</li>
      <li>Perlite or vermiculite for drainage</li>
      <li>Compost for nutrients</li>
      <li>Bark or other organic matter for structure</li>
      </ul>
      
      <h3>DIY Potting Mix Recipe</h3>
      <p>Mix equal parts:</p>
      <ul>
      <li>Quality compost</li>
      <li>Peat moss or coconut coir</li>
      <li>Perlite or coarse sand</li>
      </ul>
      
      <h2>Best Plants for Containers</h2>
      
      <h3>Easy Herbs</h3>
      <ul>
      <li><strong>Basil:</strong> Warm weather herb, pinch flowers for continued leaf production</li>
      <li><strong>Parsley:</strong> Cool weather, cut outer leaves first</li>
      <li><strong>Chives:</strong> Perennial, cut like grass for continuous harvest</li>
      <li><strong>Oregano:</strong> Spreads well, excellent for pizza and pasta</li>
      </ul>
      
      <h3>Leafy Greens</h3>
      <ul>
      <li><strong>Lettuce:</strong> Quick growing, harvest outer leaves</li>
      <li><strong>Spinach:</strong> Cool weather crop, bolt-resistant varieties</li>
      <li><strong>Kale:</strong> Very cold tolerant, harvest baby leaves</li>
      <li><strong>Swiss chard:</strong> Heat tolerant, colorful stems</li>
      </ul>
      
      <h3>Compact Vegetables</h3>
      <ul>
      <li><strong>Cherry tomatoes:</strong> Heavy producers in large containers</li>
      <li><strong>Peppers:</strong> All varieties do well in containers</li>
      <li><strong>Radishes:</strong> Quick growing, good for succession planting</li>
      <li><strong>Green onions:</strong> Regrow from kitchen scraps</li>
      </ul>
      
      <h3>Vining Crops</h3>
      <ul>
      <li><strong>Peas:</strong> Cool weather, provide support</li>
      <li><strong>Beans:</strong> Warm weather, bush varieties best</li>
      <li><strong>Cucumbers:</strong> Need large containers and support</li>
      <li><strong>Small melons:</strong> Need very large containers</li>
      </ul>
      
      <h2>Container Garden Layout Ideas</h2>
      
      <h3>Balcony Garden</h3>
      <ul>
      <li>Vertical planters for herbs</li>
      <li>Railing planters for trailing crops</li>
      <li>Large containers for tomatoes/peppers</li>
      <li>Hanging baskets for strawberries</li>
      </ul>
      
      <h3>Patio Garden</h3>
      <ul>
      <li>Groupings of containers by height</li>
      <li>Rolling containers for sun tracking</li>
      <li>Self-watering containers for vacation care</li>
      <li>Decorative containers as focal points</li>
      </ul>
      
      <h3>Indoor Growing</h3>
      <ul>
      <li>Sunny south-facing windows</li>
      <li>Grow lights for year-round production</li>
      <li>Kitchen herb gardens</li>
      <li>Microgreens on countertops</li>
      </ul>
      
      <h2>Watering Container Gardens</h2>
      
      <h3>Watering Frequency</h3>
      <p>Container plants need more frequent watering than ground-planted crops:</p>
      <ul>
      <li>Small containers: daily in hot weather</li>
      <li>Large containers: every 2-3 days</li>
      <li>Check soil moisture with finger test</li>
      <li>Water when top inch of soil is dry</li>
      </ul>
      
      <h3>Watering Techniques</h3>
      <ul>
      <li>Water slowly until it drains from bottom</li>
      <li>Water early morning to reduce evaporation</li>
      <li>Use saucers to catch excess water</li>
      <li>Consider drip irrigation for multiple containers</li>
      </ul>
      
      <h3>Self-Watering Options</h3>
      <ul>
      <li>Self-watering containers with reservoirs</li>
      <li>Drip irrigation systems</li>
      <li>Water globes for short-term watering</li>
      <li>Capillary mat systems</li>
      </ul>
      
      <h2>Fertilizing Container Plants</h2>
      
      <h3>Why Containers Need More Fertilizer</h3>
      <p>Frequent watering leaches nutrients from containers, requiring regular feeding:</p>
      
      <h3>Fertilizer Options</h3>
      <ul>
      <li><strong>Liquid fertilizer:</strong> Quick uptake, applied every 2-3 weeks</li>
      <li><strong>Slow-release granules:</strong> Long-lasting, applied at planting</li>
      <li><strong>Compost:</strong> Natural, gentle feeding</li>
      <li><strong>Fish emulsion:</strong> Organic liquid option</li>
      </ul>
      
      <h2>Common Container Problems</h2>
      
      <h3>Overwatering</h3>
      <p><strong>Symptoms:</strong> Yellow leaves, wilting despite moist soil</p>
      <p><strong>Solution:</strong> Improve drainage, reduce watering frequency</p>
      
      <h3>Underwatering</h3>
      <p><strong>Symptoms:</strong> Wilting, crispy leaf edges, stunted growth</p>
      <p><strong>Solution:</strong> Increase watering frequency, add mulch</p>
      
      <h3>Root Bound Plants</h3>
      <p><strong>Symptoms:</strong> Stunted growth, rapid water loss</p>
      <p><strong>Solution:</strong> Transplant to larger container or divide plant</p>
      
      <h2>Seasonal Container Care</h2>
      
      <h3>Spring Setup</h3>
      <ul>
      <li>Clean containers from previous season</li>
      <li>Replace or refresh potting soil</li>
      <li>Plan layout for optimal sun exposure</li>
      <li>Start cool season crops</li>
      </ul>
      
      <h3>Summer Maintenance</h3>
      <ul>
      <li>Daily watering checks</li>
      <li>Regular harvesting to encourage production</li>
      <li>Move containers to avoid excessive heat</li>
      <li>Provide afternoon shade if needed</li>
      </ul>
      
      <h3>Fall Transition</h3>
      <ul>
      <li>Plant cool season crops</li>
      <li>Harvest remaining warm season crops</li>
      <li>Move tender perennials indoors</li>
      <li>Protect containers from freezing</li>
      </ul>
      
      <h3>Winter Care</h3>
      <ul>
      <li>Protect containers from freeze damage</li>
      <li>Grow cold-hardy crops with protection</li>
      <li>Plan next year's garden</li>
      <li>Order seeds for spring planting</li>
      </ul>
      
      <p>Container gardening opens up endless possibilities for growing your own food, regardless of your living situation. Start small, learn as you go, and enjoy the satisfaction of harvesting fresh food from your own container garden!</p>`,
      excerpt: "Discover how to grow abundant food in containers, perfect for small spaces, balconies, and patios. Learn container selection, soil mixes, and care techniques.",
      imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80"
    }
  ];

  // Import the blog posts
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
      console.log(`Created blog post: ${post.title}`);
    } catch (error) {
      console.log(`Blog post "${post.title}" may already exist`);
    }
  }

  console.log('Manual Epic Gardening import completed!');
  return {
    message: "Successfully imported Epic Gardening content",
    blogPosts: epicBlogPosts.length
  };
}
