export interface FoodItem {
  id: number;
  name: string;
  category: string;
  categoryLabel: string;
  description: string;
  price: number;
  image: string;
  match: number;
  isPopular?: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: "Yetkazildi" | "Jarayonda" | "Bekor qilindi";
  items: { name: string; price: number }[];
  total: number;
}

export interface Table {
  id: string;
  label: string;
  zone: "vip" | "asosiy" | "premium" | "markaziy" | "quyi";
  capacity: number;
  reserved: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const foodItems: FoodItem[] = [
  {
    id: 1, name: "Toshkent Oshi", category: "milliy", categoryLabel: "Milliy Taomlar",
    description: "An'anaviy toshkentcha osh — guruch, sabzi, piyoz va mol go'shti bilan",
    price: 35000, image: "https://images.unsplash.com/photo-1633945274417-3c88ed7e5fdb?w=400&h=300&fit=crop", match: 97
  },
  {
    id: 2, name: "Farg'ona Oshi", category: "milliy", categoryLabel: "Milliy Taomlar",
    description: "Farg'onacha usulda tayyorlangan yumshoq va xushbo'y osh",
    price: 32000, image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop", match: 95
  },
  {
    id: 3, name: "Qo'y Go'shti Shashligi", category: "milliy", categoryLabel: "Milliy Taomlar",
    description: "Yosh qo'y go'shtidan tayyorlangan, ko'mirda qovurilgan shashlik",
    price: 48000, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop", match: 96
  },
  {
    id: 4, name: "Mol Go'shti Shashligi", category: "milliy", categoryLabel: "Milliy Taomlar",
    description: "Tanlangan mol go'shtidan ko'mirda qovurilgan shashlik",
    price: 45000, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop", match: 93
  },
  {
    id: 5, name: "Tovuq Shashligi", category: "milliy", categoryLabel: "Milliy Taomlar",
    description: "Marinadlangan tovuq go'shtidan tayyorlangan yumshoq shashlik",
    price: 38000, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop", match: 91
  },
  {
    id: 6, name: "Manti", category: "milliy", categoryLabel: "Milliy Taomlar",
    description: "Qo'lda tayyorlangan yupqa xamirda go'shtli o'zbek mantisi",
    price: 28000, image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop", match: 94
  },
  {
    id: 7, name: "Lag'mon", category: "milliy", categoryLabel: "Milliy Taomlar",
    description: "Qo'lda cho'zilgan arqon-ko'cha bilan tayyorlangan lag'mon",
    price: 30000, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop", match: 89
  },
  {
    id: 8, name: "Cheeseburger", category: "fastfood", categoryLabel: "Fast Food",
    description: "Juicy beef patty with melted cheese, lettuce, and special sauce",
    price: 35000, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop", match: 88
  },
  {
    id: 9, name: "Hot Dog", category: "fastfood", categoryLabel: "Fast Food",
    description: "Klassik amerikalik hot dog — sosiska va turli souslar bilan",
    price: 22000, image: "https://images.unsplash.com/photo-1612392062631-94ec3f4af4cf?w=400&h=300&fit=crop", match: 85
  },
  {
    id: 10, name: "French Fries", category: "fastfood", categoryLabel: "Fast Food",
    description: "Oltin rang qovurilgan kartoshka frisi, sous bilan",
    price: 18000, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop", match: 82
  },
  {
    id: 11, name: "Pizza Margarita", category: "fastfood", categoryLabel: "Fast Food",
    description: "Italiya uslubida pishirilgan margarita pizza",
    price: 55000, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop", match: 90
  },
  {
    id: 12, name: "Cezar Salati", category: "salatlar", categoryLabel: "Salatlar",
    description: "Klassik Cezar salati — romaine, parmezán va maxsus sous bilan",
    price: 28000, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop", match: 86
  },
  {
    id: 13, name: "Grek Salati", category: "salatlar", categoryLabel: "Salatlar",
    description: "Pomidor, bodring, piyoz, zaytun va feta pishloq",
    price: 25000, image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop", match: 84
  },
  {
    id: 14, name: "Shokoladli Keks", category: "shirinliklar", categoryLabel: "Shirinliklar",
    description: "Yumshoq shokoladli keks, krema bilan",
    price: 20000, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop", match: 92
  },
  {
    id: 15, name: "Tiramisu", category: "shirinliklar", categoryLabel: "Shirinliklar",
    description: "Italiyacha klassik tiramisu desert",
    price: 25000, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop", match: 88
  },
  {
    id: 16, name: "Limon Limonadi", category: "ichimliklar", categoryLabel: "Ichimliklar",
    description: "Yangi siqilgan limon sharbati bilan tayyorlangan sovuq limonad",
    price: 15000, image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop", match: 79
  },
  {
    id: 17, name: "Qora Choy", category: "ichimliklar", categoryLabel: "Ichimliklar",
    description: "Ceylon qora choy, shakar va limon bilan",
    price: 8000, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop", match: 75
  },
  {
    id: 18, name: "Cappuccino", category: "ichimliklar", categoryLabel: "Ichimliklar",
    description: "Italiyacha espresso asosida tayyorlangan kapuchino",
    price: 22000, image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop", match: 83
  },
];

export const categories = [
  { id: "barchasi", label: "Barchasi", emoji: "" },
  { id: "milliy", label: "Milliy", emoji: "🥩" },
  { id: "fastfood", label: "Fast Food", emoji: "🍔" },
  { id: "salatlar", label: "Salatlar", emoji: "🥗" },
  { id: "shirinliklar", label: "Shirinliklar", emoji: "🍰" },
  { id: "ichimliklar", label: "Ichimliklar", emoji: "🥤" },
];

export const sampleOrders: Order[] = [
  {
    id: "8AA382F6",
    date: "2026-05-08 00:32:54",
    status: "Yetkazildi",
    items: [
      { name: "Farg'ona Oshi", price: 32000 },
      { name: "Qo'y Go'shti Shashligi", price: 48000 },
      { name: "Tovuq Shashligi", price: 38000 },
      { name: "Hot Dog", price: 22000 },
      { name: "Cezar Salati", price: 28000 },
      { name: "Limon Limonadi", price: 15000 },
    ],
    total: 183000,
  },
  {
    id: "650F0960",
    date: "2026-05-08 00:09:59",
    status: "Yetkazildi",
    items: [
      { name: "Toshkent Oshi", price: 35000 },
      { name: "Farg'ona Oshi", price: 32000 },
      { name: "Qo'y Go'shti Shashligi", price: 48000 },
    ],
    total: 115000,
  },
];

export const tables: Table[] = [
  { id: "VIP1", label: "VIP 1", zone: "vip", capacity: 8, reserved: false, x: 5, y: 5, w: 14, h: 14 },
  { id: "VIP2", label: "VIP 2", zone: "vip", capacity: 4, reserved: false, x: 21, y: 5, w: 12, h: 12 },
  { id: "A1", label: "A1", zone: "asosiy", capacity: 4, reserved: false, x: 35, y: 5, w: 12, h: 12 },
  { id: "A2", label: "A2", zone: "asosiy", capacity: 2, reserved: false, x: 49, y: 5, w: 12, h: 12 },
  { id: "B1", label: "B1", zone: "premium", capacity: 6, reserved: false, x: 65, y: 5, w: 16, h: 14 },
  { id: "C1", label: "C1", zone: "quyi", capacity: 4, reserved: false, x: 3, y: 24, w: 12, h: 12 },
  { id: "C2", label: "C2", zone: "quyi", capacity: 4, reserved: false, x: 3, y: 40, w: 12, h: 12 },
  { id: "M1", label: "M1", zone: "markaziy", capacity: 6, reserved: false, x: 20, y: 24, w: 14, h: 10 },
  { id: "M2", label: "M2", zone: "markaziy", capacity: 6, reserved: false, x: 36, y: 24, w: 14, h: 10 },
  { id: "M3", label: "M3", zone: "markaziy", capacity: 10, reserved: false, x: 26, y: 36, w: 18, h: 12 },
  { id: "M4", label: "M4", zone: "markaziy", capacity: 4, reserved: false, x: 20, y: 52, w: 14, h: 10 },
  { id: "M5", label: "M5", zone: "markaziy", capacity: 4, reserved: false, x: 36, y: 52, w: 14, h: 10 },
  { id: "M6", label: "M6", zone: "markaziy", capacity: 4, reserved: false, x: 52, y: 24, w: 14, h: 10 },
  { id: "D1", label: "D1", zone: "quyi", capacity: 6, reserved: false, x: 3, y: 60, w: 14, h: 12 },
  { id: "D2", label: "D2", zone: "quyi", capacity: 4, reserved: false, x: 19, y: 66, w: 12, h: 10 },
  { id: "D3", label: "D3", zone: "quyi", capacity: 6, reserved: false, x: 33, y: 66, w: 14, h: 10 },
  { id: "D4", label: "D4", zone: "quyi", capacity: 4, reserved: false, x: 49, y: 66, w: 14, h: 10 },
];
