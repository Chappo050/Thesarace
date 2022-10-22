import axios from "axios";
import { useEffect, useReducer, useRef, useState } from "react";
import Nav from "../Nav";
import io from "socket.io-client";
import User from "../User/User";
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

function GameVersus() {
  const [words, setWords]: [Word[], (words: Word[]) => void] =
    useState(defaultWords);

  const [wordCount, setWordCount] = useState(0);

  const [guessedWords, setGuessedWords] = useState([""]);

  const [guessedWordsOpp, setGuessedWordsOpp] = useState([""]);

  const [formValue, setformValue] = useState({
    guess: "",
  });

  const [formValueOpp, setformValueOpp] = useState({
    guess: "",
  });

  const [gameOver, setGameOver] = useState(false);

  const [gameWin, setGameWin] = useState(false);

  const [playerHealth, setPlayerHealth] = useState(3);

  const [roomID, setRoomID] = useState("");

  const [inRoom, setInRoom] = useState(false);

  //determine who is the host of the session, all words are pulled from the host
  const [isHost, setIsHost] = useState(false);

  const [seconds, setSeconds] = useState(10);

  const [secondsPrep, setSecondsPrep] = useState(5);

  const [gameStart, setGameStart] = useState(false);

  const [gameReady, setGameReady] = useState(false);

  //Word Change interval
  useEffect(() => {
    if (gameStart) {
      const interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStart]);

  //Game starting prep time
  useEffect(() => {
    if (gameReady && seconds == 10) {
      const interval = setInterval(() => {
        setSecondsPrep((secondsPrep) => secondsPrep - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameReady, seconds]);

  useEffect(() => {
    if (secondsPrep <= 0) {
      setGameStart(true);
    }
  }, [secondsPrep]);

  //refresh timer, also only the host will fetch the word
  useEffect(() => {
    if (seconds <= 0 && isHost && !gameOver) {
      fetchWord();
    }
  }, [seconds]);

  useEffect(() => {
    fetchWord();
  }, [gameStart]);

  //clear guesses on word change
  useEffect(() => {
    setGuessedWords([""]);
    setSeconds(10);
  }, [words]);

  const fetchWord = async () => {
    if (isHost) {
      api
        .get("/game/soloGame")
        .then((response) => {
          setWords(response.data);
          setGuessedWordsOpp([]);
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
        !guessedWords.includes(formValue.guess.trim()) &&
        !guessedWordsOpp.includes(formValue.guess.trim())
      ) {
        //update life here
        socket.emit("correctGuess", formValue.guess, roomID);
        setGuessedWords([formValue.guess, ...guessedWords]);
        setformValue({ guess: "" });
      } else if (guessedWordsOpp.includes(formValue.guess.trim())) {
        //add display for when you guess the same word as an opponent
      }
    }
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
  }, [formValue]);

  useEffect(() => {
    socket.on("writing", (data) => {
      console.log("Opponent is writing: " + data);
      setformValueOpp({ guess: data });
    });

    socket.on("start", () => {
      setGameReady(true);
    });

    socket.on("create", (arg1) => {
      setIsHost(true);
    });

    socket.on("full", (arg1) => {
      console.log("data recieved: " + arg1);

      refreshPage();
      alert("Room is full, please try another room");
    });

    if (!isHost) {
      socket.on("newWord", (data) => {
        setWords(data);
        setGuessedWordsOpp([]);
      });
    }

    socket.on("correctGuess", (word) => {
      setPlayerHealth((playerHealth) => playerHealth - 1);
      setGuessedWordsOpp((guessedWordsOpp) => [word, ...guessedWordsOpp]);
      console.log("Playres health is now" + playerHealth);
    });

    //other player lost
    socket.on("gameOver", () => {
      setGameWin(true);
      handleGameOver();
    });
  }, []);

  //This player dies
  useEffect(() => {
    if (playerHealth <= 0) {
      socket.emit("gameOver", roomID);
      handleGameOver();
    }
  }, [playerHealth]);

  //send new word to friend
  useEffect(() => {
    if (isHost) {
      socket.emit("newWord", words, roomID);
    }
  }, [words]);

  
  const handleGameOver = () => {
    setGameOver(true);
    setInRoom(false);
    socket.disconnect();
  };

  ///PAGE STUFF///
  return (
    <div>
      <Nav />
      {!gameOver ? <>
      {!inRoom || !gameStart ? (
        <JoinScreen
          joinFunc={joinRoom}
          gameReady={gameReady}
          inRoom={inRoom}
          gameOver={gameOver}
        />
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
              <p> ♥♥♥ put health here</p>
            </div>
          </div>
          <div className=" text-2xl pt-5">
            <p>Find as many synonyms as possible!</p>
            <p>{seconds}</p>
            <div>
              {words.map((word, key) => CurrentWord(word, guessedWords))}
            </div>
            <br />
            <br />
            <br />
          </div>
          <div className="absolute right-5 top-1/3 text-3xl underline underline-offset-2 ">
            {OpponentsSide(formValueOpp.guess, guessedWordsOpp)}
          </div>
        </div>
      )}
      </>
    : (
        <div className="grid grid-cols-1 text-center text-4xl">
          <div className=" font-extrabold underline underline-offset-2 pt-16">
            {gameWin ? <p>You are the WINNER!</p> : <p>You are the LOSER!</p>}
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

const OpponentsSide = (word: any, guessedWords: String[]) => {
  return (
    <div>
      <div className="p-2 m-2 float-right">
        <input
          type="opp"
          name="opp"
          placeholder="Placeholder text"
          value={word}
          disabled={true}
          className="text-black p-0.5"
        />
      </div>
      <div className="grid grid-cols-3 gap-3 pt-10 text-blue-800">
        {guessedWords.map((synonym, key) => (
          <i>{synonym}</i>
        ))}
      </div>
    </div>
  );
};

const JoinScreen = ({ joinFunc, gameReady, inRoom }: any) => {
  return (
    <>
      {!gameReady ? (
        <div className="text-center">
          {!inRoom ? (
            <button
              className="bg-teal-200 p-5 m-10 border border-black  hover:bg-teal-400 text-center"
              onClick={() => {
                joinFunc();
              }}
            >
              Join room
            </button>
          ) : (
            <div>Waiting for a friend to join...</div>
          )}
        </div>
      ) : (
        <div className="text-center">
          Get Ready! Game starting in 5 seconds!!!!
        </div>
      )}
    </>
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
export default GameVersus;
