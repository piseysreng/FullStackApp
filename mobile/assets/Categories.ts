export const categories = [
  { "id": 1, "name": "Vegetables", "image": "https://images.unsplash.com/photo-1566385101042-1a000c1267c4?auto=format&fit=crop&q=80&w=400" },
  { "id": 2, "name": "Fruits", "image": "https://images.unsplash.com/photo-1619566639371-5909d5973971?auto=format&fit=crop&q=80&w=400" },
  { "id": 3, "name": "Beverages", "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400" },
  { "id": 4, "name": "Grocery", "image": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400" },
  { "id": 5, "name": "Edible Oil", "image": "https://images.unsplash.com/photo-1474979266404-7eaacabc8805?auto=format&fit=crop&q=80&w=400" },
  { "id": 6, "name": "Household", "image": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400" }
]

export const realCategories = [
  {
    "id": 100,
    "name": "Organic Grocery & Pantry",
    "slug": "organic-grocery-pantry",
    "description": "Premium, certified organic essentials for a healthy kitchen.",
    "image": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    "parentId": null,
    "createdAt": "2026-01-22 09:21:44.161379",
    "updatedAt": "2026-01-22T09:21:44.161Z"
  },
  {
    "id": 101,
    "name": "Fresh Seasonal Produce",
    "slug": "fresh-seasonal-produce",
    "description": "Farm-to-table organic fruits, vegetables, and fresh herbs.",
    "image": "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80",
    "parentId": 100,
    "createdAt": "2026-01-22 09:21:44.293536",
    "updatedAt": "2026-01-22T09:21:44.293Z"
  },
  {
    "id": 102,
    "name": "Grains, Legumes & Pasta",
    "slug": "grains-legumes-pasta",
    "description": "Organic ancient grains and nutrient-dense pulses.",
    "image": "https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?auto=format&fit=crop&w=800&q=80",
    "parentId": 100,
    "createdAt": "2026-01-22 09:21:44.293536",
    "updatedAt": "2026-01-22T09:21:44.293Z"
  },
  {
    "id": 103,
    "name": "Oils, Vinegars & Condiments",
    "slug": "oils-vinegars-condiments",
    "description": "Cold-pressed oils and natural fermented vinegars.",
    "image": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
    "parentId": 100,
    "createdAt": "2026-01-22 09:21:44.293536",
    "updatedAt": "2026-01-22T09:21:44.293Z"
  },
  {
    "id": 104,
    "name": "Baking & Sweeteners",
    "slug": "baking-sweeteners",
    "description": "Natural sugar alternatives and organic baking essentials.",
    "image": "https://images.unsplash.com/photo-1581339399838-2a120c18bba3?auto=format&fit=crop&w=800&q=80",
    "parentId": 100,
    "createdAt": "2026-01-22 09:21:44.293536",
    "updatedAt": "2026-01-22T09:21:44.293Z"
  },
  {
    "id": 105,
    "name": "Beverages & Liquids",
    "slug": "beverages-liquids",
    "description": "Fair-trade coffee, organic teas, and plant-based milk.",
    "image": "https://images.unsplash.com/photo-1544787210-2213d44ad53e?auto=format&fit=crop&w=800&q=80",
    "parentId": 100,
    "createdAt": "2026-01-22 09:21:44.293536",
    "updatedAt": "2026-01-22T09:21:44.293Z"
  },
  {
    "id": 106,
    "name": "Snacks & Ready-to-Eat",
    "slug": "snacks-ready-to-eat",
    "description": "Healthy, organic, and guilt-free snacks.",
    "image": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5635e?auto=format&fit=crop&w=800&q=80",
    "parentId": 100,
    "createdAt": "2026-01-22 09:21:44.293536",
    "updatedAt": "2026-01-22T09:21:44.293Z"
  },
  {
    "id": 107,
    "name": "Organic Fruits",
    "slug": "organic-fruits",
    "description": "Sweet fruits grown without synthetic pesticides.",
    "image": "https://images.unsplash.com/photo-1619566636858-adb3ef26400b?auto=format&fit=crop&w=800&q=80",
    "parentId": 101,
    "createdAt": "2026-01-22 09:21:44.325755",
    "updatedAt": "2026-01-22T09:21:44.325Z"
  },
  {
    "id": 108,
    "name": "Organic Vegetables",
    "slug": "organic-vegetables",
    "description": "Nutrient-rich greens and seasonal veggies.",
    "image": "https://images.unsplash.com/photo-1566385101042-1a000c1267c4?auto=format&fit=crop&w=800&q=80",
    "parentId": 101,
    "createdAt": "2026-01-22 09:21:44.325755",
    "updatedAt": "2026-01-22T09:21:44.325Z"
  },
  {
    "id": 109,
    "name": "Fresh Herbs",
    "slug": "fresh-herbs",
    "description": "Aromatic organic herbs to elevate your cooking.",
    "image": "https://images.unsplash.com/photo-1594145025988-19e07802804d?auto=format&fit=crop&w=800&q=80",
    "parentId": 101,
    "createdAt": "2026-01-22 09:21:44.325755",
    "updatedAt": "2026-01-22T09:21:44.325Z"
  },
  {
    "id": 110,
    "name": "Ancient Grains & Rice",
    "slug": "ancient-grains-rice",
    "description": "Quinoa, amaranth, brown rice, and more.",
    "image": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    "parentId": 102,
    "createdAt": "2026-01-22 09:21:44.325755",
    "updatedAt": "2026-01-22T09:21:44.325Z"
  },
  {
    "id": 111,
    "name": "Organic Pasta & Noodles",
    "slug": "organic-pasta-noodles",
    "description": "Wholegrain and gluten-free pasta varieties.",
    "image": "https://images.unsplash.com/photo-1551462147-3a8823c819f8?auto=format&fit=crop&w=800&q=80",
    "parentId": 102,
    "createdAt": "2026-01-22 09:21:44.325755",
    "updatedAt": "2026-01-22T09:21:44.325Z"
  },
  {
    "id": 112,
    "name": "Cold-Pressed Oils",
    "slug": "cold-pressed-oils",
    "description": "Extra virgin olive oil and avocado oil.",
    "image": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
    "parentId": 103,
    "createdAt": "2026-01-22 09:21:44.325755",
    "updatedAt": "2026-01-22T09:21:44.325Z"
  },
  {
    "id": 113,
    "name": "Organic Nut Butters",
    "slug": "organic-nut-butters",
    "description": "Pure almond and peanut butters with no additives.",
    "image": "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80",
    "parentId": 103,
    "createdAt": "2026-01-22 09:21:44.325755",
    "updatedAt": "2026-01-22T09:21:44.325Z"
  },
  {
    "id": 114,
    "name": "Tea & Coffee",
    "slug": "tea-coffee",
    "description": "Fair-trade, organic beans and herbal infusions.",
    "image": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80",
    "parentId": 105,
    "createdAt": "2026-01-22 09:21:44.325755",
    "updatedAt": "2026-01-22T09:21:44.325Z"
  },
  {
    "id": 115,
    "name": "Plant-Based Milks",
    "slug": "plant-based-milks",
    "description": "Unsweetened oat, almond, and soy alternatives.",
    "image": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",
    "parentId": 105,
    "createdAt": "2026-01-22 09:21:44.325755",
    "updatedAt": "2026-01-22T09:21:44.325Z"
  },
  {
    "id": 120,
    "name": "New New New",
    "slug": "new-new-new",
    "description": "",
    "image": "1769168864595-787347624.jpg",
    "parentId": null,
    "createdAt": "2026-01-23 11:47:45.091662",
    "updatedAt": "2026-01-23T11:47:45.091Z"
  }
]