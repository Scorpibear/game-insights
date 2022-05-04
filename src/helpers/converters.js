export const pgn2moves = pgn => pgn.replace(/(\[.*\])|(\d+\.\s)|(\n*)/g,'').trim().split(' ').slice(0, -1);
