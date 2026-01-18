import { useState, useEffect } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import FloatingButtons from "@/components/home/FloatingButtons";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ui/product-card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import type { Product } from "@shared/schema";
import { generateProducts, ExtendedProduct } from "@/lib/product-generator";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Reuse the shared product generator for consistent mock data across pages.

export default function Shop() {
  const [match, params] = useRoute("/shop/:category");
  const categorySlug = match ? params?.category : null;
  
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState("featured");
  const [filters, setFilters] = useState({
    inStock: false,
    onSale: false,
    bestSellers: false,
    organic: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: allProducts, isLoading } = useQuery<ExtendedProduct[]>({
    queryKey: ['/api/products'],
    queryFn: async () => {
      // Simulate API call with more products
      return generateProducts();
    }
  });
  
  // Filter products based on selected filters
  const filteredProducts = allProducts?.filter(product => {
    // Filter by category
    if (categorySlug) {
      if (categorySlug === "garden-tools" && product.categoryId !== 1) return false;
      if (categorySlug === "indoor-plants" && product.categoryId !== 2) return false;
      if (categorySlug === "vegetable-seeds" && product.categoryId !== 3) return false;
      if (categorySlug === "planters-pots" && product.categoryId !== 4) return false;
      if (categorySlug === "soil-fertilizers" && product.categoryId !== 5) return false;
    }
    
    // Filter by price range
    const productPrice = product.salePrice || product.price;
    if (productPrice < priceRange[0] || productPrice > priceRange[1]) return false;
    
    // Filter by other criteria
    if (filters.inStock && !product.inStock) return false;
    if (filters.onSale && !product.salePrice) return false;
    if (filters.bestSellers && !product.isBestseller) return false;
    if (filters.organic && !product.isOrganic) return false;
    
    // Filter by search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });
  
  // Sort products
  const sortedProducts = filteredProducts?.slice().sort((a, b) => {
    if (sortBy === "price-low") {
      return (a.salePrice || a.price) - (b.salePrice || b.price);
    } else if (sortBy === "price-high") {
      return (b.salePrice || b.price) - (a.salePrice || a.price);
    } else if (sortBy === "rating") {
      return (b.rating ?? 0) - (a.rating ?? 0);
    } else {
      // Default: featured
      return b.isFeatured ? 1 : -1;
    }
  });
  
  // Pagination
  const productsPerPage = 12;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts?.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = sortedProducts ? Math.ceil(sortedProducts.length / productsPerPage) : 0;
  
  // Set page title based on category
  useEffect(() => {
    let title = "Shop - Okkyno Gardening Supplies";
    if (categorySlug) {
      const formattedCategory = categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      title = `${formattedCategory} - Okkyno Gardening Supplies`;
    }
    document.title = title;
  }, [categorySlug]);

  return (
    <>
      <Header />
      <main className="bg-neutral py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-1/4 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-4">Search</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full py-2 px-4 pr-10 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <FaSearch />
                  </button>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-4">Categories</h2>
                <ul className="space-y-2">
                  <li>
                    <a href="/shop" className={`block py-2 px-3 rounded hover:bg-neutral transition ${!categorySlug ? 'bg-primary/10 text-primary font-semibold' : ''}`}>
                      All Products
                    </a>
                  </li>
                  <li>
                    <a href="/shop/garden-tools" className={`block py-2 px-3 rounded hover:bg-neutral transition ${categorySlug === 'garden-tools' ? 'bg-primary/10 text-primary font-semibold' : ''}`}>
                      Garden Tools
                    </a>
                  </li>
                  <li>
                    <a href="/shop/indoor-plants" className={`block py-2 px-3 rounded hover:bg-neutral transition ${categorySlug === 'indoor-plants' ? 'bg-primary/10 text-primary font-semibold' : ''}`}>
                      Plants & Seeds
                    </a>
                  </li>
                  <li>
                    <a href="/shop/planters-pots" className={`block py-2 px-3 rounded hover:bg-neutral transition ${categorySlug === 'planters-pots' ? 'bg-primary/10 text-primary font-semibold' : ''}`}>
                      Planters & Pots
                    </a>
                  </li>
                  <li>
                    <a href="/shop/soil-fertilizers" className={`block py-2 px-3 rounded hover:bg-neutral transition ${categorySlug === 'soil-fertilizers' ? 'bg-primary/10 text-primary font-semibold' : ''}`}>
                      Soil & Fertilizers
                    </a>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-4">Price Range</h2>
                <Slider
                  defaultValue={[0, 100]}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={100}
                  step={1}
                  className="my-6"
                />
                <div className="flex justify-between">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-4">Filter</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Checkbox
                      id="inStock"
                      checked={filters.inStock}
                      onCheckedChange={(checked) => setFilters({...filters, inStock: !!checked})}
                    />
                    <label htmlFor="inStock" className="ml-2 cursor-pointer">In Stock</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox
                      id="onSale"
                      checked={filters.onSale}
                      onCheckedChange={(checked) => setFilters({...filters, onSale: !!checked})}
                    />
                    <label htmlFor="onSale" className="ml-2 cursor-pointer">On Sale</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox
                      id="bestSellers"
                      checked={filters.bestSellers}
                      onCheckedChange={(checked) => setFilters({...filters, bestSellers: !!checked})}
                    />
                    <label htmlFor="bestSellers" className="ml-2 cursor-pointer">Best Sellers</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox
                      id="organic"
                      checked={filters.organic}
                      onCheckedChange={(checked) => setFilters({...filters, organic: !!checked})}
                    />
                    <label htmlFor="organic" className="ml-2 cursor-pointer">Organic</label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product Grid */}
            <div className="lg:w-3/4">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <h1 className="text-2xl font-bold mb-4 md:mb-0">
                    {categorySlug 
                      ? categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                      : 'All Products'}
                  </h1>
                  <div className="flex items-center">
                    <span className="mr-3 text-sm">Sort by:</span>
                    <select 
                      className="border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                    </select>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="text-sm text-gray-600">
                  Showing {filteredProducts?.length ? indexOfFirstProduct + 1 : 0}-
                  {indexOfLastProduct > (filteredProducts?.length || 0) 
                    ? filteredProducts?.length 
                    : indexOfLastProduct
                  } of {filteredProducts?.length || 0} products
                </div>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="h-56 bg-gray-200 animate-pulse"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                        <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse mb-3"></div>
                        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts?.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                  <FaSearch className="text-4xl text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search query.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentProducts?.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="flex gap-2">
                        <button
                          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-primary hover:text-white disabled:opacity-50 disabled:pointer-events-none"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          <FaChevronLeft />
                        </button>
                        
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            className={`w-10 h-10 flex items-center justify-center rounded-full ${currentPage === i + 1 ? 'bg-primary text-white' : 'border border-gray-300 hover:bg-primary/10'}`}
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </button>
                        ))}
                        
                        <button
                          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-primary hover:text-white disabled:opacity-50 disabled:pointer-events-none"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          <FaChevronRight />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
