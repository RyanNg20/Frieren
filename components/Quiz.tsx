import { useEffect, useRef, useState } from 'react';
import Fun from '../packages/dataset/sets/Fun';
import { IoCheckmarkSharp, IoCloseSharp } from 'react-icons/io5';

const Quiz = ({ playerSpeed, setPlayerSpeed, introPosition }) => {
  // const quizletSet = Quizlet.getRandomSet();
  const { jokes: quizletSet } = Fun.getAllSetsMap();

  const [words, setWords] = useState<string[]>([]);
  const [def, setDef] = useState<string>();
  const [correctID, setCorrectID] = useState<number>();
  //if correct, animation will play
  const [guess, setGuess] = useState<number>(null);

  const getCards = () => {
    // 1) Shuffle the study set.
    const shuffled = quizletSet.studiableItem.sort(() => 0.5 - Math.random());
    // 2) Grab the first three elements.
    const selected = shuffled.slice(0, 3);
    // 3) Display the word of each element on the cards.
    const tempWords = [];
    for (var i = 0; i < selected.length; i++) {
      tempWords.push(selected[i].cardSides[0].media[0]['plainText']);
    }
    setWords(tempWords);
    // 4) Randomly pick one of the word's definition to display.
    const id = Math.floor(Math.random() * 3);
    setDef(selected[id].cardSides[1].media[0]['plainText']);
    // 5) Record the id of the card with the matching word.
    setTimeout(() => {
      setCorrectID(id);
    }, 500);
  };

  const handleGuess = (index: number) => {
    if (guess == null) {
      setGuess(index);
      //if player guessed correctly, give them speed boost
      if (index == correctID) {
        setPlayerSpeed(playerSpeed + 0.4);
      }
      //setTimeout is so we can time changing of definitions/words with animation
      setTimeout(() => {
        getCards();
        setTimeout(() => {
          setGuess(null);
        }, 500);
      }, 500);
    }
  };

  //get question at beginning of game
  useEffect(() => {
    getCards();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key == '1') {
        handleGuess(0);
      } else if (e.key == '2') {
        handleGuess(1);
      } else if (e.key == '3') {
        handleGuess(2);
      }
    };
    //listen for keyboard guesses
    window.addEventListener('keydown', onKeyDown);

    //remove event listener so when component rerenders there aren't two
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [correctID, guess]);

  return (
    <div
      className={
        'h-[100vh] w-[481px] bg-[#758F76] py-32 px-24 z-[1] float-right flex flex-col justify-between items-center relative overflow-hidden'
      }
      style={{
        transition: 'transform 3s',
        transform: introPosition < -54 ? 'translateX(0%)' : 'translateX(100%)',
      }}
    >
      <h2 className="text-white text-center">{def}</h2>
      {/* Tells player if they are correct or not */}
      <div
        className={`w-full h-[100%] z-[1000] absolute top-0 items-center justify-center opacity-0 flex pointer-events-none ${
          guess !== null && 'animate-answer'
        }`}
        style={{
          backgroundColor: guess == correctID ? '#82CB69' : '#DE6767',
        }}
      >
        {guess == correctID ? (
          <IoCheckmarkSharp size={25} color="white" />
        ) : (
          <IoCloseSharp size={25} color="white" />
        )}
      </div>
      {/* List the possible answers */}
      <div className="flex flex-col gap-4">
        {words.map((word, index) => {
          return (
            <button
              key={word + index}
              onClick={() => handleGuess(index)}
              className=" bg-[#DFDFDF] outline-none w-full hover:bg-[#cfcfcf] text-black p-6 flex flex-col items-center text-center rounded-lg border-solid border-2 overflow-hidden border-black"
            >
              <p>{index + 1}</p>
              <p>{word}</p>
            </button>
          );
        })}
      </div>
      <h3 className="text-[rgba(255,255,255,0.5)]">
        Tip: use (1, 2, 3) on keyboard to answer!
      </h3>
    </div>
  );
};

export default Quiz;
