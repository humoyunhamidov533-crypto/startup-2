import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-5 px-4 text-center">
      <div className="text-7xl">🍽️</div>
      <div>
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <p className="text-xl font-semibold text-foreground mt-1">Sahifa topilmadi</p>
        <p className="text-muted-foreground mt-2 text-sm">Siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan</p>
      </div>
      <Link href="/">
        <Button className="gap-2">← Bosh sahifaga qaytish</Button>
      </Link>
    </div>
  );
}
