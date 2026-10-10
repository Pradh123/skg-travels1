import Script from "next/script";
import { parseCmsScripts } from "@/lib/api/cmsScripts";

export default function CmsScripts({ page, placement = "seo" }) {
  return parseCmsScripts(placement === "body" ? page.bodyScripts : page.headScripts).map(
    (script, index) => {
      const id = `cms-${placement}-${page.cmsResource}-${page.cmsRecordId || page.pathname}-${index}`;
      if (script.type === "application/ld+json") {
        return (
          <script
            key={id}
            id={id}
            type={script.type}
            dangerouslySetInnerHTML={{ __html: script.code }}
          />
        );
      }
      return (
        <Script
          key={id}
          id={id}
          type={script.type}
          strategy={placement === "body" ? "lazyOnload" : "afterInteractive"}
          {...(script.src
            ? { src: script.src }
            : { dangerouslySetInnerHTML: { __html: script.code } })}
        />
      );
    }
  );
}
