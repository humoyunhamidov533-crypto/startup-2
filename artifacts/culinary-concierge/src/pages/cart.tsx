import { Trash2, ShoppingCart, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useTableOrders } from "@/lib/table-orders-context";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const { items, remove, clear, total, add } = useCart();
  const { user } = useAuth();
  const { tableOrders, addItemsToOrder } = useTableOrders();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const myActiveTableOrder = user
    ? tableOrders.find(o => o.userId === user.id && o.tableStatus !== "bosh" && o.tableStatus !== "tayor")
    : null;

  const placeToTable = () => {
    if (!user) { setLocation("/login"); return; }
    if (!myActiveTableOrder) return;
    addItemsToOrder(myActiveTableOrder.id, items.map(i => i.food));
    clear();
    toast({ title: `✅ ${myActiveTableOrder.tableLabel} stoliga qo'shildi!`, description: `${items.length} ta taom buyurtma qilindi` });
    setLocation("/orders");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
          <ShoppingCart size={32} className="text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Savatcha bo'sh</h2>
        <p className="text-muted-foreground text-sm">Menuga o'ting va taomlar qo'shing</p>
        <Link href="/menu"><Button>Menuga o'tish</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Savatcha</h1>
          <button onClick={clear} className="text-sm text-muted-foreground hover:text-red-500 transition-colors" data-testid="button-clear-cart">
            Tozalash
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {items.map(item => (
            <div key={item.food.id}
              className="bg-card border border-card-border rounded-xl p-4 flex items-center gap-4"
              data-testid={`cart-item-${item.food.id}`}>
              <img src={item.food.image} alt={item.food.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{item.food.name}</h3>
                <p className="text-sm text-muted-foreground">{item.food.price.toLocaleString()} UZS</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => remove(item.food.id)}
                  className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                  <Minus size={13} className="text-foreground" />
                </button>
                <span className="w-6 text-center font-semibold text-sm text-foreground">{item.qty}</span>
                <button onClick={() => add(item.food)}
                  className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                  <Plus size={13} className="text-foreground" />
                </button>
                <button onClick={() => { for (let i = 0; i < item.qty; i++) remove(item.food.id); }}
                  className="w-7 h-7 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors ml-1"
                  data-testid={`button-remove-${item.food.id}`}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-5 space-y-4">
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.food.id} className="flex justify-between text-sm text-muted-foreground">
                <span>{item.food.name} × {item.qty}</span>
                <span>{(item.food.price * item.qty).toLocaleString()} UZS</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-base font-bold text-foreground pt-3 border-t border-border">
            <span>Jami</span>
            <span>{total.toLocaleString()} UZS</span>
          </div>

          {myActiveTableOrder ? (
            <div className="space-y-2">
              <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 text-sm text-foreground">
                <p className="font-medium">Faol bron: <span className="text-primary">{myActiveTableOrder.tableLabel}</span> stoli</p>
                <p className="text-xs text-muted-foreground mt-0.5">{myActiveTableOrder.reservationDate} · {myActiveTableOrder.reservationTime}</p>
              </div>
              <Button className="w-full gap-2 h-11" onClick={placeToTable} data-testid="button-place-to-table">
                <ArrowRight size={16} /> {myActiveTableOrder.tableLabel} stoliga buyurtma qilish
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {user ? (
                <>
                  <p className="text-xs text-muted-foreground text-center">
                    Stol buyurtmasi uchun avval{" "}
                    <Link href="/reservation" className="text-primary hover:underline">joy band qiling</Link>
                  </p>
                  <Link href="/reservation">
                    <Button variant="outline" className="w-full gap-2">
                      Joy band qilish
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground text-center">Buyurtma berish uchun kiring</p>
                  <Link href="/login">
                    <Button className="w-full gap-2 h-11" data-testid="button-checkout">
                      Kirish va buyurtma berish
                    </Button>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
