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
  it("displays popular moves", () => {
    const { getByText } = render(BoardView, {
      props: {
        game: { pgn: "1. e4 e5" },
        username: "testuser",
        popularMoves: [
          { san: "Be3", masterGamesAmount: 35000, onlineGamesAmount: 323000 },
          { san: "Bg5", masterGamesAmount: 22000, onlineGamesAmount: 485000 },
        ],
      },
    });
    getByText("Be3 (35K+323K), Bg5 (22K+485K)");
  });
  it("displays 'no data' twice for bestMove and popularMoves", () => {
    const { getAllByText } = render(BoardView, {
      props: {
        game: { pgn: "1. e4 e5" },
        username: "testuser",
        bestMove: null,
      },
    });
    expect(getAllByText("no data").length).toBe(2);
  });
});
