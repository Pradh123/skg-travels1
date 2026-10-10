"use client";
import { createContext, useContext } from "react";
const PublicContent = createContext([]);
export const usePublicContent = () => useContext(PublicContent);
export default function PublicContentProvider({ pages, children }) {
  return <PublicContent.Provider value={pages}>{children}</PublicContent.Provider>;
}
