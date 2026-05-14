import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { FoodItem } from "./data";

export type ItemStatus = "kutilmoqda" | "tayor" | "bekor";
export type TableStatus = "band" | "ovqatlanmoqda" | "tayor" | "bosh";

export interface OrderItem {
  id: string;
  foodId: number;
  name: string;
  price: number;
  status: ItemStatus;
}

export interface TableOrder {
  id: string;
  tableId: string;
  tableLabel: string;
  zone: string;
  userId: string;
  userEmail: string;
  date: string;
  reservationDate: string;
  reservationTime: string;
  guests: number;
  items: OrderItem[];
  tableStatus: TableStatus;
  total: number;
}

interface TableOrdersContextType {
  tableOrders: TableOrder[];
  getTableOrder: (tableId: string) => TableOrder | undefined;
  createTableOrder: (params: {
    tableId: string; tableLabel: string; zone: string;
    userId: string; userEmail: string;
    reservationDate: string; reservationTime: string; guests: number;
  }) => TableOrder;
  addItemsToOrder: (orderId: string, foods: FoodItem[]) => void;
  addSingleItem: (orderId: string, food: FoodItem) => void;
  removeItem: (orderId: string, itemId: string) => void;
  updateItemStatus: (orderId: string, itemId: string, status: ItemStatus) => void;
  updateTableStatus: (orderId: string, status: TableStatus) => void;
  clearTable: (tableId: string) => void;
}

const TableOrdersContext = createContext<TableOrdersContextType | null>(null);

const API_BASE = "https://startup-2-f8oh.onrender.com/api";

async function apiFetch(path: string, method = "GET", body?: object) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) return null;
  return res.json();
}

export function TableOrdersProvider({ children }: { children: ReactNode }) {
  const [tableOrders, setTableOrders] = useState<TableOrder[]>([]);

  // Sahifa yuklanganda MongoDB dan orderlarni olamiz
  useEffect(() => {
    apiFetch("/orders").then(data => {
      if (Array.isArray(data)) setTableOrders(data);
    }).catch(() => {
      // API ishlamasa, localStorage dan yuklaymiz
      try {
        const stored = localStorage.getItem("kk_table_orders");
        if (stored) setTableOrders(JSON.parse(stored));
      } catch {}
    });
  }, []);

  // Lokalda va MongoDB da yangilaymiz
  const update = useCallback((orders: TableOrder[]) => {
    setTableOrders(orders);
    localStorage.setItem("kk_table_orders", JSON.stringify(orders));
  }, []);

  const getTableOrder = useCallback((tableId: string) =>
    tableOrders.find(o => o.tableId === tableId && o.tableStatus !== "bosh"),
  [tableOrders]);

  const createTableOrder = useCallback((params: {
    tableId: string; tableLabel: string; zone: string;
    userId: string; userEmail: string;
    reservationDate: string; reservationTime: string; guests: number;
  }): TableOrder => {
    const order: TableOrder = {
      id: Math.random().toString(36).slice(2).toUpperCase(),
      ...params,
      date: new Date().toLocaleString("sv"),
      items: [],
      tableStatus: "band",
      total: 0,
    };

    const newOrders = [
      ...tableOrders.filter(o => o.tableId !== params.tableId || o.tableStatus === "bosh"),
      order,
    ];
    update(newOrders);

    // MongoDB ga saqlaymiz
    apiFetch("/orders", "POST", order).catch(console.error);

    return order;
  }, [tableOrders, update]);

  const addItemsToOrder = useCallback((orderId: string, foods: FoodItem[]) => {
    const orders = tableOrders.map(o => {
      if (o.id !== orderId) return o;
      const newItems: OrderItem[] = foods.map(f => ({
        id: Math.random().toString(36).slice(2),
        foodId: f.id, name: f.name, price: f.price, status: "kutilmoqda" as ItemStatus,
      }));
      const items = [...o.items, ...newItems];
      const updated = { ...o, items, total: items.reduce((s, i) => s + i.price, 0), tableStatus: "ovqatlanmoqda" as TableStatus };
      // MongoDB ga saqlaymiz
      apiFetch(`/orders/${orderId}`, "PATCH", { items: updated.items, total: updated.total, tableStatus: updated.tableStatus }).catch(console.error);
      return updated;
    });
    update(orders);
  }, [tableOrders, update]);

  const addSingleItem = useCallback((orderId: string, food: FoodItem) => {
    const orders = tableOrders.map(o => {
      if (o.id !== orderId) return o;
      const newItem: OrderItem = {
        id: Math.random().toString(36).slice(2),
        foodId: food.id, name: food.name, price: food.price, status: "kutilmoqda",
      };
      const items = [...o.items, newItem];
      const updated = { ...o, items, total: items.reduce((s, i) => s + i.price, 0), tableStatus: "ovqatlanmoqda" as TableStatus };
      apiFetch(`/orders/${orderId}`, "PATCH", { items: updated.items, total: updated.total, tableStatus: updated.tableStatus }).catch(console.error);
      return updated;
    });
    update(orders);
  }, [tableOrders, update]);

  const removeItem = useCallback((orderId: string, itemId: string) => {
    const orders = tableOrders.map(o => {
      if (o.id !== orderId) return o;
      const items = o.items.filter(i => i.id !== itemId);
      const updated = { ...o, items, total: items.reduce((s, i) => s + i.price, 0) };
      apiFetch(`/orders/${orderId}/items/${itemId}`, "DELETE").catch(console.error);
      return updated;
    });
    update(orders);
  }, [tableOrders, update]);

  const updateItemStatus = useCallback((orderId: string, itemId: string, status: ItemStatus) => {
    const orders = tableOrders.map(o => {
      if (o.id !== orderId) return o;
      const items = o.items.map(i => i.id === itemId ? { ...i, status } : i);
      apiFetch(`/orders/${orderId}/items/${itemId}`, "PATCH", { status }).catch(console.error);
      return { ...o, items };
    });
    update(orders);
  }, [tableOrders, update]);

  const updateTableStatus = useCallback((orderId: string, status: TableStatus) => {
    update(tableOrders.map(o => {
      if (o.id !== orderId) return o;
      apiFetch(`/orders/${orderId}`, "PATCH", { tableStatus: status }).catch(console.error);
      return { ...o, tableStatus: status };
    }));
  }, [tableOrders, update]);

  const clearTable = useCallback((tableId: string) => {
    update(tableOrders.map(o => {
      if (o.tableId !== tableId) return o;
      apiFetch(`/orders/${o.id}`, "PATCH", { tableStatus: "bosh" }).catch(console.error);
      return { ...o, tableStatus: "bosh" as TableStatus };
    }));
  }, [tableOrders, update]);

  return (
    <TableOrdersContext.Provider value={{
      tableOrders, getTableOrder, createTableOrder,
      addItemsToOrder, addSingleItem, removeItem,
      updateItemStatus, updateTableStatus, clearTable,
    }}>
      {children}
    </TableOrdersContext.Provider>
  );
}

export function useTableOrders() {
  const ctx = useContext(TableOrdersContext);
  if (!ctx) throw new Error("useTableOrders must be used within TableOrdersProvider");
  return ctx;
}
