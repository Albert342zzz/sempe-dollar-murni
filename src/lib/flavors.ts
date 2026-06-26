export type Flavor = {
  id: string;
  name: string;
  description: string;
  accent: string; // theme color (hex) for each flavor
  image: string;
};

// Available packaging sizes.
export const sizes = [
  "150gr",
  "230gr",
  "250gr",
  "350gr",
  "500gr",
  "700gr",
  "3kg (karton)",
  "3kg (kaleng)",
];

// Default price per size — admins can override per flavor on the Products page.
export const priceBySize: Record<string, number> = {
  "150gr": 10000,
  "230gr": 13000,
  "250gr": 15000,
  "350gr": 22000,
  "500gr": 30000,
  "700gr": 40000,
  "3kg (karton)": 150000,
  "3kg (kaleng)": 175000,
};

export function getFlavor(id: string): Flavor | undefined {
  return flavors.find((f) => f.id === id);
}

export function getPrice(size: string): number {
  return priceBySize[size] ?? 0;
}

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export function formatRupiah(value: number): string {
  return rupiah.format(value);
}

// All flavors share the same product photo for now — add a per-flavor image
// to the `image` field when available.
const DEFAULT_IMAGE = "/images/product3.png";

export const flavors: Flavor[] = [
  {
    id: "wijen",
    name: "Wijen",
    description:
      "Rasa original khas Sempe dengan taburan wijen yang gurih dan renyah.",
    accent: "#C9A227",
    image: DEFAULT_IMAGE,
  },
  {
    id: "pisang",
    name: "Pisang",
    description:
      "Manis legit aroma pisang yang berpadu sempurna dengan renyahnya sempe.",
    accent: "#E6B41E",
    image: DEFAULT_IMAGE,
  },
  {
    id: "keju",
    name: "Keju",
    description: "Gurih keju melimpah yang lumer di setiap gigitan.",
    accent: "#E8920C",
    image: DEFAULT_IMAGE,
  },
  {
    id: "durian",
    name: "Durian",
    description: "Aroma legit khas durian untuk penggemar si raja buah.",
    accent: "#A7B34D",
    image: DEFAULT_IMAGE,
  },
  {
    id: "cocopandan",
    name: "Cocopandan",
    description: "Perpaduan manis cocopandan yang segar dan menggoda.",
    accent: "#D9536B",
    image: DEFAULT_IMAGE,
  },
  {
    id: "cokelat",
    name: "Cokelat",
    description: "Manisnya cokelat lembut yang memanjakan lidah.",
    accent: "#6F4E37",
    image: DEFAULT_IMAGE,
  },
  {
    id: "brownies",
    name: "Brownies",
    description: "Perpaduan cokelat pekat ala brownies yang kaya rasa.",
    accent: "#4A2C2A",
    image: DEFAULT_IMAGE,
  },
  {
    id: "kopi",
    name: "Kopi",
    description: "Rasa kopi khas yang pas untuk para pecinta kopi.",
    accent: "#3C2F2A",
    image: DEFAULT_IMAGE,
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    description: "Aroma cappuccino yang creamy dan menggugah selera.",
    accent: "#B08968",
    image: DEFAULT_IMAGE,
  },
  {
    id: "mocha",
    name: "Mocha",
    description: "Paduan kopi dan cokelat mocha yang lembut dan nikmat.",
    accent: "#7B5E47",
    image: DEFAULT_IMAGE,
  },
];
