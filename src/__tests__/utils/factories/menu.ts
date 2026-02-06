export function menuItemFactory(overrides: Partial<any> = {}) {
  return {
    id: 'item_' + Math.random().toString(16).slice(2),
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato and mozzarella',
    price: 1299,
    imageUrl: '/pizza.jpg',
    categoryId: 'cat_1',
    available: true,
    createdAt: new Date(),
    ...overrides,
  };
}

export function categoryFactory(overrides: Partial<any> = {}) {
  return {
    id: 'cat_' + Math.random().toString(16).slice(2),
    name: 'Pizza',
    ...overrides,
  };
}
