import { useState } from "react";
import { useTableOrders, type TableOrder, type ItemStatus } from "@/lib/table-orders-context";
import { useAuth } from "@/lib/auth-context";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, Clock, Users, LogOut, ChevronRight, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Waiter() {
  const { user, logout } = useAuth();
  const { tableOrders, updateItemStatus, clearTable } = useTableOrders();
  const { toast } = useToast();
  const [selected, setSelected] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);

  if (!user || user.role !== "waiter") {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center">
          <p className="text-neutral-400 text-sm uppercase tracking-widest mb-2">KAMURAN KABAB</p>
          <h2 className="text-2xl font-bold text-white">Ofitsant tizimi</h2>
          <p className="text-neutral-500 text-sm mt-2">Faqat ofitsantlar uchun ruxsat berilgan</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl px-6 py-4 text-center">
          <p className="text-neutral-400 text-xs mb-1">Kirish ma'lumotlari</p>
          <p className="text-white font-mono text-sm">waiter@gmail.com · waiter123</p>
        </div>
        <Link href="/login"><Button className="bg-white text-black hover:bg-neutral-100">Kirish</Button></Link>
      </div>
    );
  }

  const activeOrders = tableOrders.filter(o => o.tableStatus !== "bosh");
  const selectedOrder = activeOrders.find(o => o.id === selected) ?? activeOrders[0] ?? null;

  const markReady = (orderId: string, itemId: string) => {
    updateItemStatus(orderId, itemId, "tayor");
  };

  const sendGuest = (order: TableOrder) => {
    clearTable(order.tableId);
    setConfirming(null);
    setSelected(null);
    toast({ title: `${order.tableLabel} — Mehmon jo'natildi`, description: "Stol endi bo'sh va qabul qilishga tayyor." });
  };

  const allReady = (order: TableOrder) =>
    order.items.length > 0 && order.items.every(i => i.status === "tayor" || i.status === "bekor");

  const readyCount = (order: TableOrder) =>
    order.items.filter(i => i.status === "tayor" || i.status === "bekor").length;

  const tableStatusLabel: Record<string, string> = {
    band: "BAND",
    ovqatlanmoqda: "FAOL",
    tayor: "TAYOR",
  };

  const tableStatusColor: Record<string, string> = {
    band: "text-amber-400",
    ovqatlanmoqda: "text-sky-400",
    tayor: "text-emerald-400",
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      {/* Top bar */}
      <header className="bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest">KAMURAN KABAB</p>
            <h1 className="text-base font-semibold text-white leading-tight">Ofitsant tizimi</h1>
          </div>
          <div className="h-6 w-px bg-neutral-800" />
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
            <span className="text-neutral-300">{activeOrders.length} ta faol stol</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-400">{user.name}</span>
          <button onClick={logout} className="flex items-center gap-1.5 text-neutral-500 hover:text-white transition-colors text-sm">
            <LogOut size={14} /> Chiqish
          </button>
        </div>
      </header>

      {activeOrders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center text-2xl">🍽️</div>
          <p className="text-neutral-400 font-medium">Hozircha faol stollar yo'q</p>
          <p className="text-neutral-600 text-sm">Mijozlar stol band qilganda bu yerda ko'rinadi</p>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Left: table list */}
          <div className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col overflow-y-auto flex-shrink-0">
            <div className="px-4 py-3 border-b border-neutral-800">
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">Stollar</p>
            </div>
            {activeOrders.map(order => {
              const rc = readyCount(order);
              const total = order.items.length;
              const isSel = selectedOrder?.id === order.id;
              const done = allReady(order);
              return (
                <button
                  key={order.id}
                  onClick={() => setSelected(order.id)}
                  className={`w-full text-left px-4 py-4 border-b border-neutral-800/60 transition-colors ${
                    isSel ? "bg-neutral-800" : "hover:bg-neutral-800/50"
                  }`}
                  data-testid={`sidebar-table-${order.tableId}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-white">{order.tableLabel}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${tableStatusColor[order.tableStatus] ?? "text-neutral-400"}`}>
                        {tableStatusLabel[order.tableStatus] ?? order.tableStatus}
                      </span>
                      {isSel && <ChevronRight size={12} className="text-neutral-400" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span className="flex items-center gap-1"><Users size={10} /> {order.guests}</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {order.reservationTime}</span>
                  </div>
                  {total > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-neutral-500">{rc}/{total} taom</span>
                        {done && <span className="text-emerald-400 font-semibold text-[10px] uppercase">Hammasi tayor</span>}
                      </div>
                      <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${done ? "bg-emerald-400" : "bg-sky-500"}`}
                          style={{ width: `${total > 0 ? (rc / total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: detail */}
          {selectedOrder ? (
            <div className="flex-1 flex flex-col overflow-y-auto">
              {/* Order header */}
              <div className="bg-neutral-900 border-b border-neutral-800 px-6 py-5 flex items-start justify-between flex-shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedOrder.tableLabel} stoli</h2>
                  <p className="text-sm text-neutral-400 mt-0.5">
                    {selectedOrder.reservationDate} · {selectedOrder.reservationTime} · {selectedOrder.guests} mehmon
                  </p>
                  <p className="text-xs text-neutral-600 mt-0.5">{selectedOrder.userEmail}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{selectedOrder.total.toLocaleString()}</p>
                  <p className="text-xs text-neutral-500">UZS · {selectedOrder.items.length} ta taom</p>
                </div>
              </div>

              {/* Items */}
              <div className="flex-1 px-6 py-5">
                {selectedOrder.items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center">
                      <Clock size={20} className="text-neutral-600" />
                    </div>
                    <p className="text-neutral-500 text-sm">Hali buyurtma qilinmagan</p>
                  </div>
                ) : (
                  <>
                    <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-4">
                      Buyurtmalar
                    </p>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, idx) => {
                        const isReady = item.status === "tayor" || item.status === "bekor";
                        return (
                          <div
                            key={item.id}
                            className={`flex items-center gap-4 px-4 py-4 rounded-xl border transition-all ${
                              isReady
                                ? "bg-neutral-900/40 border-neutral-800/40 opacity-60"
                                : "bg-neutral-900 border-neutral-800"
                            }`}
                            data-testid={`waiter-item-${item.id}`}
                          >
                            <span className="text-neutral-600 text-sm font-mono w-5">{idx + 1}</span>
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium text-sm ${isReady ? "line-through text-neutral-600" : "text-white"}`}>
                                {item.name}
                              </p>
                              <p className="text-xs text-neutral-600 mt-0.5">{item.price.toLocaleString()} UZS</p>
                            </div>
                            {isReady ? (
                              <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
                            ) : (
                              <button
                                onClick={() => markReady(selectedOrder.id, item.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-semibold rounded-lg hover:bg-neutral-200 transition-colors flex-shrink-0"
                                data-testid={`button-item-ready-${item.id}`}
                              >
                                <Check size={13} /> Tayor
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Progress summary */}
                    <div className="mt-6 p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-neutral-400">Jarayon holati</p>
                        <p className="text-sm font-semibold text-white">
                          {readyCount(selectedOrder)} / {selectedOrder.items.length}
                        </p>
                      </div>
                      <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            allReady(selectedOrder) ? "bg-emerald-400" : "bg-sky-500"
                          }`}
                          style={{ width: `${selectedOrder.items.length > 0 ? (readyCount(selectedOrder) / selectedOrder.items.length) * 100 : 0}%` }}
                        />
                      </div>
                      {allReady(selectedOrder) && (
                        <p className="text-emerald-400 text-xs font-semibold mt-2 text-center">
                          ✓ Barcha taomlar tayor — mehmonni jo'natishingiz mumkin
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Footer action */}
              {allReady(selectedOrder) && (
                <div className="border-t border-neutral-800 px-6 py-5 bg-neutral-900 flex-shrink-0">
                  {confirming === selectedOrder.id ? (
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-neutral-400 flex-1">Tasdiqlaysizmi? Stol bo'shaydi va yana qabul qilish uchun ochiladi.</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 bg-transparent"
                        onClick={() => setConfirming(null)}
                      >
                        Bekor
                      </Button>
                      <Button
                        size="sm"
                        className="bg-white text-black hover:bg-neutral-200 gap-1.5 font-semibold"
                        onClick={() => sendGuest(selectedOrder)}
                        data-testid={`button-send-guest-${selectedOrder.tableId}`}
                      >
                        <ArrowRight size={14} /> Mehmon jo'natildi
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-white text-black hover:bg-neutral-200 font-semibold gap-2 h-12"
                      onClick={() => setConfirming(selectedOrder.id)}
                      data-testid={`button-confirm-send-${selectedOrder.tableId}`}
                    >
                      <CheckCircle2 size={18} /> Mehmon jo'natildi
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-neutral-600">Chap tomondan stol tanlang</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
