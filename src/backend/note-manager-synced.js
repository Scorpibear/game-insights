import NoteManager from './note-manager'

export const NOTE_STORE_KEY = "notes";

export default class NoteManagerSynced extends NoteManager {
  constructor(initValue) {
    if(!initValue) {
      let storeValue = localStorage.getItem(NOTE_STORE_KEY);
      if(storeValue) {
        try {
          initValue = JSON.parse(storeValue);
        } catch (err) {
          console.error(`Could not parse notes: '${storeValue}'`);
        }
      }
    }
    super(initValue);
  }

  set(fen, note) {
    super.set(fen, note);
    localStorage.setItem(NOTE_STORE_KEY, JSON.stringify([...this]));
  }
}