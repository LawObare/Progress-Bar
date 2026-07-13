import { createContext, useContext, useState } from "react";

const DataContext = createContext(null);

let nextId = 1;
function genId() {
  return `item-${nextId++}-${Date.now()}`;
}

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (data) => {
    const item = {
      ...data,
      id: genId(),
      createdAt: new Date().toISOString(),
    };
    setItems((prev) => [...prev, item]);
    return item;
  };

  const updateItem = (id, changes) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...changes } : i))
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <DataContext.Provider value={{ items, addItem, updateItem, removeItem }}>
      {children}
    </DataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useItemsByType(type, category) {
  const { items } = useData();
  return items.filter(
    (i) => i.type === type && (!category || i.category === category)
  );
}
