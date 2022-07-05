import React, { useEffect, useCallback } from "react";
import { Line } from "./components";
import { Provider, useSelector, useDispatch } from "react-redux";
import {
  addLetter,
  nextLevel,
  removeLetter,
  initGame,
  addUserWord,
  colorWinnerWord,
  colorLoserWord
} from "./features/wordle/wordleSlice";
import store from "./store";
import "./styles.css";

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
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    if (isGameOver) {
      dispatch(status === "WIN" ? colorWinnerWord() : colorLoserWord());
      delay(300).then(() => {
        alert("YOU " + status + " !\n\n\nЗагадано было слово: " + guessed);
        dispatch(initGame());
      });
    }
  }, [isGameOver, dispatch, status, guessed]);

  return (
    <>
      <p className="title">Вордл</p>
      <p>Вводите слова на русском языке:</p>
      <p className="rule-line">
        <div className="rule-square green">А</div> - буква совпала
      </p>
      <p className="rule-line">
        <div className="rule-square orange">Б</div> - буква совпала, но не своем
        месте
      </p>
      <p className="rule-line">
        <div className="rule-square grey">В</div> - буква отсутствует
      </p>
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
