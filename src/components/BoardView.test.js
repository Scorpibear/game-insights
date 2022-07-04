import { getByText, render } from "@testing-library/vue";
import { describe, it } from "vitest";

// mocks to make Chessboard work
window.$ = () => {};
window.Chessboard = () => ({ orientation: () => {}, position: () => {} });

import BoardView from "./BoardView.vue";

describe("BoardView", () => {
  it("displays eco", () => {
    const { getByText } = render(BoardView, {
      props: {
        game: { pgn: "", moves: "", opening: { eco: "D99", name: "New One" } },
        username: "testuser",
      },
    });

    getByText("D99: New One");
  });
  it("shows popular by masters+online", () => {
    const { getByText } = render(BoardView, {
      props: {
        game: { pgn: "1.e4" },
        username: "testuser",
      },
    });

    getByText("Popular(masters+online):");
  });
});
