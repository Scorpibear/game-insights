import { render, fireEvent } from "@testing-library/vue";
import { describe, expect, it, vi } from "vitest";
import GoodMovesView from "./GoodMovesView.vue";

describe("GoodMovesView", () => {
  it("shows bestMove", () => {
    const { getByText } = render(GoodMovesView, {
      props: {
        data: { san: "Nf3", score: 0.25, depth: 50 },
      },
    });

    getByText(/Nf3, score: 0.25, depth: 50/);
  });
  it("shows alt move", () => {
    const { getByRole } = render(GoodMovesView, {
      props: { data: { san: "Nf3", alt: ["Be3"] } },
    });
    const element = getByRole("listitem");
    expect(element.innerText).toBe("Be3 x");
  });
  it("shows all alt moves", () => {
    const { getByRole } = render(GoodMovesView, {
      props: { data: { san: "e4", alt: ["d4", "c4", "Nf3"] } },
    });
    const element = getByRole("list");
    expect(element.innerText).toContain("d4").toContain("c4").toContain("Nf3");
  });
  it("removes alt moves", async () => {
    const { getByRole } = render(GoodMovesView, {
      props: { data: { san: "e4", alt: ["d4"] } },
    });
    await fireEvent.click(getByRole("button", { name: "x" }));
    const altMovesList = getByRole("list");
    expect(altMovesList.innerText).toBe("");
  });
  it("emits an event updateAll to update data when alt moves are added", async () => {
    const data = { san: "e4" };
    vi.spyOn(global, "prompt").mockReturnValue("d4");
    const { getByRole, emitted } = render(GoodMovesView, {
      props: { data },
    });
    await fireEvent.click(getByRole("button", { name: "+" }));
    expect(emitted("updateAlt")).toStrictEqual([[["d4"]]]);
  });
  it("calls event to update data when alt moves are deleted", async () => {
    const data = { san: "e4", alt: ["d4"] };
    const { getByRole, emitted } = render(GoodMovesView, {
      props: { data },
    });
    await fireEvent.click(getByRole("button", { name: "x" }));
    expect(emitted("updateAlt")).toStrictEqual([[[]]]);
  });
});
