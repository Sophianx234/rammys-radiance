"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  ListFilter,
  ChevronDown,
} from "lucide-react";
import { ProductTableRow } from "./product-table-row";
import Link from "next/link";
import { GridLoader } from "react-spinners";

interface IProduct {
  _id: string | number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  sales: number;
  inStock: boolean;
  isFeatured: boolean;
  category: string;
  image: string;
  images: string[];
  description: string;
  features: string[];
  variants: { name: string; options: string[] }[];
}

export default function ProductsTab() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/products"); 
        if (!res.ok) throw new Error("Failed to fetch products");
        if(res.ok){
          const data = await res.json();
          setProducts(data);
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");

        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Filter and search
  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) => {
      if (selectedCategory === "all") return true;
      // p.category is an OBJECT because populate()
      return (p.category as any)?.name === selectedCategory;
    });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "best-selling":
        return b.sales - a.sales;
      case "top-rated":
        return b.rating - a.rating;
      case "latest":
      default:
        return 0; 
    }
  });

  if (loading) return (
    <div className="absolute sm:relative z-0 flex inset-0 overflow-hidden sm:h-[80vh] items-center justify-center">
      <GridLoader size={18} color="#5B7763" />
    </div>
  );

  return (
    <div className="flex-1 space-y-8 pb-10 max-w-7xl mx-auto">
      {/* ---------- HEADER ---------- */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h2 className="text-[18px] uppercase tracking-widest font-bold text-[#222222]">Products</h2>
          <p className="text-[12px] text-text-muted mt-1 uppercase tracking-wider font-medium">
            Manage your store inventory and collections
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products/add-category" className="bg-secondary/50 text-[#222222] border border-border/40 px-5 py-2.5 text-[11px] uppercase tracking-wider font-bold hover:bg-secondary transition-colors flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" /> New Category
          </Link>
          <Link href="/admin/products/add" className="bg-[#5B7763] text-white px-5 py-2.5 text-[11px] uppercase tracking-wider font-bold hover:bg-opacity-90 transition-colors flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" /> Add New Product
          </Link>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-border/40 p-5">
        <div className="flex flex-col lg:flex-row items-center gap-4 w-full">
          <div className="relative w-full lg:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" strokeWidth={1.5} />
            <Input
              type="text"
              placeholder="Search by product name, SKU, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-secondary/20 border-border/40 text-[12px] pl-9 h-10 placeholder:text-text-muted text-[#222222] rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763] transition-colors"
            />
          </div>

          <Select onValueChange={setSelectedCategory} defaultValue={selectedCategory}>
            <SelectTrigger className="w-full lg:w-[220px] bg-secondary/20 border-border/40 text-[12px] text-[#222222] h-10 rounded-none focus:ring-0 focus:border-[#5B7763]">
              <div className="flex items-center gap-2 text-text-muted">
                <ListFilter className="w-3.5 h-3.5" strokeWidth={1.5} />
                <SelectValue placeholder="All Categories" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-none border-border/40">
              <SelectItem value="all" className="text-[12px]">All Categories</SelectItem>
              {categories.map((cat: any) => (
                <SelectItem key={cat._id} value={cat.name} className="text-[12px]">
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setSortBy} defaultValue={sortBy}>
            <SelectTrigger className="w-full lg:w-[200px] bg-secondary/20 border-border/40 text-[12px] text-[#222222] h-10 rounded-none focus:ring-0 focus:border-[#5B7763]">
              <div className="flex items-center gap-2 text-text-muted">
                <ChevronDown className="w-3.5 h-3.5" strokeWidth={1.5} />
                <SelectValue placeholder="Sort By" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-none border-border/40">
              <SelectItem value="latest" className="text-[12px]">Latest</SelectItem>
              <SelectItem value="price-asc" className="text-[12px]">Price: Low to High</SelectItem>
              <SelectItem value="price-desc" className="text-[12px]">Price: High to Low</SelectItem>
              <SelectItem value="best-selling" className="text-[12px]">Best Selling</SelectItem>
              <SelectItem value="top-rated" className="text-[12px]">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Table */}
      {loading ? (
        <div className="text-center p-16 text-text-muted text-[11px] uppercase tracking-wider font-bold">Loading products...</div>
      ) : sortedProducts.length > 0 ? (
        <div className="bg-white border border-border/40 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/40">
                <TableHead className="text-[10px] uppercase tracking-wider font-bold text-text-muted h-12">Product</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-bold text-text-muted h-12">Category</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-bold text-text-muted h-12">Price</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-bold text-text-muted h-12">Stock</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-bold text-text-muted h-12">Rating</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-bold text-text-muted h-12 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.map((product) => (
                <ProductTableRow key={product._id} product={product} />
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center p-16 bg-white border border-border/40 mt-8 flex flex-col items-center justify-center gap-4">
          <p className="text-text-muted text-[12px]">No products found matching your criteria.</p>
          <Link 
            href='products/add' 
            className="bg-[#5B7763] text-white px-5 py-2.5 text-[11px] uppercase tracking-wider font-bold hover:bg-opacity-90 transition-colors"
          >
            Add First Product
          </Link>
        </div>
      )}
    </div>
  );
}
