import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Upload, Download, FileJson, Package, BookOpen, Users, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AdminDataManagerPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [importData, setImportData] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Sample data structures for reference
  const sampleProductData = {
    products: [
      {
        name: "Cherokee Purple Heirloom Tomato Seeds",
        slug: "cherokee-purple-heirloom-tomato-seeds",
        description: "Deep purple-brown tomatoes with outstanding flavor...",
        shortDescription: "Heirloom tomato variety with exceptional taste",
        price: 3.99,
        comparePrice: 4.99,
        imageUrl: "https://example.com/tomato-seeds.jpg",
        imageUrls: ["https://example.com/tomato1.jpg", "https://example.com/tomato2.jpg"],
        categoryId: 1,
        sku: "TOM-CHE-001",
        stock: 150,
        featured: true
      }
    ]
  };

  const sampleBlogData = {
    posts: [
      {
        title: "How to Start a Vegetable Garden: Complete Beginner's Guide",
        slug: "how-to-start-vegetable-garden-beginners-guide",
        content: "Starting a vegetable garden can be incredibly rewarding...",
        excerpt: "Learn the fundamentals of starting your first vegetable garden",
        imageUrl: "https://example.com/garden-guide.jpg",
        authorId: 1,
        published: true
      }
    ]
  };

  const handleImport = async (type: string) => {
    if (!importData.trim()) {
      toast({
        title: "Error",
        description: "Please enter JSON data to import",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);

    try {
      const data = JSON.parse(importData);

      // Validate data structure
      if (type === 'products' && !data.products) {
        throw new Error('Invalid format: Expected "products" array');
      }
      if (type === 'blogs' && !data.posts) {
        throw new Error('Invalid format: Expected "posts" array');
      }

      // Import data based on type
      let importPromises: Promise<any>[] = [];

      if (type === 'products' && data.products) {
        importPromises = data.products.map((product: any) => 
          apiRequest('POST', '/api/products', product)
        );
      } else if (type === 'blogs' && data.posts) {
        importPromises = data.posts.map((post: any) => 
          apiRequest('POST', '/api/blog', post)
        );
      }

      await Promise.all(importPromises);

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });

      toast({
        title: "Import Successful",
        description: `Successfully imported ${importPromises.length} ${type}`,
      });

      setImportData('');
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Invalid JSON format",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async (type: string) => {
    setIsExporting(true);

    try {
      let data;
      let filename;

      switch (type) {
        case 'products':
          const productsResponse = await fetch('/api/products');
          const products = await productsResponse.json();
          data = { products };
          filename = 'okkyno-products.json';
          break;

        case 'blogs':
          const blogsResponse = await fetch('/api/blog');
          const posts = await blogsResponse.json();
          data = { posts };
          filename = 'okkyno-blog-posts.json';
          break;

        case 'categories':
          const categoriesResponse = await fetch('/api/categories');
          const categories = await categoriesResponse.json();
          data = { categories };
          filename = 'okkyno-categories.json';
          break;

        case 'orders':
          const ordersResponse = await fetch('/api/orders');
          const orders = await ordersResponse.json();
          data = { orders };
          filename = 'okkyno-orders.json';
          break;

        default:
          throw new Error('Invalid export type');
      }

      // Download file
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `${type} data exported successfully`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportData(content);
    };
    reader.readAsText(file);
  };

  return (
    <AdminLayout title="Data Manager">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Data Manager</h1>
            <p className="text-muted-foreground">Import and export your store data in JSON format</p>
          </div>
        </div>

        <Tabs defaultValue="import" className="space-y-4">
          <TabsList>
            <TabsTrigger value="import">Import Data</TabsTrigger>
            <TabsTrigger value="export">Export Data</TabsTrigger>
            <TabsTrigger value="samples">Sample Formats</TabsTrigger>
          </TabsList>

          {/* Import Tab */}
          <TabsContent value="import">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Import JSON Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Upload JSON File</label>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Or paste JSON data</label>
                    <Textarea
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                      placeholder="Paste your JSON data here..."
                      className="min-h-[300px] font-mono text-sm"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleImport('products')}
                      disabled={isImporting || !importData.trim()}
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Import Products
                    </Button>
                    <Button
                      onClick={() => handleImport('blogs')}
                      disabled={isImporting || !importData.trim()}
                      variant="outline"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Import Blog Posts
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Import Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Product Import Format</h4>
                    <p className="text-sm text-muted-foreground">
                      Your JSON should contain a "products" array with product objects
                    </p>
                    <Badge variant="secondary">Required: name, price, categoryId</Badge>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium">Blog Post Import Format</h4>
                    <p className="text-sm text-muted-foreground">
                      Your JSON should contain a "posts" array with blog post objects
                    </p>
                    <Badge variant="secondary">Required: title, content, authorId</Badge>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium">Tips for Successful Import</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Ensure all required fields are present</li>
                      <li>• Use valid image URLs for images</li>
                      <li>• Category IDs must exist in your store</li>
                      <li>• SKUs should be unique for products</li>
                      <li>• Slugs will be auto-generated if not provided</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5" />
                    Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Export all your products with images, pricing, and inventory data
                  </p>
                  <Button
                    onClick={() => handleExport('products')}
                    disabled={isExporting}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Products
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="h-5 w-5" />
                    Blog Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Export all your blog posts with content, images, and metadata
                  </p>
                  <Button
                    onClick={() => handleExport('blogs')}
                    disabled={isExporting}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Posts
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Database className="h-5 w-5" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Export all product categories and their configurations
                  </p>
                  <Button
                    onClick={() => handleExport('categories')}
                    disabled={isExporting}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Categories
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingCart className="h-5 w-5" />
                    Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Export all orders with customer and payment information
                  </p>
                  <Button
                    onClick={() => handleExport('orders')}
                    disabled={isExporting}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Orders
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sample Formats Tab */}
          <TabsContent value="samples">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Product Import Format
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto">
                    {JSON.stringify(sampleProductData, null, 2)}
                  </pre>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setImportData(JSON.stringify(sampleProductData, null, 2))}
                  >
                    <FileJson className="w-4 h-4 mr-2" />
                    Use This Sample
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Blog Post Import Format
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto">
                    {JSON.stringify(sampleBlogData, null, 2)}
                  </pre>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setImportData(JSON.stringify(sampleBlogData, null, 2))}
                  >
                    <FileJson className="w-4 h-4 mr-2" />
                    Use This Sample
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}