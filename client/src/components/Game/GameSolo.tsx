import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Nav from "../Nav";
import CountdownTimer from "../CountdownTimer";
import { debounce } from "lodash";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

interface Word {
  _id: String;
  word: String;
  synonyms: [String];
}

interface PlayerDetails {
  username: String;
  guest: boolean;
}

const defaultWords: Word[] = [];

function GameSolo() {
  const timerRef = useRef<HTMLBodyElement>(null);

  const [words, setWords]: [Word[], (words: Word[]) => void] =
    useState(defaultWords);

    const [playerName, setPlayerName] = useState<PlayerDetails>({
      username: "",
      guest: true,
    });

  const [wordCount, setWordCount] = useState(0);

  const [guessedWords, setGuessedWords] = useState([""]);

  const [score, setScore] = useState(0);

  const [formValue, setformValue] = useState({
    guess: "",
  });

  const [onCooldown, setOnCooldown] = useState(false);

  const [gameOver, setGameOver] = useState(false);
  //initalize timer
  const [timer, setTimer] = useState(120 * 1000 + new Date().getTime());

  //When time is up remove words and next words and display final score
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (timerRef.current?.innerText == "0") {
        setGameOver(true);
      }
    }, 200);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: any) => {
      if (e.key === "ArrowRight" && !onCooldown) {
        newWordTimer();
        debouncedAPICall();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    fetchUserDetails()
    api
      .get("/game/new")
      .then((response) => {
        setWords(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  //clear guesses on word change
  useEffect(() => {
    setGuessedWords([""]);
  }, [words]);

  const debouncedAPICall = useRef(
    debounce(async () => {
      fetchWord();
    }, 1000)
  ).current;

  const fetchWord = async () => {
    if (!onCooldown) {
      newWordTimer();
      api
        .get("/game/new")
        .then((response) => {
          setWords(response.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const fetchUserDetails = async () => {
    api
      .get("/game/user")
      .then((response) => {
        setPlayerName(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    //check if guess is correct and hasnt already been guessed
    for (let i = 0; i < words[wordCount].synonyms.length; i++) {
      const element = words[wordCount].synonyms[i];
      if (
        formValue.guess.trim() === element &&
        !guessedWords.includes(formValue.guess.trim())
      ) {
        //update scores and words
        setGuessedWords([formValue.guess, ...guessedWords]);
        setScore(score + 1);
        setformValue({ guess: "" });
        // add 2 seconds to the timer
        setTimer(timer + 2 * 1000);
      }
    }
  };

  //handles cooldown for new word requests
  const newWordTimer = () => {
    setOnCooldown(true);
    setTimeout(() => {
      setOnCooldown(false);
    }, 1000);
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
      {!gameOver ? (
        <div className="grid grid-cols-3 text-center">
          <div className="grid grid-cols-1 gap-10 pt-36 md:text-2xl lg:text-4xl text-xl">
            <div>{playerName.username}</div>
            <form
              onSubmit={handleSubmit}
              className="text-black text-center p-4 md:text-xl lg:text-2xl text-lg"
            >
              <br />
              <div className="mx-5">
                <input
                  type="guess"
                  name="guess"
                  placeholder="Enter your guess here!"
                  value={formValue.guess}
                  onChange={handleChange}
                  required
                  className=" flex text-black p-0.5 w-full shadow-lg shadow-black text-center md:text-2xl sm:text-xl lg:text-3xl text-xl"
                />
              </div>

              <div className="">
                <br />
                <button
                  type="submit"
                  className="bg-teal-200 p-1 mt-10 border border-black text-center md:text-2xl sm:text-xl lg:text-3xl text-xl"
                >
                  Submit
                </button>
              </div>
            </form>
            <div>
              <p className="mt-2 font-extrabold md:text-2xl sm:text-xl lg:text-3xl text-xl">Score: {score}</p>
              {!onCooldown ? <NextWordButton fetchWord={fetchWord} /> : <></>}
            </div>
          </div>
          <div className=" text-2xl pt-5">
            <p>Find as many synonyms as possible!</p>
            <CountdownTimer time={timer} timerRef={timerRef} start={true} />
            <div>
              {words.map((word, key) => CurrentWord(word, guessedWords))}
            </div>

          </div>
          <i />
        </div>
      ) : (
        <div className="grid grid-cols-1 text-center text-4xl">
          <div className=" font-extrabold underline underline-offset-2 pt-10">
            Final Score is: {score}
          </div>
          <button className="bg-teal-200 p-1 border border-black m-16 hover:bg-teal-400 " onClick={refreshPage}>New Game</button>
        </div>
      )}
    </div>
  );
}

const NextWordButton = ({ fetchWord }: any) => {
  return (
    <button
      onClick={() => fetchWord()}
      className="bg-teal-200 p-1 border border-black md:text-2xl sm:text-xl lg:text-3xl text-xl"
    >
      Next Word
    </button>
  );
};
const CurrentWord = (word: Word, guessedWords: String[]) => {
  return (
    <div>
 
 <div className="md:text-5xl sm:text-4xl lg:text-6xl text-2xl">{word.word}</div>
 
      <div className="grid grid-cols-3 gap-3 pt-10 text-blue-800">
        {guessedWords.map((synonym, key) => (
          <i>{synonym}</i>
        ))}
      </div>
    </div>
  );
};

export default GameSolo;
