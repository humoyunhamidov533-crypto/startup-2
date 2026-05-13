import { useState } from "react";
import { tables } from "@/lib/data";
import type { Table } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";
import { useTableOrders, type TableOrder } from "@/lib/table-orders-context";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Clock, Check } from "lucide-react";

const zoneColors: Record<string, string> = {
  vip: "bg-pink-500 hover:bg-pink-600",
  asosiy: "bg-emerald-500 hover:bg-emerald-600",
  premium: "bg-amber-400 hover:bg-amber-500",
  markaziy: "bg-sky-400 hover:bg-sky-500",
  quyi: "bg-amber-500 hover:bg-amber-600",
};

const zoneLabels: Record<string, string> = {
  vip: "VIP xona",
  asosiy: "Asosiy zal",
  premium: "Premium xona",
  markaziy: "Markaziy zal",
  quyi: "Quyi zal",
};

export default function Reservation() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { tableOrders, createTableOrder, getTableOrder } = useTableOrders();

  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [postModal, setPostModal] = useState<{ order: TableOrder; label: string } | null>(null);

  const handleReserve = () => {
    if (!user) {
      toast({ title: "Kirish kerak", description: "Joy band qilish uchun tizimga kiring", variant: "destructive" });
      return;
    }
    if (!selectedTable) {
      toast({ title: "Stol tanlang", variant: "destructive" });
      return;
    }
    if (!date || !time) {
      toast({ title: "Sana va vaqt kiriting", variant: "destructive" });
      return;
    }
    const order = createTableOrder({
      tableId: selectedTable.id,
      tableLabel: selectedTable.label,
      zone: selectedTable.zone,
      userId: user.id,
      userEmail: user.email,
      reservationDate: date,
      reservationTime: time,
      guests,
    });
    const label = selectedTable.label;
    setSelectedTable(null);
    toast({ title: "✅ Muvaffaqiyatli band qilindi!", description: `${label} — ${date} kuni ${time}` });
    setPostModal({ order, label });
  };

  const isOccupied = (tableId: string) => {
    const o = getTableOrder(tableId);
    return !!o && o.tableStatus !== "bosh";
  };

  const getStatus = (tableId: string) => getTableOrder(tableId)?.tableStatus;

  const tablelist = tables.map(t => ({ ...t }));

  const scaleX = 6.5;
  const scaleY = 6.5;

  const occupiedColor: Record<string, string> = {
    band: "bg-amber-200 text-amber-800",
    ovqatlanmoqda: "bg-blue-200 text-blue-800",
    tayor: "bg-emerald-200 text-emerald-800",
  };

  return (
    <div className="min-h-screen bg-background">
      {postModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-card-border rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check size={28} className="text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg text-foreground">
                {postModal.label} band qilindi!
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {postModal.order.reservationDate} · {postModal.order.reservationTime} · {postModal.order.guests} mehmon
              </p>
            </div>
            <p className="text-sm font-medium text-foreground text-center mb-4">
              Hozir ovqat buyurtma qilasizmi?
            </p>
            <div className="flex flex-col gap-3">
              <Button
                className="w-full gap-2"
                onClick={() => {
                  setPostModal(null);
                  setLocation(`/menu?orderId=${postModal.order.id}`);
                }}
                data-testid="button-order-now"
              >
                <ShoppingBag size={16} /> Hozir ovqat zakas qilish
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => setPostModal(null)}
                data-testid="button-order-later"
              >
                <Clock size={16} /> Keyinroq zakas qilish
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">Joy band qilish</h1>
        <p className="text-muted-foreground mb-6">Xaritadan stolni tanlang va bron qiling</p>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="bg-card border border-card-border rounded-2xl p-4 overflow-x-auto">
              <div className="flex flex-wrap gap-3 mb-4 text-xs font-medium">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gray-300 border"></span> Bo'sh</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-300"></span> Band qilingan</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-300"></span> Ovqatlanmoqda</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-300"></span> Chiqishga tayor</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-pink-500"></span> VIP</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-sky-400"></span> Markaziy</div>
              </div>

              <div className="relative bg-stone-100 rounded-xl" style={{ minWidth: 640, height: 520 }}>
                <div className="absolute top-2 left-2 text-xs font-semibold text-gray-500 tracking-wide">VIP XONA</div>
                <div className="absolute top-2 right-4 text-xs font-semibold text-gray-500 tracking-wide">PREMIUM XONA</div>
                <div className="absolute bg-amber-700/30 rounded-lg text-xs font-bold text-amber-900 flex items-center justify-center"
                  style={{ right: 12, top: 120, width: 80, height: 220, writingMode: "vertical-rl", letterSpacing: 4 }}>BAR</div>
                <div className="absolute bg-stone-300/60 rounded-lg text-xs font-bold text-gray-600 flex items-center justify-center"
                  style={{ right: 12, bottom: 40, width: 80, height: 100 }}>OSHXONA</div>

                {tablelist.map(table => {
                  const occupied = isOccupied(table.id);
                  const status = getStatus(table.id);
                  const isSelected = selectedTable?.id === table.id;
                  const oColor = status ? occupiedColor[status] : "";

                  const colorClass = occupied
                    ? `${oColor} cursor-not-allowed`
                    : isSelected
                    ? "ring-4 ring-white ring-offset-1 scale-105 " + zoneColors[table.zone]
                    : zoneColors[table.zone] + " cursor-pointer";

                  return (
                    <div
                      key={table.id}
                      className="absolute flex flex-col items-center"
                      style={{
                        left: table.x * scaleX / 10 * 10,
                        top: table.y * scaleY / 10 * 10,
                        width: table.w * scaleX / 10 * 10,
                      }}
                    >
                      <button
                        disabled={occupied}
                        onClick={() => !occupied && setSelectedTable(isSelected ? null : table)}
                        data-testid={`table-${table.id}`}
                        className={`rounded-lg text-xs font-bold flex flex-col items-center justify-center transition-all w-full ${occupied ? "" : "text-white"} ${colorClass}`}
                        style={{ height: table.h * scaleY / 10 * 10 }}
                      >
                        <span>{table.label}</span>
                        <span className="text-[10px] opacity-80">👤 {table.capacity}</span>
                      </button>
                      {occupied && status && (
                        <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded-b-md text-center leading-tight whitespace-nowrap border-t-0 ${oColor}`}>
                          {status === "band" ? "Band" : status === "ovqatlanmoqda" ? "Ovqatlanmoqda" : "Tayor"}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {tableOrders.filter(o => o.tableStatus !== "bosh").length > 0 && (
              <div className="mt-4 bg-card border border-card-border rounded-2xl p-4">
                <h3 className="text-sm font-bold text-foreground mb-3">Faol bronlar</h3>
                <div className="space-y-2">
                  {tableOrders.filter(o => o.tableStatus !== "bosh").map(o => (
                    <div key={o.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{o.tableLabel} — {zoneLabels[o.zone] ?? o.zone}</p>
                        <p className="text-xs text-muted-foreground">{o.reservationDate} · {o.reservationTime} · {o.guests} mehmon</p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                        o.tableStatus === "band" ? "bg-amber-100 text-amber-700 border-amber-200" :
                        o.tableStatus === "ovqatlanmoqda" ? "bg-blue-100 text-blue-700 border-blue-200" :
                        "bg-emerald-100 text-emerald-700 border-emerald-200"
                      }`}>
                        {o.tableStatus === "band" ? "Band" : o.tableStatus === "ovqatlanmoqda" ? "Ovqatlanmoqda" : "Tayor"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:w-72">
            <div className="bg-card border border-card-border rounded-2xl p-5 sticky top-24">
              <div className="flex flex-col items-center mb-5 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-3 text-3xl">🪑</div>
                {selectedTable ? (
                  <>
                    <h3 className="font-bold text-foreground">{selectedTable.label}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {zoneLabels[selectedTable.zone]} · max {selectedTable.capacity} kishi
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-foreground">Stol tanlang</h3>
                    <p className="text-sm text-muted-foreground mt-1">Xaritadan bo'sh stolni bosing</p>
                  </>
                )}
              </div>

              {selectedTable && (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Sana</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      data-testid="input-date" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Vaqt</label>
                    <input type="time" value={time} onChange={e => setTime(e.target.value)}
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      data-testid="input-time" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Mehmonlar soni</label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setGuests(g => Math.max(1, g - 1))} className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted font-bold">−</button>
                      <span className="font-semibold text-foreground w-6 text-center">{guests}</span>
                      <button onClick={() => setGuests(g => Math.min(selectedTable.capacity, g + 1))} className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted font-bold">+</button>
                    </div>
                  </div>
                </div>
              )}

              {user ? (
                <Button className="w-full" onClick={handleReserve} disabled={!selectedTable} data-testid="button-reserve">
                  Band qilish
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground text-center">Kirish kerak</p>
                  <Link href="/login"><Button className="w-full" variant="outline">Kirish</Button></Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
