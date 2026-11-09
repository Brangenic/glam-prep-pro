/**
 * With BLOG_SEASON_NOTICES empty, the notice renders nothing on any post.
 */
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SeasonNotice from "@/components/blog/SeasonNotice";

describe("SeasonNotice with an empty map", () => {
  it.each(["ultimate-guide-to-trinidad-carnival-2026-mas-bands-dates-insider-tips", "any-other-post", undefined])(
    "renders nothing for %s",
    (slug) => {
      const { container } = render(
        <MemoryRouter>
          <SeasonNotice slug={slug} />
        </MemoryRouter>,
      );
      expect(container.innerHTML).toBe("");
    },
  );
});
