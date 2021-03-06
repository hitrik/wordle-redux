import { createSlice } from "@reduxjs/toolkit";

const TOTAL_LEVELS = 6;
const MAX_LENGTH_WORD = 5;
const colors = new Map();
colors.set("outofplace", "orange");
colors.set("absent", "lightgrey");
colors.set("correct", "lightgreen");

function compareWordsAndGetColors(user, guessed) {
  const result = [];
  for (let i = 0; i < MAX_LENGTH_WORD; i++) {
    if (guessed.includes(user[i])) {
      if (user[i] === guessed[i]) {
        result[i] = colors.get("correct");
      } else {
        result[i] = colors.get("outofplace");
      }
    } else {
      result[i] = colors.get("absent");
    }
  }
  return result;
}

export const wordleSlice = createSlice({
  name: "wordle",
  reducers: {
    addLetter(state, action) {
      if (
        state.userInput.length < MAX_LENGTH_WORD &&
        action.payload.match(/[а-я]/gi)
      ) {
        state.userInput = [...state.userInput, action.payload.toUpperCase()];
      }
    },
    removeLetter(state) {
      const value = [...state.userInput];
      value.pop();
      state.userInput = value;
    },
    colorWinnerWord(state) {
      state.colors = new Array(5).fill("lightgreen");
    },
    colorLoserWord(state) {
      state.colors = new Array(5).fill("tomato");
    },
    nextLevel(state) {
      if (state.isGameOver) {
        return;
      }
      if (state.level < TOTAL_LEVELS) {
        const userWord = state.userWords[state.level];
        const colors = compareWordsAndGetColors(userWord, state.guessedWord);
        state.colors = colors;
        state.userColors[state.level] = colors;

        state.level = state.level + 1;
      }
      state.colors = [];
      state.userInput = [];
    },
    addUserWord(state) {
      if (
        state.userInput.length === 0 &&
        state.userInput.length < MAX_LENGTH_WORD
      ) {
        return;
      }
      if (state.userInput.join("") === state.guessedWord) {
        state.isGameOver = true;
        state.status = "WIN";
        return;
      }
      if (state.level === TOTAL_LEVELS - 1) {
        state.isGameOver = true;
        state.status = "LOSE";
        return;
      }
      state.userWords[state.level] = [...state.userInput];
      state.userInput = [];
    },
    initGame(state) {
      state.guessedWord = state.wizardWords[
        Math.floor(Math.random() * state.wizardWords.length)
      ].toUpperCase();
      state.level = 0;
      state.userInput = "";
      state.isGameOver = false;
      const emptyWord = new Array(MAX_LENGTH_WORD).fill("");
      const words = [];
      const colors = [];
      for (let i = 0; i < TOTAL_LEVELS; i++) {
        words.push(emptyWord);
        colors.push([]);
      }
      state.colors = [];
      state.userColors = colors;
      state.userWords = words;
    }
  },
  initialState: {
    colors: [],
    guessedWord: "",
    userInput: [],
    level: 0,
    isGameOver: false,
    userWords: [],
    userColors: [],
    status: "LOOSE",
    wizardWords: [
      "палка",
      "сосна",
      "крупа",
      "блажь",
      "народ",
      "помпа",
      "карта",
      "парад",
      "марка",
      "трава",
      "калач"
    ]
  }
});

export const {
  addLetter,
  nextLevel,
  removeLetter,
  initGame,
  addUserWord,
  getColorForWord,
  colorWinnerWord,
  colorLoserWord
} = wordleSlice.actions;

export default wordleSlice.reducer;
