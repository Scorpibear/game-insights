import { render } from "@testing-library/vue";
import { it } from "vitest";

// mocks to make Chessboard work
window.$ = () => {};
window.Chessboard = () => ({ orientation: () => {}, position: () => {} });

import BoardView from "./BoardView.vue";

it("displays eco", () => {
  const { getByText } = render(BoardView, {
    props: {
      game: { pgn: "", moves: "", opening: { eco: "D99", name: "New One" } },
      username: "testuser",
    },
  });

  // assert output
  getByText("D99: New One");
});
