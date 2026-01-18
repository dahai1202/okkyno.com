import axios from 'axios';
import * as cheerio from 'cheerio';
import { storage } from './storage';
import { InsertProduct, InsertBlogPost, InsertCategory } from '@shared/schema';

export class AggressiveEpicScraper {
  private baseUrl = 'https://epicgardening.com';
  private scrapedUrls = new Set<string>();
  private delay = 1500;
  
  private async fetchWithRetry(url: string): Promise<string | null> {
    if (this.scrapedUrls.has(url)) return null;
    this.scrapedUrls.add(url);
    
    try {
      console.log(`Scraping: ${url}`);
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Referer': 'https://www.google.com/',
        },
        timeout: 20000,
      });
      
      await new Promise(resolve => setTimeout(resolve, this.delay));
      return response.data;
    } catch (error) {
      console.log(`Failed to fetch ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }

  private slugify(str: string): string {
    return str.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private extractPrice(text: string): number {
    const priceMatch = text.match(/\$?(\d+(?:\.\d{2})?)/);
    return priceMatch ? parseFloat(priceMatch[1]) : Math.random() * 50 + 10;
  }

  async scrapeSitemap(): Promise<string[]> {
    const sitemapUrls = [
      `${this.baseUrl}/sitemap.xml`,
      `${this.baseUrl}/sitemap_index.xml`,
      `${this.baseUrl}/post-sitemap.xml`,
      `${this.baseUrl}/page-sitemap.xml`
    ];
    
    const discoveredUrls: string[] = [];
    
    for (const sitemapUrl of sitemapUrls) {
      const content = await this.fetchWithRetry(sitemapUrl);
      if (content) {
        const $ = cheerio.load(content, { xmlMode: true });
        $('url loc, sitemap loc').each((_, element) => {
          const url = $(element).text().trim();
          if (url && url.includes('epicgardening.com')) {
            discoveredUrls.push(url);
          }
        });
      }
    }
    
    console.log(`Discovered ${discoveredUrls.length} URLs from sitemaps`);
    return discoveredUrls;
  }

  async scrapePageLinks(url: string): Promise<string[]> {
    const content = await this.fetchWithRetry(url);
    if (!content) return [];
    
    const $ = cheerio.load(content);
    const links: string[] = [];
    
    $('a[href]').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        let fullUrl = href;
        if (href.startsWith('/')) {
          fullUrl = this.baseUrl + href;
        }
        if (fullUrl.includes('epicgardening.com') && 
            (fullUrl.includes('/learn/') || 
             fullUrl.includes('/blog/') ||
             fullUrl.includes('/guide/') ||
             fullUrl.includes('/plant/') ||
             fullUrl.includes('/product/'))) {
          links.push(fullUrl);
        }
      }
    });
    
    return Array.from(new Set(links));
  }

  async extractBlogContent(url: string): Promise<void> {
    const content = await this.fetchWithRetry(url);
    if (!content) return;
    
    const $ = cheerio.load(content);
    
    const title = $('h1').first().text().trim() || 
                 $('title').text().replace(/\s*-\s*Epic Gardening.*/, '').trim();
    
    if (!title || title.length < 10) return;
    
    // Extract main content
    let articleContent = '';
    const contentSelectors = [
      'article .entry-content',
      '.post-content',
      '.content-area',
      'main .content',
      '.single-post-content'
    ];
    
    for (const selector of contentSelectors) {
      const contentEl = $(selector);
      if (contentEl.length) {
        articleContent = contentEl.html() || '';
        break;
      }
    }
    
    if (!articleContent) {
      articleContent = $('article').html() || $('main').html() || '';
    }
    
    const excerpt = $('meta[name="description"]').attr('content') || 
                   $('meta[property="og:description"]').attr('content') ||
                   articleContent.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
    
    const featuredImage = $('meta[property="og:image"]').attr('content') ||
                         $('.featured-image img').attr('src') ||
                         $('article img').first().attr('src') ||
                         'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&auto=format&fit=crop&q=80';
    
    try {
      const blogData: InsertBlogPost = {
        title,
        slug: this.slugify(title),
        content: articleContent || `<h1>${title}</h1><p>Comprehensive gardening guide covering ${title.toLowerCase()}.</p>`,
        excerpt,
        imageUrl: featuredImage.startsWith('http') ? featuredImage : `${this.baseUrl}${featuredImage}`,
        authorId: 1,
        published: true,
      };

      await storage.createBlogPost(blogData);
      console.log(`Created blog post: ${title}`);
    } catch (error) {
      console.log(`Blog post "${title}" may already exist`);
    }
  }

  async extractProductData(url: string): Promise<void> {
    const content = await this.fetchWithRetry(url);
    if (!content) return;
    
    const $ = cheerio.load(content);
    
    const name = $('.product-title, .entry-title, h1').first().text().trim();
    if (!name || name.length < 3) return;
    
    const description = $('.product-description, .entry-content, .product-content').first().text().trim() ||
                       `High-quality ${name.toLowerCase()} for your gardening needs.`;
    
    const priceText = $('.price, .woocommerce-Price-amount, .cost').first().text().trim();
    const price = this.extractPrice(priceText);
    
    const imageUrl = $('.product-image img, .featured-image img').first().attr('src') ||
                    $('meta[property="og:image"]').attr('content') ||
                    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80';
    
    const category = $('.product-category, .breadcrumb a').last().text().trim() || 'Garden Products';
    
    try {
      // Create category if it doesn't exist
      let categoryId = 1;
      try {
        const newCategory = await storage.createCategory({
          name: category,
          slug: this.slugify(category),
          description: `${category} for gardening enthusiasts`,
          imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80'
        });
        categoryId = newCategory.id;
      } catch {
        const existingCategory = await storage.getCategoryBySlug(this.slugify(category));
        if (existingCategory) categoryId = existingCategory.id;
      }
      
      const productData: InsertProduct = {
        name,
        slug: this.slugify(name),
        description: description.substring(0, 1000),
        shortDescription: description.substring(0, 150) + '...',
        price,
        comparePrice: price * 1.3,
        imageUrl: imageUrl.startsWith('http') ? imageUrl : `${this.baseUrl}${imageUrl}`,
        imageUrls: [imageUrl.startsWith('http') ? imageUrl : `${this.baseUrl}${imageUrl}`],
        videoUrl: undefined,
        videoUrls: [],
        categoryId,
        sku: `EG-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        stock: Math.floor(Math.random() * 50) + 10,
        featured: Math.random() > 0.8,
        rating: 4.0 + Math.random() * 1.0,
        reviewCount: Math.floor(Math.random() * 100) + 5,
        tags: name.toLowerCase().split(' ').slice(0, 4),
        difficulty: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
      };

      await storage.createProduct(productData);
      console.log(`Created product: ${name}`);
    } catch (error) {
      console.log(`Product "${name}" may already exist`);
    }
  }

  async generateComprehensiveEpicContent(): Promise<void> {
    console.log('Generating comprehensive Epic Gardening style content...');
    
    // Create comprehensive categories based on Epic Gardening's structure
    const epicCategories = [
      { name: "Vegetable Seeds", slug: "vegetable-seeds", description: "Heirloom and hybrid vegetable seeds" },
      { name: "Herb Seeds", slug: "herb-seeds", description: "Culinary and medicinal herb seeds" },
      { name: "Flower Seeds", slug: "flower-seeds", description: "Annual and perennial flower seeds" },
      { name: "Microgreen Seeds", slug: "microgreen-seeds", description: "Fast-growing microgreen varieties" },
      { name: "Sprouting Seeds", slug: "sprouting-seeds", description: "Seeds for sprouting and growing" },
      { name: "Cedar Raised Beds", slug: "cedar-raised-beds", description: "Premium cedar raised garden bed kits" },
      { name: "Metal Raised Beds", slug: "metal-raised-beds", description: "Durable galvanized metal raised beds" },
      { name: "Raised Bed Accessories", slug: "raised-bed-accessories", description: "Covers, irrigation, and accessories" },
      { name: "Grow Lights", slug: "grow-lights", description: "LED and fluorescent growing lights" },
      { name: "Seed Starting Trays", slug: "seed-starting-trays", description: "Professional seed starting systems" },
      { name: "Heat Mats", slug: "heat-mats", description: "Seedling heat mats for germination" },
      { name: "Grow Tents", slug: "grow-tents", description: "Indoor growing environments" },
      { name: "Hand Pruners", slug: "hand-pruners", description: "Professional pruning shears" },
      { name: "Garden Knives", slug: "garden-knives", description: "Harvest and utility knives" },
      { name: "Cultivators", slug: "cultivators", description: "Hand cultivators and weeders" },
      { name: "Measuring Tools", slug: "measuring-tools", description: "pH meters, thermometers, and gauges" }
    ];

    for (const category of epicCategories) {
      try {
        await storage.createCategory({
          ...category,
          imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80'
        });
        console.log(`Created category: ${category.name}`);
      } catch (error) {
        // Category may already exist
      }
    }

    // Generate extensive Epic Gardening style products
    const comprehensiveProducts = [
      "Purple Top Turnip Seeds", "Detroit Dark Red Beet Seeds", "Chioggia Beet Seeds",
      "Scarlet Nantes Carrot Seeds", "Cosmic Purple Carrot Seeds", "Paris Market Carrot Seeds",
      "Gourmet Gold Beet Seeds", "Bull's Blood Beet Seeds", "Rainbow Chard Seeds",
      "Fordhook Giant Chard Seeds", "Bright Lights Chard Seeds", "Ruby Red Chard Seeds",
      "Bloomsdale Spinach Seeds", "Space Spinach Seeds", "Giant Noble Spinach Seeds",
      "Red Kitten Spinach Seeds", "Malabar Spinach Seeds", "New Zealand Spinach Seeds",
      "Black Seeded Simpson Lettuce", "Buttercrunch Lettuce Seeds", "Red Sails Lettuce Seeds",
      "Tom Thumb Lettuce Seeds", "Oakleaf Lettuce Seeds", "Red Romaine Lettuce Seeds",
      "Genovese Basil Seeds", "Purple Ruffles Basil Seeds", "Lemon Basil Seeds",
      "Thai Basil Seeds", "Holy Basil Seeds", "African Blue Basil Seeds",
      "Common Thyme Seeds", "French Thyme Seeds", "Lemon Thyme Seeds",
      "Orange Thyme Seeds", "Creeping Thyme Seeds", "Winter Thyme Seeds"
    ];

    for (let i = 0; i < comprehensiveProducts.length; i++) {
      const productName = comprehensiveProducts[i];
      try {
        const productData: InsertProduct = {
          name: productName,
          slug: this.slugify(productName),
          description: `Premium ${productName.toLowerCase()} perfect for home gardening. These high-quality seeds produce excellent yields with superior flavor and disease resistance.`,
          shortDescription: `Premium ${productName.toLowerCase()} with excellent yields`,
          price: 2.99 + Math.random() * 7,
          comparePrice: undefined,
          imageUrl: `https://images.unsplash.com/photo-${1597254563670 + i}?w=800&auto=format&fit=crop&q=80`,
          imageUrls: [`https://images.unsplash.com/photo-${1597254563670 + i}?w=800&auto=format&fit=crop&q=80`],
          videoUrl: undefined,
          videoUrls: [],
          categoryId: Math.floor(Math.random() * 5) + 1, // Random category
          sku: `EG-${Date.now()}-${i.toString().padStart(3, '0')}`,
          stock: Math.floor(Math.random() * 100) + 20,
          featured: i < 10, // First 10 are featured
          rating: 4.0 + Math.random() * 1.0,
          reviewCount: Math.floor(Math.random() * 150) + 10,
          tags: productName.toLowerCase().split(' ').slice(0, 3),
          difficulty: ['Beginner', 'Intermediate'][Math.floor(Math.random() * 2)],
        };

        await storage.createProduct(productData);
        console.log(`Created comprehensive product ${i + 1}/${comprehensiveProducts.length}: ${productName}`);
      } catch (error) {
        console.log(`Product "${productName}" may already exist`);
      }
    }

    console.log('Comprehensive Epic Gardening content generation completed!');
  }

  async fullContentClone(): Promise<void> {
    console.log('Starting aggressive Epic Gardening content cloning...');
    
    try {
      // Step 1: Generate comprehensive Epic Gardening style content
      await this.generateComprehensiveEpicContent();
      
      // Step 2: Discover URLs from sitemap
      const discoveredUrls = await this.scrapeSitemap();
      
      // Step 3: Scrape blog content from discovered URLs
      const blogUrls = discoveredUrls.filter(url => 
        url.includes('/learn/') || 
        url.includes('/blog/') || 
        url.includes('/guide/')
      ).slice(0, 50); // Limit to 50 blog posts
      
      for (const url of blogUrls) {
        await this.extractBlogContent(url);
      }
      
      // Step 4: Scrape product content from discovered URLs
      const productUrls = discoveredUrls.filter(url => 
        url.includes('/product/') || 
        url.includes('/shop/')
      ).slice(0, 30); // Limit to 30 products
      
      for (const url of productUrls) {
        await this.extractProductData(url);
      }
      
      console.log('Aggressive Epic Gardening content cloning completed!');
      
    } catch (error) {
      console.error('Content cloning failed:', error instanceof Error ? error.message : 'Unknown error');
    }
  }
}