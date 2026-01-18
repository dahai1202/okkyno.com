import { useRoute } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";

export default function AdminProductsPage() {
  // Route matching for different views
  const [addMatch] = useRoute("/admin/products/add");
  const [editMatch, editParams] = useRoute("/admin/products/edit/:id");

  // Determine which component to render based on the route
  const renderContent = () => {
    if (addMatch) {
      return <ProductForm />;
    }

    if (editMatch && editParams?.id) {
      const productId = parseInt(editParams.id);
      if (isNaN(productId)) {
        return <div>Invalid product ID</div>;
      }
      return <ProductForm productId={productId} />;
    }

    // Fallback
    return <div>Invalid route</div>;
  };

  // Determine page title based on the route
  const getPageTitle = () => {
    if (addMatch) {
      return "Add New Product";
    }

    if (editMatch) {
      return "Edit Product";
    }

    return "Product";
  };

  return (
    <AdminLayout title={getPageTitle()}>
      {renderContent()}
    </AdminLayout>
  );
}