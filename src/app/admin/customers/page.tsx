'use client'

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Trash2, Search, Filter, Eye, ShoppingBag, User as UserIcon, X, MoreVertical, Copy } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { GridLoader } from "react-spinners";

// --- Types based on your Schemas ---

interface IOrderSummary {
  _id: string;
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: string;
  createdAt: string;
  itemsCount: number;
}

interface IUser {
  _id: string;
  name: string;
  email: string;
  profile?: string;
  role: "customer" | "admin" | "buyer" | "dispatcher";
  createdAt: string;
  wishlist: any[]; 
  orders:number
}

const Toast = withReactContent(Swal).mixin({
  toast: true,
  position: "bottom-right",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  customClass: {
    popup: "rounded-none border border-border/40 bg-white",
    title: "text-[12px] uppercase tracking-wider font-bold text-[#222222]",
  },
});

// --- Helper Functions ---

const getRoleBadgeStyle = (role: string) => {
  switch (role) {
    case "admin": return "bg-red-50 text-red-700 border-red-200";
    case "dispatcher": return "bg-blue-50 text-blue-700 border-blue-200";
    case "buyer": return "bg-[#5B7763]/10 text-[#5B7763] border-[#5B7763]/20";
    default: return "bg-secondary/50 text-[#222222] border-border/40";
  }
};

