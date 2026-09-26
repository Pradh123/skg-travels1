import Link from "next/link";
import { Search } from "lucide-react";
import { sitePages } from "@/data/site";

export const metadata = {
  title: "Search SKG Travels",
  description: "Search SKG Travels services, cities and taxi routes.",
};

function getPageText(page) {
  const sections = page.sections || [];
  return {
    title: `${page.title || ""} ${page.heading || ""}`.toLowerCase(),
    description: (page.description || "").toLowerCase(),
    pathname: (page.pathname || "").replaceAll("-", " ").toLowerCase(),
    content: sections
      .flatMap((section) => [section.heading, ...(section.paragraphs || [])])
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  };
}

function getExcerpt(page, terms) {
  const paragraphs = (page.sections || []).flatMap((section) => section.paragraphs || []);
  const excerpt = paragraphs.find((paragraph) => terms.some((term) => paragraph.toLowerCase().includes(term)))
    || page.description
    || "Explore this SKG Travels page.";
  return excerpt.length > 190 ? `${excerpt.slice(0, 187).trimEnd()}...` : excerpt;
}

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const results = terms.length
    ? sitePages
        .map((page) => {
          const text = getPageText(page);
          const allText = `${text.title} ${text.description} ${text.pathname} ${text.content}`;
          if (!terms.every((term) => allText.includes(term))) return null;
          const score = terms.reduce((total, term) => total
            + (text.title.includes(term) ? 5 : 0)
            + (text.pathname.includes(term) ? 4 : 0)
            + (text.description.includes(term) ? 2 : 0)
            + (text.content.includes(term) ? 1 : 0), 0);
          return { page, score };
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score)
        .slice(0, 40)
    : [];

  return (
    <main className="search-page">
      <div className="search-page-inner">
        <p className="search-page-eyebrow">SKG TRAVELS</p>
        <h1>{query ? `Search results for "${query}"` : "Search our website"}</h1>
        {query && <p className="search-page-count">Showing {results.length} {results.length === 1 ? "result" : "results"}</p>}
        {!query ? (
          <p className="search-page-empty">Enter a city, route, or service in the search bar above.</p>
        ) : results.length ? (
          <div className="search-results">
            {results.map(({ page }) => (
              <Link key={page.pathname} href={page.pathname} className="search-result-card">
                <span>{page.pathname === "/" ? "Home" : page.pathname.replaceAll("-", " ").replaceAll("/", " > ")}</span>
                <h2>{page.heading || page.title}</h2>
                <p>{getExcerpt(page, terms)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="search-page-empty">
            <Search size={22} aria-hidden="true" />
            <p>No pages found. Try a city name, route, or service.</p>
          </div>
        )}
      </div>
    </main>
  );
}
