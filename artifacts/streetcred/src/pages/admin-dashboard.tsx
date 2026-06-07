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
  useUpdateProduct,
  useDeleteProduct,
  useToggleProductAvailability,
  useListAnnouncements,
  useCreateAnnouncement,
  useDeleteAnnouncement,
  getListProductsQueryKey,
  getGetProductStatsQueryKey,
  getListAnnouncementsQueryKey,
  getAdminVerifyQueryKey,
} from "@workspace/api-client-react";
import { clearAdminToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Power, Edit, Image as ImageIcon, MessageSquare, Package, Upload } from "lucide-react";
import logoPath from "@assets/IMG-20260606-WA0072_1780821751075.jpg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"products" | "announcements">("products");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Authentication check
  const { isLoading: isVerifying, isError: isVerifyError } = useAdminVerify({
    query: {
      queryKey: getAdminVerifyQueryKey(),
      retry: false,
    }
  });

  // Queries
  const { data: stats } = useGetProductStats({ query: { queryKey: getGetProductStatsQueryKey(), enabled: !isVerifyError } });
  const { data: products } = useListProducts(undefined, { query: { queryKey: getListProductsQueryKey(), enabled: !isVerifyError } });
  const { data: announcements } = useListAnnouncements({ query: { queryKey: getListAnnouncementsQueryKey(), enabled: !isVerifyError } });

  // Mutations
  const createProduct = useCreateProduct();
  const toggleAvailability = useToggleProductAvailability();
  const deleteProduct = useDeleteProduct();
  const createAnnouncement = useCreateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();

  const productForm = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      sizes: "S, M, L, XL",
      imageUrl: "",
      whatsappNumber: "",
      featured: 0,
    },
  });

  const announcementForm = useForm<z.infer<typeof announcementSchema>>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { message: "" }
  });

  if (isVerifyError) {
    clearAdminToken();
    setLocation("/admin/login");
    return null;
  }

  if (isVerifying) {
    return <div className="min-h-screen flex items-center justify-center font-display text-2xl uppercase tracking-widest text-primary">Initializing System...</div>;
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
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });
      
      if (!res.ok) throw new Error("Upload failed");
      
      const data = await res.json();
      productForm.setValue("imageUrl", data.url);
      
      toast({ title: "Image uploaded successfully" });
    } catch (error) {
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
        toast({ title: "Product created" });
      }
    });
  };

  const onSubmitAnnouncement = (data: z.infer<typeof announcementSchema>) => {
    createAnnouncement.mutate({ data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAnnouncementsQueryKey() });
        announcementForm.reset();
        toast({ title: "Announcement published" });
      }
    });
  };

  const handleToggleAvailability = (id: number, current: number) => {
    toggleAvailability.mutate({ id, data: { available: current === 1 ? 0 : 1 } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetProductStatsQueryKey() });
        toast({ title: "Availability updated" });
      }
    });
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetProductStatsQueryKey() });
          toast({ title: "Product deleted" });
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Topbar */}
      <header className="border-b border-white/10 bg-card/50 sticky top-0 z-40 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoPath} alt="Streetcred" className="w-8 h-8 border border-white/20" />
            <span className="font-display text-xl tracking-widest uppercase text-primary">Command Center</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="font-sans text-xs tracking-widest uppercase hover:bg-destructive/20 hover:text-destructive">
            <Power className="w-4 h-4 mr-2" /> Disconnect
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-card border border-white/10 p-6 flex flex-col justify-between">
            <div className="font-sans text-xs tracking-widest uppercase text-muted-foreground mb-4">Total Products</div>
            <div className="font-display text-6xl text-white">{stats?.total || 0}</div>
          </div>
          <div className="bg-card border border-white/10 p-6 flex flex-col justify-between border-t-4 border-t-primary">
            <div className="font-sans text-xs tracking-widest uppercase text-primary mb-4">Available / In Stock</div>
            <div className="font-display text-6xl text-primary">{stats?.available || 0}</div>
          </div>
          <div className="bg-card border border-white/10 p-6 flex flex-col justify-between border-t-4 border-t-destructive">
            <div className="font-sans text-xs tracking-widest uppercase text-destructive mb-4">Sold Out</div>
            <div className="font-display text-6xl text-destructive">{stats?.unavailable || 0}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10 pb-px">
          <button 
            className={`pb-4 font-display text-xl tracking-wider uppercase transition-colors relative ${activeTab === 'products' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}
            onClick={() => setActiveTab('products')}
          >
            <Package className="inline-block w-5 h-5 mr-2 mb-1" /> Products
            {activeTab === 'products' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary" />}
          </button>
          <button 
            className={`pb-4 font-display text-xl tracking-wider uppercase transition-colors relative ${activeTab === 'announcements' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}
            onClick={() => setActiveTab('announcements')}
          >
            <MessageSquare className="inline-block w-5 h-5 mr-2 mb-1" /> Announcements
            {activeTab === 'announcements' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary" />}
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-3xl tracking-widest uppercase">Inventory</h2>
              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-none font-display text-lg tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="w-5 h-5 mr-2" /> New Drop
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border border-white/10 rounded-none sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="font-display text-3xl tracking-widest uppercase">Create Product</DialogTitle>
                  </DialogHeader>
                  <Form {...productForm}>
                    <form onSubmit={productForm.handleSubmit(onSubmitProduct)} className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={productForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="uppercase text-xs tracking-widest">Name</FormLabel>
                              <FormControl><Input {...field} className="rounded-none border-white/20 bg-black/50 focus-visible:ring-primary" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={productForm.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="uppercase text-xs tracking-widest">Price (MWK)</FormLabel>
                              <FormControl><Input type="number" {...field} className="rounded-none border-white/20 bg-black/50 focus-visible:ring-primary" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={productForm.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="uppercase text-xs tracking-widest">Category</FormLabel>
                              <FormControl><Input {...field} placeholder="Hoodies, Tees..." className="rounded-none border-white/20 bg-black/50 focus-visible:ring-primary" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={productForm.control}
                          name="sizes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="uppercase text-xs tracking-widest">Sizes (comma separated)</FormLabel>
                              <FormControl><Input {...field} placeholder="S, M, L, XL" className="rounded-none border-white/20 bg-black/50 focus-visible:ring-primary" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={productForm.control}
                        name="whatsappNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="uppercase text-xs tracking-widest">Your WhatsApp Number</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="+265999000000"
                                className="rounded-none border-white/20 bg-black/50 focus-visible:ring-primary"
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">Orders for this item go directly to this number</p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <FormLabel className="uppercase text-xs tracking-widest">Image Upload</FormLabel>
                        <div className="flex gap-4 items-center">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="rounded-none border-white/20"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                          >
                            <Upload className="w-4 h-4 mr-2" /> {uploadingImage ? 'Uploading...' : 'Choose File'}
                          </Button>
                          <input 
                            type="file" 
                            className="hidden" 
                            ref={fileInputRef} 
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                          {productForm.watch("imageUrl") && (
                            <div className="h-12 w-12 border border-white/20 bg-black overflow-hidden relative">
                              <img src={productForm.watch("imageUrl")} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>

                      <FormField
                        control={productForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="uppercase text-xs tracking-widest">Description</FormLabel>
                            <FormControl><Textarea {...field} className="rounded-none border-white/20 bg-black/50 focus-visible:ring-primary min-h-[100px]" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex items-center gap-2 py-2 border border-white/10 p-4 bg-white/5">
                        <input 
                          type="checkbox" 
                          id="featured" 
                          checked={productForm.watch("featured") === 1}
                          onChange={(e) => productForm.setValue("featured", e.target.checked ? 1 : 0)}
                          className="w-5 h-5 accent-primary bg-black border-white/20"
                        />
                        <label htmlFor="featured" className="uppercase text-sm tracking-widest text-primary font-bold cursor-pointer">Mark as New Drop / Featured</label>
                      </div>

                      <Button type="submit" className="w-full rounded-none h-12 font-display text-xl tracking-widest uppercase" disabled={createProduct.isPending || uploadingImage}>
                        Create Product
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
                    {products?.map(product => (
                      <tr key={product.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 w-24">
                          <div className="w-16 h-20 bg-black border border-white/10 flex items-center justify-center overflow-hidden">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-muted-foreground/50" />
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-display text-2xl tracking-wider uppercase mb-1">{product.name}</div>
                          <div className="text-xs text-muted-foreground uppercase tracking-widest">{product.category} {product.featured === 1 && <span className="text-primary ml-2">• FEATURED</span>}</div>
                        </td>
                        <td className="p-4 font-mono">MWK {product.price.toLocaleString()}</td>
                        <td className="p-4">
                          <div className={`inline-flex px-2 py-1 text-xs uppercase tracking-widest font-bold border ${product.available === 1 ? 'border-primary text-primary bg-primary/10' : 'border-destructive text-destructive bg-destructive/10'}`}>
                            {product.available === 1 ? 'Available' : 'Sold Out'}
                          </div>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-none border-white/20 font-sans text-xs uppercase tracking-widest"
                            onClick={() => handleToggleAvailability(product.id, product.available)}
                            disabled={toggleAvailability.isPending}
                          >
                            {product.available === 1 ? 'Mark Sold Out' : 'Restock'}
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
                        <td colSpan={5} className="p-8 text-center text-muted-foreground font-display text-2xl tracking-widest uppercase">No products in inventory</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="space-y-8">
            <div className="border border-white/10 bg-card p-6">
              <h3 className="font-display text-2xl tracking-widest uppercase mb-6">Broadcast New Message</h3>
              <Form {...announcementForm}>
                <form onSubmit={announcementForm.handleSubmit(onSubmitAnnouncement)} className="flex gap-4 items-start">
                  <FormField
                    control={announcementForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="E.g. NEW DROP THIS FRIDAY AT 8PM CAT" {...field} className="rounded-none border-white/20 bg-black/50 h-12 focus-visible:ring-primary font-mono" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="rounded-none h-12 px-8 font-display text-xl tracking-widest uppercase bg-primary text-primary-foreground" disabled={createAnnouncement.isPending}>
                    Publish
                  </Button>
                </form>
              </Form>
            </div>

            <div className="border border-white/10 bg-card">
              <h3 className="font-display text-xl tracking-widest uppercase p-6 border-b border-white/10 bg-white/5">Active Broadcasts</h3>
              <div className="divide-y divide-white/5">
                {announcements?.map(announcement => (
                  <div key={announcement.id} className="p-6 flex justify-between items-center group hover:bg-white/5 transition-colors">
                    <div className="font-mono text-lg">{announcement.message}</div>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        if (confirm("Delete this broadcast?")) {
                          deleteAnnouncement.mutate({ id: announcement.id }, {
                            onSuccess: () => {
                              queryClient.invalidateQueries({ queryKey: getListAnnouncementsQueryKey() });
                              toast({ title: "Broadcast deleted" });
                            }
                          })
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </div>
                ))}
                {!announcements?.length && (
                  <div className="p-8 text-center text-muted-foreground font-display text-2xl tracking-widest uppercase">No active broadcasts</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
