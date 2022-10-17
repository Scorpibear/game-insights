import { render } from "@testing-library/vue";
import { describe, it, expect } from "vitest";

// mocks to make Chessboard work
window.$ = () => {};
window.Chessboard = () => ({ orientation: () => {}, position: () => {} });

import BoardView from "./BoardView.vue";

describe("BoardView", () => {
  it("shows popular by masters+online", () => {
    const { getByText } = render(BoardView, {
      props: {
        game: { pgn: "1.e4" },
        username: "testuser",
      },
    });

    getByText("Popular:");
  });
  it("displays bestMove", () => {
    const { getByText } = render(BoardView, {
      props: {
        game: { pgn: "1. e4 e5" },
        bestMove: { san: "h3", score: "0.59", depth: 46 },
      },
    });
    getByText("h3, score: 0.59, depth: 46");
  });
  it("displays 'no data' twice for bestMove and popularMoves", () => {
    const { getAllByText } = render(BoardView, {
      props: {
        game: { pgn: "1. e4 e5" },
        bestMove: null,
      },
    });
    expect(getAllByText("no data").length).toBe(2);
  });
});
