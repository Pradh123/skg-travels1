export const searchCategories = [
  { value: "all", label: "All" },
  { value: "cities", label: "Cities" },
  { value: "blogs", label: "Blogs" },
  { value: "cars", label: "Cars" },
];

export function getSearchCategory(page) {
  const pathname = page.pathname || "";
  if (pathname === "/cities" || pathname.startsWith("/cities/")) return "cities";
  if (pathname === "/blogs" || pathname.startsWith("/blogs/")) return "blogs";
  if (pathname.startsWith("/car-rental") || pathname.startsWith("/cars/") || pathname === "/services") return "cars";
  return "all";
}

export function matchesSearchCategory(page, category) {
  return category === "all" || getSearchCategory(page) === category;
}
