import { AltMovesDB } from "./alt-moves-db";

const key = "altMoves";

export class AltMovesDBSynced extends AltMovesDB {
  constructor() {
    const syncedStr = localStorage.getItem(key);
    let data = undefined;
    if (syncedStr) {
      try {
        data = JSON.parse(syncedStr);
      } catch (err) {
        console.error(
          `Could not load altMovesDB from broken string '${syncedStr}': ${err}`
        );
      }
    }
    super(data);
  }
  update(fen, moves) {
    super.update(fen, moves);
    localStorage.setItem(key, JSON.stringify([...this]));
  }
}
