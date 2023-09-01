import { configure, render } from "@testing-library/vue";
import { describe, it, expect, beforeAll } from "vitest";

import PopularMovesView from "./PopularMovesView.vue";

describe("PopularMovesView", () => {
  beforeAll(() => {
    configure({testIdAttribute: 'id'});
  })
  const data = [
    { san: "Be3", masterGamesAmount: 34000, onlineGamesAmount: 321000 },
    { san: "Bg5", masterGamesAmount: 12000, onlineGamesAmount: 484000 },
  ];
  it("renders without errors", () => {
    const { getByText } = render(PopularMovesView, { props: { data } });
    getByText("Be3 (34K+321K), Bg5 (12K+484K)");
  });
  it("shows the button for top 11 positions", () => {
    const { getByText } = render(PopularMovesView, { props: { data } });
    getByText("11");
  });
  it("button triggers split2top event", () => {
    const { getByText, emitted } = render(PopularMovesView, {
      props: { data },
    });
    getByText("11").click();
    expect(emitted("split2top")).toBeDefined();
  });
  it("split to 3 emitted split2top3", () => {
    const { getByTestId, emitted } = render(PopularMovesView, {
      props: { data },
    });
    getByTestId("split2top3").click();
    expect(emitted("split2top3")).toBeDefined();
  })
});
