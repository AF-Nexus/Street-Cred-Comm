import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminVerify,
  useGetProductStats,
  useListProducts,
  useCreateProduct,
  useDeleteProduct,
  useToggleProductAvailability,
  useListAnnouncements,
  useCreateAnnouncement,
  useDeleteAnnouncement,
  useListUsers,
  useBanUser,
  useSetUserRole,
  getListProductsQueryKey,
  getGetProductStatsQueryKey,
  getListAnnouncementsQueryKey,
  getAdminVerifyQueryKey,
  getListUsersQueryKey,
} from "@workspace/api-client-react";
import { clearAdminToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Trash2, Power, Image as ImageIcon, MessageSquare,
  Package, Upload, Users, ShieldCheck, ShieldOff, Ban, CheckCircle2,
} from "lucide-react";
import logoPath from "@assets/IMG-20260606-WA0072_1780821751075.jpg";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

const productSchema = z.object({
  name: z.string().min(1, "Name required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  category: z.string().optional(),
  sizes: z.string().optional(),
  imageUrl: z.string().optional(),
  whatsappNumber: z.string().optional(),
  featured: z.coerce.number().optional().default(0),
});

type ProductFormValues = z.infer<typeof productSchema>;

const announcementSchema = z.object({
  message: z.string().min(1, "Message required"),
});

type Tab = "products" | "announcements" | "users";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isLoading: isVerifying, isError: isVerifyError } = useAdminVerify({
    query: { queryKey: getAdminVerifyQueryKey(), retry: false },
  });

  const { data: stats } = useGetProductStats({
    query: { queryKey: getGetProductStatsQueryKey(), enabled: !isVerifyError },
  });
  const { data: products } = useListProducts(undefined, {
    query: { queryKey: getListProductsQueryKey(), enabled: !isVerifyError },
  });
  const { data: announcements } = useListAnnouncements({
    query: { queryKey: getListAnnouncementsQueryKey(), enabled: !isVerifyError },
  });
  const { data: users, refetch: refetchUsers } = useListUsers({
    query: { queryKey: getListUsersQueryKey(), enabled: !isVerifyError },
  });

  const createProduct = useCreateProduct();
  const toggleAvailability = useToggleProductAvailability();
  const deleteProduct = useDeleteProduct();
  const createAnnouncement = useCreateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();
  const banUser = useBanUser();
  const setUserRole = useSetUserRole();

  const productForm = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "", description: "", price: 0, category: "",
      sizes: "S, M, L, XL", imageUrl: "", whatsappNumber: "", featured: 0,
    },
  });

  const announcementForm = useForm<z.infer<typeof announcementSchema>>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { message: "" },
  });

  if (isVerifyError) {
    clearAdminToken();
    setLocation("/admin/login");
    return null;
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center font-display text-2xl uppercase tracking-widest text-primary">
        Loading...
      </div>
    );
  }

  const handleLogout = () => {
    clearAdminToken();
    setLocation("/admin/login");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("image", file);
      const token = localStorage.getItem("streetcred_admin_token");
      const res = await fetch("/api/uploads/image", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      productForm.setValue("imageUrl", data.url);
      toast({ title: "Image uploaded" });
    } catch {
      toast({ variant: "destructive", title: "Image upload failed" });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onSubmitProduct = (data: ProductFormValues) => {
    createProduct.mutate({ data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetProductStatsQueryKey() });
        setIsAddProductOpen(false);
        productForm.reset();
        toast({ title: "Product added" });
      },
      onError: () => toast({ variant: "destructive", title: "Failed to add product" }),
    });
  };

  const onSubmitAnnouncement = (data: z.infer<typeof announcementSchema>) => {
    createAnnouncement.mutate({ data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAnnouncementsQueryKey() });
        announcementForm.reset();
        toast({ title: "Announcement posted" });
      },
    });
  };

  const handleToggleAvailability = (id: number, current: number) => {
    toggleAvailability.mutate({ id, data: { available: current === 1 ? 0 : 1 } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetProductStatsQueryKey() });
        toast({ title: "Availability updated" });
      },
    });
  };

  const handleDeleteProduct = (id: number) => {
    if (!confirm("Delete this product?")) return;
    deleteProduct.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetProductStatsQueryKey() });
        toast({ title: "Product deleted" });
      },
    });
  };

  const handleBanToggle = (id: number, currentBanned: number) => {
    const newBanned = currentBanned === 1 ? 0 : 1;
    banUser.mutate({ id, data: { banned: newBanned } }, {
      onSuccess: () => {
        refetchUsers();
        toast({ title: newBanned === 1 ? "User banned" : "User unbanned" });
      },
    });
  };

  const handleRoleToggle = (id: number, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    setUserRole.mutate({ id, data: { role: newRole } }, {
      onSuccess: () => {
        refetchUsers();
        toast({ title: newRole === "admin" ? "User promoted to admin" : "Admin rights removed" });
      },
    });
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "products", label: "Products", icon: <Package className="w-5 h-5" /> },
    { key: "announcements", label: "Announcements", icon: <MessageSquare className="w-5 h-5" /> },
    { key: "users", label: "Users", icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/10 bg-card/50 sticky top-0 z-40 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoPath} alt="Streetcred" className="w-8 h-8 border border-white/20" />
            <span className="font-display text-xl tracking-widest uppercase text-primary">Admin Dashboard</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="font-sans text-xs tracking-widest uppercase hover:bg-destructive/20 hover:text-destructive"
          >
            <Power className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-card border border-white/10 p-6">
            <div className="font-sans text-xs tracking-widest uppercase text-muted-foreground mb-4">Total Products</div>
            <div className="font-display text-6xl text-white">{stats?.total ?? 0}</div>
          </div>
          <div className="bg-card border border-white/10 border-t-4 border-t-primary p-6">
            <div className="font-sans text-xs tracking-widest uppercase text-primary mb-4">Available</div>
            <div className="font-display text-6xl text-primary">{stats?.available ?? 0}</div>
          </div>
          <div className="bg-card border border-white/10 border-t-4 border-t-destructive p-6">
            <div className="font-sans text-xs tracking-widest uppercase text-destructive mb-4">Sold Out</div>
            <div className="font-display text-6xl text-destructive">{stats?.unavailable ?? 0}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10 pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-4 font-display text-xl tracking-wider uppercase transition-colors relative flex items-center gap-2 ${
                activeTab === tab.key ? "text-primary" : "text-muted-foreground hover:text-white"
              }`}
            >
              {tab.icon} {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-3xl tracking-widest uppercase">Products</h2>
              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-none font-display text-lg tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="w-5 h-5 mr-2" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border border-white/10 rounded-none sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-display text-3xl tracking-widest uppercase">Add New Product</DialogTitle>
                  </DialogHeader>
                  <Form {...productForm}>
                    <form onSubmit={productForm.handleSubmit(onSubmitProduct)} className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={productForm.control} name="name" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="uppercase text-xs tracking-widest">Product Name</FormLabel>
                            <FormControl><Input {...field} className="rounded-none border-white/20 bg-black/50 focus-visible:ring-primary" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={productForm.control} name="price" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="uppercase text-xs tracking-widest">Price (MWK)</FormLabel>
                            <FormControl><Input type="number" {...field} className="rounded-none border-white/20 bg-black/50 focus-visible:ring-primary" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={productForm.control} name="category" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="uppercase text-xs tracking-widest">Category</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full h-10 border border-white/20 bg-black/50 text-white font-sans text-sm px-3 focus:outline-none focus:ring-2 focus:ring-primary rounded-none appearance-none cursor-pointer"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
                              >
                                <option value="">Select category…</option>
                                <option value="Hoodies">Hoodies</option>
                                <option value="Tees">Tees</option>
                                <option value="Bottoms">Bottoms</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Hats">Hats</option>
                                <option value="Other">Other</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={productForm.control} name="sizes" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="uppercase text-xs tracking-widest">Sizes (comma separated)</FormLabel>
                            <FormControl><Input {...field} placeholder="S, M, L, XL" className="rounded-none border-white/20 bg-black/50 focus-visible:ring-primary" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <FormField control={productForm.control} name="whatsappNumber" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase text-xs tracking-widest">Your WhatsApp Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+265999000000" className="rounded-none border-white/20 bg-black/50 focus-visible:ring-primary" />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">Orders for this item will go to this number</p>
                          <FormMessage />
                        </FormItem>
                      )} />

                      {/* Image Upload — plain label, not FormLabel (to avoid FormField context error) */}
                      <div className="space-y-2">
                        <p className="uppercase text-xs tracking-widest text-muted-foreground font-sans">Product Image</p>
                        <div className="flex gap-4 items-center">
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-none border-white/20"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingImage ? "Uploading..." : "Upload Photo"}
                          </Button>
                          <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                          {productForm.watch("imageUrl") && (
                            <div className="h-12 w-12 border border-white/20 bg-black overflow-hidden">
                              <img src={productForm.watch("imageUrl")} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>

                      <FormField control={productForm.control} name="description" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase text-xs tracking-widest">Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="rounded-none border-white/20 bg-black/50 focus-visible:ring-primary min-h-[80px]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <div className="flex items-center gap-2 border border-white/10 p-4 bg-white/5">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={productForm.watch("featured") === 1}
                          onChange={(e) => productForm.setValue("featured", e.target.checked ? 1 : 0)}
                          className="w-5 h-5 accent-primary"
                        />
                        <label htmlFor="featured" className="uppercase text-sm tracking-widest text-primary font-bold cursor-pointer">
                          Feature on homepage
                        </label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full rounded-none h-12 font-display text-xl tracking-widest uppercase"
                        disabled={createProduct.isPending || uploadingImage}
                      >
                        {createProduct.isPending ? "Saving..." : "Add Product"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="border border-white/10 bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans">
                  <thead className="border-b border-white/10 bg-white/5 uppercase text-xs tracking-widest text-muted-foreground">
                    <tr>
                      <th className="p-4 font-normal">Image</th>
                      <th className="p-4 font-normal">Details</th>
                      <th className="p-4 font-normal">Price</th>
                      <th className="p-4 font-normal">Status</th>
                      <th className="p-4 font-normal text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products?.map((product) => (
                      <tr key={product.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 w-24">
                          <div className="w-16 h-20 bg-black border border-white/10 flex items-center justify-center overflow-hidden">
                            {product.imageUrl
                              ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                              : <ImageIcon className="w-6 h-6 text-muted-foreground/50" />
                            }
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-display text-2xl tracking-wider uppercase mb-1">{product.name}</div>
                          <div className="text-xs text-muted-foreground uppercase tracking-widest">
                            {product.category}
                            {product.featured === 1 && <span className="text-primary ml-2">• Featured</span>}
                          </div>
                        </td>
                        <td className="p-4 font-mono">MWK {product.price.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`inline-flex px-2 py-1 text-xs uppercase tracking-widest font-bold border ${
                            product.available === 1
                              ? "border-primary text-primary bg-primary/10"
                              : "border-destructive text-destructive bg-destructive/10"
                          }`}>
                            {product.available === 1 ? "Available" : "Sold Out"}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-none border-white/20 font-sans text-xs uppercase tracking-widest"
                            onClick={() => handleToggleAvailability(product.id, product.available)}
                            disabled={toggleAvailability.isPending}
                          >
                            {product.available === 1 ? "Mark Sold Out" : "Mark Available"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="rounded-none h-9 w-9"
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={deleteProduct.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {!products?.length && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground font-display text-2xl tracking-widest uppercase">
                          No products yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === "announcements" && (
          <div className="space-y-8">
            <div className="border border-white/10 bg-card p-6">
              <h3 className="font-display text-2xl tracking-widest uppercase mb-6">Post Announcement</h3>
              <Form {...announcementForm}>
                <form onSubmit={announcementForm.handleSubmit(onSubmitAnnouncement)} className="flex gap-4 items-start">
                  <FormField control={announcementForm.control} name="message" render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="E.g. New drop this Friday at 8pm!"
                          {...field}
                          className="rounded-none border-white/20 bg-black/50 h-12 focus-visible:ring-primary font-mono"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="rounded-none h-12 px-8 font-display text-xl tracking-widest uppercase bg-primary text-primary-foreground" disabled={createAnnouncement.isPending}>
                    Post
                  </Button>
                </form>
              </Form>
            </div>

            <div className="border border-white/10 bg-card">
              <h3 className="font-display text-xl tracking-widest uppercase p-6 border-b border-white/10 bg-white/5">Active Announcements</h3>
              <div className="divide-y divide-white/5">
                {announcements?.map((ann) => (
                  <div key={ann.id} className="p-5 flex justify-between items-center hover:bg-white/5 transition-colors">
                    <div className="font-mono text-base flex-1 mr-4">{ann.message}</div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-none shrink-0"
                      onClick={() => {
                        if (confirm("Delete this announcement?")) {
                          deleteAnnouncement.mutate({ id: ann.id }, {
                            onSuccess: () => {
                              queryClient.invalidateQueries({ queryKey: getListAnnouncementsQueryKey() });
                              toast({ title: "Announcement deleted" });
                            },
                          });
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </div>
                ))}
                {!announcements?.length && (
                  <div className="p-8 text-center text-muted-foreground font-display text-2xl tracking-widest uppercase">
                    No announcements yet
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-3xl tracking-widest uppercase">Users</h2>
              <span className="font-sans text-sm text-muted-foreground">{users?.length ?? 0} registered</span>
            </div>

            <div className="border border-white/10 bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans">
                  <thead className="border-b border-white/10 bg-white/5 uppercase text-xs tracking-widest text-muted-foreground">
                    <tr>
                      <th className="p-4 font-normal">User</th>
                      <th className="p-4 font-normal">Country</th>
                      <th className="p-4 font-normal">Role</th>
                      <th className="p-4 font-normal">Status</th>
                      <th className="p-4 font-normal">Reset Code</th>
                      <th className="p-4 font-normal text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users?.map((user) => {
                      const hasResetCode = !!(user as any).resetCode;
                      const codeExpired = hasResetCode && new Date() > new Date((user as any).resetCodeExpiry);
                      return (
                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div className="font-display text-lg tracking-wider uppercase">{user.username}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{user.email}</div>
                          </td>
                          <td className="p-4 text-muted-foreground text-sm uppercase tracking-widest">
                            {(user as any).country ?? "MW"}
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs uppercase tracking-widest font-bold border ${
                              user.role === "admin"
                                ? "border-primary text-primary bg-primary/10"
                                : "border-white/20 text-muted-foreground"
                            }`}>
                              {user.role === "admin" && <ShieldCheck className="w-3 h-3" />}
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex px-2 py-1 text-xs uppercase tracking-widest font-bold border ${
                              user.banned === 1
                                ? "border-destructive text-destructive bg-destructive/10"
                                : "border-green-500/50 text-green-400 bg-green-500/10"
                            }`}>
                              {user.banned === 1 ? "Banned" : "Active"}
                            </span>
                          </td>
                          <td className="p-4">
                            {hasResetCode ? (
                              <div className={`space-y-1 ${codeExpired ? "opacity-50" : ""}`}>
                                <div className="font-mono text-base font-bold text-primary tracking-[0.2em] select-all">
                                  {(user as any).resetCode}
                                </div>
                                <div className={`text-xs uppercase tracking-widest ${codeExpired ? "text-destructive" : "text-zinc-500"}`}>
                                  {codeExpired ? "Expired" : "Active — send via WhatsApp"}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground/40 uppercase tracking-widest">—</span>
                            )}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-none border-white/20 font-sans text-xs uppercase tracking-widest"
                              onClick={() => handleRoleToggle(user.id, user.role)}
                              disabled={setUserRole.isPending}
                            >
                              {user.role === "admin"
                                ? <><ShieldOff className="w-3.5 h-3.5 mr-1" /> Remove Admin</>
                                : <><ShieldCheck className="w-3.5 h-3.5 mr-1" /> Make Admin</>
                              }
                            </Button>
                            <Button
                              variant={user.banned === 1 ? "outline" : "destructive"}
                              size="sm"
                              className={`rounded-none font-sans text-xs uppercase tracking-widest ${
                                user.banned === 1 ? "border-white/20" : ""
                              }`}
                              onClick={() => handleBanToggle(user.id, user.banned)}
                              disabled={banUser.isPending}
                            >
                              {user.banned === 1
                                ? <><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Unban</>
                                : <><Ban className="w-3.5 h-3.5 mr-1" /> Ban</>
                              }
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                    {!users?.length && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground font-display text-2xl tracking-widest uppercase">
                          No users registered yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
