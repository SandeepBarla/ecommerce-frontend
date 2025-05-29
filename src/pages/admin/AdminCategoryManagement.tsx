import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "@/api/categories";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryResponse } from "@/types/product/CategoryResponse";
import { Edit, PlusCircle, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const AdminCategoryManagement = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<CategoryResponse | null>(
    null
  );
  const [categoryName, setCategoryName] = useState("");
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditCategory(null);
    setCategoryName("");
    setModalOpen(true);
  };

  const openEditModal = (cat: CategoryResponse) => {
    setEditCategory(cat);
    setCategoryName(cat.name);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editCategory) {
        await updateCategory(editCategory.id, categoryName);
        toast.success("Category updated");
      } else {
        await createCategory(categoryName);
        toast.success("Category created");
      }
      setModalOpen(false);
      loadCategories();
    } catch (err: any) {
      toast.error(err?.message || "Error saving category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: CategoryResponse) => {
    if (!window.confirm(`Delete category '${cat.name}'?`)) return;
    try {
      await deleteCategory(cat.id);
      toast.success("Category deleted");
      loadCategories();
    } catch (err: any) {
      toast.error(err?.message || "Error deleting category");
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Category Management
        </h1>
        <Button
          onClick={openAddModal}
          className="bg-ethnic-purple hover:bg-ethnic-purple/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>
      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center py-8 text-gray-500"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center py-8 text-gray-500"
                >
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditModal(cat)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(cat)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleSave}
              disabled={saving || !categoryName}
              className="bg-ethnic-purple hover:bg-ethnic-purple/90"
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCategoryManagement;
