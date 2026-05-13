import { useState } from "react";
import { User, Star, Package, MapPin, Phone, Mail, Calendar, Edit2, Check, X, Shield, ChefHat, ChevronRight, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTableOrders } from "@/lib/table-orders-context";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const { tableOrders } = useTableOrders();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-5 px-4">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
          <User size={36} className="text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Tizimga kiring</h2>
        <p className="text-muted-foreground text-center max-w-xs">Profilingizni ko'rish uchun avval tizimga kiring</p>
        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="outline" className="gap-2" data-testid="button-login-profile">
              <User size={16} /> Kirish
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" data-testid="button-register-profile">
              Ro'yxatdan o'tish
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === "admin";
  const isWaiter = user.role === "waiter";
  const isCustomer = user.role === "customer";

  const startEdit = () => {
    setForm({ name: user.name, phone: user.phone ?? "", address: user.address ?? "" });
    setEditing(true);
  };

  const saveEdit = () => {
    if (!form.name.trim()) {
      toast({ title: "Xato", description: "Ism bo'sh bo'lishi mumkin emas", variant: "destructive" });
      return;
    }
    updateUser({ name: form.name.trim(), phone: form.phone.trim() || undefined, address: form.address.trim() || undefined });
    setEditing(false);
    toast({ title: "✅ Profil yangilandi!" });
  };

  const myActiveOrders = tableOrders.filter(o => o.userId === user.id && o.tableStatus !== "bosh");

  const stats = isCustomer ? [
    { label: "Faol bronlar", value: myActiveOrders.length, icon: Package, color: "bg-blue-50 text-blue-600" },
    { label: "Bonus ball", value: user.bonusPoints, icon: Star, color: "bg-amber-50 text-amber-600" },
  ] : isAdmin ? [
    { label: "Jami buyurtmalar", value: tableOrders.length, icon: Package, color: "bg-blue-50 text-blue-600" },
    { label: "Faol stollar", value: tableOrders.filter(o => o.tableStatus !== "bosh").length, icon: MapPin, color: "bg-emerald-50 text-emerald-600" },
  ] : [];

  const infoRows = [
    { icon: Mail, label: "Email", value: user.email },
    { icon: Phone, label: "Telefon", value: user.phone || "Qo'shilmagan" },
    ...(isCustomer ? [
      { icon: MapPin, label: "Manzil", value: user.address || "Qo'shilmagan" },
      { icon: Calendar, label: "Ro'yxatdan o'tgan", value: new Date(user.joinDate).toLocaleDateString("uz-Cyrl-UZ", { year: "numeric", month: "long", day: "numeric" }) },
    ] : []),
  ];

  const roleLabel = isAdmin ? "Administrator" : isWaiter ? "Ofitsant" : "Mijoz";
  const roleColor = isAdmin ? "bg-orange-100 text-orange-600" : isWaiter ? "bg-sky-100 text-sky-600" : "bg-emerald-100 text-emerald-700";
  const roleIcon = isAdmin ? Shield : isWaiter ? ChefHat : User;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-4">

        {/* Main card */}
        <div className="bg-card border border-card-border rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={36} className="text-primary" />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center ${roleColor}`}>
                  {(() => { const Icon = roleIcon; return <Icon size={13} />; })()}
                </div>
              </div>
              {editing ? (
                <div className="space-y-2 flex-1 min-w-0">
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Ismingiz"
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background outline-none focus:ring-2 focus:ring-primary/20"
                    data-testid="input-edit-name" />
                  <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+998 90 123 45 67"
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background outline-none focus:ring-2 focus:ring-primary/20"
                    data-testid="input-edit-phone" />
                  <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                    placeholder="Manzilingiz"
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background outline-none focus:ring-2 focus:ring-primary/20"
                    data-testid="input-edit-address" />
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-bold text-foreground" data-testid="text-user-name">{user.name}</h1>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColor}`}>{roleLabel}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5" data-testid="text-user-email">{user.email}</p>
                  {user.phone && <p className="text-sm text-muted-foreground mt-0.5">{user.phone}</p>}
                </div>
              )}
            </div>
            {isCustomer && (
              editing ? (
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={saveEdit} className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:bg-primary/90" data-testid="button-save-profile">
                    <Check size={16} />
                  </button>
                  <button onClick={() => setEditing(false)} className="w-8 h-8 bg-muted text-muted-foreground rounded-lg flex items-center justify-center hover:bg-muted/80">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button onClick={startEdit} className="w-8 h-8 bg-muted text-muted-foreground rounded-lg flex items-center justify-center hover:bg-muted/80 flex-shrink-0" data-testid="button-edit-profile">
                  <Edit2 size={14} />
                </button>
              )
            )}
          </div>

          {stats.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {stats.map(stat => (
                <div key={stat.label} className={`${stat.color} rounded-xl p-4 flex items-center gap-3`}>
                  <stat.icon size={20} />
                  <div>
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-xs opacity-80">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active reservations for customer */}
        {isCustomer && myActiveOrders.length > 0 && (
          <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Faol bronlarim</h2>
            </div>
            {myActiveOrders.map(o => (
              <div key={o.id} className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                  {o.tableLabel}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{o.tableLabel} stoli · {o.guests} mehmon</p>
                  <p className="text-xs text-muted-foreground">{o.reservationDate} · {o.reservationTime}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                  o.tableStatus === "band" ? "bg-amber-100 text-amber-700" :
                  o.tableStatus === "ovqatlanmoqda" ? "bg-blue-100 text-blue-700" :
                  "bg-emerald-100 text-emerald-700"
                }`}>
                  {o.tableStatus === "band" ? "Band" : o.tableStatus === "ovqatlanmoqda" ? "Faol" : "Tayor"}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Shaxsiy ma'lumotlar</h2>
          </div>
          {infoRows.map(row => (
            <div key={row.label} className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0">
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <row.icon size={15} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{row.label}</p>
                <p className="text-sm font-medium text-foreground">{row.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Tezkor havolalar</h2>
          </div>
          {[
            ...(isCustomer ? [
              { href: "/orders", label: "Buyurtmalarim", icon: Package },
              { href: "/reservation", label: "Joy band qilish", icon: MapPin },
            ] : []),
            ...(isAdmin ? [
              { href: "/admin", label: "Admin Panel", icon: Shield },
              { href: "/waiter", label: "Ofitsant paneli", icon: ChefHat },
            ] : []),
            ...(isWaiter ? [
              { href: "/waiter", label: "Ofitsant paneli", icon: ChefHat },
            ] : []),
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors border-b border-border last:border-0">
              <div className="w-9 h-9 bg-muted rounded-xl flex items-center justify-center">
                <item.icon size={18} className="text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground flex-1">{item.label}</span>
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>
          ))}
        </div>

        <Button variant="outline" className="w-full text-red-500 border-red-200 hover:bg-red-50 gap-2"
          onClick={logout} data-testid="button-logout-profile">
          <LogOut size={16} /> Hisobdan chiqish
        </Button>
      </div>
    </div>
  );
}
