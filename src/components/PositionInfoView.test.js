import { render, configure, fireEvent } from "@testing-library/vue";
import { describe, it, expect, beforeAll, vi, afterEach } from "vitest";

import PositionInfoView from "./PositionInfoView.vue";

const spyOn = vi.spyOn;

describe("PositionInfoView", () => {
  beforeAll(() => {
    configure({testIdAttribute: 'id'});
  })
  const pgn = "1. d4 d6";
  const fen = "rnbqkbnr/ppp1pppp/3p4/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2";
  const noteManager = {get: () => "default note", set: () => {}};
  it("renders without errors", () => {
    render(PositionInfoView, { props: {pgn, fen, noteManager} });
  });
  it("noteManager.set is called when note is changed", async () => {
    spyOn(noteManager, 'set').mockImplementation(() => {});
    const {getByTestId} = render(PositionInfoView, { props: {pgn, fen, noteManager} });
    await fireEvent.click(getByTestId("show-note"));
    await fireEvent.update(getByTestId('note'), "my note");
    expect(noteManager.set).toHaveBeenCalled();
  })
  it("shows fen", async () => {
    const {getByTestId, getByDisplayValue} = render(PositionInfoView, { props: {pgn, fen, noteManager} });
    await fireEvent.click(getByTestId("show-fen"));
    getByDisplayValue(fen);
  })
  afterEach(() => {
    vi.resetAllMocks();
  })
});
