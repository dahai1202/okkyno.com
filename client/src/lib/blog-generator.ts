import { sampleBlogPosts } from "./data";
import type { BlogPost } from "@shared/schema";

export interface ExtendedBlogPost extends BlogPost {
  category?: string;
  authorName?: string;
  authorImageUrl?: string;
  publishDate?: Date;
  isFeatured?: boolean;
}

export const generateBlogPosts = (): ExtendedBlogPost[] => {
  return sampleBlogPosts.map((post, idx) => ({
    id: post.id ?? idx + 1,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    imageUrl: post.imageUrl,
    authorId: 1,
    published: true,
    commentCount: 0,
    createdAt: post.publishDate ?? new Date(),
    updatedAt: post.publishDate ?? new Date(),
    category: post.category,
    authorName: post.authorName,
    authorImageUrl: post.authorImageUrl,
    publishDate: post.publishDate,
    isFeatured: post.isFeatured,
  }));
};
