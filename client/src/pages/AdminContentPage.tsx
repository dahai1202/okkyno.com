import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, CheckCircle, AlertCircle, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ScrapingStatus {
  isRunning: boolean;
  lastRun: string | null;
  itemsImported: number;
}

export default function AdminContentPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isImporting, setIsImporting] = useState(false);

  // Get scraping status
  const { data: scrapingStatus } = useQuery<ScrapingStatus>({
    queryKey: ['/api/scrape/status'],
    refetchInterval: 5000, // Poll every 5 seconds when scraping
  });

  // Start Epic Gardening import
  const startImportMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/scrape/comprehensive-epic'),
    onSuccess: () => {
      setIsImporting(true);
      toast({
        title: "Import Started",
        description: "Epic Gardening content import has been initiated in the background.",
      });
      // Refresh status
      queryClient.invalidateQueries({ queryKey: ['/api/scrape/status'] });
      
      // Stop showing importing state after a delay
      setTimeout(() => setIsImporting(false), 10000);
    },
    onError: (error: any) => {
      toast({
        title: "Import Failed",
        description: error.message || "Failed to start the import process.",
        variant: "destructive",
      });
    },
  });

  const handleStartImport = () => {
    startImportMutation.mutate();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Content Management</h1>
          <p className="text-muted-foreground">
            Import content, products, and blog posts from external sources
          </p>
        </div>

        <div className="grid gap-6">
          {/* Epic Gardening Import Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Globe className="h-6 w-6 text-green-600" />
                <div>
                  <CardTitle>Epic Gardening Import</CardTitle>
                  <CardDescription>
                    Clone blog posts, products, images, and videos from epicgardening.com
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Import Status</p>
                  <div className="flex items-center gap-2">
                    {isImporting || startImportMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        <Badge variant="secondary">Importing...</Badge>
                      </>
                    ) : scrapingStatus?.isRunning ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        <Badge variant="secondary">Running</Badge>
                      </>
                    ) : scrapingStatus?.lastRun ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <Badge variant="secondary">Completed</Badge>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <Badge variant="outline">Ready</Badge>
                      </>
                    )}
                  </div>
                </div>
                <Button
                  onClick={handleStartImport}
                  disabled={isImporting || startImportMutation.isPending}
                  className="min-w-[120px]"
                >
                  {isImporting || startImportMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Start Import
                    </>
                  )}
                </Button>
              </div>

              {scrapingStatus?.lastRun && (
                <div className="text-sm text-muted-foreground">
                  Last import: {new Date(scrapingStatus.lastRun).toLocaleString()}
                </div>
              )}

              {(scrapingStatus?.itemsImported || 0) > 0 && (
                <div className="text-sm text-muted-foreground">
                  Items imported: {scrapingStatus?.itemsImported || 0}
                </div>
              )}

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">What will be imported:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Product listings with images and videos</li>
                  <li>• Blog posts and gardening guides</li>
                  <li>• Product categories and descriptions</li>
                  <li>• High-quality images from Epic Gardening</li>
                  <li>• Educational content and growing tips</li>
                </ul>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> The import process runs in the background and may take several minutes to complete. 
                  The system will automatically fetch authentic content from Epic Gardening's website.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Import History/Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Content Statistics</CardTitle>
              <CardDescription>
                Overview of imported content in your database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">190</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">16</div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">2</div>
                  <div className="text-sm text-muted-foreground">Blog Posts</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">0</div>
                  <div className="text-sm text-muted-foreground">Testimonials</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}