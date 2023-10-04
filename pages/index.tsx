import Quiz from '../components/Quiz';
import Grid from '../components/Grid';
import { useEffect, useRef, useState } from 'react';
import Entity from '../components/Entity';
import { Indie_Flower } from 'next/font/google';
import volumeOn from '../assets/volumeOn.png';
import volumeOff from '../assets/volumeOff.png';
import Image from 'next/image';
import background from '../assets/background.jpg';
import Music from '../components/Music';
import Intro from '../components/Intro';
import DeathScreen from '../components/DeathScreen';

const indieFlower = Indie_Flower({ weight: '400', subsets: ['latin'] });

const FRAME_LENGTH = 20; //each frame is 50 milliseconds, x frames / second
const DEATH_TIME = 5; //how many seconds of player being out of bounds will make them dead

export default function Game() {
  if (typeof window === 'undefined') return null;

  const [frame, setFrame] = useState<number>(0);
  //0: Menu screen
  //1: Introduction
  //2: Game Start
  const [mode, setMode] = useState<number>(0);
  const [playerSpeed, setPlayerSpeed] = useState<number>(5); // how fast the player is moving
  const [tileSpeed, setTileSpeed] = useState<number>(0); // how fast the tiles are moving
  const [distance, setDistance] = useState<number>(0); // how far the player has travelled
  const [introPosition, setIntroPosition] = useState<number>(0); //At Start of game, determines position of tutorial elements
  const [slowed, setSlowed] = useState<boolean>(false); //is the player on the path or not?
  //0: player is not dead
  //1: screen is slowly fading to black because player is out of bounds
  //2: player is dead
  const [death, setDeath] = useState<number>(0);
  //sets timer when death == 1 and setsDeath(2) after DEATH_TIME seconds
  const [deathTimer, setDeathTimer] = useState<any>();
  const [score, setScore] = useState<number>(0); // distance that shows up when player dies
  const playerRef = useRef(null);

  //Note: useEffect needs to be ABOVE mode useEffect so that tileSpeed is set to 1 last
  useEffect(() => {
    // slowly increase tilespeed based on time
    if (frame % 250 == 0 && mode == 2 && death !== 2) {
      setTileSpeed(tileSpeed + 0.2);
    }
  }, [frame]);

  useEffect(() => {
    //slowly slide the intro over
    if (introPosition > -65) {
      setIntroPosition(introPosition - tileSpeed / 18);
    }
    //begin game when intro is done
    if (introPosition < -57 && mode == 1) {
      setMode(2);
    }
  }, [frame, mode]);

  //tilespeed is 0 at beginning of game, set to 1 during intro
  useEffect(() => {
    if (mode == 0) {
      setTileSpeed(0);
    } else if (mode == 1) setTileSpeed(2);
    else if (mode == 2) {
      setTileSpeed(2);
    }
  }, [mode]);

  //sets distance travelled
  useEffect(() => {
    if (mode == 2) setDistance(Math.floor(distance + tileSpeed));
  }, [frame, tileSpeed]);

  //Keeps track of how much time has passed. Each "frame" is 0.02 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(frame + 1);
    }, FRAME_LENGTH);
    return () => clearInterval(timer);
  }, [frame]);

  useEffect(() => {
    //after DEATH_TIME seconds of being out of bounds you die
    if (death == 1 && deathTimer == undefined) {
      setDeathTimer(
        setTimeout(() => {
          setDeath(2);
        }, DEATH_TIME * 1000)
      );
    }
    //if player setps back into bounds, clear deathtimer so player doesn't die
    if (death != 1 && deathTimer != undefined) {
      clearTimeout(deathTimer);
      setDeathTimer(undefined);
    }

    //if player steps out of bounds
    if (playerRef?.current?.state.positionX < 0 && death == 0) {
      setDeath(1);
    }
    //if player steps back into bounds
    if (playerRef?.current?.state.positionX >= 0 && death == 1) {
      setDeath(0);
    }
  }, [frame, death]);

  useEffect(() => {
    //on death reset game
    if (death == 2) {
      setFrame(0);
      setPlayerSpeed(5);
      setTileSpeed(0);
      setDistance(0);
      setIntroPosition(0);
      setSlowed(false);
      setDeathTimer(undefined);
      setMode(0);
      setScore(distance);
    }
  }, [death]);

  return (
    <main className={indieFlower.className}>
      <div
        className={'h-[100vh] w-[100vw] overflow-hidden relative flex flex-row'}
      >
        <DeathScreen
          DEATH_TIME={DEATH_TIME}
          death={death}
          setMode={setMode}
          setTileSpeed={setTileSpeed}
          setDeath={setDeath}
          setIntroPosition={setIntroPosition}
          score={score}
        />
        <Intro
          mode={mode}
          setMode={setMode}
          introPosition={introPosition}
          setIntroPosition={setIntroPosition}
        />
        {/* HUD */}
        <div
          className="grow flex flex-col items-center justify-between z-[1]"
          style={{
            transition: 'opacity 3s',
            opacity: introPosition < -54 ? 1 : 0,
          }}
        >
          <h2 className=" text-white mt-8">{distance} m</h2>
          <div className="mb-16 z-[1] opacity-70">
            <Music mode={mode} death={death} />
          </div>
        </div>
        <Quiz
          playerSpeed={playerSpeed}
          setPlayerSpeed={setPlayerSpeed}
          introPosition={introPosition}
        />
        <Grid
          frame={frame}
          tileSpeed={tileSpeed}
          mode={mode}
          setMode={setMode}
          playerSpeed={playerSpeed}
          setPlayerSpeed={setPlayerSpeed}
          playerRef={playerRef}
          slowed={slowed}
          setSlowed={setSlowed}
          death={death}
        />
        {/* Player */}
        <Entity
          positionX={window.innerWidth / 2}
          positionY={window.innerHeight / 2 + 50}
          frame={frame}
          species="Wolf"
          ref={playerRef}
          tileSpeed={tileSpeed}
          speed={slowed ? 1 : playerSpeed}
          death={death}
        />
      </div>
    </main>
  );
}
