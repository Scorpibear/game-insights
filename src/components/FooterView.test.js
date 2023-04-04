import FooterView from "./FooterView.vue";
import { version } from "../../package";
import { render } from "@testing-library/vue";
import { describe, it } from "vitest";

describe("FooterView", () => {
  it("displayes current version", () => {
    const { getByText } = render(FooterView, {});

    getByText(`Game Insights v${version}`);
  });
});
