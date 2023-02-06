import { render } from "@testing-library/vue";
import { describe, it } from "vitest";

import PopularMovesView from "./PopularMovesView.vue";

describe("PopularMovesView", () => {
  it("renders without errors", () => {
    const { getByText } = render(PopularMovesView, {
      props: {
        data: [
          { san: "Be3", masterGamesAmount: 34000, onlineGamesAmount: 321000 },
          { san: "Bg5", masterGamesAmount: 12000, onlineGamesAmount: 484000 },
        ],
      },
    });
    getByText("Be3 (34K+321K), Bg5 (12K+484K)");
  });
});
