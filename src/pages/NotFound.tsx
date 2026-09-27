import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  // Static hosting cannot return a real 404 status, so emit the strongest
  // signal we can: noindex,nofollow, a distinct title and description, and
  // no canonical at all. Every tag is replaced in place, never appended, so
  // the head can never carry two of anything. Restored on unmount.
  useEffect(() => {
    const upsertMeta = (name: string, content: string) => {
      const all = document.head.querySelectorAll<HTMLMetaElement>(`meta[name="${name}"]`);
      all.forEach((n, i) => i > 0 && n.remove());
      let tag = all[0];
      const previous = tag ? tag.getAttribute("content") : null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
      return () => {
        if (previous === null) tag.remove();
        else tag.setAttribute("content", previous);
      };
    };

    const previousTitle = document.title;
    document.title = "Page not found (404) | Carnival Glam Hub";
    const restoreRobots = upsertMeta("robots", "noindex, nofollow");
    const restoreDescription = upsertMeta(
      "description",
      "This page could not be found on Carnival Glam Hub. Return to the home page to explore Carnival makeup, hair and glam services.",
    );

    const removed = Array.from(document.head.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]'));
    const lastHref = removed[0]?.getAttribute("href") ?? null;
    removed.forEach((n) => n.remove());

    return () => {
      document.title = previousTitle;
      restoreRobots();
      restoreDescription();
      if (lastHref && !document.head.querySelector('link[rel="canonical"]')) {
        const c = document.createElement("link");
        c.setAttribute("rel", "canonical");
        c.setAttribute("href", lastHref);
        document.head.appendChild(c);
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
