import { useState, useEffect } from "react";
import { useSearch, useLocation } from "wouter";
import { foodItems, categories, type FoodItem } from "@/lib/data";
import { useCart } from "@/lib/cart-context";
import { useTableOrders } from "@/lib/table-orders-context";
import { Search, ShoppingBag, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function Menu() {
  const searchStr = useSearch();
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(searchStr);
  const initialQuery = params.get("q") ?? "";
  const orderId = params.get("orderId") ?? "";

  const [search, setSearch] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("barchasi");
  const [tableSelected, setTableSelected] = useState<Set<number>>(new Set());

  const { add } = useCart();
  const { addItemsToOrder, tableOrders } = useTableOrders();
  const { toast } = useToast();

  useEffect(() => { setSearch(initialQuery); }, [initialQuery]);

  const tableOrder = orderId ? tableOrders.find(o => o.id === orderId) : null;

  const filtered = foodItems.filter(item => {
    const matchCat = activeCategory === "barchasi" || item.category === activeCategory;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const grouped = categories.slice(1).map(cat => ({
    ...cat,
    items: filtered.filter(i => i.category === cat.id),
  })).filter(g => g.items.length > 0);

  const toggleTableSelect = (id: number) => {
    setTableSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const confirmTableOrder = () => {
    if (!tableOrder || tableSelected.size === 0) return;
    const selected = foodItems.filter(f => tableSelected.has(f.id));
    addItemsToOrder(tableOrder.id, selected);
    toast({ title: `${selected.length} ta taom stolga qo'shildi!`, description: `${tableOrder.tableLabel} stoli` });
    setLocation("/orders");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Table order banner */}
      {tableOrder && (
        <div className="sticky top-16 z-30 bg-primary text-primary-foreground px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <ShoppingBag size={18} className="flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-sm">{tableOrder.tableLabel} stoli uchun buyurtma</p>
                <p className="text-xs text-primary-foreground/80">{tableSelected.size} ta taom tanlangan</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {tableSelected.size > 0 && (
                <Button size="sm" onClick={confirmTableOrder}
                  className="bg-white text-primary hover:bg-white/90 font-semibold gap-1.5 text-xs h-8">
                  <Check size={13} /> Tasdiqlash ({tableSelected.size})
                </Button>
              )}
              <button onClick={() => setLocation("/orders")}
                className="text-primary-foreground/70 hover:text-primary-foreground">
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">Bizning Menu</h1>
        <p className="text-muted-foreground mb-6">Mazali taomlarni tanlang va buyurtma bering</p>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              data-testid={`filter-cat-${cat.id}`}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-white text-muted-foreground border-border hover:border-primary/40"
              }`}>
              {cat.emoji && <span>{cat.emoji}</span>}
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative mb-8">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="search" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Taom qidiring..."
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            data-testid="input-menu-search" />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Hech narsa topilmadi</p>
            <p className="text-muted-foreground text-sm mt-1">Boshqa kalit so'z bilan qidiring</p>
          </div>
        ) : activeCategory !== "barchasi" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(item => (
              <FoodCard key={item.id} item={item}
                tableMode={!!tableOrder}
                tableSelected={tableSelected.has(item.id)}
                onTableToggle={() => toggleTableSelect(item.id)}
                onAdd={() => { add(item); toast({ title: `${item.name} savatchaga qo'shildi` }); }} />
            ))}
          </div>
        ) : (
          grouped.map(group => (
            <section key={group.id} className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span>{group.emoji}</span>{group.label}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {group.items.map(item => (
                  <FoodCard key={item.id} item={item}
                    tableMode={!!tableOrder}
                    tableSelected={tableSelected.has(item.id)}
                    onTableToggle={() => toggleTableSelect(item.id)}
                    onAdd={() => { add(item); toast({ title: `${item.name} savatchaga qo'shildi` }); }} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

function FoodCard({ item, tableMode, tableSelected, onTableToggle, onAdd }: {
  item: FoodItem;
  tableMode: boolean;
  tableSelected: boolean;
  onTableToggle: () => void;
  onAdd: () => void;
}) {
  return (
    <div
      className={`bg-card border rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all group ${
        tableSelected ? "border-primary ring-2 ring-primary/20" : "border-card-border"
      }`}
      data-testid={`card-menu-${item.id}`}
    >
      <div className="relative h-48 overflow-hidden">
        <img src={item.image} alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
          {item.match}% MATCH
        </span>
        {tableSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <Check size={13} className="text-primary-foreground" />
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground">{item.categoryLabel}</p>
        <h3 className="font-semibold text-foreground mt-0.5">{item.name}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-foreground">{item.price.toLocaleString()} UZS</span>
          {tableMode ? (
            <button onClick={onTableToggle}
              data-testid={`button-table-select-${item.id}`}
              className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                tableSelected
                  ? "bg-primary text-primary-foreground"
                  : "border border-primary text-primary hover:bg-primary/10"
              }`}>
              {tableSelected ? "✓ Tanlandi" : "+ Tanlash"}
            </button>
          ) : (
            <button onClick={onAdd}
              data-testid={`button-add-menu-${item.id}`}
              className="bg-primary text-primary-foreground text-sm px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-colors font-medium">
              + Qo'shish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
