"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Trash2, Search, Filter, Eye, ShoppingBag, User as UserIcon, X, MoreVertical, Copy, Lock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Swal from "sweetalert2";
import { useDashStore } from "@/lib/store";
import { useRouter, useSearchParams } from "next/navigation";
import { updateCustomerRoleAction, toggleSuspendCustomerAction, fetchCustomerOrdersAction, adminChangePasswordAction } from "@/app/actions/customers";
import { useConfirm } from "@/components/ui/confirm-provider";
import { toast } from "sonner";

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

export function CustomersClient({ initialUsers }: { initialUsers: any[] }) {
  const { user } = useDashStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const search = searchParams.get("search") || "";
  const roleFilter = searchParams.get("role") || "all";
  const confirm = useConfirm();

  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  
  const [passwordChangeUser, setPasswordChangeUser] = useState<any | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordChangeLoading, setIsPasswordChangeLoading] = useState(false);

  const updateURL = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all") params.set(key, value);
      else params.delete(key);
    });
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleViewUser = async (u: any) => {
    setSelectedUser(u);
    setIsDetailOpen(true);
    setOrdersLoading(true);
    const res = await fetchCustomerOrdersAction(u._id);
    if (res.success) {
      setUserOrders(res.orders);
    } else {
      setUserOrders([]);
    }
    setOrdersLoading(false);
  };

  const handleUpdateRole = async (newRole: string) => {
    if (!selectedUser) return;
    const res = await updateCustomerRoleAction(selectedUser._id, newRole);
    if (res.success) {
      setUsers(users.map(u => u._id === selectedUser._id ? { ...u, role: newRole } : u));
      setSelectedUser({ ...selectedUser, role: newRole });
      toast.success(`ROLE UPDATED TO ${newRole.toUpperCase()}`);
    } else {
      toast.error("FAILED TO UPDATE ROLE");
    }
  };

  const handleSuspendUser = async (u: any) => {
    const isSuspended = u.isSuspended;
    const actionText = isSuspended ? "Unsuspend" : "Suspend";
    const isConfirmed = await confirm({
      title: `${actionText} User?`,
      description: isSuspended ? "They will be able to log in and place orders again." : "They will not be able to log in or place orders until unsuspended.",
      confirmText: `Yes, ${actionText}`,
      variant: isSuspended ? "primary" : "destructive"
    });

    if (isConfirmed) {
      const res = await toggleSuspendCustomerAction(u._id, isSuspended);
      if (res.success) {
        setUsers(users.map(user => user._id === u._id ? { ...user, isSuspended: !isSuspended } : user));
        if (selectedUser?._id === u._id) setSelectedUser({ ...selectedUser, isSuspended: !isSuspended });
        toast.success(`USER ${isSuspended ? 'UNSUSPENDED' : 'SUSPENDED'} SUCCESSFULLY`);
      } else {
        toast.error("FAILED TO UPDATE SUSPENSION STATUS");
      }
    }
  };

  const handleChangePasswordSubmit = async () => {
    if (!passwordChangeUser || !newPassword) return;
    setIsPasswordChangeLoading(true);
    const res = await adminChangePasswordAction(passwordChangeUser._id, newPassword);
    if (res.success) {
      toast.success("PASSWORD UPDATED SUCCESSFULLY");
      setPasswordChangeUser(null);
      setNewPassword("");
    } else {
      toast.error(res.error || "FAILED TO UPDATE PASSWORD");
    }
    setIsPasswordChangeLoading(false);
  };

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
              onChange={(e) => updateURL({ search: e.target.value })}
            />
            {search && (
              <button 
                onClick={() => updateURL({ search: null })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-[#222222]"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            )}
          </div>

          <Select value={roleFilter} onValueChange={(val) => updateURL({ role: val })}>
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
            onClick={() => updateURL({ search: null, role: null })} 
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
            {users.length === 0 ? (
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
              users.map((u) => (
                <tr key={u._id} className="group hover:bg-secondary/10 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img 
                        src={u.profile || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random`} 
                        alt={u.name} 
                        className="h-10 w-10 object-cover border border-border/40" 
                      />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-[#222222]">{u.name}</span>
                        <span className="text-[11px] text-text-muted tracking-wider">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col items-start gap-1">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold border ${getRoleBadgeStyle(u.role)}`}>
                        {u.role}
                      </span>
                      {u.isSuspended && (
                        <span className="inline-flex items-center justify-center px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold border bg-red-50 text-red-700 border-red-200 mt-1">
                          Suspended
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[11px] text-text-muted tracking-wider">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="py-4 px-6 text-center text-[12px] font-mono text-text-muted">
                    {u.orders || 0}
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
                          onClick={() => handleViewUser(u)}
                          className="text-[11px] uppercase tracking-wider font-bold text-[#222222] cursor-pointer rounded-none focus:bg-secondary/50 py-2.5 px-3"
                        >
                          <Eye className="mr-2 h-3.5 w-3.5" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            navigator.clipboard.writeText(u.email || u.phone || "");
                            toast.success("COPIED TO CLIPBOARD");
                          }}
                          className="text-[11px] uppercase tracking-wider font-bold text-[#222222] cursor-pointer rounded-none focus:bg-secondary/50 py-2.5 px-3"
                        >
                          <Copy className="mr-2 h-3.5 w-3.5" /> Copy Contact
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/40" />
                        <DropdownMenuItem 
                          onClick={() => setPasswordChangeUser(u)}
                          className="text-[11px] uppercase tracking-wider font-bold text-[#222222] cursor-pointer rounded-none focus:bg-secondary/50 py-2.5 px-3"
                        >
                          <Lock className="mr-2 h-3.5 w-3.5" /> Change Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/40" />
                          <DropdownMenuItem 
                            onClick={() => handleSuspendUser(u)} 
                            className={`text-[11px] uppercase tracking-wider font-bold cursor-pointer rounded-none py-2.5 px-3 ${u.isSuspended ? 'text-[#5B7763] focus:bg-[#5B7763]/10 focus:text-[#5B7763]' : 'text-red-600 focus:bg-red-50 focus:text-red-700'}`}
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> {u.isSuspended ? "Unsuspend User" : "Suspend User"}
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
        <DialogContent showCloseButton={false} className="max-w-6xl w-[95vw] h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-[#fdfbf7] rounded-none border border-border/40">
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
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold border ${getRoleBadgeStyle(selectedUser.role)}`}>
                        {selectedUser.role}
                      </span>
                      {selectedUser.isSuspended && (
                        <span className="inline-flex items-center justify-center px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold border bg-red-50 text-red-700 border-red-200">
                          Suspended
                        </span>
                      )}
                      {selectedUser.createdAt && (
                        <>
                          <span className="w-px h-4 bg-border/40 mx-1 hidden sm:block" />
                          <span className="text-[10px] uppercase tracking-widest font-bold text-text-muted">
                            Joined {new Date(selectedUser.createdAt).getFullYear()}
                          </span>
                        </>
                      )}
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
                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
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

      {/* CHANGE PASSWORD DIALOG */}
      <Dialog open={!!passwordChangeUser} onOpenChange={(open) => !open && setPasswordChangeUser(null)}>
        <DialogContent className="rounded-none border border-border/40 bg-white sm:max-w-md">
          <DialogTitle className="text-[14px] uppercase tracking-widest font-bold text-[#222222] border-b border-border/40 pb-4">
            Change User Password
          </DialogTitle>
          <div className="py-4 space-y-4">
            <p className="text-[11px] text-text-muted tracking-wide">
              Enter a new password for <span className="font-bold text-black">{passwordChangeUser?.name}</span>.
            </p>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-text-muted">New Password</label>
              <Input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-12 rounded-none border-border/40 focus-visible:ring-0 focus-visible:border-black"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setPasswordChangeUser(null)}
              className="px-6 py-3 border border-border/40 text-[10px] uppercase tracking-widest font-bold text-text-muted hover:text-black hover:bg-secondary/50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleChangePasswordSubmit}
              disabled={isPasswordChangeLoading || !newPassword}
              className="px-6 py-3 bg-black text-white text-[10px] uppercase tracking-widest font-bold hover:bg-black/90 transition-colors disabled:opacity-50"
            >
              {isPasswordChangeLoading ? "Saving..." : "Save Password"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
