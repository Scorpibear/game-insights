describe("E2E Tests", () => {
  it("should open the home page", () => {
    cy.visit("/").get(".board-header").should("contain", "Let's learn");
  });
  it("should get games of Zhigalko from lichess.org", () => {
    cy.visit("/");
    cy.get("input[name=lichess-username]").type("Zhigalko_Sergei");
    cy.get("button[name=get]").click();
  });
  it("note is saved after switching out of the context", () => {
    cy.visit("/").get("#board0 > .position-info > .controls > #show-note").as("show-note").click();
    cy.get('#note').as("note-area").type("my note");
    cy.get("#board0 > .position-info > .controls > #show-fen").click()
    cy.get("@show-note").click();
    cy.get("@note-area").should("have.value", "my note");
  });
  it("shows different notes for different positions", () => {
    cy.visit("/");
    cy.get('#board1 > .position-info > .controls > #show-note').as("show-note").click();
    cy.get('#board1 > .position-info > .text-area > #note').as("note-area").type("e4 note");
    cy.get("#board1 > .navigation > #back").click();
    cy.get("@note-area").should("not.have.value", "e4 note");
  })
});
