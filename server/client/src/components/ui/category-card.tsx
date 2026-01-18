import { Link } from "wouter";
import { Category } from "@shared/schema";

type CategoryWithCount = Category & {
  productCount?: number;
};

interface CategoryCardProps {
  category: CategoryWithCount;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/shop/${category.slug}`}>
      <div className="group bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 group-hover:shadow-md text-center">
        <div className="h-36 overflow-hidden">
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-dark group-hover:text-primary transition">{category.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{category.productCount} Products</p>
        </div>
      </div>
    </Link>
  );
}
