import { useState } from "react";
import { BarChart3, ShoppingBag, Users, TrendingUp, Package, Trash2, Edit2, X, Plus, Search } from "lucide-react";
import { foodItems as initialFoods, type FoodItem } from "@/lib/data";
import { useTableOrders } from "@/lib/table-orders-context";
import { useAuth } from "@/lib/auth-context";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  band: "bg-amber-100 text-amber-700 border-amber-200",
  ovqatlanmoqda: "bg-blue-100 text-blue-700 border-blue-200",
  tayor: "bg-emerald-100 text-emerald-700 border-emerald-200",
  bosh: "bg-gray-100 text-gray-500 border-gray-200",
};
const statusLabels: Record<string, string> = {
  band: "Band", ovqatlanmoqda: "Ovqatlanmoqda", tayor: "Tayor", bosh: "Bo'sh",
};

export default function Admin() {
  const { user, login } = useAuth();
  const { tableOrders, addSingleItem } = useTableOrders();
  const { toast } = useToast();

  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [tab, setTab] = useState<"dashboard" | "menu" | "orders" | "tables">("dashboard");
  const [foods, setFoods] = useState<FoodItem[]>(initialFoods);
  const [editItem, setEditItem] = useState<FoodItem | null>(null);

  const [addFoodTo, setAddFoodTo] = useState<string | null>(null);
  const [foodSearch, setFoodSearch] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const ok = await login(email, password);
    setLoginLoading(false);
    if (!ok) toast({ title: "Xato", description: "Email yoki parol noto'g'ri", variant: "destructive" });
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 size={28} className="text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground text-sm mt-1">KamuranKabab boshqaruv paneli</p>
          </div>
          <div className="bg-card border border-card-border rounded-2xl p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Admin email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  data-testid="input-admin-email" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Admin paroli</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  data-testid="input-admin-password" />
                <p className="text-xs text-muted-foreground mt-1">Standart: <code className="bg-muted px-1 rounded">admin123</code></p>
              </div>
              <Button type="submit" className="w-full" disabled={loginLoading} data-testid="button-admin-login">
                {loginLoading ? "Kirilmoqda..." : "Kirish"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary">← Bosh sahifaga qaytish</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const deleteFood = (id: number) => { setFoods(prev => prev.filter(f => f.id !== id)); toast({ title: "Taom o'chirildi" }); };
  const saveEdit = (updated: FoodItem) => { setFoods(prev => prev.map(f => f.id === updated.id ? updated : f)); setEditItem(null); toast({ title: "Yangilandi" }); };

  const activeOrders = tableOrders.filter(o => o.tableStatus !== "bosh");
  const totalRevenue = tableOrders.reduce((s, o) => s + o.total, 0);

  const filteredFoods = foods.filter(f => f.name.toLowerCase().includes(foodSearch.toLowerCase()));

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "tables", label: "Stollar", icon: Package },
    { id: "menu", label: "Menu", icon: ShoppingBag },
    { id: "orders", label: "Barcha buyurtmalar", icon: TrendingUp },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <BarChart3 size={18} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">KamuranKabab</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
          <Link href="/"><Button variant="outline" size="sm">Saytga qaytish</Button></Link>
        </div>
      </header>

      <div className="flex">
        <aside className="w-56 min-h-[calc(100vh-65px)] bg-white border-r border-border p-3">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} data-testid={`admin-tab-${t.id}`}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-colors ${
                tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}>
              <t.icon size={16} />{t.label}
            </button>
          ))}
          <div className="mt-4 pt-4 border-t border-border">
            <Link href="/waiter">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-orange-600 hover:bg-orange-50 transition-colors">
                🍽️ Ofitsant paneli
              </button>
            </Link>
          </div>
        </aside>

        <main className="flex-1 p-6 overflow-auto">
          {tab === "dashboard" && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-5">Dashboard</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Faol stollar", value: activeOrders.length, icon: Package, color: "bg-blue-50 text-blue-600" },
                  { label: "Jami daromad", value: totalRevenue.toLocaleString() + " UZS", icon: TrendingUp, color: "bg-green-50 text-green-600" },
                  { label: "Taomlar soni", value: foods.length, icon: ShoppingBag, color: "bg-purple-50 text-purple-600" },
                  { label: "Foydalanuvchilar", value: (() => { const s = localStorage.getItem("kk_users"); return s ? JSON.parse(s).length : 0; })(), icon: Users, color: "bg-orange-50 text-orange-600" },
                ].map(stat => (
                  <div key={stat.label} className="bg-card border border-card-border rounded-2xl p-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                      <stat.icon size={20} />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-card border border-card-border rounded-2xl p-5">
                <h3 className="font-bold text-foreground mb-4">Faol stollar holati</h3>
                {activeOrders.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Hozircha faol buyurtmalar yo'q</p>
                ) : (
                  <div className="space-y-3">
                    {activeOrders.map(o => (
                      <div key={o.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-xl">
                        <div>
                          <p className="font-semibold text-sm text-foreground">{o.tableLabel} — {o.userEmail}</p>
                          <p className="text-xs text-muted-foreground">{o.reservationDate} · {o.reservationTime} · {o.guests} mehmon · {o.items.length} taom</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">{o.total.toLocaleString()} UZS</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[o.tableStatus]}`}>{statusLabels[o.tableStatus]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "tables" && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-5">Stollar va buyurtmalar</h2>
              {activeOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={40} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Hozircha faol stollar yo'q</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeOrders.map(order => (
                    <div key={order.id} className="bg-card border border-card-border rounded-2xl overflow-hidden" data-testid={`admin-table-order-${order.id}`}>
                      <div className="p-4 border-b border-border flex items-center justify-between">
                        <div>
                          <p className="font-bold text-foreground">{order.tableLabel} stoli</p>
                          <p className="text-xs text-muted-foreground">{order.userEmail} · {order.guests} mehmon · {order.reservationTime}</p>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColors[order.tableStatus]}`}>{statusLabels[order.tableStatus]}</span>
                      </div>

                      {order.items.length > 0 && (
                        <div className="divide-y divide-border">
                          {order.items.map(item => (
                            <div key={item.id} className="flex items-center justify-between px-4 py-2.5">
                              <span className="text-sm text-foreground">{item.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{item.price.toLocaleString()} UZS</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  item.status === "tayor" ? "bg-emerald-100 text-emerald-700" :
                                  item.status === "bekor" ? "bg-red-100 text-red-600" :
                                  "bg-amber-100 text-amber-700"
                                }`}>
                                  {item.status === "kutilmoqda" ? "Kutilmoqda" : item.status === "tayor" ? "Tayor" : "Bekor"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="p-4 border-t border-border flex items-center justify-between">
                        <p className="font-bold text-sm text-foreground">Jami: {order.total.toLocaleString()} UZS</p>
                        {addFoodTo === order.id ? (
                          <div className="flex-1 ml-4">
                            <div className="relative mb-2">
                              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                              <input value={foodSearch} onChange={e => setFoodSearch(e.target.value)}
                                placeholder="Taom qidirish..."
                                className="w-full pl-7 pr-3 py-1.5 border border-border rounded-lg text-xs bg-background outline-none" />
                            </div>
                            <div className="max-h-36 overflow-y-auto space-y-1 mb-2">
                              {filteredFoods.slice(0, 8).map(food => (
                                <button key={food.id} onClick={() => { addSingleItem(order.id, food); toast({ title: `${food.name} qo'shildi!` }); }}
                                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-muted text-left transition-colors"
                                  data-testid={`admin-add-food-${food.id}`}>
                                  <span className="text-xs font-medium text-foreground">{food.name}</span>
                                  <span className="text-xs text-muted-foreground">{food.price.toLocaleString()} UZS</span>
                                </button>
                              ))}
                            </div>
                            <Button size="sm" variant="outline" className="w-full h-7 text-xs" onClick={() => { setAddFoodTo(null); setFoodSearch(""); }}>
                              Yopish
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { setAddFoodTo(order.id); setFoodSearch(""); }} data-testid={`button-admin-add-food-${order.id}`}>
                            <Plus size={14} /> Taom qo'shish
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "menu" && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-5">Menu boshqaruvi ({foods.length} ta)</h2>
              {editItem && <EditModal item={editItem} onSave={saveEdit} onCancel={() => setEditItem(null)} />}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {foods.map(food => (
                  <div key={food.id} className="bg-card border border-card-border rounded-xl overflow-hidden" data-testid={`admin-food-${food.id}`}>
                    <img src={food.image} alt={food.name} className="w-full h-36 object-cover" />
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground">{food.categoryLabel}</p>
                      <h3 className="font-semibold text-foreground text-sm">{food.name}</h3>
                      <p className="font-bold text-sm text-foreground mt-1">{food.price.toLocaleString()} UZS</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={() => setEditItem(food)}><Edit2 size={11} className="mr-1" />Tahrir</Button>
                        <Button size="sm" variant="outline" className="flex-1 h-7 text-xs text-red-500 border-red-200 hover:bg-red-50" onClick={() => deleteFood(food.id)}><Trash2 size={11} className="mr-1" />O'chir</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-5">Barcha buyurtmalar tarixi</h2>
              {tableOrders.length === 0 ? (
                <div className="text-center py-12"><Package size={40} className="text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">Hali buyurtmalar yo'q</p></div>
              ) : (
                <div className="space-y-4">
                  {tableOrders.map(order => (
                    <div key={order.id} className="bg-card border border-card-border rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-foreground">{order.tableLabel} — {order.userEmail}</p>
                          <p className="text-xs text-muted-foreground">{order.reservationDate} · {order.reservationTime}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColors[order.tableStatus]}`}>{statusLabels[order.tableStatus]}</span>
                      </div>
                      <div className="space-y-0.5 mt-2">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between text-sm"><span className="text-foreground">{item.name}</span><span className="text-muted-foreground">{item.price.toLocaleString()} UZS</span></div>
                        ))}
                      </div>
                      <div className="flex justify-between font-bold text-foreground border-t border-border pt-2 mt-2">
                        <span>Jami</span><span>{order.total.toLocaleString()} UZS</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function EditModal({ item, onSave, onCancel }: { item: FoodItem; onSave: (f: FoodItem) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ ...item });
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-card-border rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground">Taomni tahrirlash</h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>
        <div className="space-y-3">
          <div><label className="text-xs font-medium text-muted-foreground block mb-1">Nomi</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background outline-none" /></div>
          <div><label className="text-xs font-medium text-muted-foreground block mb-1">Narxi (UZS)</label>
            <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background outline-none" /></div>
          <div><label className="text-xs font-medium text-muted-foreground block mb-1">Tavsif</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background outline-none resize-none" /></div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1" onClick={onCancel}>Bekor</Button>
          <Button className="flex-1" onClick={() => onSave(form)}>Saqlash</Button>
        </div>
      </div>
    </div>
  );
}
