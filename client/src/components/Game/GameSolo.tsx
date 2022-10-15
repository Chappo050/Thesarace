import axios from "axios";
import { useEffect, useState } from "react";
import Nav from "../Nav";
import CountdownTimer from "../CountdownTimer";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

interface Word {
  _id: String;
  word: String;
  synonyms: [String];
}

const defaultWords: Word[] = [];

function GameSolo() {
  const [words, setWords]: [Word[], (words: Word[]) => void] =
    useState(defaultWords);

  const [wordCount, setWordCount] = useState(0);

  const [guessedWords, setGuessedWords] = useState([""]);

  const [score, setScore] = useState(0);

  const [formValue, setformValue] = useState({
    guess: "",
  });

  //initalize timer
  const [timer, setTimer] = useState(30 * 1000 + new Date().getTime())

  useEffect(() => {
    api
      .get("/game/soloGame")
      .then((response) => {
        setWords(response.data);
        console.log(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    //check if guess is correct and hasnt already been guessed
    for (let i = 0; i < words[wordCount].synonyms.length; i++) {
      const element = words[wordCount].synonyms[i];
      if (formValue.guess.trim() === element && !guessedWords.includes(formValue.guess.trim())) {
        //update scores and words
        setGuessedWords([formValue.guess, ...guessedWords]);
        setScore(score + 1);
        setformValue({ guess: "" });
        // add 2 seconds to the timer
        setTimer(timer + 2* 1000)
      }
    }
  };

  const handleChange = (event: any) => {
    setformValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div>
      <Nav />
      <div className="grid grid-cols-3 text-center">
        <div className="pt-36  text-5xl">
          <div>Player Name</div>
          <form
            onSubmit={handleSubmit}
            className="text-black text-center p-4 text-3xl"
          >
            <div className="p-2 m-2 text">
              <input
                type="guess"
                name="guess"
                placeholder="             Enter your guess here!"
                value={formValue.guess}
                onChange={handleChange}
                required
                className="text-black p-0.5"
              />
            </div>

            <div className="">
              <button
                type="submit"
                className="bg-teal-200 p-1 border border-black"
              >
                Submit
              </button>
              <p className="text-3xl pt-24 font-extrabold">Score: {score}</p>
            </div>
          </form>
        </div>
        <div className=" text-2xl pt-5">
          <p>Find as many synonyms as possible!</p>
          <CountdownTimer time={timer} />
          <div>{words.map((word, key) => CurrentWord(word, guessedWords))}</div>
        </div>
        <i />
      </div>
    </div>
  );
}

const CurrentWord = (word: Word, guessedWords: String[]) => {
  return (
    <div>
      <div className="text-8xl">{word.word}</div>
      <div className="grid grid-cols-3 gap-3 pt-10">
        {word.synonyms.map((synonym, key) => (
          <i>{synonym}</i>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 pt-10 text-blue-800">
        {guessedWords.map((synonym, key) => (
          <i>{synonym}</i>
        ))}
      </div>
    </div>
  );
};

export default GameSolo;
