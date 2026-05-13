import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Zap, Star, ChevronRight } from "lucide-react";
import { foodItems, categories } from "@/lib/data";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("barchasi");
  const { add } = useCart();

  const aiRecommended = [...foodItems].sort((a, b) => b.match - a.match);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setLocation(`/menu?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const displayed = aiRecommended.filter(item =>
    activeCategory === "barchasi" || item.category === activeCategory
  ).slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-[420px] md:h-[480px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&h=600&fit=crop"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Siz uchun eng sara taomlar
          </h1>
          <form onSubmit={handleSearch} className="flex w-full max-w-lg bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="flex items-center pl-4 text-muted-foreground">
              <Search size={18} />
            </div>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Restoran yoki taom qidirish..."
              className="flex-1 px-3 py-3 text-sm outline-none text-foreground"
              data-testid="input-search"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-6 text-sm font-semibold hover:bg-primary/90 transition-colors"
              data-testid="button-search"
            >
              Qidirish
            </button>
          </form>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-orange-400 rounded-2xl p-6 flex items-center justify-between cursor-pointer hover:bg-orange-500 transition-colors">
            <div>
              <h3 className="text-white font-bold text-lg">Bonus ballar yig'ing</h3>
              <p className="text-white/90 text-sm mt-1">Har bir buyurtmadan 5% keshbek</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Star className="text-white" size={24} />
            </div>
          </div>
          <div className="bg-primary rounded-2xl p-6 flex items-center justify-between cursor-pointer hover:bg-primary/90 transition-colors">
            <div>
              <h3 className="text-white font-bold text-lg">Premium Experience</h3>
              <p className="text-white/90 text-sm mt-1">Ostxonani jonli ko'rish imkoniyati</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Zap className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              data-testid={`filter-${cat.id}`}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-white text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              {cat.emoji && <span>{cat.emoji}</span>}
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Zap size={18} className="text-orange-500" />
              Sizga yoqishi mumkin
            </h2>
            <p className="text-sm text-muted-foreground">AI tomonidan sizning ta'bingizga moslangan</p>
          </div>
          <Link href="/menu" data-testid="link-see-all">
            <Button variant="ghost" size="sm" className="text-primary">
              Barchasini ko'rish <ChevronRight size={16} />
            </Button>
          </Link>
        </div>

        {displayed.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Bu kategoriyada taomlar topilmadi</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayed.map(item => (
              <div
                key={item.id}
                className="bg-card rounded-xl overflow-hidden border border-card-border shadow-xs hover:shadow-md transition-shadow group"
                data-testid={`card-food-${item.id}`}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.match}% MATCH
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-xs text-muted-foreground">{item.categoryLabel}</p>
                  <h3 className="font-semibold text-sm text-foreground mt-0.5 truncate">{item.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-foreground">{item.price.toLocaleString()} UZS</span>
                    <button
                      onClick={() => add(item)}
                      data-testid={`button-add-${item.id}`}
                      className="bg-primary text-primary-foreground text-xs px-2.5 py-1 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      + Qo'shish
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
