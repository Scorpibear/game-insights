import { render } from "@testing-library/vue";
import { describe, it, expect } from "vitest";

import PositionInfoView from "./PositionInfoView.vue";

describe("PositionInfoView", () => {
  const pgn = "1. d4 d6";
  const noteManager = {get: () => "default note"};
  it("renders without errors", () => {
    render(PositionInfoView, { props: {pgn, noteManager} });
  });
});
