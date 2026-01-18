import { useLocation } from "wouter";
import { BlogPost } from "@shared/schema";
import { formatDate } from "@/utils/formatters";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const [, setLocation] = useLocation();

  const handleCardClick = () => {
    setLocation(`/blog/${post.slug}`);
  };

  return (
    <article className="group cursor-pointer" onClick={handleCardClick}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="aspect-video bg-gray-100 overflow-hidden">
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
              <span className="text-4xl text-green-600">🌱</span>
            </div>
          )}
        </div>

        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-xs">
              Blog
            </Badge>
            <span className="text-sm text-gray-500">
              {formatDate(post.createdAt)}
            </span>
          </div>

          <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {post.excerpt}
            </p>
          )}

          <span className="text-green-600 hover:text-green-700 font-medium text-sm inline-flex items-center group">
            Read More
            <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </CardContent>
      </Card>
    </article>
  );
}