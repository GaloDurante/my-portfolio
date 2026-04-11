"use client";

import { useState } from "react";

export function useSidebarCollapsed(initial: boolean) {
  const [collapsed, setCollapsed] = useState(initial);

  const toggleCollapsed = () => {
    const newValue = !collapsed;
    setCollapsed(newValue);

    document.cookie = `sidebar-collapsed=${newValue}; path=/`;
  };

  return { collapsed, toggleCollapsed };
}
