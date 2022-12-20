import { render, fireEvent } from "@testing-library/vue";
import { describe, it, expect, vi } from "vitest";

// mocks to make Chessboard work
window.$ = () => {};
window.Chessboard = () => ({ orientation: () => {}, position: () => {} });

const backend = {
  updateAltMoves: () => {},
  getBestMove: () => Promise.resolve({ bestMove: "e4" }),
  getPopularMoves: () => Promise.resolve([]),
};

import BoardView from "./BoardView.vue";

describe("BoardView", () => {
  it("shows popular by masters+online", () => {
    const { getByText } = render(BoardView, {
      props: {
        game: { pgn: "1.e4" },
        backend,
      },
    });

    getByText("Popular:");
  });
  it("displays popular moves", () => {
    const { getByText } = render(BoardView, {
      props: {
        game: { pgn: "1. e4 e5" },
        popularMoves: [
          { san: "Be3", masterGamesAmount: 35000, onlineGamesAmount: 323000 },
          { san: "Bg5", masterGamesAmount: 22000, onlineGamesAmount: 485000 },
        ],
        backend,
      },
    });
    getByText("Be3 (35K+323K), Bg5 (22K+485K)");
  });
  it("displays 'no data' twice for bestMove and popularMoves", () => {
    const { getAllByText } = render(BoardView, {
      props: {
        game: { pgn: "1. e4 e5" },
        bestMove: null,
        backend,
      },
    });
    expect(getAllByText("no data").length).toBe(2);
  });
  it("calls backend.updateAltMoves when alt move is added", async () => {
    vi.spyOn(global, "prompt").mockReturnValue("c4");
    vi.spyOn(backend, "updateAltMoves");

    const { getByRole } = render(BoardView, {
      props: {
        backend,
        game: { pgn: "1. e4 e5" },
      },
    });
    const button = getByRole("button", { name: "+" });
    await fireEvent.click(button);

    expect(backend.updateAltMoves).toHaveBeenCalled();
  });
});
