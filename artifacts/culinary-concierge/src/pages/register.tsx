import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const [, setLocation] = useLocation();
  const { register } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Xato", description: "Parol kamida 6 ta belgidan iborat bo'lishi kerak", variant: "destructive" });
      return;
    }
    setLoading(true);
    const ok = await register(name, email, password, phone || undefined);
    setLoading(false);
    if (ok) {
      toast({ title: "Muvaffaqiyatli ro'yxatdan o'tdingiz!" });
      setLocation("/profile");
    } else {
      toast({ title: "Xato", description: "Bu email allaqachon ro'yxatdan o'tgan", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">KamuranKabab</h1>
          <p className="text-muted-foreground mt-2">Yangi hisob yarating</p>
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Ismingiz</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Alisher Nazarov"
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                data-testid="input-register-name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                data-testid="input-register-email"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Telefon <span className="text-muted-foreground">(ixtiyoriy)</span></label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                data-testid="input-register-phone"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Parol</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Kamida 6 ta belgi"
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                data-testid="input-register-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading} data-testid="button-register-submit">
              {loading ? "Yaratilmoqda..." : "Ro'yxatdan o'tish"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Hisobingiz bormi?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline" data-testid="link-to-login">
              Kirish
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
