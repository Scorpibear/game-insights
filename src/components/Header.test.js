import { render } from "@testing-library/vue";
import { it } from "vitest";

import Header from "./Header.vue";

it("requests lichess username", () => {
  const { getByText } = render(Header, {
    props: {},
  });

  // assert output
  getByText("Game Insights for lichess username:");
});
