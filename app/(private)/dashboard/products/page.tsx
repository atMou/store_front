"use client";
import Table, { Column } from "@/components/molecules/Table";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
} from "@/features/product/api";
import ProductForm from "@/features/product/components/ProductForm";
import UpdateProductForm from "@/features/product/components/UpdateProductForm";
import { useInfiniteProducts } from "@/features/product/hooks/useInfiniteProducts";
import type { Product } from "@/features/product/types";
import type { UpdateProductFormSchema } from "@/features/product/validations/UpdateProductFormValidation";
import useToast from "@/hooks/ui/useToast";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { TabPanel, Tabs, TabsList, TabTrigger } from "@/shared/ui/Tabs/Tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProductsDashboard = () => {
  const { showToast } = useToast();
  const router = useRouter();
  const [createProduct, { isLoading: isCreating, error: createError }] =
    useCreateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const pathname = usePathname();
  const shouldFetchProducts = pathname === "/dashboard/products";

  const {
    products,
    pagination,
    isLoading: dataIsLoading,
    isFetching: dataIsFetching,
  } = useInfiniteProducts({
    skip: !shouldFetchProducts,
    additionalFilters: { include: "colorVariants" },
  });

  useEffect(() => {
    console.log("Products fetched:", products);
  }, [products]);

  const [activeTab, setActiveTab] = useState<string>("list");

  const [editingProduct, setEditingProduct] =
    useState<UpdateProductFormSchema | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleCreateProduct = async (formData: FormData) => {
    try {
      await createProduct(formData).unwrap();
      setActiveTab("list");
      showToast({ message: "Product created successfully", type: "success" });
    } catch (err) {
      console.error("Failed to create product:", err);
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProductToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete).unwrap();
      setIsConfirmModalOpen(false);
      setProductToDelete(null);
      showToast({ message: "Product deleted successfully", type: "success" });
    } catch (err) {
      console.error("Failed to delete product:", err);
      showToast({ message: "Failed to delete product", type: "error" });
    }
  };

  const cancelDelete = () => {
    setIsConfirmModalOpen(false);
    setProductToDelete(null);
  };

  const handleEditProduct = (product: Product) => {
    // Transform Product to UpdateProductFormSchema
    const updateData: UpdateProductFormSchema = {
      productId: product.id,
      slug: product.slug,
      images: [],
      isMain: [],
      price: product.price,
      newPrice: product.newPrice,
      brand: product.brand,
      category: product.category,
      subCategory: product.subCategory,
      type: product.productType.type,
      subType: product.productType.subType,
      description: product.description,
      detailsAttributes: product.detailsAttributes,
      sizeFitAttributes: product.sizeFitAttributes,
      materialDetails: product.materialDetails,
      isFeatured: product.status.isFeatured,
      isNew: product.status.isNew,
      isBestSeller: product.status.isBestSeller,
      isTrending: product.status.isTrending,
      imageDtos:
        product.images?.map((img) => ({
          productImageId: img.id || "",
          url: img.url,
          altText: img.altText || "",
          isMain: img.isMain || false,
          productId: product.id,
        })) || [],
      variants:
        product.colorVariants?.map((v) => ({
          variantId: v.id,
          color: typeof v.color === "string" ? v.color : v.color?.name || "",
          images: [],
          isMain: [],
          imageDtos:
            v.images?.map((img) => ({
              productImageId: img.id,
              url: img.url,
              altText: img.altText,
              isMain: img.isMain || false,
              variantId: v.id,
            })) || [],
        })) || [],
      alternativesIds: [],
    };
    setEditingProduct(updateData);
    setActiveTab("edit");
  };

  const columns: Column<Product>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-2">
          <span>{row.slug}</span>
        </div>
      ),
    },
    {
      key: "variants",
      label: "Variants",
      sortable: false,
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          {(row as Product).colorVariants?.length > 0 ? (
            [...(row as Product).colorVariants]
              .sort((a, b) => a.color?.name.localeCompare(b.color?.name) || 0)
              .map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-1 border border-gray-300 px-2 py-1 rounded text-xs"
                >
                  <div
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: v.color?.hex || "#cccccc" }}
                    title={v.color?.name || "Unknown color"}
                  />
                  <span className="font-medium">
                    {v.color?.name || "Unknown"}
                  </span>
                  {v.sku && <span className="text-gray-600">({v.sku})</span>}
                </div>
              ))
          ) : (
            <span className="text-gray-500 text-sm">No variants</span>
          )}
        </div>
      ),
    },
    {
      key: "salesCount",
      label: "Sales Count",
      sortable: true,
      render: (row) => (row as Product).totalSales,
    },
    {
      key: "alternativesCount",
      label: "Alternatives Count",
      sortable: false,
      render: (row) => (
        <span className="font-medium">
          {(row as Product).alternatives?.length || 0}
        </span>
      ),
    },
    {
      key: "summary",
      label: "Summary",
      sortable: false,
      render: (row) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => router.push(`/dashboard/products/${row.id}`)}
              className="text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
            >
              <Eye size={16} />
              View
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View product summary</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      key: "alternatives",
      label: "Alternatives",
      sortable: false,
      render: (row) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() =>
                router.push(`/dashboard/products/${row.id}/alternatives`)
              }
              className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <Plus size={16} />
              Add
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add alternatives to this product</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (row) => (
        <div className="flex space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleEditProduct(row)}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <Edit size={16} />
                Edit
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit product details</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() =>
                  router.push(`/dashboard/products/${row.id}/alternatives`)
                }
                className="text-green-600 hover:text-green-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus size={16} />
                Alternatives
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Manage product alternatives</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleDeleteProduct(row.id)}
                className="text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete this product</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className=" min-h-screen bg-white">
      <div className="flex flex-col space-y-7 w-full max-w-6xl p-6">
        <div className="flex flex-col space-y-2 mb-2">
          <h1 className="text-2xl font-bold text-black">Products Dashboard</h1>
        </div>

        <Tabs defaultSelectedTab={activeTab} onTabChange={setActiveTab}>
          <TabsList>
            <TabTrigger tab="list">Products List</TabTrigger>
            <TabTrigger tab="create">Create Product</TabTrigger>
            {editingProduct && <TabTrigger tab="edit">Edit Product</TabTrigger>}
          </TabsList>

          <TabPanel tab="list">
            <Table
              data={products}
              columns={columns}
              isLoading={dataIsLoading || dataIsFetching}
              emptyMessage="No products available"
              onRefresh={() => console.log("refreshed")}
              totalPages={Math.ceil(
                (pagination.totalCount || 0) / (pagination.pageSize || 1)
              )}
              totalResults={pagination.totalCount}
              resultsPerPage={pagination.pageSize}
              currentPage={pagination.currentPage}
            />
          </TabPanel>

          <TabPanel tab="create">
            <ProductForm
              onSubmit={handleCreateProduct}
              isLoading={isCreating}
              error={createError}
              submitLabel="Create Product"
            />
          </TabPanel>

          <TabPanel tab="edit">
            {editingProduct && (
              <UpdateProductForm initialData={editingProduct} />
            )}
          </TabPanel>
        </Tabs>
      </div>

      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsDashboard;
