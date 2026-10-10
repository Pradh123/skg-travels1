import Script from "next/script";
import { parseCmsScripts } from "@/lib/api/cmsScripts";

export default function CmsScripts({ page }) {
  return parseCmsScripts(page.headScripts).map((script, index) => {
    const id = `cms-${page.cmsResource}-${page.cmsRecordId || page.pathname}-${index}`;
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
        strategy="afterInteractive"
        {...(script.src
          ? { src: script.src }
          : { dangerouslySetInnerHTML: { __html: script.code } })}
      />
    );
  });
}
