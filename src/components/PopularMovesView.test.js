import { render } from "@testing-library/vue";
import { describe, it, expect } from "vitest";

import PopularMovesView from "./PopularMovesView.vue";

describe("PopularMovesView", () => {
  const data = [
    { san: "Be3", masterGamesAmount: 34000, onlineGamesAmount: 321000 },
    { san: "Bg5", masterGamesAmount: 12000, onlineGamesAmount: 484000 },
  ];
  it("renders without errors", () => {
    const { getByText } = render(PopularMovesView, { props: { data } });
    getByText("Be3 (34K+321K), Bg5 (12K+484K)");
  });
  it("shows the button for top 18 positions", () => {
    const { getByText } = render(PopularMovesView, { props: { data } });
    getByText("18");
  });
  it("button triggers new boards creation", () => {
    const { getByText, emitted } = render(PopularMovesView, {
      props: { data },
    });
    getByText("18").click();
    expect(emitted("split2top18")).toBeDefined();
  });
});
