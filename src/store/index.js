import { configureStore } from "@reduxjs/toolkit";
import wordleReducer from "../features/wordle/wordleSlice";

export default configureStore({
  reducer: {
    wordle: wordleReducer
  }
});
