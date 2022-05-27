export const pgn2moves = (pgn) =>
  pgn
    .replace(/(\[.*\])|(\d+\.\s)|(\n*)/g, "")
    .trim()
    .split(" ")
    .slice(0, -1);

export function lichess2fenData(input) {
  return { depth: input.depth };
}
