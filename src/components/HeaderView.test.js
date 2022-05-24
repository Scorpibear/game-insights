import { render } from "@testing-library/vue";
import { it } from "vitest";

import HeaderView from "./HeaderView.vue";

it("requests lichess username", () => {
  const { getByText } = render(HeaderView, {
    props: {},
  });

  // assert output
  getByText("Game Insights for lichess username:");
});
