import axios from "axios";
import { useEffect, useState } from "react";
import Nav from "../Nav";
import io from "socket.io-client";
import { FaHeartbeat } from "react-icons/fa";
const socket = io("ws://thesaurace.herokuapp.com");

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

  const [opponentDisconnect, setOpponentDisconnect] = useState(false);

  const [gameOver, setGameOver] = useState(false);

  const [gameWin, setGameWin] = useState(false);

  const [playerName, setPlayerName] = useState<PlayerDetails>({
    username: "",
    guest: true,
  });

  const [playerNameOpp, setPlayerNameOpp] = useState<PlayerDetails>({
    username: "",
    guest: true,
  });

  const [playerHealth, setPlayerHealth] = useState(3);

  const [playerHealthOpp, setPlayerHealthOpp] = useState(3);

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
    fetchUserDetails();
  }, [gameStart]);

  //clear guesses on word change
  useEffect(() => {
    setGuessedWords([""]);
    setSeconds(10);
  }, [words]);

  const fetchWord = async () => {
    if (isHost) {
      api
        .get("/game/new")
        .then((response) => {
          setWords(response.data);
          setGuessedWordsOpp([]);
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
        !guessedWords.includes(formValue.guess.trim()) &&
        !guessedWordsOpp.includes(formValue.guess.trim())
      ) {
        //update life here
        socket.emit("correctGuess", formValue.guess, roomID);
        setGuessedWords([formValue.guess, ...guessedWords]);
        setformValue({ guess: "" });
        setPlayerHealthOpp(playerHealthOpp - 1);
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
      socket.emit("join", playerName.username, room);
      setInRoom(true);
    }
  };

  //send what oppenent is writing
  useEffect(() => {
    socket.emit("writing", formValue.guess, roomID);

  }, [formValue]);

  useEffect(() => {
    socket.on("writing", (data) => {
      setformValueOpp({ guess: data });
    });

    socket.on("start", () => {
      setGameReady(true);
    });

    socket.on("create", (arg1) => {
      setIsHost(true);
    });

    socket.on("full", (arg1) => {

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
    });

    //other player lost
    socket.on("userDetails", (details) => {
      setPlayerNameOpp(details);
    });

    //other player lost
    socket.on("gameOver", () => {
      setGameWin(true);
      handleGameOver();
    });

    socket.once("userLeft", () => {
      setOpponentDisconnect(true);
      setTimeout(refreshPage, 5000);
    })

    socket.once("disconnect", () => {
      setOpponentDisconnect(true);
      setTimeout(refreshPage, 5000);
    })
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


  useEffect(()=> {
    socket.emit("userDetails", playerName, roomID);
  }, [playerName])
  const handleGameOver = () => {
    setGameOver(true);
    setInRoom(false);
    socket.disconnect();
  };

  ///PAGE STUFF///
  return (
    <div>
      <Nav />
      {!gameOver ? (
        <>
          {!inRoom || !gameStart ? (
            <JoinScreen
              joinFunc={joinRoom}
              gameReady={gameReady}
              inRoom={inRoom}
              gameOver={gameOver}
            />
          ) : (
            <div className="grid grid-cols-3 text-center h-screen ">
              <div className=" left-5 pt-72  text-4xl ">
                <div className="grid grid-cols-1 gap-10 text-4xl ">
                  {playerName.guest ? (
                    <div className="italic md:text-2xl lg:text-3xl text-sm">
                      {" "}
                      {playerName.username}{" "}
                    </div>
                  ) : (
                    <div className="underline underline-offset-2 md:text-2xl lg:text-3xl text-sm"> {playerName.username} </div>
                  )}
                  <form
                    onSubmit={handleSubmit}
                    className="text-black text-center text-3xl"
                  >
                    <br />
                    <div className="mx-5 ">
                      <input
                        type="guess"
                        maxLength={20}
                        name="guess"
                        placeholder="Type here!"
                        value={formValue.guess}
                        onChange={handleChange}
                        required
                        className=" flex text-black p-0.5 w-full shadow-lg shadow-black text-center md:text-2xl sm:text-xl lg:text-3xl text-sm"
                      />

                      <button
                        type="submit"
                        className="bg-teal-200 p-1 mt-5 border border-black text-center md:text-xl sm:text-lg lg:text-2xl text-sm"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                  <div>
                    {playerHealth > 0 ? (
                      <PlayerHealth
                        health={playerHealth}
                        Heart={<FaHeartbeat />}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
              <div className=" text-2xl pt-5 border-l-2 border-r-2 border-solid border-black ">
                <p>Find as many synonyms as possible!</p>
                <p>{seconds}</p>
                {opponentDisconnect ? <p>Opponent has disconnected, returning to join screen in 5 seconds...</p> : <></>}
                <div>
                  {words.map((word, key) =>
                    CurrentWord(word, guessedWords, guessedWordsOpp)
                  )}
                </div>
                <br />
                <br />
                <br />
              </div>
              <div className=" right-5 pt-72  text-4xl  ">
                {OpponentsSide(formValueOpp.guess, playerNameOpp)}
                {playerHealth > 0 ? (
                  <PlayerHealth
                    health={playerHealthOpp}
                    Heart={<FaHeartbeat />}
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
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

const PlayerHealth = ({ health, Heart }: any) => {
  const healthArray = Array.from(Array(health));

  return (
    <div className="grid grid-cols-3 justify-items-center text-red-500 animate-pulse sm:text-lg md:text-xl lg:text-4xl text-xl mx-10">
      {healthArray.map(() => Heart)}
    </div>
  );
};

const OpponentsSide = (word: any, player: PlayerDetails) => {
  return (
    <div className="grid grid-cols-1 gap-10">
      {player.guest ? (
        <div className="italic  no-underline md:text-2xl sm:text-xl lg:text-3xl text-sm pt-10"> {player.username} </div>
      ) : (
        <div className="underline md:text-2xl sm:text-xl lg:text-3xl text-xl mb-8"> {player.username} </div>
      )}
      <div className="mx-5 mb-24 ">
        <input
          type="opp"
          name="opp"
          placeholder="....."
          value={word}
          disabled={true}
          className="flex text-black p-0.5 w-full text-center md:text-2xl sm:text-xl lg:text-3xl text-sm"
        />
      </div>
    </div>
  );
};

const JoinScreen = ({ joinFunc , gameReady, inRoom }: any) => {
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

//Displays the current words and their guessed words for both players
const CurrentWord = (
  word: Word,
  guessedWords: String[],
  guessedWordsOpp: String[]
) => {
  return (
    <div>
      <div className="lg:text-6xl md:text-4xl m-10 ">{word.word}</div>

      <div className="grid grid-cols-2 gap-3 pt-10  ">
        <div className="grid grid-cols-1 gap-3 pt-10 text-blue-700 border-blue-700 border border-opacity-50 mx-2 md:text-2xl lg:text-4xl ">
          {guessedWords.map((synonym, key) => (
            <i>{synonym}</i>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 pt-10 text-red-700 border-red-700 border border-opacity-50 mx-2">
          {guessedWordsOpp.map((synonym, key) => (
            <i>{synonym}</i>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameVersus;
