describe("E2E Tests", () => {
  it("should open the home page", () => {
    cy.visit("/").get(".board-header").should("contain", "Let's learn");
  });
  it("should get games of Zhigalko from lichess.org", () => {
    cy.visit("/");
    cy.get("input[name=lichess-username]").type("Zhigalko_Sergei");
    cy.get("button[name=get]").click();
  });
});
