export class AltMovesDB extends Map {
  update(fen, moves) {
    this.set(fen, moves);
  }
}
