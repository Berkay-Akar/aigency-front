export interface CreditPackage {
  id: string;
  credits: number;
  price: string;
  priceNum: number;
  label: string;
  desc: string;
  descKey: string;
  popular?: boolean;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "starter_200",
    credits: 200,
    price: "$9",
    priceNum: 9,
    label: "Starter",
    desc: "Perfect for trying things out",
    descKey: "starterDesc",
  },
  {
    id: "growth_1000",
    credits: 1000,
    price: "$39",
    priceNum: 39,
    label: "Growth",
    desc: "Best value for regular creators",
    descKey: "growthDesc",
    popular: true,
  },
  {
    id: "pro_3000",
    credits: 3000,
    price: "$99",
    priceNum: 99,
    label: "Pro",
    desc: "For agencies & power users",
    descKey: "proDesc",
  },
];
