// import { type Category } from "./types";

export type Product = {
  id: string;
  name: string;
  category: string;
  variants?: string[];
  unit: "kg" | "pz";
  icon: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  subcategories?: Category[];
  products?: Product[];
};

export const categories: Category[] = [
  {
    id: "frutta",
    name: "Frutta",
    icon: "🍎",
    products: [
      {
        id: "mele",
        name: "Mele",
        category: "frutta",
        variants: ["Kanzi", "Granny Smith", "Royal Gala", "Fuji", "Golden Delicious"],
        unit: "kg",
        icon: "🍎"
      },
      {
        id: "pere",
        name: "Pere",
        category: "frutta",
        variants: ["Abate", "Carmen", "Guyot", "Santa Maria", "William", "Kaiser", "Decana"],
        unit: "kg",
        icon: "🍐"
      },
      {
        id: "uva",
        name: "Uva",
        category: "frutta",
        variants: ["da tavola", "Vittoria", "Italia", "Red Globe", "Uva spina", "Uva fragola"],
        unit: "kg",
        icon: "🍇"
      },
      {
        id: "pesche",
        name: "Pesche",
        category: "frutta",
        variants: ["nettarine", "tabacchiera", "percoche", "pesche gialle", "pesche bianche"],
        unit: "kg",
        icon: "🍑"
      },
      {
        id: "kiwi",
        name: "Kiwi",
        category: "frutta",
        variants: ["verde", "gold"],
        unit: "kg",
        icon: "🥝"
      },
      {
        id: "banane",
        name: "Banane",
        category: "frutta",
        variants: ["Cavendish", "plantain", "banane rosse"],
        unit: "kg",
        icon: "🍌"
      },
      {
        id: "angurie",
        name: "Angurie",
        category: "frutta",
        variants: ["crimson sweet", "sugar baby", "moon and stars"],
        unit: "kg",
        icon: "🍉"
      },
      {
        id: "frutti-rossi",
        name: "Frutti rossi",
        category: "frutta",
        variants: ["mirtilli", "fragole", "lamponi", "ribes", "more", "ribes rosso", "ribes nero"],
        unit: "kg",
        icon: "🫐"
      },
      {
        id: "albicocche",
        name: "Albicocche",
        category: "frutta",
        variants: ["Bella d'Italia", "Precoce di Treviglio", "Valleggia"],
        unit: "kg",
        icon: "🍑"
      },
      {
        id: "susine",
        name: "Susine",
        category: "frutta",
        variants: ["Santa Rosa", "Angelino", "President"],
        unit: "kg",
        icon: "🫐"
      },
      {
        id: "ciliegie",
        name: "Ciliegie",
        category: "frutta",
        variants: ["Durone", "Ferrovia", "Bigarreau"],
        unit: "kg",
        icon: "🍒"
      },
      {
        id: "meloni",
        name: "Meloni",
        category: "frutta",
        variants: ["cantalupo", "retato", "invernale"],
        unit: "kg",
        icon: "🍈"
      },
      {
        id: "arance",
        name: "Arance",
        category: "frutta",
        variants: ["da tavola", "da spremere", "Navel", "Tarocco", "Valencia"],
        unit: "kg",
        icon: "🍊"
      },
      {
        id: "limoni",
        name: "Limoni",
        category: "frutta",
        variants: ["Femminello", "Meyer", "Eureka"],
        unit: "kg",
        icon: "🍋"
      }
    ]
  },
  {
    id: "verdura",
    name: "Verdura",
    icon: "🥬",
    products: [
      {
        id: "carciofi",
        name: "Carciofi",
        category: "verdura",
        variants: ["Romanesco", "Spinoso", "Violetto"],
        unit: "kg",
        icon: "🌱"
      },
      {
        id: "asparagi",
        name: "Asparagi",
        category: "verdura",
        variants: ["verdi", "bianchi", "viola"],
        unit: "kg",
        icon: "🥬"
      },
      {
        id: "zucca",
        name: "Zucca",
        category: "verdura",
        variants: ["Butternut", "Hokkaido", "Spaghetti"],
        unit: "kg",
        icon: "🎃"
      },
      {
        id: "pomodori",
        name: "Pomodori",
        category: "verdura",
        variants: ["San Marzano", "Pixel", "Ciliegino", "Cuore di Bue"],
        unit: "kg",
        icon: "🍅"
      },
      {
        id: "patate",
        name: "Patate",
        category: "verdura",
        variants: ["novelle", "pasta gialla", "pasta bianca"],
        unit: "kg",
        icon: "🥔"
      },
      {
        id: "zucchine",
        name: "Zucchine",
        category: "verdura",
        variants: ["verdi", "gialle", "trombetta"],
        unit: "kg",
        icon: "🥒"
      },
      {
        id: "insalata",
        name: "Insalata",
        category: "verdura",
        variants: ["lattuga", "rucola", "radicchio", "iceberg", "romana"],
        unit: "kg",
        icon: "🥬"
      },
      {
        id: "peperoni",
        name: "Peperoni",
        category: "verdura",
        variants: ["rossi", "gialli", "verdi", "arancioni"],
        unit: "kg",
        icon: "🫑"
      },
      {
        id: "melanzane",
        name: "Melanzane",
        category: "verdura",
        variants: ["lunghe", "tonde", "violette"],
        unit: "kg",
        icon: "🍆"
      },
      {
        id: "cavolfiori",
        name: "Cavolfiori",
        category: "verdura",
        variants: ["bianchi", "verdi", "viola"],
        unit: "kg",
        icon: "🥦"
      },
      {
        id: "broccoli",
        name: "Broccoli",
        category: "verdura",
        variants: ["verdi", "viola", "romanesco"],
        unit: "kg",
        icon: "🥦"
      },
      {
        id: "spinaci",
        name: "Spinaci",
        category: "verdura",
        variants: ["freschi", "baby"],
        unit: "kg",
        icon: "🥬"
      },
      {
        id: "carote",
        name: "Carote",
        category: "verdura",
        variants: ["arancioni", "gialle", "viola"],
        unit: "kg",
        icon: "🥕"
      }
    ]
  },
  {
    id: "alimentari",
    name: "Alimentari",
    icon: "🥖",
    products: [
      {
        id: "affettati-carne",
        name: "Affettati di carne",
        category: "alimentari",
        variants: ["Crudo di Parma", "Crudo San Daniele", "Cotto", "Salame", "Coppa", "Pancetta", "Culatello", "Speck", "Bresaola", "Mortadella", "Wurstel"],
        unit: "kg",
        icon: "🥓"
      },
      {
        id: "conserve-pesce",
        name: "Conserve di pesce",
        category: "alimentari",
        variants: ["Tonno in olio", "Tonno al naturale", "Tonno rosso", "Ventresca di tonno", "Tonno pinne gialle", "Salmone affumicato", "Sardine in olio", "Acciughe in olio", "Acciughe in salsa piccante"],
        unit: "pz",
        icon: "🐟"
      },
      {
        id: "legumi-polenta",
        name: "Legumi e polenta",
        category: "alimentari",
        variants: ["Ceci", "Fagioli borlotti", "Fagioli cannellini", "Lenticchie", "Piselli", "Polenta", "Polenta Taragna", "Purè di Patate"],
        unit: "pz",
        icon: "🫘"
      },
      {
        id: "pasta",
        name: "Pasta",
        category: "alimentari",
        variants: ["Spaghetti", "Penne", "Fusilli", "Linguine", "Paccheri", "Farfalle", "Orecchiette", "Tagliatelle", "Ravioli", "Tortellini", "Integrale", "Senza Glutine", "Kamut", "Legumi"],
        unit: "pz",
        icon: "🍝"
      },
      {
        id: "riso",
        name: "Riso",
        category: "alimentari",
        variants: ["Arborio", "Carnaroli", "Basmati", "Venere", "Jasmine", "Integrale", "Parboiled"],
        unit: "pz",
        icon: "🍚"
      },
      {
        id: "uova",
        name: "Uova",
        category: "alimentari",
        variants: ["Allevate a terra", "Bio"],
        unit: "pz",
        icon: "🥚"
      },
      {
        id: "latte-latticini",
        name: "Latte e latticini",
        category: "alimentari",
        variants: ["Intero", "Scremato", "Senza lattosio", "Soia", "Mandorla", "Avena", "Cocco", "Burro", "Panna", "Yogurt bianco senza grassi", "Yogurt bianco normale", "Yogurt alla frutta"],
        unit: "pz",
        icon: "🥛"
      },
      {
        id: "formaggi",
        name: "Formaggi",
        category: "alimentari",
        variants: ["Mozzarella di bufala", "Mozzarella treccia", "Ricotta", "Stracchino", "Parmigiano Reggiano", "Pecorino", "Grana Padano", "Gorgonzola", "Formaggini", "Philadelphia"],
        unit: "pz",
        icon: "🧀"
      },
      {
        id: "colazione",
        name: "Colazione",
        category: "alimentari",
        variants: ["Muesli", "Cornflakes", "Biscotti Frollini", "Biscotti Integrali", "Biscotti Senza zucchero", "Wafer", "Biscotti per bambini", "Biscotti Gocciole", "Biscotti Oro Saiwa"],
        unit: "pz",
        icon: "🥣"
      },
      {
        id: "marmellate-creme",
        name: "Marmellate e creme",
        category: "alimentari",
        variants: ["Marmellata di Frutta", "Miele", "Nutella", "Crema di pistacchio", "Crema di nocciola"],
        unit: "pz",
        icon: "🍯"
      },
      {
        id: "snack-salati",
        name: "Snack salati",
        category: "alimentari",
        variants: ["Crackers", "Patatine", "Taralli", "Grissini", "Mandorle", "Noci", "Pistacchi", "Mix", "Gallette di riso", "Gallette di grano saraceno", "Gallette di mais"],
        unit: "pz",
        icon: "🥨"
      },
      {
        id: "snack-dolci",
        name: "Snack dolci",
        category: "alimentari",
        variants: ["Cioccolato Fondente", "Cioccolato al latte", "Brioche", "Gelato"],
        unit: "pz",
        icon: "🍫"
      },
      {
        id: "olio-aceto",
        name: "Olio e aceto",
        category: "alimentari",
        variants: ["Di olive taggiasche", "Italiano", "Europeo", "Di semi di girasole", "Di arachidi", "Aromatizzato", "Aceto balsamico", "Aceto di mele", "Aceto di vino"],
        unit: "pz",
        icon: "🫒"
      },
      {
        id: "condimenti-salse",
        name: "Condimenti e salse",
        category: "alimentari",
        variants: ["Ketchup", "Maionese", "Senape", "Salsa BBQ", "Soya", "Tabasco"],
        unit: "pz",
        icon: "🧂"
      },
      {
        id: "ready-to-eat",
        name: "Ready-to-eat",
        category: "alimentari",
        variants: ["Zuppa di lenticchie", "Zuppa di legumi", "Zuppa di zucca", "Polenta"],
        unit: "pz",
        icon: "🥣"
      },
      {
        id: "acqua",
        name: "Acqua",
        category: "alimentari",
        variants: ["Naturale", "Frizzante", "Leggermente frizzante"],
        unit: "pz",
        icon: "💧"
      },
      {
        id: "vino",
        name: "Vino",
        category: "alimentari",
        variants: ["Rosso", "Bianco", "Rosé", "Spumante"],
        unit: "pz",
        icon: "🍷"
      },
      {
        id: "birra",
        name: "Birra",
        category: "alimentari",
        variants: ["Chiara", "Scura", "Rossa", "Artigianale"],
        unit: "pz",
        icon: "🍺"
      }
    ]
  },
  {
    id: "casa",
    name: "Prodotti per la Casa",
    icon: "🧹",
    products: [
      {
        id: "detersivi-piatti",
        name: "Detersivi per piatti",
        category: "casa",
        variants: ["liquidi", "in polvere", "in pastiglie"],
        unit: "pz",
        icon: "🧼"
      },
      {
        id: "detersivi-bucato",
        name: "Detersivi per bucato",
        category: "casa",
        variants: ["liquidi", "in polvere", "in capsule"],
        unit: "pz",
        icon: "👕"
      },
      {
        id: "pulitori-multiuso",
        name: "Pulitori multiuso",
        category: "casa",
        variants: ["spray", "liquidi", "in pastiglie"],
        unit: "pz",
        icon: "🧴"
      },
      {
        id: "prodotti-bagno",
        name: "Prodotti per la pulizia del bagno",
        category: "casa",
        variants: ["detergenti", "disinfettanti", "anticalcare"],
        unit: "pz",
        icon: "🚿"
      },
      {
        id: "prodotti-cucina",
        name: "Prodotti per la pulizia della cucina",
        category: "casa",
        variants: ["detergenti", "sgrassatori", "disinfettanti"],
        unit: "pz",
        icon: "🍽️"
      },
      {
        id: "prodotti-vetri",
        name: "Prodotti per la pulizia dei vetri",
        category: "casa",
        variants: ["spray", "liquidi"],
        unit: "pz",
        icon: "🪟"
      },
      {
        id: "deodoranti-ambienti",
        name: "Deodoranti per ambienti",
        category: "casa",
        variants: ["spray", "diffusori", "bastoncini"],
        unit: "pz",
        icon: "🌸"
      },
      {
        id: "sacchetti-spazzatura",
        name: "Sacchetti per la spazzatura",
        category: "casa",
        variants: ["grandi", "medi", "piccoli"],
        unit: "pz",
        icon: "🗑️"
      },
      {
        id: "carta-igienica",
        name: "Carta igienica",
        category: "casa",
        variants: ["doppia velina", "tripla velina", "extra morbida"],
        unit: "pz",
        icon: "🧻"
      },
      {
        id: "rotoli-carta-cucina",
        name: "Rotoli di carta da cucina",
        category: "casa",
        variants: ["monostrato", "multistrato", "extra assorbenti"],
        unit: "pz",
        icon: "📄"
      }
    ]
  }
];

export const findProduct = (categoryId: string, productId: string): Product | undefined => {
  const findInCategory = (category: Category): Product | undefined => {
    if (category.products) {
      return category.products.find(p => p.id === productId);
    }
    if (category.subcategories) {
      for (const subcat of category.subcategories) {
        const found = findInCategory(subcat);
        if (found) return found;
      }
    }
    return undefined;
  };

  for (const category of categories) {
    if (category.id === categoryId || category.subcategories?.some(sub => sub.id === categoryId)) {
      return findInCategory(category);
    }
  }
  return undefined;
};