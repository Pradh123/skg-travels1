import { serializeJsonLd } from "@/lib/seo/schemas";

// Renders one server-generated <script type="application/ld+json"> node per schema entry.
// JSON-LD is valid anywhere in the document, so pages render it inline next to their content.
export default function JsonLd({ graph = [] }) {
  const nodes = (Array.isArray(graph) ? graph : [graph]).filter(Boolean);
  if (!nodes.length) return null;
  return (
    <>
      {nodes.map((node, index) => (
        <script
          key={node["@id"] || `${node["@type"] || "node"}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(node) }}
        />
      ))}
    </>
  );
}
