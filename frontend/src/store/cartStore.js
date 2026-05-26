import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  items: [],

  addItem: (produto, quantidade = 1) => {
    const { items } = get()
    const existing = items.find(i => i.produto.id === produto.id)
    if (existing) {
      set({ items: items.map(i =>
        i.produto.id === produto.id
          ? { ...i, quantidade: i.quantidade + quantidade }
          : i
      )})
    } else {
      set({ items: [...items, { produto, quantidade }] })
    }
  },

  removeItem: (produtoId) => {
    set({ items: get().items.filter(i => i.produto.id !== produtoId) })
  },

  updateQuantidade: (produtoId, quantidade) => {
    if (quantidade <= 0) {
      get().removeItem(produtoId)
      return
    }
    set({ items: get().items.map(i =>
      i.produto.id === produtoId ? { ...i, quantidade } : i
    )})
  },

  clearCart: () => set({ items: [] }),

  getTotal: () => {
    return get().items.reduce((acc, i) =>
      acc + (parseFloat(i.produto.preco) * i.quantidade), 0)
  },

  getCount: () => {
    return get().items.reduce((acc, i) => acc + i.quantidade, 0)
  },
}))
