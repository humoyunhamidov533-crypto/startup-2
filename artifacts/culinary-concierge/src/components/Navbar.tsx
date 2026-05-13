import { Link, useLocation } from "wouter";
import { ShoppingCart, User, LogOut, Menu, X, Shield, ChefHat } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Bosh sahifa" },
  { href: "/menu", label: "Menu" },
  { href: "/reservation", label: "Joy band qilish" },
  { href: "/orders", label: "Buyurtmalar" },
  { href: "/profile", label: "Profil" },
];

export default function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (user?.role === "waiter") {
    return (
      <header className="sticky top-0 z-50 bg-orange-500 border-b border-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-2 text-white font-bold">
            <ChefHat size={20} /> Ofitsant Paneli
          </div>
          <div className="flex items-center gap-3">
            <span className="text-orange-100 text-sm">{user.name}</span>
            <button onClick={logout} className="text-orange-100 hover:text-white"><LogOut size={18} /></button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold text-primary tracking-tight" data-testid="link-logo">
          KamuranKabab
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}
              data-testid={`nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                location === link.href
                  ? "text-primary border-b-2 border-primary rounded-none"
                  : "text-muted-foreground hover:text-foreground"
              }`}>
              {link.label}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link href="/admin"
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 transition-colors ${
                location === "/admin" ? "text-primary border-b-2 border-primary rounded-none" : "text-orange-500 hover:text-orange-600"
              }`}>
              <Shield size={14} /> Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/cart" className="relative p-2 rounded-lg hover:bg-muted transition-colors" data-testid="link-cart">
            <ShoppingCart size={20} className="text-foreground" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{count}</span>
            )}
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-muted-foreground max-w-[120px] truncate">{user.name}</span>
              <Button variant="ghost" size="sm" onClick={logout} data-testid="button-logout"><LogOut size={16} /></Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login"><Button variant="ghost" size="sm" data-testid="button-login"><User size={16} className="mr-1" /> Kirish</Button></Link>
              <Link href="/register"><Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white" data-testid="button-register">Ro'yxatdan o'tish</Button></Link>
            </div>
          )}

          <button className="md:hidden p-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(!mobileOpen)} data-testid="button-mobile-menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-2">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location === link.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}>{link.label}</Link>
          ))}
          {user?.role === "admin" && (
            <Link href="/admin" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-md text-sm font-medium text-orange-500 flex items-center gap-1">
              <Shield size={14} /> Admin Panel
            </Link>
          )}
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            {user ? (
              <Button variant="outline" size="sm" onClick={() => { logout(); setMobileOpen(false); }}><LogOut size={16} className="mr-1" /> Chiqish</Button>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}><Button variant="outline" size="sm" className="w-full">Kirish</Button></Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}><Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600 text-white">Ro'yxatdan o'tish</Button></Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
