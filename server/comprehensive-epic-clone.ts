
import axios from 'axios';
import * as cheerio from 'cheerio';
import { storage } from './storage';
import { InsertProduct, InsertBlogPost, InsertCategory } from '@shared/schema';

export class ComprehensiveEpicCloner {
  private baseUrl = 'https://epicgardening.com';
  private scrapedUrls = new Set<string>();
  private delay = 2000; // Respectful delay
  private maxRetries = 3;

  private async fetchPage(url: string, retries = 0): Promise<string | null> {
    if (this.scrapedUrls.has(url)) return null;
    this.scrapedUrls.add(url);
    
    try {
      console.log(`Fetching: ${url}`);
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Cache-Control': 'no-cache',
          'Referer': 'https://www.google.com/',
        },
        timeout: 30000,
        maxRedirects: 5,
      });
      
      await this.sleep(this.delay);
      return response.data;
    } catch (error) {
      if (retries < this.maxRetries) {
        console.log(`Retry ${retries + 1}/${this.maxRetries} for ${url}`);
        await this.sleep(this.delay * (retries + 1));
        return this.fetchPage(url, retries + 1);
      }
      console.log(`Failed to fetch ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private slugify(str: string): string {
    return str.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private extractImages($: cheerio.CheerioAPI, element: cheerio.Cheerio<any>): string[] {
    const images: string[] = [];
    
    element.find('img').each((_, img) => {
      const $img = $(img);
      const src = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src') || $img.attr('data-original');
      if (src && !src.includes('data:image') && !src.includes('placeholder') && !src.includes('loading')) {
        const fullUrl = src.startsWith('http') ? src : 
                       src.startsWith('//') ? `https:${src}` : 
                       `${this.baseUrl}${src.startsWith('/') ? src : '/' + src}`;
        if (!images.includes(fullUrl)) {
          images.push(fullUrl);
        }
      }
    });
    
    return images;
  }

  private extractVideos($: cheerio.CheerioAPI, element: cheerio.Cheerio<any>): string[] {
    const videos: string[] = [];
    
    // YouTube and Vimeo embeds
    element.find('iframe').each((_, iframe) => {
      const src = $(iframe).attr('src');
      if (src && (src.includes('youtube.com') || src.includes('youtu.be') || src.includes('vimeo.com'))) {
        videos.push(src);
      }
    });

    // Video tags
    element.find('video source').each((_, source) => {
      const src = $(source).attr('src');
      if (src) {
        const fullUrl = src.startsWith('http') ? src : `${this.baseUrl}${src.startsWith('/') ? src : '/' + src}`;
        videos.push(fullUrl);
      }
    });
    
    return videos;
  }

  private extractPrice(priceText: string): number {
    const match = priceText.match(/\$?(\d+(?:\.\d{2})?)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async discoverUrls(): Promise<{ blogUrls: string[], productUrls: string[], categoryUrls: string[] }> {
    const discoveredUrls = { blogUrls: [] as string[], productUrls: [] as string[], categoryUrls: [] as string[] };
    
    try {
      // Scrape sitemap
      const sitemapUrls = [`${this.baseUrl}/sitemap.xml`, `${this.baseUrl}/sitemap_index.xml`];
      
      for (const sitemapUrl of sitemapUrls) {
        const content = await this.fetchPage(sitemapUrl);
        if (content) {
          const $ = cheerio.load(content, { xmlMode: true });
          
          $('url loc, sitemap loc').each((_, element) => {
            const url = $(element).text().trim();
            if (url.includes('/learn/') || url.includes('/blog/') || url.includes('/guide/')) {
              discoveredUrls.blogUrls.push(url);
            } else if (url.includes('/product/') || url.includes('/shop/')) {
              discoveredUrls.productUrls.push(url);
            } else if (url.includes('/category/') || url.includes('/collection/')) {
              discoveredUrls.categoryUrls.push(url);
            }
          });
        }
      }

      // Scrape main navigation
      const mainContent = await this.fetchPage(this.baseUrl);
      if (mainContent) {
        const $ = cheerio.load(mainContent);
        
        // Extract navigation links
        $('nav a, .menu a, .navigation a, header a').each((_, element) => {
          const href = $(element).attr('href');
          if (href) {
            const fullUrl = href.startsWith('http') ? href : `${this.baseUrl}${href.startsWith('/') ? href : '/' + href}`;
            
            if (href.includes('/learn/') || href.includes('/blog/') || href.includes('/guide/')) {
              discoveredUrls.blogUrls.push(fullUrl);
            } else if (href.includes('/product/') || href.includes('/shop/')) {
              discoveredUrls.productUrls.push(fullUrl);
            } else if (href.includes('/category/') || href.includes('/collection/')) {
              discoveredUrls.categoryUrls.push(fullUrl);
            }
          }
        });

        // Extract links from main content
        $('a[href*="/learn/"], a[href*="/blog/"], a[href*="/guide/"]').each((_, element) => {
          const href = $(element).attr('href');
          if (href) {
            const fullUrl = href.startsWith('http') ? href : `${this.baseUrl}${href.startsWith('/') ? href : '/' + href}`;
            discoveredUrls.blogUrls.push(fullUrl);
          }
        });
      }

      // Remove duplicates
      discoveredUrls.blogUrls = [...new Set(discoveredUrls.blogUrls)];
      discoveredUrls.productUrls = [...new Set(discoveredUrls.productUrls)];
      discoveredUrls.categoryUrls = [...new Set(discoveredUrls.categoryUrls)];

      console.log(`Discovered ${discoveredUrls.blogUrls.length} blog URLs, ${discoveredUrls.productUrls.length} product URLs, ${discoveredUrls.categoryUrls.length} category URLs`);
      
    } catch (error) {
      console.error('Error discovering URLs:', error);
    }

    return discoveredUrls;
  }

  async scrapeBlogPost(url: string): Promise<void> {
    const content = await this.fetchPage(url);
    if (!content) return;
    
    const $ = cheerio.load(content);
    
    const title = $('h1').first().text().trim() || 
                 $('title').text().replace(/\s*-\s*Epic Gardening.*/, '').trim() ||
                 $('meta[property="og:title"]').attr('content') || '';
    
    if (!title || title.length < 5) return;
    
    // Extract main content with multiple selectors
    let articleContent = '';
    const contentSelectors = [
      'article .entry-content',
      '.post-content',
      '.content-area',
      'main .content',
      '.single-post-content',
      '[class*="content"]',
      'article',
      'main'
    ];
    
    for (const selector of contentSelectors) {
      const contentEl = $(selector);
      if (contentEl.length && contentEl.html()) {
        articleContent = contentEl.html() || '';
        break;
      }
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
        content: articleContent || `<p>Comprehensive guide about ${title.toLowerCase()}.</p>`,
        excerpt,
        imageUrl: featuredImage.startsWith('http') ? featuredImage : `${this.baseUrl}${featuredImage}`,
        authorId: 1,
        published: true,
      };

      await storage.createBlogPost(blogData);
      console.log(`Created blog post: ${title}`);
    } catch (error) {
      console.log(`Failed to create blog post: ${title}`);
    }
  }

  async scrapeProduct(url: string): Promise<void> {
    const content = await this.fetchPage(url);
    if (!content) return;
    
    const $ = cheerio.load(content);
    
    const name = $('h1').first().text().trim() || 
                $('title').text().replace(/\s*-\s*Epic Gardening.*/, '').trim() ||
                $('.product-title').text().trim() || '';
    
    if (!name || name.length < 3) return;
    
    const description = $('.product-description, .description, .product-content').html() ||
                       $('meta[name="description"]').attr('content') ||
                       $('meta[property="og:description"]').attr('content') ||
                       `High-quality ${name.toLowerCase()} for your gardening needs.`;
    
    const shortDescription = typeof description === 'string' 
      ? description.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
      : `Premium ${name.toLowerCase()} for gardening enthusiasts.`;
    
    const priceText = $('.price, .cost, .amount, [class*="price"]').first().text().trim();
    const price = this.extractPrice(priceText) || Math.random() * 50 + 10;
    
    const images = this.extractImages($, $('body'));
    const videos = this.extractVideos($, $('body'));
    
    const imageUrl = images[0] || 
                    $('meta[property="og:image"]').attr('content') ||
                    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80';

    try {
      const productData: InsertProduct = {
        name,
        slug: this.slugify(name),
        description: typeof description === 'string' ? description : description.toString(),
        shortDescription,
        price,
        comparePrice: price * 1.25,
        imageUrl: imageUrl.startsWith('http') ? imageUrl : `${this.baseUrl}${imageUrl}`,
        imageUrls: images.slice(0, 5), // Limit to 5 images
        videoUrl: videos[0],
        videoUrls: videos.slice(0, 3), // Limit to 3 videos
        categoryId: 1, // Default category
        sku: `EG-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        stock: Math.floor(Math.random() * 100) + 10,
        featured: Math.random() > 0.8,
        rating: 3.5 + Math.random() * 1.5,
        reviewCount: Math.floor(Math.random() * 200) + 10,
        tags: name.split(' ').slice(0, 4),
      };

      await storage.createProduct(productData);
      console.log(`Created product: ${name}`);
    } catch (error) {
      console.log(`Failed to create product: ${name}`);
    }
  }

  async scrapeCategory(url: string): Promise<void> {
    const content = await this.fetchPage(url);
    if (!content) return;
    
    const $ = cheerio.load(content);
    
    const name = $('h1').first().text().trim() || 
                $('.category-title').text().trim() ||
                $('title').text().replace(/\s*-\s*Epic Gardening.*/, '').trim() || '';
    
    if (!name || name.length < 2) return;
    
    const description = $('.category-description, .description').text().trim() ||
                       $('meta[name="description"]').attr('content') ||
                       `Premium ${name.toLowerCase()} products for your garden.`;
    
    const imageUrl = $('.category-image img').attr('src') ||
                    $('meta[property="og:image"]').attr('content') ||
                    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80';

    try {
      const categoryData: InsertCategory = {
        name,
        slug: this.slugify(name),
        description,
        imageUrl: imageUrl.startsWith('http') ? imageUrl : `${this.baseUrl}${imageUrl}`,
      };

      await storage.createCategory(categoryData);
      console.log(`Created category: ${name}`);
    } catch (error) {
      console.log(`Category ${name} may already exist`);
    }
  }

  async fullClone(): Promise<void> {
    console.log('Starting comprehensive Epic Gardening content cloning...');
    
    try {
      // Step 1: Discover all URLs
      const { blogUrls, productUrls, categoryUrls } = await this.discoverUrls();
      
      // Step 2: Create categories first
      console.log('Scraping categories...');
      for (const url of categoryUrls.slice(0, 20)) { // Limit to 20 categories
        await this.scrapeCategory(url);
      }
      
      // Step 3: Scrape blog posts
      console.log('Scraping blog posts...');
      for (const url of blogUrls.slice(0, 100)) { // Limit to 100 blog posts
        await this.scrapeBlogPost(url);
      }
      
      // Step 4: Scrape products
      console.log('Scraping products...');
      for (const url of productUrls.slice(0, 200)) { // Limit to 200 products
        await this.scrapeProduct(url);
      }

      // Step 5: Scrape additional content from main pages
      const mainPages = [
        `${this.baseUrl}/learn`,
        `${this.baseUrl}/blog`,
        `${this.baseUrl}/shop`,
        `${this.baseUrl}/products`,
        `${this.baseUrl}/categories`
      ];

      for (const page of mainPages) {
        await this.scrapePageLinks(page);
      }
      
      console.log('Comprehensive Epic Gardening content cloning completed!');
      
    } catch (error) {
      console.error('Content cloning failed:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async scrapePageLinks(url: string): Promise<void> {
    const content = await this.fetchPage(url);
    if (!content) return;
    
    const $ = cheerio.load(content);
    
    // Extract all relevant links from the page
    const links: string[] = [];
    
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (href && (
        href.includes('/learn/') || 
        href.includes('/blog/') || 
        href.includes('/product/') ||
        href.includes('/shop/') ||
        href.includes('/guide/')
      )) {
        const fullUrl = href.startsWith('http') ? href : `${this.baseUrl}${href.startsWith('/') ? href : '/' + href}`;
        links.push(fullUrl);
      }
    });

    // Process discovered links
    for (const link of [...new Set(links)].slice(0, 50)) { // Limit per page
      if (link.includes('/learn/') || link.includes('/blog/') || link.includes('/guide/')) {
        await this.scrapeBlogPost(link);
      } else if (link.includes('/product/') || link.includes('/shop/')) {
        await this.scrapeProduct(link);
      }
    }
  }
}
