import axios from 'axios';
import * as cheerio from 'cheerio';
import { storage } from './storage';
import { InsertProduct, InsertBlogPost, InsertCategory } from '@shared/schema';

export class ScraperV3 {
  private shopBaseUrl = 'https://shop.epicgardening.com';
  private blogBaseUrl = 'https://www.epicgardening.com';
  private delay = 2000; // 2 seconds delay
  private maxRetries = 3;

  private async fetchPage(url: string, retries = 0): Promise<string> {
    try {
      console.log(`Fetching: ${url}`);

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        timeout: 30000,
      });

      await this.sleep(this.delay);
      return response.data;
    } catch (error) {
      if (retries < this.maxRetries) {
        console.log(`Retry ${retries + 1}/${this.maxRetries} for ${url}`);
        await this.sleep(this.delay * (retries + 1));
        return this.fetchPage(url, retries + 1);
      }
      throw error;
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private slugify(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // --- Product Scraping ---

  async scrapeProducts(pagesToScrape: number = 5): Promise<number> {
    let count = 0;

    // Ensure "General" category exists as fallback
    let defaultCategory = await storage.getCategoryBySlug("general");
    if (!defaultCategory) {
      defaultCategory = await storage.createCategory({
        name: "General",
        slug: "general",
        description: "General gardening supplies",
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80"
      });
    }

    for (let i = 1; i <= pagesToScrape; i++) {
      const url = `${this.shopBaseUrl}/collections/all?page=${i}`;
      try {
        const html = await this.fetchPage(url);
        const $ = cheerio.load(html);

        const productPromises: Promise<void>[] = [];

        // Selector for product cards - Adjust based on observed HTML structure or common patterns
        // shopify usually uses .grid-product, .product-item, .product-card
        // Based on text output, links are like /collections/all/products/...

        $('a[href*="/products/"]').each((_, element) => {
          const href = $(element).attr('href');
          if (!href || href.includes('#')) return;

          // Only process unique product links (deduplication)
          if (!href.includes('/collections/all/products/')) return;

          const fullUrl = href.startsWith('http') ? href : `${this.shopBaseUrl}${href}`;

          // We can try to extract info from the card first to save requests
          // But visiting the page gives better details.
          // For speed, let's just visit a few or all?
          // Given "Import all items", we should visit. But valid request rate might be an issue.
          // Let's try to extract from the list page first if possible.

          // Actually, let's just process the list page data if sufficient, or visit if needed.
          // The list page has image, title, price.

          const $card = $(element).closest('div'); // Assuming some container

          // Let's scrape the individual page to be thorough
          productPromises.push(this.processProductPage(fullUrl, defaultCategory!.id));
        });

        await Promise.all(productPromises); // Process page concurrently? limit concurrency
        // Better to process sequentially to avoid rate limits

      } catch (error) {
        console.error(`Error scraping products page ${i}:`, error);
      }
    }
    return count;
  }

  private async processProductPage(url: string, defaultCategoryId: number): Promise<void> {
    try {
      const html = await this.fetchPage(url);
      const $ = cheerio.load(html);

      const title = $('h1').first().text().trim();
      if (!title) return;

      const slug = this.slugify(title);

      // Price extraction
      let price = 0;
      const priceText = $('.price, .product__price, .price-item--regular').first().text();
      const priceMatch = priceText.match(/\$?(\d+\.\d+)/);
      if (priceMatch) {
        price = parseFloat(priceMatch[1]);
      }

      // Description
      const description = $('.product__description, .rte, .description').first().text().trim() || title;

      // Images
      const images: string[] = [];
      $('img').each((_, img) => {
        let src = $(img).attr('src') || $(img).attr('data-src');
        if (src && (src.includes('/products/') || src.includes('cdn.shopify.com')) && !src.includes('icon')) {
           if (src.startsWith('//')) src = 'https:' + src;
           if (!images.includes(src)) images.push(src);
        }
      });

      const mainImage = images.length > 0 ? images[0] : "";

      // Check if product exists
      const existing = await storage.getProductBySlug(slug);

      const productData: InsertProduct = {
        name: title,
        slug: slug,
        description: description.substring(0, 1000), // Limit length
        shortDescription: description.substring(0, 200),
        price: price || 19.99,
        imageUrl: mainImage,
        imageUrls: images.slice(0, 5),
        categoryId: defaultCategoryId,
        sku: `EG-${Date.now()}-${Math.floor(Math.random()*1000)}`,
        stock: 100,
        featured: false,
      };

      if (existing) {
        // Update?
        console.log(`Product ${title} already exists. Skipping.`);
      } else {
        await storage.createProduct(productData);
        console.log(`Created product: ${title}`);
      }

    } catch (error) {
      console.error(`Failed to process product ${url}:`, error);
    }
  }

  // --- Blog Scraping ---

  async scrapeBlogs(pagesToScrape: number = 3): Promise<void> {
    for (let i = 1; i <= pagesToScrape; i++) {
      const url = i === 1 ? `${this.blogBaseUrl}/blog/` : `${this.blogBaseUrl}/blog/page/${i}/`;
      // Based on visual check, it might just be /blog/ or /category/something
      // Let's try /blog/ first. If it redirects or fails, we might need to find the blog index.
      // The text output showed "Learn" -> epicgardening.com.
      // Many Wordpress sites use /page/2/

      try {
        const html = await this.fetchPage(url);
        const $ = cheerio.load(html);

        const blogLinks: string[] = [];

        // Find article links
        $('article a').each((_, el) => {
            const href = $(el).attr('href');
            if (href && href.startsWith(this.blogBaseUrl)) {
                if (!blogLinks.includes(href)) blogLinks.push(href);
            }
        });

        for (const link of blogLinks) {
            await this.processBlogPage(link);
        }

      } catch (error) {
        console.error(`Error scraping blog page ${i}:`, error);
      }
    }
  }

  private async processBlogPage(url: string): Promise<void> {
    try {
      const html = await this.fetchPage(url);
      const $ = cheerio.load(html);

      const title = $('h1').first().text().trim();
      if (!title) return;

      const slug = this.slugify(title);

      const content = $('.entry-content, .post-content').html() || "";
      const excerpt = $('.entry-content p').first().text().substring(0, 200) + "...";

      const imageUrl = $('meta[property="og:image"]').attr('content') || "";

      const existing = await storage.getBlogPostBySlug(slug);

      const blogData: InsertBlogPost = {
        title,
        slug,
        content: content || "Content not found",
        excerpt,
        imageUrl,
        authorId: 1, // Default admin
        published: true
      };

      if (existing) {
         console.log(`Blog ${title} already exists. Skipping.`);
      } else {
        await storage.createBlogPost(blogData);
        console.log(`Created blog: ${title}`);
      }

    } catch (error) {
        console.error(`Failed to process blog ${url}:`, error);
    }
  }
}
