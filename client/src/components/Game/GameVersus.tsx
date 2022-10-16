import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Nav from "../Nav";
import CountdownTimer from "../CountdownTimer";
import io from "socket.io-client";
const socket = io("ws://localhost:5000");

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
  const timerRef = useRef<HTMLBodyElement>(null);

  const [words, setWords]: [Word[], (words: Word[]) => void] =
    useState(defaultWords);

  const [wordCount, setWordCount] = useState(0);

  const [guessedWords, setGuessedWords] = useState([""]);

  const [score, setScore] = useState(0);

  const [formValue, setformValue] = useState({
    guess: "",
  });

  const [formValueOpp, setformValueOpp] = useState({
    guess: "",
  });

  const [onCooldown, setOnCooldown] = useState(false);

  const [gameOver, setGameOver] = useState(false);

  //initalize timer
  const [timer, setTimer] = useState(1200 * 1000 + new Date().getTime());

  const [gameData, setGameData] = useState({});

  const [roomID, setRoomID] = useState("");

  const [inRoom, setInRoom] = useState(false);
  //When time is up remove words and next words and display final score
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (timerRef.current?.innerText == "0") {
        setGameOver(true);
        console.log("meow");
      }
    }, 200);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    api
      .get("/game/soloGame")
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

  const fetchWord = async () => {
    if (!onCooldown) {
      newWordTimer();
      api
        .get("/game/soloGame")
        .then((response) => {
          setWords(response.data);
          console.log(response.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
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

  ///SOCKET HANDELING///

  const joinRoom = () => {
    const room: any = prompt("Enter Rooom Name");
    if (room === null) {
      alert("Please enter a room name.");
    } else {
      setRoomID(room);
      socket.emit("join", "Matthew", room);
      setInRoom(true);
    }
  };

  //send what oppenent is writing
  useEffect(() => {
    socket.emit("writing", formValue.guess, roomID);
    console.log("sending " + formValue.guess);
  }, [formValue]);

  useEffect(() => {
    socket.on("writing", (data) => {
      console.log("Opponent is writing: " + data);
      setformValueOpp({ guess: data });
    });
  }, []);

  useEffect(() => {
    socket.on("update", (arg1) => {
      console.log("data recieved: " + arg1);
    });
  }, []);

  useEffect(() => {
    socket.on("full", (arg1) => {
      console.log("data recieved: " + arg1);

      refreshPage()
      alert('Room is full, please try another room')
    });
  }, []);

  return (
    <div>
      <Nav />
      {!inRoom ? (
        <JoinScreen joinFunc={joinRoom} />
      ) : (
        <div className="grid grid-cols-3 text-center">
          <div className="pt-36  text-5xl">
            <div>Player Name</div>
            <form
              onSubmit={handleSubmit}
              className="text-black text-center p-4 text-3xl"
            >
              <br />
              <div className="p-2 m-2 text">
                <input
                  type="guess"
                  maxLength={20}
                  name="guess"
                  placeholder="             Enter your guess here!"
                  value={formValue.guess}
                  onChange={handleChange}
                  required
                  className="text-black p-0.5"
                />
              </div>

              <div className="">
                <br />
                <button
                  type="submit"
                  className="bg-teal-200 p-1 border border-black"
                >
                  Submit
                </button>
              </div>
            </form>
            <div>
              <p className="text-3xl pt-24 font-extrabold">Score: {score}</p>
            </div>
          </div>
          <div className=" text-2xl pt-5">
            <p>Find as many synonyms as possible!</p>
            <CountdownTimer time={timer} timerRef={timerRef} start={inRoom} />
            <div>
              {words.map((word, key) => CurrentWord(word, guessedWords))}
            </div>
            <br />
            <br />
            <br />
          </div>
          <div className="absolute right-5 top-1/3 text-3xl underline underline-offset-2 ">
            <OpponentsSide val={formValueOpp.guess} />
          </div>
        </div>
      )}
      {!gameOver ? (
        <></>
      ) : (
        <div className="grid grid-cols-1 text-center text-4xl">
          <div className=" font-extrabold underline underline-offset-2 pt-16">
            Final Score is: {score}
          </div>
          <button
            className="bg-teal-200 p-1 border border-black m-16 hover:bg-teal-400"
            onClick={refreshPage}
          >
            New Game
          </button>
        </div>
      )}
    </div>
  );
}

const OpponentsSide = ({ val }: any) => {
  return (
    <div className="p-2 m-2 float-right">
      <input
        type="opp"
        name="opp"
        placeholder="Placeholder text"
        value={val}
        disabled={true}
        className="text-black p-0.5"
      />
    </div>
  );
};

const JoinScreen = ({ joinFunc }: any) => {
  return (
    <div className="text-center">
      <button
        className="bg-teal-200 p-5 m-10 border border-black  hover:bg-teal-400 text-center"
        onClick={() => {
          joinFunc();
        }}
      >
        Join room
      </button>
    </div>
  );
};

const CurrentWord = (word: Word, guessedWords: String[]) => {
  return (
    <div>
      <div className="text-8xl">{word.word}</div>

      <div className="grid grid-cols-3 gap-3 pt-10 text-blue-800">
        {guessedWords.map((synonym, key) => (
          <i>{synonym}</i>
        ))}
      </div>
    </div>
  );
};

//only needewd for testing
const wordliststuff = (word: Word, guessedWords: String[]) => {
  return (
    <div>
      <div className="text-8xl">{word.word}</div>
      <div className="grid grid-cols-3 gap-3 pt-10">
        {word.synonyms.map((synonym, key) => (
          <i>{synonym}</i>
        ))}
      </div>
    </div>
  );
};
export default GameSolo;
