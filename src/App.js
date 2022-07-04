import React, { useEffect, useCallback } from "react";
import { Line } from "./components";
import { Provider, useSelector, useDispatch } from "react-redux";
import {
  addLetter,
  nextLevel,
  removeLetter,
  initGame,
  addUserWord
} from "./features/wordle/wordleSlice";
import store from "./store";
import "./styles.css";

const BLANK_WORD_ARRAY = new Array(5).fill("");
const WORD_LENGTH = 5;

const fillArrayByEmptyString = (inputArray) => {
  const result = [];
  for (let i = 0; i < WORD_LENGTH; i++) {
    result.push(inputArray[i] || "");
  }
  return result;
};

function Main() {
  const dispatch = useDispatch();
  const level = useSelector((state) => state.wordle.level);
  const guessed = useSelector((state) => state.wordle.guessedWord);
  const input = useSelector((state) => state.wordle.userInput);
  const userWords = useSelector((state) => state.wordle.userWords);
  const isGameOver = useSelector((state) => state.wordle.isGameOver);
  const colors = useSelector((state) => state.wordle.colors);
  const userColors = useSelector((state) => state.wordle.userColors);
  const status = useSelector((state) => state.wordle.status);

  const handle = useCallback(
    (event) => {
      if (event.key === "Enter") {
        dispatch(addUserWord());
        dispatch(nextLevel());
        return;
      }
      if (event.key === "Backspace") {
        dispatch(removeLetter());
      } else {
        dispatch(addLetter(event.key));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(initGame());
    window.addEventListener("keyup", handle, false);
    return () => window.removeEventListener("keyup", handle);
  }, [handle, dispatch]);

  useEffect(() => {
    if (isGameOver) {
      alert("YOU " + status + " !");
      dispatch(initGame());
    }
  }, [isGameOver, dispatch, status]);

  return (
    <>
      <p>Level: {level}</p>
      <p>User input: {input}</p>
      <p>Guessed: {guessed}</p>
      <p>Is game over? {isGameOver + ""}</p>
      <div className="conatiner">
        {userWords.map((_, index) => {
          return (
            <Line
              key={index}
              colors={level === index ? colors : userColors[index]}
              letters={
                level === index
                  ? fillArrayByEmptyString(input)
                  : userWords[index]
              }
            />
          );
        })}
      </div>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
