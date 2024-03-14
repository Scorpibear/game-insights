import { render, fireEvent } from "@testing-library/vue";
import { describe, it, expect, vi, afterEach } from "vitest";

// mocks to make Chessboard work
window.$ = () => {};
window.Chessboard = () => ({ orientation: () => "white", position: () => {} });

const backend = {
  updateAltMoves: () => {},
  getBestMove: () => Promise.resolve({ bestMove: "e4" }),
  getPopularMoves: () =>
    Promise.resolve({ moves: [{ san: "d4" }, { san: "e4" }, { san: "Nf3" }] }),
};

async function execNow(fn) {
  try {
    await fn();
  } catch (err) {
    // Do nothing
  }
}

const game = { pgn: "1. e4 c6" };
const fens = {
  start: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "1. e4": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
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
  it("has continue with the main line option", async () => {
    const { getByText } = render(BoardView, {
      props: { backend, game: { pgn: "1. e4" } },
    });
    vi.spyOn(global, "setTimeout").mockImplementation(execNow);

    const button = getByText("Continue with Main Line");
    await fireEvent.click(button);
  });
  it("has Replay & Learn button", async () => {
    const { getByText } = render(BoardView, {
      props: { backend, game: { pgn: "1. e4" } },
    });

    const button = getByText("Replay & Learn");
    await fireEvent.click(button);
  });
  it("close the board emits board.replaceWith event", async () => {
    const wrapper = render(BoardView, {
      props: { backend, game },
    });

    const button = wrapper.getByRole("button", { name: "x" });
    await fireEvent.click(button);
    expect(wrapper.emitted()).toHaveProperty("replaceWith");
  });
  /* make it work
  it("users actual position when split", async () => {
    const wrapper = render(BoardView, { props: { backend, game } });

    const button = wrapper.getByAltText("split");
    await fireEvent.click(button);
    console.log(wrapper.emitted());
  });*/
  it("shows opening passed as a property", async () => {
    const { getByText } = render(BoardView, {
      props: {
        backend,
        game: {
          ...game,
          openingInfo: {
            eco: "B90",
            name: "Sicilian Defense: Najdorf Variation, Adams Attack",
          },
        },
      },
    });
    getByText("B90: Sicilian Defense: Najdorf Variation, Adams Attack");
  });
  // button does not appear
  /*
  it("listens to split2top18", async () => {
    console.log("TEST START");
    const wrapper = render(BoardView, {
      props: { backend, game },
    });
    console.log("RENDER ENDS");
    const button = wrapper.getByRole("button", { name: "18" });
    console.log("SEARCH FOR THE BUTTON FINISHED");
    await fireEvent.click(button);
    console.log("CLICK ON THE BUTTON FINISHED");
    expect(wrapper.emitted()).toHaveProperty("split2top18");
    console.log("TEST END");
  });
  */
  
  it("shows last fen when the board is loaded", async () => {
    // create board with 1.e4 game
    const { findByTestId } = render(BoardView, {
      props: { game: { pgn: "1. e4" }, backend },
    });
    
    await findByTestId(fens["1. e4"]);
  });
  it("change fen to the initial when back is pressed in 1.e4 game", async () => {
    const { getByTestId } = render(BoardView, {
      props: { game: { pgn: "1. e4" }, backend },
    });
    
    await fireEvent.click(getByTestId("back"));
    
    getByTestId(fens.start);
  });
  it("return fen to the last when next is pressed after back in 1.e4 game", async () => {
    const { getByTestId } = render(BoardView, {
      props: { game: { pgn: "1. e4" }, backend },
    });
    
    await fireEvent.click(getByTestId("back"));
    await fireEvent.click(getByTestId("next"));
    
    getByTestId(fens["1. e4"]);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });
});
