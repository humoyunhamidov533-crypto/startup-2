import { useState } from "react";
import { Package, Plus, Trash2, Search, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTableOrders, type TableOrder } from "@/lib/table-orders-context";
import { foodItems, type FoodItem } from "@/lib/data";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  band: "bg-amber-100 text-amber-700",
  ovqatlanmoqda: "bg-blue-100 text-blue-700",
  tayor: "bg-emerald-100 text-emerald-700",
  bosh: "bg-gray-100 text-gray-500",
};

const statusLabels: Record<string, string> = {
  band: "Band qilingan",
  ovqatlanmoqda: "Ovqatlanmoqda",
  tayor: "Chiqishga tayor",
  bosh: "Yopilgan",
};

export default function Orders() {
  const { user } = useAuth();
  const { tableOrders, addItemsToOrder, addSingleItem, removeItem } = useTableOrders();
  const { toast } = useToast();
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const pendingOrderId = params.get("orderId");

  const [addingTo, setAddingTo] = useState<string | null>(pendingOrderId);
  const [foodSearch, setFoodSearch] = useState("");
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Package size={48} className="text-muted-foreground" />
        <h2 className="text-xl font-bold text-foreground">Kirish kerak</h2>
        <div className="flex gap-2">
          <Link href="/login"><Button variant="outline">Kirish</Button></Link>
          <Link href="/register"><Button>Ro'yxatdan o'tish</Button></Link>
        </div>
      </div>
    );
  }

  const myOrders = tableOrders.filter(o => o.userId === user.id);

  const filteredFoods = foodItems.filter(f =>
    f.name.toLowerCase().includes(foodSearch.toLowerCase())
  );

  const toggleFood = (food: FoodItem) => {
    setSelectedFoods(prev =>
      prev.find(f => f.id === food.id) ? prev.filter(f => f.id !== food.id) : [...prev, food]
    );
  };

  const confirmAdd = (orderId: string) => {
    if (selectedFoods.length === 0) return;
    addItemsToOrder(orderId, selectedFoods);
    toast({ title: `${selectedFoods.length} ta taom qo'shildi!` });
    setSelectedFoods([]);
    setAddingTo(null);
  };

  const handleRemoveItem = (orderId: string, itemId: string) => {
    removeItem(orderId, itemId);
    toast({ title: "Taom olib tashlandi" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">Buyurtmalarim</h1>
        <p className="text-muted-foreground mb-6">Stolga bog'liq buyurtmalaringiz</p>

        {myOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Hali buyurtmalar yo'q</p>
            <Link href="/reservation" className="mt-3 inline-block">
              <Button variant="outline">Stol band qilish</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {myOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                isAddingItems={addingTo === order.id}
                onStartAdd={() => { setAddingTo(order.id); setSelectedFoods([]); setFoodSearch(""); }}
                onCancelAdd={() => { setAddingTo(null); setSelectedFoods([]); }}
                onConfirmAdd={() => confirmAdd(order.id)}
                onRemoveItem={(itemId) => handleRemoveItem(order.id, itemId)}
                filteredFoods={filteredFoods}
                selectedFoods={selectedFoods}
                onToggleFood={toggleFood}
                foodSearch={foodSearch}
                onFoodSearch={setFoodSearch}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({
  order, isAddingItems, onStartAdd, onCancelAdd, onConfirmAdd,
  onRemoveItem, filteredFoods, selectedFoods, onToggleFood, foodSearch, onFoodSearch,
}: {
  order: TableOrder;
  isAddingItems: boolean;
  onStartAdd: () => void;
  onCancelAdd: () => void;
  onConfirmAdd: () => void;
  onRemoveItem: (itemId: string) => void;
  filteredFoods: FoodItem[];
  selectedFoods: FoodItem[];
  onToggleFood: (f: FoodItem) => void;
  foodSearch: string;
  onFoodSearch: (s: string) => void;
}) {
  const itemStatusColor: Record<string, string> = {
    kutilmoqda: "text-amber-600 bg-amber-50",
    tayor: "text-emerald-600 bg-emerald-50",
    bekor: "text-red-500 bg-red-50",
  };
  const itemStatusLabel: Record<string, string> = {
    kutilmoqda: "⏳ Kutilmoqda",
    tayor: "✅ Tayor",
    bekor: "❌ Bekor",
  };

  return (
    <div className="bg-card border border-card-border rounded-2xl overflow-hidden shadow-xs" data-testid={`order-${order.id}`}>
      <div className="p-5 border-b border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center font-bold text-primary text-sm">
              {order.tableLabel}
            </div>
            <div>
              <p className="font-bold text-foreground">{order.tableLabel} stoli</p>
              <p className="text-xs text-muted-foreground">
                🕐 {order.reservationDate} · {order.reservationTime} · 👤 {order.guests} mehmon
              </p>
            </div>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${statusColors[order.tableStatus]}`}>
            {statusLabels[order.tableStatus]}
          </span>
        </div>
      </div>

      {order.items.length > 0 ? (
        <div className="divide-y divide-border">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center justify-between px-5 py-3 gap-3" data-testid={`order-item-${item.id}`}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.price.toLocaleString()} UZS</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${itemStatusColor[item.status]}`}>
                  {itemStatusLabel[item.status]}
                </span>
                {order.tableStatus === "band" || order.tableStatus === "ovqatlanmoqda" ? (
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="w-6 h-6 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition-colors"
                    title="Olib tashlash"
                    data-testid={`button-remove-item-${item.id}`}
                  >
                    <Trash2 size={12} />
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-5 py-4 text-sm text-muted-foreground flex items-center gap-2">
          <Package size={16} /> Hali ovqat qo'shilmagan
        </div>
      )}

      {order.items.length > 0 && (
        <div className="px-5 py-3 border-t border-border flex justify-between font-bold text-foreground">
          <span>Jami</span>
          <span>{order.total.toLocaleString()} UZS</span>
        </div>
      )}

      {order.tableStatus !== "tayor" && order.tableStatus !== "bosh" && !isAddingItems && (
        <div className="px-5 pb-4 pt-2">
          <Button size="sm" variant="outline" className="gap-1.5 w-full" onClick={onStartAdd} data-testid={`button-add-food-${order.id}`}>
            <Plus size={14} /> Taom qo'shish
          </Button>
        </div>
      )}

      {isAddingItems && (
        <div className="border-t border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-foreground">Taom qo'shish</p>
            <button onClick={onCancelAdd} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
          </div>

          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={foodSearch}
              onChange={e => onFoodSearch(e.target.value)}
              placeholder="Taom qidirish..."
              className="w-full pl-8 pr-3 py-2 border border-border rounded-lg text-sm bg-background outline-none"
            />
          </div>

          {selectedFoods.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {selectedFoods.map(f => (
                <span key={f.id} className="text-xs bg-primary text-primary-foreground px-2.5 py-1 rounded-full flex items-center gap-1">
                  {f.name}
                  <button onClick={() => onToggleFood(f)}><X size={10} /></button>
                </span>
              ))}
            </div>
          )}

          <div className="max-h-52 overflow-y-auto space-y-1 mb-3">
            {filteredFoods.map(food => {
              const selected = selectedFoods.find(f => f.id === food.id);
              return (
                <button
                  key={food.id}
                  onClick={() => onToggleFood(food)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    selected ? "bg-primary/10 border border-primary/30" : "hover:bg-muted"
                  }`}
                  data-testid={`select-food-${food.id}`}
                >
                  <span className="text-sm font-medium text-foreground">{food.name}</span>
                  <span className="text-xs text-muted-foreground">{food.price.toLocaleString()} UZS</span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={onCancelAdd}>Bekor</Button>
            <Button size="sm" className="flex-1" disabled={selectedFoods.length === 0} onClick={onConfirmAdd} data-testid="button-confirm-add">
              Qo'shish ({selectedFoods.length})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
