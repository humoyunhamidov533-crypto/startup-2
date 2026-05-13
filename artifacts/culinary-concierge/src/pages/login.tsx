import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      toast({ title: "Xush kelibsiz!" });
      if (email === "admin@gmail.com") {
        setLocation("/admin");
      } else if (email === "waiter@gmail.com") {
        setLocation("/waiter");
      } else {
        setLocation("/");
      }
    } else {
      toast({ title: "Xato", description: "Email yoki parol noto'g'ri", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🍽️</div>
          <h1 className="text-2xl font-bold text-foreground">Xush kelibsiz</h1>
          <p className="text-muted-foreground mt-1 text-sm">KamuranKabab hisobingizga kiring</p>
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="email@example.com"
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-shadow"
                data-testid="input-login-email" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Parol</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-shadow"
                data-testid="input-login-password" />
            </div>
            <Button type="submit" className="w-full h-11" disabled={loading} data-testid="button-login-submit">
              {loading ? "Kirilmoqda..." : "Kirish"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Hisobingiz yo'qmi?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline" data-testid="link-to-register">
              Ro'yxatdan o'ting
            </Link>
          </p>
        </div>

        <div className="mt-4 bg-muted/60 rounded-xl p-4 space-y-1.5 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground text-xs mb-2">Test kirish ma'lumotlari:</p>
          <p>🔑 Admin: <span className="font-mono text-foreground">admin@gmail.com</span> / <span className="font-mono text-foreground">admin123</span></p>
          <p>🍽️ Ofitsant: <span className="font-mono text-foreground">waiter@gmail.com</span> / <span className="font-mono text-foreground">waiter123</span></p>
        </div>
      </div>
    </div>
  );
}