const getOrderStatusColor = (status: string) => {
  switch (status) {
    case "delivered": return "bg-[#5B7763]/10 text-[#5B7763] border-[#5B7763]/20";
    case "cancelled": return "bg-red-50 text-red-700 border-red-200";
    case "processing": return "bg-blue-50 text-blue-700 border-blue-200";
    default: return "bg-secondary/50 text-[#222222] border-border/40";
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(amount);
};

export default function AdminUsersPage() {
  // --- State ---
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Selection & Modals
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // User Specific Data (fetched on demand)
  const [userOrders, setUserOrders] = useState<IOrderSummary[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // --- Fetching ---

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      setUsers(Array.isArray(data.customers) ? data.customers : []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders when a user is selected for view
  const fetchUserOrders = async (userId: string) => {
    setOrdersLoading(true);
    try {
      const res = await fetch(`/api/orders?userId=${userId}`);
      const data = await res.json();
      setUserOrders(data.orders || []); 
    } catch (error) {
      console.error("Error fetching user orders:", error);
      setUserOrders([]); // Fallback empty
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Handlers ---

  const handleViewUser = (user: IUser) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
    fetchUserOrders(user._id);
  };

  const handleUpdateRole = async (newRole: string) => {
    if (!selectedUser) return;
    try {
      const res = await fetch(`/api/users/${selectedUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }), // Only sending role update
      });
      
      if (res.ok) {
        setUsers(users.map(u => u._id === selectedUser._id ? { ...u, role: newRole as any } : u));
        setSelectedUser({ ...selectedUser, role: newRole as any });

        Toast.fire({
          icon: "success",
          title: `ROLE UPDATED TO ${newRole.toUpperCase()}`,
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "FAILED TO UPDATE ROLE",
        });
      }
    } catch (error) {
      console.error("Error updating role:", error);
      Toast.fire({
        icon: "error",
        title: "SOMETHING WENT WRONG",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    const result = await Swal.fire({
      title: "DELETE USER?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "YES, DELETE",
      cancelButtonText: "CANCEL",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#5B7763",
      reverseButtons: true,
      customClass: { 
        popup: "rounded-none border border-border/40 bg-white",
        title: "text-[14px] uppercase tracking-widest font-bold text-[#222222]",
        confirmButton: "rounded-none text-[11px] uppercase tracking-wider font-bold",
        cancelButton: "rounded-none text-[11px] uppercase tracking-wider font-bold"
      },
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });

      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
        if (selectedUser?._id === id) setIsDetailOpen(false);

        Toast.fire({
          icon: "success",
          title: "USER DELETED SUCCESSFULLY",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "FAILED TO DELETE USER",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Toast.fire({
        icon: "error",
        title: "UNEXPECTED ERROR OCCURRED",
      });
    }
  };

  // --- Filtering Logic ---

  const filteredUsers = users.filter((u) => {
    const matchesSearch = (u.name?.toLowerCase() || "").includes(search.toLowerCase()) || 
                          (u.email?.toLowerCase() || "").includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) return (
    <div className="absolute sm:relative flex inset-0 sm:h-dvh items-center justify-center">
      <GridLoader size={18} color="#5B7763" />
    </div>
  )

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-6 space-y-8 max-w-7xl mx-auto pb-20"
    >
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-6">
        <div>
          <h2 className="text-[18px] uppercase tracking-widest font-bold text-[#222222]">User Management</h2>
          <p className="text-[12px] text-text-muted mt-1 tracking-wider font-medium">
            View, filter, and manage system users and their roles.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-border/40 px-4 py-2">
          <span className="text-[11px] uppercase tracking-wider font-bold text-text-muted">Total Users</span>
          <span className="w-px h-4 bg-border/40 mx-1" />
          <span className="text-[13px] font-bold text-[#222222]">{users.length}</span>
        </div>
      </header>

      {/* FILTER BAR */}
      <div className="bg-white border border-border/40 p-4 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="flex flex-1 items-center gap-3 w-full">
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted group-focus-within:text-[#5B7763] transition-colors" />
            <Input
              placeholder="SEARCH BY NAME OR EMAIL..."
              className="pl-11 pr-10 bg-secondary/20 border-border/40 text-[11px] uppercase tracking-wider h-12 rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-[#222222]"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            )}
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px] h-12 rounded-none text-[11px] uppercase tracking-wider font-bold focus:ring-0 bg-white border-border/40 text-[#222222]">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 flex-shrink-0" />
                <SelectValue placeholder="FILTER ROLE" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-none border-border/40">
              <SelectItem value="all" className="text-[11px] uppercase tracking-wider cursor-pointer">All Roles</SelectItem>
              <SelectItem value="customer" className="text-[11px] uppercase tracking-wider cursor-pointer">Customer</SelectItem>
              <SelectItem value="admin" className="text-[11px] uppercase tracking-wider cursor-pointer">Admin</SelectItem>
              <SelectItem value="buyer" className="text-[11px] uppercase tracking-wider cursor-pointer">Buyer</SelectItem>
              <SelectItem value="dispatcher" className="text-[11px] uppercase tracking-wider cursor-pointer">Dispatcher</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Reset Button */}
        {(search || roleFilter !== "all") && (
          <button 
            onClick={() => { setSearch(""); setRoleFilter("all"); }} 
            className="h-12 px-4 text-[11px] uppercase tracking-wider font-bold text-text-muted hover:text-red-600 transition-colors flex items-center justify-center gap-2 border border-transparent hover:border-red-200 hover:bg-red-50"
          >
            RESET <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* MAIN USER TABLE */}
      <div className="bg-white border border-border/40 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/40 bg-secondary/20">
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-text-muted w-[250px]">User Profile</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-text-muted">Role</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-text-muted">Joined Date</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-text-muted text-center">Orders</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-text-muted text-center w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-text-muted">
                      <div className="bg-secondary/20 p-4 rounded-full mb-4">
                         <Search className="h-6 w-6 opacity-50" />
                      </div>
                      <p className="text-[13px] font-bold uppercase tracking-wider text-[#222222]">No users found</p>
                      <p className="text-[11px] mt-2 tracking-wider">Try adjusting your filters or search query.</p>
                    </div>
                  </td>
                </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="group hover:bg-secondary/10 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.profile || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                        alt={user.name} 
                        className="h-10 w-10 object-cover border border-border/40" 
                      />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-[#222222]">{user.name}</span>
                        <span className="text-[11px] text-text-muted tracking-wider">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold border ${getRoleBadgeStyle(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[11px] text-text-muted tracking-wider">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-center text-[12px] font-mono text-text-muted">
                    {user.orders || 0}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-8 w-8 inline-flex items-center justify-center text-text-muted hover:text-[#222222] hover:bg-secondary/50 transition-colors border border-transparent hover:border-border/40">
                          <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-none border-border/40 shadow-sm w-48">
                        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-text-muted font-bold px-3 py-2">Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleViewUser(user)}
                          className="text-[11px] uppercase tracking-wider font-bold text-[#222222] cursor-pointer rounded-none focus:bg-secondary/50 py-2.5 px-3"
                        >
                          <Eye className="mr-2 h-3.5 w-3.5" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            navigator.clipboard.writeText(user.email);
                            Toast.fire({ icon: "success", title: "EMAIL COPIED TO CLIPBOARD" });
                          }}
                          className="text-[11px] uppercase tracking-wider font-bold text-[#222222] cursor-pointer rounded-none focus:bg-secondary/50 py-2.5 px-3"
                        >
                          <Copy className="mr-2 h-3.5 w-3.5" /> Copy Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/40" />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteUser(user._id)} 
                          className="text-[11px] uppercase tracking-wider font-bold text-red-600 cursor-pointer rounded-none focus:bg-red-50 focus:text-red-700 py-2.5 px-3"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DETAILED USER VIEW DIALOG */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent showCloseButton={false} className="max-w-4xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-[#fdfbf7] rounded-none border border-border/40">
          
          {selectedUser && (
            <>
              {/* Modal Header */}
              <div className="p-8 bg-white border-b border-border/40 relative">
                <button 
                  onClick={() => setIsDetailOpen(false)}
                  className="absolute top-8 right-8 w-8 h-8 flex items-center justify-center border border-border/40 text-text-muted hover:text-[#222222] hover:bg-secondary/50 transition-colors"
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <div className="flex items-center gap-6">
                  <img 
                    src={selectedUser.profile || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}`} 
                    className="w-20 h-20 border border-border/40 object-cover"
                  />
                  <div className="space-y-2">
                    <DialogTitle className="text-[20px] uppercase tracking-widest font-bold text-[#222222]">{selectedUser.name}</DialogTitle>
                    <DialogDescription className="text-[12px] text-text-muted tracking-wider">{selectedUser.email}</DialogDescription>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold border ${getRoleBadgeStyle(selectedUser.role)}`}>
                        {selectedUser.role}
                      </span>
                      <span className="w-px h-4 bg-border/40 mx-1" />
                      <span className="text-[10px] uppercase tracking-widest font-bold text-text-muted">
                        Joined {new Date(selectedUser.createdAt).getFullYear()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Content with Tabs */}
              <div className="flex-1 overflow-y-auto scrollbar-hide p-8">
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-secondary/20 border border-border/40 rounded-none h-12 p-1">
                    <TabsTrigger value="profile" className="rounded-none text-[11px] uppercase tracking-wider font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#5B7763]">Profile & Settings</TabsTrigger>
                    <TabsTrigger value="orders" className="rounded-none text-[11px] uppercase tracking-wider font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#5B7763]">Order History</TabsTrigger>
                  </TabsList>

                  {/* TAB 1: PROFILE & SETTINGS */}
                  <TabsContent value="profile" className="space-y-8">
                    <div className="bg-white border border-border/40 p-6 space-y-6">
                      <h3 className="text-[12px] uppercase tracking-widest font-bold text-[#222222] flex items-center gap-2 border-b border-border/40 pb-4">
                        <UserIcon className="w-4 h-4 text-[#5B7763]" strokeWidth={1.5} /> Role Management
                      </h3>
                      
                      <div className="bg-orange-50 border border-orange-200 p-4 text-[11px] text-orange-800 tracking-wider">
                        <strong>WARNING:</strong> Changing a user's role grants them different permissions. Admins have full access.
                      </div>
                      
                      <div className="max-w-xs space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-text-muted">Current Role</label>
                        <Select 
                          value={selectedUser.role} 
                          onValueChange={handleUpdateRole}
                        >
                          <SelectTrigger className="h-12 rounded-none text-[11px] uppercase tracking-wider font-bold focus:ring-0 bg-secondary/20 border-border/40 text-[#222222]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-none border-border/40">
                            <SelectItem value="customer" className="text-[11px] uppercase tracking-wider cursor-pointer">Customer</SelectItem>
                            <SelectItem value="admin" className="text-[11px] uppercase tracking-wider cursor-pointer">Admin</SelectItem>
                            <SelectItem value="buyer" className="text-[11px] uppercase tracking-wider cursor-pointer">Buyer</SelectItem>
                            <SelectItem value="dispatcher" className="text-[11px] uppercase tracking-wider cursor-pointer">Dispatcher</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="bg-white border border-border/40 p-6 space-y-6">
                      <h3 className="text-[12px] uppercase tracking-widest font-bold text-[#222222] border-b border-border/40 pb-4">
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-[9px] text-text-muted uppercase tracking-widest font-bold">Email Address</label>
                          <p className="text-[12px] font-medium text-[#222222]">{selectedUser.email}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-text-muted uppercase tracking-widest font-bold">User ID</label>
                          <p className="text-[12px] font-mono font-medium text-text-muted">{selectedUser._id}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* TAB 2: ORDER HISTORY */}
                  <TabsContent value="orders">
                    <div className="bg-white border border-border/40 overflow-hidden">
                      <div className="p-6 border-b border-border/40 flex items-center justify-between">
                        <h3 className="text-[12px] uppercase tracking-widest font-bold text-[#222222] flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-[#5B7763]" strokeWidth={1.5} /> Past Orders
                        </h3>
                        {userOrders.length > 0 && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted border border-border/40 px-2 py-1">
                            {userOrders.length} Orders
                          </span>
                        )}
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-border/40 bg-secondary/20">
                              <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-text-muted">Order ID</th>
                              <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-text-muted">Date</th>
                              <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-text-muted">Status</th>
                              <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-text-muted">Payment</th>
                              <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-text-muted text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/40">
                            {ordersLoading ? (
                              <tr>
                                <td colSpan={5} className="py-12 text-center text-[11px] text-text-muted uppercase tracking-wider font-bold">Loading orders...</td>
                              </tr>
                            ) : userOrders.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="py-12 text-center text-[11px] text-text-muted uppercase tracking-wider font-bold">
                                  No orders found for this user.
                                </td>
                              </tr>
                            ) : (
                              userOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-secondary/10 transition-colors">
                                  <td className="py-4 px-6 font-mono text-[11px] font-medium text-[#222222]">
                                    {order._id.slice(-6).toUpperCase()}
                                  </td>
                                  <td className="py-4 px-6 text-[11px] text-text-muted tracking-wider">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </td>
                                  <td className="py-4 px-6">
                                    <span className={`inline-flex items-center justify-center px-2 py-1 text-[9px] uppercase tracking-widest font-bold border ${getOrderStatusColor(order.orderStatus)}`}>
                                      {order.orderStatus}
                                    </span>
                                  </td>
                                  <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                      <span className={`w-2 h-2 rounded-none ${order.paymentStatus === 'paid' ? 'bg-[#5B7763]' : order.paymentStatus === 'pending' ? 'bg-orange-500' : 'bg-red-500'}`} />
                                      <span className="text-[11px] uppercase tracking-wider font-bold text-[#222222]">{order.paymentStatus}</span>
                                    </div>
                                  </td>
                                  <td className="py-4 px-6 text-right text-[12px] font-bold text-[#222222]">
                                    {formatCurrency(order.totalAmount)}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <DialogFooter className="p-6 border-t border-border/40 bg-white">
                <button 
                  onClick={() => setIsDetailOpen(false)}
                  className="bg-white border border-border/40 text-[#222222] px-6 py-3 text-[11px] uppercase tracking-wider font-bold hover:bg-secondary/50 transition-colors"
                >
                  Close Details
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}