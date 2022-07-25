import { render } from "@testing-library/vue";
import { describe, it } from "vitest";

import HeaderView from "./HeaderView.vue";

describe("HeaderView", () => {
  it("requests lichess username", () => {
    const { getByText } = render(HeaderView, {
      props: {},
    });

    // assert output
    getByText("Game insights for:");
  });
  describe("get button", () => {
    it("request the latest games from backend", () => {});
  });
});
