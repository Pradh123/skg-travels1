import pages from "./sitePages.json";
export { navLinks, fleet, benefits } from "./siteMeta";

export const pageMap = new Map(pages.map((page) => [page.pathname, page]));
export const getPage = (pathname) => pageMap.get(pathname);
export const sitePages = pages;
