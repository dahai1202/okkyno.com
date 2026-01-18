import {
  BlogPost,
  blogPosts,
  CartItem,
  cartItems,
  categories,
  Category,
  Comment,
  comments,
  InsertBlogPost,
  InsertCartItem,
  InsertCategory,
  InsertComment,
  InsertOrder,
  InsertOrderItem,
  InsertProduct,
  InsertTestimonial,
  InsertUser,
  Order,
  OrderItem,
  orderItems,
  orders,
  Product,
  products,
  Testimonial,
  testimonials,
  User,
  users,
} from '@shared/schema';

// Storage interface for all CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<Category>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Product operations
  getProducts(limit?: number, offset?: number): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Blog operations
  getBlogPosts(limit?: number, offset?: number, publishedOnly?: boolean): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Comment operations
  getCommentsByBlogPost(blogPostId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: number): Promise<boolean>;

  // Order operations
  getOrders(): Promise<Order[]>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Order item operations
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;

  // Testimonial operations
  getTestimonials(approvedOnly?: boolean): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  approveTestimonial(id: number): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;

  // Cart operations
  getCartItems(sessionId: string): Promise<CartItem[]>;
  getCartItem(sessionId: string, productId: number): Promise<CartItem | undefined>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private blogPosts: Map<number, BlogPost>;
  private comments: Map<number, Comment>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private testimonials: Map<number, Testimonial>;
  private cartItems: Map<number, CartItem>;

  private userIdCounter: number;
  private categoryIdCounter: number;
  private productIdCounter: number;
  private blogPostIdCounter: number;
  private commentIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;
  private testimonialIdCounter: number;
  private cartItemIdCounter: number;

  // Sample data for initial load
  private sampleCategories: InsertCategory[] = [
    { name: "Vegetables", slug: "vegetables", description: "Fresh vegetables for your garden", imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80" },
    { name: "Indoor Plants", slug: "indoor-plants", description: "Beautiful plants for your home", imageUrl: "https://images.unsplash.com/photo-1586093021710-3c5dd9bd1e06?w=800&auto=format&fit=crop&q=80" },
    { name: "Garden Tools", slug: "garden-tools", description: "Quality tools for gardening", imageUrl: "https://images.unsplash.com/photo-1589111118344-fe616859d7a7?w=800&auto=format&fit=crop&q=80" },
    { name: "Hand Tools", slug: "hand-tools", description: "Essential hand tools for gardening", imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80" },
    { name: "Power Tools", slug: "power-tools", description: "Electric and battery-powered garden tools", imageUrl: "https://images.unsplash.com/photo-1558618666-5a006db2c7ad?w=800&auto=format&fit=crop&q=80" },
    { name: "Watering", slug: "watering", description: "Watering systems and irrigation tools", imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&auto=format&fit=crop&q=80" },
    { name: "Pruning", slug: "pruning", description: "Pruning and cutting tools", imageUrl: "https://images.unsplash.com/photo-1615232428120-9aa7ce2ab176?w=800&auto=format&fit=crop&q=80" },
    { name: "Flowers", slug: "flowers", description: "Colorful flowers for your garden", imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&auto=format&fit=crop&q=80" },
    { name: "Pots & Planters", slug: "pots-planters", description: "Decorative pots for your plants", imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80" },
    { name: "Seeds", slug: "seeds", description: "High-quality seeds for planting", imageUrl: "https://images.unsplash.com/photo-1597254563670-2df0f6b27a5e?w=800&auto=format&fit=crop&q=80" },
    { name: "Herbs", slug: "herbs", description: "Fresh herbs for cooking and wellness", imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80" },
    { name: "Succulents", slug: "succulents", description: "Low-maintenance succulent plants", imageUrl: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&auto=format&fit=crop&q=80" },
    { name: "Fruit Trees", slug: "fruit-trees", description: "Fruit-bearing trees for your garden", imageUrl: "https://images.unsplash.com/photo-1572915904405-c13b2eecfac7?w=800&auto=format&fit=crop&q=80" },
    { name: "Organic Fertilizers", slug: "organic-fertilizers", description: "Natural fertilizers for healthy plants", imageUrl: "https://images.unsplash.com/photo-1595771805070-fdf2e7cd5050?w=800&auto=format&fit=crop&q=80" },
    { name: "Soil & Fertilizers", slug: "soil-fertilizers", description: "Premium soil and fertilizers", imageUrl: "https://images.unsplash.com/photo-1595771805070-fdf2e7cd5050?w=800&auto=format&fit=crop&q=80" },
    { name: "Accessories", slug: "accessories", description: "Garden accessories and supplies", imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80" }
  ];

  // Comprehensive product database based on Epic Gardening
  private comprehensiveProducts: InsertProduct[] = [
    // Vegetables (Category 1)
    {
      name: "Cherokee Purple Heirloom Tomato",
      slug: "cherokee-purple-heirloom-tomato",
      description: "A legendary heirloom variety with deep purple-brown fruits that offer exceptional flavor. These beefsteak-type tomatoes can weigh up to 1 pound each and are perfect for slicing. The complex, rich flavor combines sweet and smoky notes that make this variety a favorite among gardeners.",
      shortDescription: "Large, flavorful heirloom tomato with deep purple coloring",
      price: 4.99,
      comparePrice: 6.99,
      imageUrl: "https://images.unsplash.com/photo-1546470427-e5380b43d0a4?w=800&auto=format&fit=crop&q=80",
      imageUrls: [
        "https://images.unsplash.com/photo-1546470427-e5380b43d0a4?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80"
      ],
      videoUrl: "https://player.vimeo.com/video/123456789",
      categoryId: 1,
      sku: "TOM-CHE-001",
      stock: 150,
      featured: true,
      rating: 4.8,
      reviewCount: 124,
      tags: ["heirloom", "organic", "indeterminate", "beefsteak"],
      botanicalName: "Solanum lycopersicum",
      difficulty: "Intermediate",
      sunRequirement: "Full Sun",
      waterRequirement: "Regular",
      dimensions: "6-8 feet tall",
      weight: 0.1
    },
    {
      name: "Detroit Dark Red Beet",
      slug: "detroit-dark-red-beet",
      description: "A classic beet variety with deep red roots and tender greens. Perfect for roasting, pickling, or eating fresh. The roots are sweet and earthy, while the tops can be harvested as nutritious leafy greens.",
      shortDescription: "Classic deep red beet variety with edible greens",
      price: 3.49,
      imageUrl: "https://images.unsplash.com/photo-1593113598332-4c853d3d1e8c?w=800&auto=format&fit=crop&q=80",
      imageUrls: [
        "https://images.unsplash.com/photo-1593113598332-4c853d3d1e8c?w=800&auto=format&fit=crop&q=80"
      ],
      categoryId: 1,
      sku: "BEE-DET-001",
      stock: 200,
      featured: false,
      rating: 4.6,
      reviewCount: 89,
      tags: ["root vegetable", "organic", "heirloom"],
      botanicalName: "Beta vulgaris",
      difficulty: "Easy",
      sunRequirement: "Full Sun to Partial Shade",
      waterRequirement: "Regular",
      dimensions: "2-3 inches diameter",
      weight: 0.05
    },
    {
      name: "Dragon Tongue Bush Bean",
      slug: "dragon-tongue-bush-bean",
      description: "Stunning purple-streaked pods that are as beautiful as they are delicious. These bush beans are compact and productive, perfect for small gardens. The pods are tender when young and the beans inside are creamy white.",
      shortDescription: "Purple-streaked bush beans with exceptional flavor",
      price: 4.25,
      imageUrl: "https://images.unsplash.com/photo-1543080917-8618c1dc2e85?w=800&auto=format&fit=crop&q=80",
      imageUrls: [
        "https://images.unsplash.com/photo-1543080917-8618c1dc2e85?w=800&auto=format&fit=crop&q=80"
      ],
      categoryId: 1,
      sku: "BEA-DRA-001",
      stock: 125,
      featured: true,
      rating: 4.7,
      reviewCount: 67,
      tags: ["bush bean", "heirloom", "compact"],
      botanicalName: "Phaseolus vulgaris",
      difficulty: "Easy",
      sunRequirement: "Full Sun",
      waterRequirement: "Regular",
      dimensions: "18-24 inches tall",
      weight: 0.08
    },

    // Indoor Plants (Category 2)
    {
      name: "Monstera Deliciosa 'Swiss Cheese Plant'",
      slug: "monstera-deliciosa-swiss-cheese-plant",
      description: "The iconic split-leaf philodendron that's taken social media by storm. Known for its dramatic fenestrations (holes and splits) that develop as the plant matures. This tropical beauty can grow quite large indoors and is surprisingly easy to care for.",
      shortDescription: "Popular split-leaf houseplant with dramatic fenestrations",
      price: 29.99,
      comparePrice: 39.99,
      imageUrl: "https://images.unsplash.com/photo-1586093021710-3c5dd9bd1e06?w=800&auto=format&fit=crop&q=80",
      imageUrls: [
        "https://images.unsplash.com/photo-1586093021710-3c5dd9bd1e06?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1583879620084-de3d35b0eeaa?w=800&auto=format&fit=crop&q=80"
      ],
      videoUrl: "https://player.vimeo.com/video/987654321",
      categoryId: 2,
      sku: "MON-DEL-001",
      stock: 45,
      featured: true,
      rating: 4.9,
      reviewCount: 234,
      tags: ["tropical", "low-light", "air-purifying", "climbing"],
      botanicalName: "Monstera deliciosa",
      difficulty: "Easy",
      sunRequirement: "Bright Indirect Light",
      waterRequirement: "Weekly",
      dimensions: "6-8 feet indoors",
      weight: 2.5
    },
    {
      name: "Snake Plant 'Sansevieria Trifasciata'",
      slug: "snake-plant-sansevieria-trifasciata",
      description: "The ultimate low-maintenance houseplant. This architectural beauty with its sword-like leaves can tolerate neglect better than almost any other plant. It's also one of the best air-purifying plants according to NASA studies.",
      shortDescription: "Nearly indestructible air-purifying houseplant",
      price: 19.99,
      imageUrl: "https://images.unsplash.com/photo-1493400448374-3b3e5ab7e0fa?w=800&auto=format&fit=crop&q=80",
      imageUrls: [
        "https://images.unsplash.com/photo-1493400448374-3b3e5ab7e0fa?w=800&auto=format&fit=crop&q=80"
      ],
      categoryId: 2,
      sku: "SNA-TRI-001",
      stock: 85,
      featured: true,
      rating: 4.8,
      reviewCount: 456,
      tags: ["low-light", "drought-tolerant", "air-purifying", "beginner-friendly"],
      botanicalName: "Sansevieria trifasciata",
      difficulty: "Easy",
      sunRequirement: "Low to Bright Light",
      waterRequirement: "Monthly",
      dimensions: "2-4 feet tall",
      weight: 1.8
    },

    // Hand Tools (Category 4)
    {
      name: "Japanese Hori Hori Garden Knife",
      slug: "japanese-hori-hori-garden-knife",
      description: "The ultimate multi-purpose garden tool. This traditional Japanese knife features a sharp stainless steel blade with serrated edge, depth markings, and comfortable wooden handle. Perfect for digging, cutting, measuring, and transplanting.",
      shortDescription: "Versatile Japanese garden knife for multiple tasks",
      price: 34.99,
      comparePrice: 44.99,
      imageUrl: "https://images.unsplash.com/photo-1589111118344-fe616859d7a7?w=800&auto=format&fit=crop&q=80",
      imageUrls: [
        "https://images.unsplash.com/photo-1589111118344-fe616859d7a7?w=800&auto=format&fit=crop&q=80"
      ],
      videoUrl: "https://player.vimeo.com/video/456789123",
      categoryId: 4,
      sku: "HOR-JAP-001",
      stock: 75,
      featured: true,
      rating: 4.9,
      reviewCount: 189,
      tags: ["stainless steel", "multi-purpose", "professional", "japanese"],
      difficulty: "N/A",
      sunRequirement: "N/A",
      waterRequirement: "N/A",
      dimensions: "12 inches long",
      weight: 0.75
    },

    // More Vegetables (Category 1)
    {
      name: "Purple Top Turnip",
      slug: "purple-top-turnip",
      description: "A classic root vegetable with white flesh and purple shoulders. Both roots and greens are edible, making this a dual-purpose crop. Sweet, mild flavor that improves with cool weather.",
      shortDescription: "Dual-purpose root vegetable with edible greens",
      price: 2.99,
      imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f634ed8a?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1609501676725-7186f634ed8a?w=800&auto=format&fit=crop&q=80"],
      categoryId: 1,
      sku: "TUR-PUR-001",
      stock: 180,
      featured: false,
      rating: 4.4,
      reviewCount: 76,
      tags: ["root vegetable", "cold hardy", "dual purpose"],
      botanicalName: "Brassica rapa",
      difficulty: "Easy",
      sunRequirement: "Full Sun",
      waterRequirement: "Regular",
      dimensions: "3-4 inches diameter",
      weight: 0.04
    },
    {
      name: "Scarlet Nantes Carrot",
      slug: "scarlet-nantes-carrot",
      description: "The gold standard for home garden carrots. Bright orange, cylindrical roots with sweet flavor and crisp texture. Excellent for fresh eating, cooking, or juicing.",
      shortDescription: "Classic orange carrot variety with sweet flavor",
      price: 3.25,
      imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80"],
      videoUrl: "https://player.vimeo.com/video/789123456",
      categoryId: 1,
      sku: "CAR-SCA-001",
      stock: 220,
      featured: true,
      rating: 4.7,
      reviewCount: 156,
      tags: ["root vegetable", "sweet", "versatile"],
      botanicalName: "Daucus carota",
      difficulty: "Easy",
      sunRequirement: "Full Sun",
      waterRequirement: "Regular",
      dimensions: "6-7 inches long",
      weight: 0.03
    },
    {
      name: "Buttercrunch Lettuce",
      slug: "buttercrunch-lettuce",
      description: "Award-winning butter lettuce with tender, sweet leaves and compact heads. Perfect for salads and sandwiches. Heat-resistant variety that's slow to bolt.",
      shortDescription: "Tender butter lettuce with sweet flavor",
      price: 2.75,
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80"],
      categoryId: 1,
      sku: "LET-BUT-001",
      stock: 165,
      featured: false,
      rating: 4.5,
      reviewCount: 94,
      tags: ["lettuce", "tender", "heat resistant"],
      botanicalName: "Lactuca sativa",
      difficulty: "Easy",
      sunRequirement: "Partial Shade",
      waterRequirement: "Regular",
      dimensions: "8 inches diameter",
      weight: 0.02
    },
    {
      name: "Sugar Snap Pea",
      slug: "sugar-snap-pea",
      description: "Sweet, crunchy pods that are eaten whole. These climbing peas produce abundant harvests and are perfect for fresh eating, stir-fries, or light cooking.",
      shortDescription: "Sweet edible-pod peas for fresh eating",
      price: 4.50,
      imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80"],
      categoryId: 1,
      sku: "PEA-SUG-001",
      stock: 140,
      featured: true,
      rating: 4.8,
      reviewCount: 203,
      tags: ["climbing", "edible pod", "sweet"],
      botanicalName: "Pisum sativum",
      difficulty: "Easy",
      sunRequirement: "Full Sun",
      waterRequirement: "Regular",
      dimensions: "6 feet tall",
      weight: 0.06
    },

    // More Indoor Plants (Category 2)
    {
      name: "Fiddle Leaf Fig",
      slug: "fiddle-leaf-fig",
      description: "The ultimate statement houseplant with large, violin-shaped leaves. This tree can grow quite tall indoors and adds dramatic architectural interest to any space.",
      shortDescription: "Dramatic statement plant with large violin-shaped leaves",
      price: 45.99,
      comparePrice: 65.99,
      imageUrl: "https://images.unsplash.com/photo-1462037165750-500d68bfad65?w=800&auto=format&fit=crop&q=80",
      imageUrls: [
        "https://images.unsplash.com/photo-1462037165750-500d68bfad65?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1586093021710-3c5dd9bd1e06?w=800&auto=format&fit=crop&q=80"
      ],
      videoUrl: "https://player.vimeo.com/video/321654987",
      categoryId: 2,
      sku: "FID-LEA-001",
      stock: 25,
      featured: true,
      rating: 4.6,
      reviewCount: 178,
      tags: ["statement plant", "tree", "architectural"],
      botanicalName: "Ficus lyrata",
      difficulty: "Intermediate",
      sunRequirement: "Bright Indirect Light",
      waterRequirement: "Weekly",
      dimensions: "6-10 feet indoors",
      weight: 4.2
    },
    {
      name: "Pothos 'Golden'",
      slug: "pothos-golden",
      description: "The perfect beginner houseplant with heart-shaped leaves variegated in green and yellow. Extremely easy to care for and propagate, this trailing vine works great in hanging baskets.",
      shortDescription: "Easy-care trailing vine with variegated leaves",
      price: 12.99,
      imageUrl: "https://images.unsplash.com/photo-1520301255226-bf5f144451c1?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1520301255226-bf5f144451c1?w=800&auto=format&fit=crop&q=80"],
      categoryId: 2,
      sku: "POT-GOL-001",
      stock: 95,
      featured: false,
      rating: 4.9,
      reviewCount: 342,
      tags: ["trailing", "variegated", "beginner-friendly", "propagates easily"],
      botanicalName: "Epipremnum aureum",
      difficulty: "Easy",
      sunRequirement: "Low to Bright Light",
      waterRequirement: "Weekly",
      dimensions: "Trailing to 8 feet",
      weight: 0.8
    },
    {
      name: "ZZ Plant 'Zamioculcas Zamiifolia'",
      slug: "zz-plant-zamioculcas-zamiifolia",
      description: "Nearly indestructible plant with glossy, waxy leaves. Perfect for offices and low-light areas. Can survive weeks without water and still look great.",
      shortDescription: "Low-maintenance plant with glossy waxy leaves",
      price: 24.99,
      imageUrl: "https://images.unsplash.com/photo-1581992015047-b5e5c4633fcb?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1581992015047-b5e5c4633fcb?w=800&auto=format&fit=crop&q=80"],
      categoryId: 2,
      sku: "ZZ-ZAM-001",
      stock: 65,
      featured: true,
      rating: 4.8,
      reviewCount: 267,
      tags: ["low-light", "drought-tolerant", "office plant"],
      botanicalName: "Zamioculcas zamiifolia",
      difficulty: "Easy",
      sunRequirement: "Low to Medium Light",
      waterRequirement: "Monthly",
      dimensions: "2-3 feet tall",
      weight: 2.1
    },
    {
      name: "Rubber Plant 'Ficus Elastica'",
      slug: "rubber-plant-ficus-elastica",
      description: "Classic houseplant with large, glossy dark green leaves. Easy to care for and can grow into an impressive indoor tree with proper care.",
      shortDescription: "Classic plant with large glossy leaves",
      price: 32.99,
      imageUrl: "https://images.unsplash.com/photo-1591958911259-bee2173bdcdc?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1591958911259-bee2173bdcdc?w=800&auto=format&fit=crop&q=80"],
      videoUrl: "https://player.vimeo.com/video/654321789",
      categoryId: 2,
      sku: "RUB-ELA-001",
      stock: 40,
      featured: false,
      rating: 4.7,
      reviewCount: 145,
      tags: ["tree", "glossy leaves", "classic"],
      botanicalName: "Ficus elastica",
      difficulty: "Easy",
      sunRequirement: "Bright Indirect Light",
      waterRequirement: "Weekly",
      dimensions: "6-8 feet indoors",
      weight: 3.5
    },

    // Pruning Tools (Category 7) 
    {
      name: "Felco F-2 Classic Manual Hand Pruner",
      slug: "felco-f2-classic-manual-hand-pruner",
      description: "Professional-grade bypass pruners with hardened steel blades and ergonomic handles. Cuts branches up to 1 inch diameter cleanly. Replaceable parts for lifetime use.",
      shortDescription: "Professional bypass pruners with lifetime warranty",
      price: 52.99,
      comparePrice: 68.99,
      imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80"],
      videoUrl: "https://player.vimeo.com/video/123987654",
      categoryId: 7,
      sku: "FEL-F2-001",
      stock: 45,
      featured: true,
      rating: 4.9,
      reviewCount: 312,
      tags: ["professional", "bypass", "replaceable parts", "lifetime warranty"],
      difficulty: "N/A",
      sunRequirement: "N/A",
      waterRequirement: "N/A",
      dimensions: "8.5 inches long",
      weight: 0.5
    },
    {
      name: "Corona ClassicCUT Forged Bypass Pruner",
      slug: "corona-classiccut-forged-bypass-pruner",
      description: "Forged steel construction with precision-ground blades. Comfortable grip handles reduce hand fatigue during extended use. Perfect for roses and delicate plants.",
      shortDescription: "Forged steel bypass pruner for precision cutting",
      price: 24.99,
      imageUrl: "https://images.unsplash.com/photo-1615232428120-9aa7ce2ab176?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1615232428120-9aa7ce2ab176?w=800&auto=format&fit=crop&q=80"],
      categoryId: 7,
      sku: "COR-CLA-001",
      stock: 65,
      featured: false,
      rating: 4.6,
      reviewCount: 198,
      tags: ["forged steel", "comfortable grip", "roses"],
      difficulty: "N/A",
      sunRequirement: "N/A",
      waterRequirement: "N/A",
      dimensions: "8 inches long",
      weight: 0.4
    },

    // Flowers (Category 4)
    {
      name: "Sunflower 'Mammoth Russian'",
      slug: "sunflower-mammoth-russian",
      description: "Giant sunflowers that can reach 12+ feet tall with flower heads up to 2 feet across. These impressive blooms attract beneficial insects and produce large, edible seeds.",
      shortDescription: "Giant sunflower variety reaching 12+ feet tall",
      price: 3.99,
      imageUrl: "https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=800&auto=format&fit=crop&q=80"],
      videoUrl: "https://player.vimeo.com/video/789456123",
      categoryId: 4,
      sku: "SUN-MAM-001",
      stock: 180,
      featured: true,
      rating: 4.8,
      reviewCount: 156,
      tags: ["giant", "edible seeds", "beneficial insects", "annual"],
      botanicalName: "Helianthus annuus",
      difficulty: "Easy",
      sunRequirement: "Full Sun",
      waterRequirement: "Regular",
      dimensions: "12+ feet tall",
      weight: 0.02
    },
    {
      name: "Zinnia 'State Fair Mix'",
      slug: "zinnia-state-fair-mix",
      description: "Colorful mix of large dahlia-type zinnias in vibrant colors. Long-lasting blooms perfect for cutting gardens. Heat and drought tolerant once established.",
      shortDescription: "Colorful dahlia-type zinnias for cutting gardens",
      price: 2.75,
      imageUrl: "https://images.unsplash.com/photo-1597848212624-e6ec2d97d05e?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1597848212624-e6ec2d97d05e?w=800&auto=format&fit=crop&q=80"],
      categoryId: 4,
      sku: "ZIN-STA-001",
      stock: 220,
      featured: false,
      rating: 4.7,
      reviewCount: 134,
      tags: ["cutting flowers", "heat tolerant", "drought tolerant", "annual"],
      botanicalName: "Zinnia elegans",
      difficulty: "Easy",
      sunRequirement: "Full Sun",
      waterRequirement: "Low to Moderate",
      dimensions: "3-4 feet tall",
      weight: 0.01
    },

    // Pots & Planters (Category 5)
    {
      name: "Terra Cotta Classic Round Pot 12-inch",
      slug: "terra-cotta-classic-round-pot-12-inch",
      description: "Traditional unglazed terra cotta pot with drainage hole. Breathable clay material promotes healthy root growth. Perfect for herbs, vegetables, and flowering plants.",
      shortDescription: "Classic terra cotta pot with excellent drainage",
      price: 18.99,
      comparePrice: 24.99,
      imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80"],
      categoryId: 5,
      sku: "TER-CLA-001",
      stock: 85,
      featured: true,
      rating: 4.5,
      reviewCount: 267,
      tags: ["terra cotta", "drainage hole", "breathable", "traditional"],
      difficulty: "N/A",
      sunRequirement: "N/A",
      waterRequirement: "N/A",
      dimensions: "12 inches diameter",
      weight: 2.8
    },
    {
      name: "Self-Watering Planter Box 24-inch",
      slug: "self-watering-planter-box-24-inch",
      description: "Innovative self-watering system with water reservoir. Perfect for busy gardeners or vacation plant care. Includes water level indicator and overflow drain.",
      shortDescription: "Self-watering planter with reservoir system",
      price: 45.99,
      comparePrice: 59.99,
      imageUrl: "https://images.unsplash.com/photo-1493400448374-3b3e5ab7e0fa?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1493400448374-3b3e5ab7e0fa?w=800&auto=format&fit=crop&q=80"],
      videoUrl: "https://player.vimeo.com/video/456123789",
      categoryId: 5,
      sku: "SEL-WAT-001",
      stock: 35,
      featured: true,
      rating: 4.8,
      reviewCount: 189,
      tags: ["self-watering", "reservoir", "vacation care", "indicator"],
      difficulty: "N/A",
      sunRequirement: "N/A",
      waterRequirement: "N/A",
      dimensions: "24 x 8 x 8 inches",
      weight: 3.5
    },

    // Seeds (Category 6)
    {
      name: "Heirloom Tomato Seed Collection",
      slug: "heirloom-tomato-seed-collection",
      description: "Premium collection of 6 heirloom tomato varieties including Cherokee Purple, Brandywine, Green Zebra, and more. Each packet contains 20+ seeds with growing instructions.",
      shortDescription: "Collection of 6 heirloom tomato varieties",
      price: 19.99,
      comparePrice: 29.99,
      imageUrl: "https://images.unsplash.com/photo-1557844352-761f2565b576?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1557844352-761f2565b576?w=800&auto=format&fit=crop&q=80"],
      videoUrl: "https://player.vimeo.com/video/654987321",
      categoryId: 6,
      sku: "HEI-TOM-001",
      stock: 120,
      featured: true,
      rating: 4.9,
      reviewCount: 245,
      tags: ["heirloom", "collection", "6 varieties", "growing instructions"],
      botanicalName: "Solanum lycopersicum",
      difficulty: "Intermediate",
      sunRequirement: "Full Sun",
      waterRequirement: "Regular",
      dimensions: "Varies by variety",
      weight: 0.05
    },

    // Herbs (Category 7)
    {
      name: "Gourmet Basil 'Genovese'",
      slug: "gourmet-basil-genovese",
      description: "The classic Italian basil for authentic pesto. Large, aromatic leaves with intense flavor. Easy to grow and perfect for containers or garden beds.",
      shortDescription: "Classic Italian basil perfect for pesto",
      price: 3.49,
      imageUrl: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=800&auto=format&fit=crop&q=80"],
      categoryId: 7,
      sku: "BAS-GEN-001",
      stock: 195,
      featured: true,
      rating: 4.8,
      reviewCount: 178,
      tags: ["italian", "pesto", "aromatic", "container friendly"],
      botanicalName: "Ocimum basilicum",
      difficulty: "Easy",
      sunRequirement: "Full Sun",
      waterRequirement: "Regular",
      dimensions: "18-24 inches tall",
      weight: 0.01
    },
    {
      name: "Lavender 'English Munstead'",
      slug: "lavender-english-munstead",
      description: "Compact English lavender with fragrant purple spikes. Perfect for borders, containers, or herb gardens. Attracts bees and butterflies while repelling pests.",
      shortDescription: "Compact English lavender with fragrant blooms",
      price: 8.99,
      imageUrl: "https://images.unsplash.com/photo-1595771805070-fdf2e7cd5050?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1595771805070-fdf2e7cd5050?w=800&auto=format&fit=crop&q=80"],
      videoUrl: "https://player.vimeo.com/video/321789654",
      categoryId: 7,
      sku: "LAV-ENG-001",
      stock: 85,
      featured: true,
      rating: 4.7,
      reviewCount: 156,
      tags: ["english", "fragrant", "attracts pollinators", "pest repellent"],
      botanicalName: "Lavandula angustifolia",
      difficulty: "Easy",
      sunRequirement: "Full Sun",
      waterRequirement: "Low",
      dimensions: "12-18 inches tall",
      weight: 0.5
    },

    // Succulents (Category 8)
    {
      name: "Echeveria 'Blue Prince'",
      slug: "echeveria-blue-prince",
      description: "Stunning blue-purple rosettes with compact growth habit. Perfect for containers, rock gardens, or succulent arrangements. Low water needs and easy care.",
      shortDescription: "Blue-purple succulent rosettes for containers",
      price: 12.99,
      imageUrl: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&auto=format&fit=crop&q=80"],
      categoryId: 8,
      sku: "ECH-BLU-001",
      stock: 65,
      featured: true,
      rating: 4.8,
      reviewCount: 134,
      tags: ["blue-purple", "rosettes", "low water", "arrangements"],
      botanicalName: "Echeveria 'Blue Prince'",
      difficulty: "Easy",
      sunRequirement: "Bright Light",
      waterRequirement: "Low",
      dimensions: "4-6 inches diameter",
      weight: 0.3
    },

    // Fruit Trees (Category 9)
    {
      name: "Dwarf Apple Tree 'Honeycrisp'",
      slug: "dwarf-apple-tree-honeycrisp",
      description: "Popular dwarf apple variety perfect for small spaces. Produces crisp, sweet apples with excellent storage quality. Self-pollinating and container-friendly.",
      shortDescription: "Dwarf apple tree perfect for small spaces",
      price: 89.99,
      comparePrice: 119.99,
      imageUrl: "https://images.unsplash.com/photo-1572915904405-c13b2eecfac7?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1572915904405-c13b2eecfac7?w=800&auto=format&fit=crop&q=80"],
      videoUrl: "https://player.vimeo.com/video/987321654",
      categoryId: 9,
      sku: "APP-HON-001",
      stock: 25,
      featured: true,
      rating: 4.9,
      reviewCount: 89,
      tags: ["dwarf", "self-pollinating", "container friendly", "crisp"],
      botanicalName: "Malus domestica",
      difficulty: "Intermediate",
      sunRequirement: "Full Sun",
      waterRequirement: "Regular",
      dimensions: "6-8 feet tall",
      weight: 15.0
    },

    // Organic Fertilizers (Category 10)
    {
      name: "All-Purpose Organic Compost 40lb",
      slug: "all-purpose-organic-compost-40lb",
      description: "Premium aged compost made from organic materials. Improves soil structure, water retention, and nutrient content. Perfect for vegetable gardens, flower beds, and container plants.",
      shortDescription: "Premium aged organic compost for all plants",
      price: 16.99,
      comparePrice: 22.99,
      imageUrl: "https://images.unsplash.com/photo-1595771805070-fdf2e7cd5050?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1595771805070-fdf2e7cd5050?w=800&auto=format&fit=crop&q=80"],
      categoryId: 10,
      sku: "COM-ALL-001",
      stock: 150,
      featured: true,
      rating: 4.6,
      reviewCount: 234,
      tags: ["organic", "aged", "soil improvement", "water retention"],
      difficulty: "N/A",
      sunRequirement: "N/A",
      waterRequirement: "N/A",
      dimensions: "40 lb bag",
      weight: 40.0
    },

    // Additional Vegetables (Category 1) - Expanding to 200+ products
    {
      name: "Black Krim Heirloom Tomato",
      slug: "black-krim-heirloom-tomato",
      description: "Deep purple-black Russian heirloom with complex smoky flavor. Large beefsteak-type fruits perfect for slicing. Rich, wine-like taste sets this variety apart.",
      shortDescription: "Russian heirloom tomato with smoky flavor",
      price: 4.75,
      imageUrl: "https://images.unsplash.com/photo-1561136594-7f68413baa99?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1561136594-7f68413baa99?w=800&auto=format&fit=crop&q=80"],
      categoryId: 1,
      sku: "TOM-BLA-001",
      stock: 85,
      featured: false,
      rating: 4.8,
      reviewCount: 167,
      tags: ["heirloom", "russian", "smoky flavor", "beefsteak"],
      botanicalName: "Solanum lycopersicum",
      difficulty: "Intermediate",
      sunRequirement: "Full Sun",
      waterRequirement: "Regular",
      dimensions: "6-8 feet tall",
      weight: 0.1
    },
    {
      name: "Rainbow Swiss Chard",
      slug: "rainbow-swiss-chard",
      description: "Colorful stems in red, yellow, orange, and pink make this both beautiful and nutritious. Both leaves and stems are edible. Continuous harvest variety.",
      shortDescription: "Colorful chard with edible stems and leaves",
      price: 3.25,
      imageUrl: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&auto=format&fit=crop&q=80"],
      videoUrl: "https://player.vimeo.com/video/147258369",
      categoryId: 1,
      sku: "CHA-RAI-001",
      stock: 145,
      featured: true,
      rating: 4.6,
      reviewCount: 198,
      tags: ["colorful", "edible stems", "continuous harvest", "nutritious"],
      botanicalName: "Beta vulgaris",
      difficulty: "Easy",
      sunRequirement: "Full Sun to Partial Shade",
      waterRequirement: "Regular",
      dimensions: "18-24 inches tall",
      weight: 0.02
    },
    {
      name: "Japanese Long Cucumber",
      slug: "japanese-long-cucumber",
      description: "Thin-skinned, nearly seedless cucumbers up to 18 inches long. Crisp texture and mild flavor. Perfect for fresh eating and Asian cuisine.",
      shortDescription: "Long, thin-skinned cucumbers for fresh eating",
      price: 3.99,
      imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop&q=80"],
      categoryId: 1,
      sku: "CUC-JAP-001",
      stock: 120,
      featured: false,
      rating: 4.7,
      reviewCount: 89,
      tags: ["thin-skinned", "seedless", "asian cuisine", "crisp"],
      botanicalName: "Cucumis sativus",
      difficulty: "Intermediate",
      sunRequirement: "Full Sun",
      waterRequirement: "Regular",
      dimensions: "Climbing vine to 6 feet",
      weight: 0.03
    },

    // More Indoor Plants (Category 2)
    {
      name: "Bird of Paradise 'Strelitzia'",
      slug: "bird-of-paradise-strelitzia",
      description: "Dramatic tropical plant with large paddle-shaped leaves. Can produce orange and blue bird-like flowers indoors with proper care. Statement piece for bright rooms.",
      shortDescription: "Tropical plant with large paddle-shaped leaves",
      price: 55.99,
      comparePrice: 75.99,
      imageUrl: "https://images.unsplash.com/photo-1509423350716-97f2360af9a4?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1509423350716-97f2360af9a4?w=800&auto=format&fit=crop&q=80"],
      videoUrl: "https://player.vimeo.com/video/258147369",
      categoryId: 2,
      sku: "BIR-PAR-001",
      stock: 15,
      featured: true,
      rating: 4.5,
      reviewCount: 78,
      tags: ["tropical", "statement plant", "large leaves", "flowering"],
      botanicalName: "Strelitzia reginae",
      difficulty: "Intermediate",
      sunRequirement: "Bright Indirect Light",
      waterRequirement: "Weekly",
      dimensions: "6-8 feet indoors",
      weight: 8.5
    },
    {
      name: "Philodendron 'Pink Princess'",
      slug: "philodendron-pink-princess",
      description: "Rare variegated philodendron with stunning pink and green leaves. Each leaf is unique with different patterns. Highly sought-after collector's plant.",
      shortDescription: "Rare philodendron with pink and green variegation",
      price: 89.99,
      comparePrice: 129.99,
      imageUrl: "https://images.unsplash.com/photo-1586093021710-3c5dd9bd1e06?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1586093021710-3c5dd9bd1e06?w=800&auto=format&fit=crop&q=80"],
      categoryId: 2,
      sku: "PHI-PIN-001",
      stock: 8,
      featured: true,
      rating: 4.9,
      reviewCount: 145,
      tags: ["rare", "variegated", "collector", "pink"],
      botanicalName: "Philodendron erubescens",
      difficulty: "Intermediate",
      sunRequirement: "Bright Indirect Light",
      waterRequirement: "Weekly",
      dimensions: "Climbing to 6 feet",
      weight: 1.2
    },

    // More Garden Tools (Category 3)
    {
      name: "Ergonomic Garden Spade",
      slug: "ergonomic-garden-spade",
      description: "D-handle spade with ergonomic design reduces strain on back and wrists. Sharp steel blade cuts through tough soil and roots. Lifetime handle warranty.",
      shortDescription: "Ergonomic spade reduces strain and fatigue",
      price: 42.99,
      imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80"],
      categoryId: 3,
      sku: "SPA-ERG-001",
      stock: 55,
      featured: false,
      rating: 4.7,
      reviewCount: 203,
      tags: ["ergonomic", "d-handle", "lifetime warranty", "steel blade"],
      difficulty: "N/A",
      sunRequirement: "N/A",
      waterRequirement: "N/A",
      dimensions: "40 inches long",
      weight: 2.2
    },
    {
      name: "Professional Soil Thermometer",
      slug: "professional-soil-thermometer",
      description: "Accurate soil thermometer with 6-inch probe. Essential for timing seed planting and monitoring compost temperatures. Easy-to-read dial display.",
      shortDescription: "Accurate thermometer for soil temperature monitoring",
      price: 18.99,
      imageUrl: "https://images.unsplash.com/photo-1615232428120-9aa7ce2ab176?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1615232428120-9aa7ce2ab176?w=800&auto=format&fit=crop&q=80"],
      categoryId: 3,
      sku: "THR-PRO-001",
      stock: 95,
      featured: false,
      rating: 4.4,
      reviewCount: 167,
      tags: ["accurate", "6-inch probe", "seed timing", "compost monitoring"],
      difficulty: "N/A",
      sunRequirement: "N/A",
      waterRequirement: "N/A",
      dimensions: "8 inches long",
      weight: 0.3
    },

    // More Flowers (Category 4)
    {
      name: "Cosmos 'Sensation Mix'",
      slug: "cosmos-sensation-mix",
      description: "Large daisy-like flowers in pink, white, and crimson. Self-seeding annual that attracts butterflies and beneficial insects. Excellent cut flower.",
      shortDescription: "Large daisy-like flowers that attract butterflies",
      price: 2.49,
      imageUrl: "https://images.unsplash.com/photo-1597848212624-e6ec2d97d05e?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1597848212624-e6ec2d97d05e?w=800&auto=format&fit=crop&q=80"],
      categoryId: 4,
      sku: "COS-SEN-001",
      stock: 185,
      featured: false,
      rating: 4.6,
      reviewCount: 234,
      tags: ["self-seeding", "butterflies", "beneficial insects", "cut flower"],
      botanicalName: "Cosmos bipinnatus",
      difficulty: "Easy",
      sunRequirement: "Full Sun",
      waterRequirement: "Low",
      dimensions: "3-4 feet tall",
      weight: 0.01
    },
    {
      name: "Marigold 'French Petite Mix'",
      slug: "marigold-french-petite-mix",
      description: "Compact marigolds with double flowers in yellow, orange, and red. Natural pest deterrent for vegetable gardens. Blooms all season long.",
      shortDescription: "Compact pest-deterrent marigolds with double flowers",
      price: 2.25,
      imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=80"],
      videoUrl: "https://player.vimeo.com/video/369147258",
      categoryId: 4,
      sku: "MAR-FRE-001",
      stock: 225,
      featured: true,
      rating: 4.7,
      reviewCount: 189,
      tags: ["compact", "pest deterrent", "double flowers", "all season"],
      botanicalName: "Tagetes patula",
      difficulty: "Easy",
      sunRequirement: "Full Sun",
      waterRequirement: "Regular",
      dimensions: "8-10 inches tall",
      weight: 0.01
    },

    // More Pots & Planters (Category 5)
    {
      name: "Fabric Grow Bags Set of 5",
      slug: "fabric-grow-bags-set-of-5",
      description: "Breathable fabric pots promote healthy root development. Set includes 5 different sizes from 1 to 10 gallons. Reusable and foldable for easy storage.",
      shortDescription: "Breathable fabric pots in 5 different sizes",
      price: 29.99,
      comparePrice: 39.99,
      imageUrl: "https://images.unsplash.com/photo-1493400448374-3b3e5ab7e0fa?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1493400448374-3b3e5ab7e0fa?w=800&auto=format&fit=crop&q=80"],
      categoryId: 5,
      sku: "FAB-GRO-001",
      stock: 125,
      featured: true,
      rating: 4.8,
      reviewCount: 312,
      tags: ["breathable", "root development", "5 sizes", "reusable"],
      difficulty: "N/A",
      sunRequirement: "N/A",
      waterRequirement: "N/A",
      dimensions: "1-10 gallon sizes",
      weight: 1.2
    },
    {
      name: "Wooden Cedar Planter Box",
      slug: "wooden-cedar-planter-box",
      description: "Natural cedar construction resists rot and insects. Perfect for herbs, vegetables, or flowers. Includes liner and drainage system for optimal plant health.",
      shortDescription: "Natural cedar planter with drainage system",
      price: 78.99,
      comparePrice: 99.99,
      imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80"],
      videoUrl: "https://player.vimeo.com/video/741852963",
      categoryId: 5,
      sku: "WOO-CED-001",
      stock: 25,
      featured: true,
      rating: 4.6,
      reviewCount: 156,
      tags: ["cedar", "rot resistant", "drainage system", "liner included"],
      difficulty: "N/A",
      sunRequirement: "N/A",
      waterRequirement: "N/A",
      dimensions: "36 x 12 x 12 inches",
      weight: 18.5
    },

    // More Seeds (Category 6)
    {
      name: "Wildflower Meadow Mix",
      slug: "wildflower-meadow-mix",
      description: "Native wildflower blend creates natural meadow habitat. Attracts butterflies, bees, and beneficial insects. Low maintenance once established.",
      shortDescription: "Native wildflower mix for natural meadows",
      price: 12.99,
      imageUrl: "https://images.unsplash.com/photo-1597848212624-e6ec2d97d05e?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1597848212624-e6ec2d97d05e?w=800&auto=format&fit=crop&q=80"],
      categoryId: 6,
      sku: "WIL-MEA-001",
      stock: 165,
      featured: true,
      rating: 4.7,
      reviewCount: 289,
      tags: ["native", "butterflies", "bees", "low maintenance"],
      difficulty: "Easy",
      sunRequirement: "Full Sun",
      waterRequirement: "Low",
      dimensions: "Covers 100 sq ft",
      weight: 0.1
    },
    {
      name: "Microgreens Starter Kit",
      slug: "microgreens-starter-kit",
      description: "Complete kit for growing nutrient-dense microgreens indoors. Includes 10 varieties of seeds, growing trays, and instructions. Harvest in 7-14 days.",
      shortDescription: "Complete kit for growing microgreens indoors",
      price: 24.99,
      comparePrice: 34.99,
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80"],
      videoUrl: "https://player.vimeo.com/video/852741963",
      categoryId: 6,
      sku: "MIC-STA-001",
      stock: 95,
      featured: true,
      rating: 4.9,
      reviewCount: 234,
      tags: ["microgreens", "indoor growing", "10 varieties", "quick harvest"],
      difficulty: "Easy",
      sunRequirement: "Indirect Light",
      waterRequirement: "Daily misting",
      dimensions: "Kit covers 10x20 inch tray",
      weight: 0.8
    },

    // More Herbs (Category 7)
    {
      name: "Rosemary 'Tuscan Blue'",
      slug: "rosemary-tuscan-blue",
      description: "Upright rosemary with intense flavor and blue flowers. Excellent for culinary use and as an ornamental plant. Drought tolerant once established.",
      shortDescription: "Upright rosemary with intense flavor",
      price: 6.99,
      imageUrl: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=800&auto=format&fit=crop&q=80"],
      categoryId: 7,
      sku: "ROS-TUS-001",
      stock: 75,
      featured: false,
      rating: 4.8,
      reviewCount: 167,
      tags: ["upright", "intense flavor", "blue flowers", "drought tolerant"],
      botanicalName: "Rosmarinus officinalis",
      difficulty: "Easy",
      sunRequirement: "Full Sun",
      waterRequirement: "Low",
      dimensions: "3-4 feet tall",
      weight: 0.6
    },
    {
      name: "Thyme 'French Summer'",
      slug: "thyme-french-summer",
      description: "Classic culinary thyme with small aromatic leaves. Essential for French cuisine and herb blends. Forms low spreading mats with tiny white flowers.",
      shortDescription: "Classic culinary thyme for French cuisine",
      price: 4.99,
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80"],
      categoryId: 7,
      sku: "THY-FRE-001",
      stock: 145,
      featured: false,
      rating: 4.6,
      reviewCount: 198,
      tags: ["culinary", "french cuisine", "aromatic", "spreading"],
      botanicalName: "Thymus vulgaris",
      difficulty: "Easy",
      sunRequirement: "Full Sun",
      waterRequirement: "Low",
      dimensions: "6-8 inches tall",
      weight: 0.2
    },

    // More Succulents (Category 8)
    {
      name: "Jade Plant 'Crassula Ovata'",
      slug: "jade-plant-crassula-ovata",
      description: "Classic succulent with thick, glossy leaves. Easy to propagate and can live for decades with proper care. Brings good luck according to feng shui.",
      shortDescription: "Classic succulent with thick glossy leaves",
      price: 15.99,
      imageUrl: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&auto=format&fit=crop&q=80"],
      categoryId: 8,
      sku: "JAD-OVA-001",
      stock: 85,
      featured: false,
      rating: 4.7,
      reviewCount: 234,
      tags: ["classic", "easy propagation", "long-lived", "feng shui"],
      botanicalName: "Crassula ovata",
      difficulty: "Easy",
      sunRequirement: "Bright Light",
      waterRequirement: "Low",
      dimensions: "3-6 feet indoors",
      weight: 1.5
    },
    {
      name: "Succulent Garden Collection",
      slug: "succulent-garden-collection",
      description: "Curated collection of 6 different succulent varieties in 2-inch pots. Perfect for creating arrangements or starting a succulent garden. Low maintenance plants.",
      shortDescription: "Collection of 6 different succulent varieties",
      price: 34.99,
      comparePrice: 49.99,
      imageUrl: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&auto=format&fit=crop&q=80"],
      videoUrl: "https://player.vimeo.com/video/963852741",
      categoryId: 8,
      sku: "SUC-GAR-001",
      stock: 45,
      featured: true,
      rating: 4.9,
      reviewCount: 345,
      tags: ["collection", "6 varieties", "arrangements", "low maintenance"],
      difficulty: "Easy",
      sunRequirement: "Bright Light",
      waterRequirement: "Low",
      dimensions: "2-inch pots",
      weight: 1.8
    },

    // More Fruit Trees (Category 9)
    {
      name: "Dwarf Lemon Tree 'Meyer'",
      slug: "dwarf-lemon-tree-meyer",
      description: "Compact Meyer lemon tree perfect for containers. Sweet, thin-skinned lemons year-round. Fragrant white flowers add beauty to patios and indoor spaces.",
      shortDescription: "Compact Meyer lemon tree for containers",
      price: 79.99,
      comparePrice: 99.99,
      imageUrl: "https://images.unsplash.com/photo-1572915904405-c13b2eecfac7?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1572915904405-c13b2eecfac7?w=800&auto=format&fit=crop&q=80"],
      videoUrl: "https://player.vimeo.com/video/123654789",
      categoryId: 9,
      sku: "LEM-MEY-001",
      stock: 35,
      featured: true,
      rating: 4.8,
      reviewCount: 156,
      tags: ["dwarf", "container friendly", "year-round fruit", "fragrant flowers"],
      botanicalName: "Citrus × meyeri",
      difficulty: "Intermediate",
      sunRequirement: "Full Sun",
      waterRequirement: "Regular",
      dimensions: "4-6 feet tall",
      weight: 12.0
    },
    {
      name: "Blueberry Bush 'Patriot'",
      slug: "blueberry-bush-patriot",
      description: "Cold-hardy blueberry variety with large, sweet berries. Self-pollinating but produces more fruit with cross-pollination. Beautiful fall foliage adds ornamental value.",
      shortDescription: "Cold-hardy blueberry with large sweet berries",
      price: 24.99,
      imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80"],
      categoryId: 9,
      sku: "BLU-PAT-001",
      stock: 65,
      featured: false,
      rating: 4.7,
      reviewCount: 189,
      tags: ["cold-hardy", "self-pollinating", "large berries", "fall foliage"],
      botanicalName: "Vaccinium corymbosum",
      difficulty: "Intermediate",
      sunRequirement: "Full Sun to Partial Shade",
      waterRequirement: "Regular",
      dimensions: "4-6 feet tall",
      weight: 3.5
    },

    // More Organic Fertilizers (Category 10)
    {
      name: "Worm Castings 15lb",
      slug: "worm-castings-15lb",
      description: "Pure earthworm castings provide gentle, slow-release nutrition. Improves soil structure and water retention. Safe for all plants including seedlings.",
      shortDescription: "Pure earthworm castings for gentle nutrition",
      price: 19.99,
      imageUrl: "https://images.unsplash.com/photo-1595771805070-fdf2e7cd5050?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1595771805070-fdf2e7cd5050?w=800&auto=format&fit=crop&q=80"],
      categoryId: 10,
      sku: "WOR-CAS-001",
      stock: 95,
      featured: false,
      rating: 4.8,
      reviewCount: 267,
      tags: ["pure", "slow-release", "soil improvement", "safe for seedlings"],
      difficulty: "N/A",
      sunRequirement: "N/A",
      waterRequirement: "N/A",
      dimensions: "15 lb bag",
      weight: 15.0
    },
    {
      name: "Kelp Meal Organic Fertilizer 5lb",
      slug: "kelp-meal-organic-fertilizer-5lb",
      description: "Sustainably harvested kelp meal provides trace minerals and growth hormones. Enhances plant vigor and stress resistance. Excellent for root development.",
      shortDescription: "Kelp meal fertilizer with trace minerals",
      price: 14.99,
      imageUrl: "https://images.unsplash.com/photo-1595771805070-fdf2e7cd5050?w=800&auto=format&fit=crop&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1595771805070-fdf2e7cd5050?w=800&auto=format&fit=crop&q=80"],
      categoryId: 10,
      sku: "KEL-MEA-001",
      stock: 125,
      featured: false,
      rating: 4.6,
      reviewCount: 145,
      tags: ["sustainable", "trace minerals", "growth hormones", "stress resistance"],
      difficulty: "N/A",
      sunRequirement: "N/A",
      waterRequirement: "N/A",
      dimensions: "5 lb bag",
      weight: 5.0
    }
  ];

  private slugify(str: string) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.blogPosts = new Map();
    this.comments = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.testimonials = new Map();
    this.cartItems = new Map();

    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.productIdCounter = 1;
    this.blogPostIdCounter = 1;
    this.commentIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;
    this.testimonialIdCounter = 1;
    this.cartItemIdCounter = 1;

    // Initialize with sample data
    this.initSampleData();
  }

  private initSampleData() {
    // Create admin user
    this.createUser({
      username: "admin",
      password: "adminpassword", // In a real app, this would be hashed
      email: "admin@okkyno.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin"
    });

    // Create sample categories
    this.sampleCategories.forEach(category => this.createCategory(category));

    // Create sample products with real plant images
    this.createProduct({
      name: "Fiddle Leaf Fig",
      slug: "fiddle-leaf-fig",
      description: "A stunning statement plant with large, violin-shaped leaves. Perfect for bright, indirect light and makes an excellent focal point in any room.",
      shortDescription: "Statement plant with violin-shaped leaves",
      price: 89.99,
      comparePrice: 109.99,
      imageUrl: "https://images.unsplash.com/photo-1586093248106-bbf80d13b57f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"],
      categoryId: 2, // Indoor Plants
      sku: "PLANT-FLF-001",
      stock: 25,
      featured: true,
      rating: 4.8,
      reviewCount: 127
    });

    this.createProduct({
      name: "Monstera Deliciosa",
      slug: "monstera-deliciosa",
      description: "The beloved Swiss Cheese Plant with its iconic split leaves. Fast-growing and perfect for creating a tropical atmosphere in your home.",
      shortDescription: "Swiss Cheese Plant with split leaves",
      price: 45.99,
      comparePrice: 59.99,
      imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1606660265514-358ebbadc80d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"],
      categoryId: 2, // Indoor Plants
      sku: "PLANT-MON-001",
      stock: 40,
      featured: true,
      rating: 4.7,
      reviewCount: 89
    });

    this.createProduct({
      name: "Snake Plant (Sansevieria)",
      slug: "snake-plant-sansevieria",
      description: "The ultimate low-maintenance plant. Thrives in low light and requires minimal watering. Perfect for beginners and busy plant parents.",
      shortDescription: "Low-maintenance plant for any environment",
      price: 32.99,
      comparePrice: null,
      imageUrl: "https://images.unsplash.com/photo-1631377819268-d7f921975224?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1572688484438-313a6e50c333?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"],
      categoryId: 2, // Indoor Plants
      sku: "PLANT-SNK-001",
      stock: 60,
      featured: true,
      rating: 4.9,
      reviewCount: 203
    });

    this.createProduct({
      name: "Peace Lily",
      slug: "peace-lily",
      description: "Elegant white flowers and glossy green leaves make this a perfect choice for offices and homes. Air-purifying and tolerates low light.",
      shortDescription: "Elegant flowering plant with air-purifying qualities",
      price: 28.99,
      comparePrice: null,
      imageUrl: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      imageUrls: ["https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"],
      categoryId: 2, // Indoor Plants
      sku: "PLANT-PCE-001",
      stock: 35,
      featured: false,
      rating: 4.6,
      reviewCount: 156
    });

    this.createProduct({
      name: "ZZ Plant (Zamioculcas zamiifolia)",
      slug: "zz-plant",
      description: "Glossy, dark green leaves and extreme drought tolerance make this the perfect plant for travelers and those new to plant care.",
      shortDescription: "Drought-tolerant plant with glossy leaves",
      price: 39.99,
      comparePrice: 49.99,
      imageUrl: "https://images.unsplash.com/photo-1597798641621-0e3c8c204c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      imageUrls: [],
      categoryId: 2, // Indoor Plants
      sku: "PLANT-ZZ-001",
      stock: 45,
      featured: false,
      rating: 4.8,
      reviewCount: 134
    });

    this.createProduct({
      name: "Premium Pruning Shears",
      slug: "premium-pruning-shears",
      description: "Professional-grade pruning shears with ergonomic handles. Sharp, durable stainless steel blades that stay sharp through heavy use.",
      shortDescription: "Professional-grade pruning shears for your garden",
      price: 24.99,
      comparePrice: 32.99,
      imageUrl: "https://images.unsplash.com/photo-1589111118344-fe616859d7a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      imageUrls: [],
      categoryId: 3, // Garden Tools category
      sku: "TOOL-PRU-001",
      stock: 75,
      featured: true,
      rating: 5.0,
      reviewCount: 128
    });

    this.createProduct({
      name: "Monstera Deliciosa Plant",
      slug: "monstera-deliciosa-plant",
      description: "Popular, easy-to-grow houseplant with distinctive split leaves. Great for adding a tropical feel to any room. Prefers indirect light.",
      shortDescription: "Popular houseplant with distinctive split leaves",
      price: 39.99,
      comparePrice: null,
      imageUrl: "https://images.unsplash.com/photo-1575224526242-5f04e45d14bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      imageUrls: [],
      categoryId: 2, // Indoor Plants category
      sku: "PLANT-IND-001",
      stock: 30,
      featured: true,
      rating: 4.0,
      reviewCount: 76
    });

    this.createProduct({
      name: "Ceramic Plant Pot - White",
      slug: "ceramic-plant-pot-white",
      description: "Elegant white ceramic plant pot with drainage hole and saucer. Suitable for indoor use. Perfect for small to medium plants.",
      shortDescription: "Elegant white ceramic pot for indoor plants",
      price: 18.99,
      comparePrice: null,
      imageUrl: "https://images.unsplash.com/photo-1572688484438-313a6e50c333?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      imageUrls: [],
      categoryId: 5, // Pots & Planters category
      sku: "POT-CER-001",
      stock: 50,
      featured: true,
      rating: 4.5,
      reviewCount: 54
    });

    // Additional sample products
    this.createProduct({
      name: "Deluxe Garden Trowel",
      slug: "deluxe-garden-trowel",
      description: "Sturdy stainless steel trowel with ergonomic handle for easy digging and planting.",
      shortDescription: "Stainless steel garden trowel",
      price: 14.99,
      comparePrice: 19.99,
      imageUrl: "https://images.unsplash.com/photo-1583244493066-4bbf37da8c8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      imageUrls: [],
      categoryId: 3, // Garden Tools category
      sku: "TOOL-TRO-002",
      stock: 40,
      featured: false,
      rating: 4.7,
      reviewCount: 98
    });

    this.createProduct({
      name: "Tomato Seedling Starter Kit",
      slug: "tomato-seedling-starter-kit",
      description: "All-in-one kit to start tomato seedlings indoors including tray, dome and soil pellets.",
      shortDescription: "Complete kit for starting tomatoes",
      price: 12.99,
      comparePrice: null,
      imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c82?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      imageUrls: [],
      categoryId: 6, // Seeds category
      sku: "SEED-KIT-001",
      stock: 60,
      featured: false,
      rating: 4.2,
      reviewCount: 21
    });

    this.createProduct({
      name: "Snake Plant - Sansevieria",
      slug: "snake-plant-sansevieria",
      description: "Low-maintenance houseplant that thrives in low light conditions.",
      shortDescription: "Hardy houseplant for low light",
      price: 24.5,
      comparePrice: null,
      imageUrl: "https://images.unsplash.com/photo-1510626176961-4b5323c8fecc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      imageUrls: [],
      categoryId: 2, // Indoor Plants category
      sku: "PLANT-IND-002",
      stock: 80,
      featured: false,
      rating: 4.8,
      reviewCount: 110
    });

    this.createProduct({
      name: "Terracotta Pot Set (3 Pack)",
      slug: "terracotta-pot-set-3-pack",
      description: "Classic terracotta pots with drainage holes, perfect for herbs and succulents.",
      shortDescription: "Set of 3 terracotta pots",
      price: 16.99,
      comparePrice: 21.99,
      imageUrl: "https://images.unsplash.com/photo-1585238342023-c7906dc93c7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      imageUrls: [],
      categoryId: 5, // Pots & Planters category
      sku: "POT-TER-003",
      stock: 90,
      featured: false,
      rating: 4.3,
      reviewCount: 37
    });

    // Create comprehensive products from Epic Gardening inspired database
    for (const productData of this.comprehensiveProducts) {
      this.createProduct(productData);
    }

    // Create sample blog posts
    this.createBlogPost({
      title: "How to Start a Vegetable Garden: Complete Guide for Beginners",
      slug: "how-to-start-vegetable-garden-guide-beginners",
      content: `<p>Starting a vegetable garden can be a rewarding experience that provides fresh produce and a connection to the growing process. This guide will walk you through everything you need to know to get started.</p>
      <h2>Choosing the Right Location</h2>
      <p>Most vegetables need at least 6-8 hours of direct sunlight daily. Choose a spot in your yard that gets plenty of sun and has good drainage. Avoid areas that are too windy or prone to flooding.</p>
      <h2>Planning Your Garden</h2>
      <p>Start small with just a few types of vegetables. Consider what your family enjoys eating and what grows well in your climate. Draw a simple layout of your garden beds.</p>
      <h2>Preparing the Soil</h2>
      <p>Good soil is the foundation of a successful garden. Test your soil to determine its pH and nutrient levels. Add compost or other organic matter to improve soil structure and fertility.</p>
      <h2>Planting</h2>
      <p>Follow the planting guidelines for each type of vegetable. Some plants, like tomatoes and peppers, are best started indoors and transplanted, while others, like carrots and beans, can be directly sown in the garden.</p>
      <h2>Watering and Maintenance</h2>
      <p>Most vegetables need about 1 inch of water per week. Water deeply but infrequently to encourage deep root growth. Mulch around plants to retain moisture and suppress weeds.</p>
      <h2>Harvesting</h2>
      <p>Harvest vegetables at their peak of ripeness for the best flavor. Regular harvesting often encourages plants to produce more.</p>
      <p>With a little planning and care, you'll be enjoying fresh vegetables from your garden in no time!</p>`,
      excerpt: "Learn everything you need to know about starting your first vegetable garden, from planning and soil preparation to harvesting.",
      imageUrl: "https://images.unsplash.com/photo-1527069438729-2eb562e7c9e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      authorId: 1,
      published: true
    });

    this.createBlogPost({
      title: "10 Low-Maintenance Indoor Plants That Purify Your Air",
      slug: "10-low-maintenance-indoor-plants-purify-air",
      content: `<p>Indoor plants not only add beauty to your home but can also improve air quality. Here are 10 easy-to-care-for plants that help purify the air.</p>
      <h2>1. Snake Plant (Sansevieria trifasciata)</h2>
      <p>Also known as mother-in-law's tongue, this plant is nearly indestructible. It thrives in low light and doesn't need frequent watering.</p>
      <h2>2. Spider Plant (Chlorophytum comosum)</h2>
      <p>A classic houseplant that produces baby plants you can propagate. It's non-toxic to pets and very forgiving of neglect.</p>
      <h2>3. Peace Lily (Spathiphyllum)</h2>
      <p>With elegant white flowers, peace lilies thrive in low light and help remove toxins like ammonia and formaldehyde.</p>
      <h2>4. ZZ Plant (Zamioculcas zamiifolia)</h2>
      <p>Glossy leaves and extreme drought tolerance make this perfect for busy schedules. It can survive weeks without water.</p>
      <h2>5. Rubber Plant (Ficus elastica)</h2>
      <p>Large, glossy leaves make a bold statement. It's forgiving and adapts well to various light conditions.</p>
      <h2>6. Pothos (Epipremnum aureum)</h2>
      <p>Trailing vines make this perfect for hanging baskets or shelves. It roots easily in water for propagation.</p>
      <h2>7. Philodendron</h2>
      <p>Heart-shaped leaves and low light tolerance make this a beginner favorite. Many varieties available.</p>
      <h2>8. Aloe Vera</h2>
      <p>Succulent that requires minimal water and provides natural healing gel for burns and cuts.</p>
      <h2>9. Boston Fern (Nephrolepis exaltata)</h2>
      <p>Adds lush texture and helps humidify dry indoor air. Perfect for bathrooms with natural light.</p>
      <h2>10. Chinese Evergreen (Aglaonema)</h2>
      <p>Colorful foliage patterns and low light tolerance. Available in many varieties with different leaf patterns.</p>
      <p>These plants require minimal care while providing maximum benefit to your indoor environment.</p>`,
      excerpt: "Discover beautiful houseplants that not only look great but also help clean the air in your home while requiring minimal care.",
      imageUrl: "https://images.unsplash.com/photo-1603436326446-e8beaa0c2956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      authorId: 1,
      published: true
    });

    this.createBlogPost({
      title: "The Ultimate Guide to Garden Soil Preparation and Amendments",
      slug: "ultimate-guide-garden-soil-preparation-amendments",
      content: `<p>Good soil is the foundation of a successful garden. This guide will help you understand, test, and improve your garden soil.</p>
      <h2>Understanding Soil Types</h2>
      <p>Soils generally fall into three categories: sandy, clay, and loam. Sandy soil drains quickly but doesn't hold nutrients well. Clay soil holds nutrients but can become waterlogged and compacted. Loam, a mix of sand, silt, and clay, is ideal for most garden plants.</p>
      <h2>Testing Your Soil</h2>
      <p>Before amending your soil, it's important to know what you're working with. A basic soil test will tell you the pH level and nutrient content. You can purchase a DIY kit or send a sample to your local extension office for a more detailed analysis.</p>
      <h2>Adjusting Soil pH</h2>
      <p>Most plants prefer a slightly acidic to neutral pH (6.0-7.0). To raise pH (make soil less acidic), add garden lime. To lower pH (make soil more acidic), add sulfur or organic materials like pine needles or coffee grounds.</p>
      <h2>Adding Organic Matter</h2>
      <p>Compost is the gardener's best friend. It improves soil structure, adds nutrients, and supports beneficial soil organisms. Aim to add a 2-3 inch layer of compost to your garden beds annually.</p>
      <h2>Other Soil Amendments</h2>
      <p><strong>For Sandy Soil:</strong> Add compost, coconut coir, or aged manure to improve water and nutrient retention.</p>
      <p><strong>For Clay Soil:</strong> Add compost, coarse sand, or gypsum to improve drainage and prevent compaction.</p>
      <p><strong>For Nutrient Deficiencies:</strong> Based on your soil test, you might need to add specific amendments like bone meal (for phosphorus) or greensand (for potassium).</p>
      <h2>When to Amend Soil</h2>
      <p>The best time to amend soil is in fall or early spring before planting. This gives amendments time to integrate into the soil.</p>
      <h2>Mulching</h2>
      <p>After planting, apply a 2-3 inch layer of mulch (like straw, wood chips, or shredded leaves) to conserve moisture, suppress weeds, and gradually add organic matter as it breaks down.</p>
      <p>Remember, building good soil is an ongoing process. With regular additions of organic matter and appropriate amendments, your garden soil will improve year after year.</p>`,
      excerpt: "Learn how to test, amend, and prepare your soil for optimal plant growth and a thriving garden this season.",
      imageUrl: "https://images.unsplash.com/photo-1601113286329-138a19a0db5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      authorId: 1,
      published: true
    });

    // Create sample testimonials
    this.createTestimonial({
      content: "I've been buying plants from Okkyno for over a year now and I'm always impressed with the quality. The tomato seedlings I purchased last spring produced the best harvest I've ever had!",
      rating: 5,
      customerName: "Sarah Johnson",
      customerTitle: "Home Gardener",
      customerImage: "https://randomuser.me/api/portraits/women/45.jpg"
    });

    this.createTestimonial({
      content: "The gardening tools I purchased from Okkyno are exceptional quality. The ergonomic design makes gardening much easier on my wrists and the customer service was fantastic when I had questions.",
      rating: 5,
      customerName: "Michael Chen",
      customerTitle: "Landscape Designer",
      customerImage: "https://randomuser.me/api/portraits/men/32.jpg"
    });

    this.createTestimonial({
      content: "As someone new to gardening, I really appreciate the detailed care instructions that come with every plant. The blog articles have also been incredibly helpful. My indoor garden is thriving thanks to Okkyno!",
      rating: 4,
      customerName: "Emily Rodriguez",
      customerTitle: "Indoor Plant Enthusiast",
      customerImage: "https://randomuser.me/api/portraits/women/68.jpg"
    });

    // Set all testimonials to approved
    this.testimonials.forEach((testimonial, id) => {
      this.approveTestimonial(id);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const newUser: User = {
      ...user,
      id,
      createdAt: now,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      role: user.role ?? "customer",
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const newCategory: Category = {
      ...category,
      id,
      description: category.description ?? null,
      imageUrl: category.imageUrl ?? null,
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id: number, categoryData: Partial<Category>): Promise<Category | undefined> {
    const category = await this.getCategory(id);
    if (!category) return undefined;

    const updatedCategory = { ...category, ...categoryData };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Product operations
  async getProducts(limit?: number, offset = 0): Promise<Product[]> {
    const products = Array.from(this.products.values());
    if (limit) {
      return products.slice(offset, offset + limit);
    }
    return products;
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId
    );
  }

  async getFeaturedProducts(limit?: number): Promise<Product[]> {
    const featuredProducts = Array.from(this.products.values()).filter(
      (product) => product.featured
    );
    if (limit) {
      return featuredProducts.slice(0, limit);
    }
    return featuredProducts;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        (product.description && product.description.toLowerCase().includes(lowercaseQuery)) ||
        (product.shortDescription && product.shortDescription.toLowerCase().includes(lowercaseQuery))
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const now = new Date();
    const newProduct: Product = {
      ...product,
      id,
      createdAt: now,
      description: product.description ?? null,
      shortDescription: product.shortDescription ?? null,
      comparePrice: product.comparePrice ?? null,
      imageUrl: product.imageUrl ?? null,
      imageUrls: product.imageUrls ?? [],
      videoUrl: product.videoUrl || null,
      videoUrls: product.videoUrls || [],
      featured: product.featured ?? false,
      rating: product.rating ?? 0,
      reviewCount: product.reviewCount ?? 0,
      stock: product.stock ?? 0,
      tags: product.tags ?? [],
      botanicalName: product.botanicalName ?? null,
      difficulty: product.difficulty ?? null,
      sunRequirement: product.sunRequirement ?? null,
      waterRequirement: product.waterRequirement ?? null,
      dimensions: product.dimensions ?? null,
      weight: product.weight ?? null,
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const product = await this.getProduct(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Blog operations
  async getBlogPosts(limit?: number, offset = 0, publishedOnly = true): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPosts.values());

    if (publishedOnly) {
      posts = posts.filter(post => post.published);
    }

    // Sort by creation date, newest first
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (limit) {
      return posts.slice(offset, offset + limit);
    }
    return posts;
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(
      (post) => post.slug === slug
    );
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostIdCounter++;
    const now = new Date();
    const newPost: BlogPost = {
      ...post,
      id,
      commentCount: 0,
      createdAt: now,
      updatedAt: now,
      excerpt: post.excerpt ?? null,
      imageUrl: post.imageUrl ?? null,
      published: post.published ?? false,
    };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  async updateBlogPost(id: number, postData: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const post = await this.getBlogPost(id);
    if (!post) return undefined;

    const updatedPost = {
      ...post,
      ...postData,
      updatedAt: new Date()
    };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // Comment operations
  async getCommentsByBlogPost(blogPostId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.blogPostId === blogPostId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const id = this.commentIdCounter++;
    const now = new Date();
    const newComment: Comment = { ...comment, id, createdAt: now };
    this.comments.set(id, newComment);

    // Update blog post comment count
    const post = await this.getBlogPost(comment.blogPostId);
    if (post) {
      await this.updateBlogPost(post.id, { commentCount: (post.commentCount ?? 0) + 1 });
    }

    return newComment;
  }

  async deleteComment(id: number): Promise<boolean> {
    const comment = this.comments.get(id);
    if (!comment) return false;

    // Update blog post comment count
    const post = await this.getBlogPost(comment.blogPostId);
    if (post) {
      await this.updateBlogPost(post.id, { commentCount: (post.commentCount ?? 0) - 1 });
    }

    return this.comments.delete(id);
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const now = new Date();
    const newOrder: Order = {
      ...order,
      id,
      createdAt: now,
      status: order.status ?? "pending",
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = await this.getOrder(id);
    if (!order) return undefined;

    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Order item operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId
    );
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemIdCounter++;
    const newItem: OrderItem = { ...item, id };
    this.orderItems.set(id, newItem);
    return newItem;
  }

  // Testimonial operations
  async getTestimonials(approvedOnly = true): Promise<Testimonial[]> {
    let testimonials = Array.from(this.testimonials.values());

    if (approvedOnly) {
      testimonials = testimonials.filter(testimonial => testimonial.approved);
    }

    return testimonials;
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialIdCounter++;
    const now = new Date();
    const newTestimonial: Testimonial = {
      ...testimonial,
      id,
      approved: false,
      createdAt: now,
      customerTitle: testimonial.customerTitle ?? null,
      customerImage: testimonial.customerImage ?? null,
    };
    this.testimonials.set(id, newTestimonial);
    return newTestimonial;
  }

  async approveTestimonial(id: number): Promise<Testimonial | undefined> {
    const testimonial = this.testimonials.get(id);
    if (!testimonial) return undefined;

    const updatedTestimonial = { ...testimonial, approved: true };
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    return this.testimonials.delete(id);
  }

  // Cart operations
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.sessionId === sessionId
    );
  }

  async getCartItem(sessionId: string, productId: number): Promise<CartItem | undefined> {
    return Array.from(this.cartItems.values()).find(
      (item) => item.sessionId === sessionId && item.productId === productId
    );
  }

  async addCartItem(item: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = await this.getCartItem(item.sessionId, item.productId);

    if (existingItem) {
      // Update quantity of existing item
      return this.updateCartItemQuantity(existingItem.id, existingItem.quantity + item.quantity) as Promise<CartItem>;
    }

    // Create new item
    const id = this.cartItemIdCounter++;
    const now = new Date();
    const newItem: CartItem = { ...item, id, createdAt: now };
    this.cartItems.set(id, newItem);
    return newItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;

    if (quantity <= 0) {
      this.cartItems.delete(id);
      return undefined;
    }

    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const cartItems = await this.getCartItems(sessionId);
    let success = true;

    for (const item of cartItems) {
      if (!this.cartItems.delete(item.id)) {
        success = false;
      }
    }

    return success;
  }
}

export const storage = new MemStorage();
