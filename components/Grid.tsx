import { useEffect, useState, memo } from 'react';
import Tileset from '../assets/tileset.png';

const ROWS = 8;
const TILE_WIDTH = 117;
const COLUMNS = 17;
const PROLIFERATION_CHANCE = 0.6;

const Grid = ({
  frame,
  tileSpeed,
  mode,
  setMode,
  playerSpeed,
  setPlayerSpeed,
  playerRef,
  slowed,
  setSlowed,
  death,
}) => {
  const [tiles, setTiles] = useState<any>(new Array(COLUMNS));
  const [columnPosition, setColumnPosition] = useState<number>(
    -TILE_WIDTH * (COLUMNS - 1)
  );
  //there is one path, when deciding which tile to make the path, it needs to be connected to the tile that was most recently added to the path
  const [prevTile, setPrevTile] = useState<number>(Math.floor(ROWS / 2));

  useEffect(() => {
    if (!playerRef || typeof window == 'undefined') return;

    //height of the row
    const rowHeight = window.innerHeight / ROWS;
    //the row that the player is in
    let playerRow = Math.floor(playerRef.current.state.positionY / rowHeight);
    //the column the player is in
    let playerColumn =
      (Math.floor(
        (playerRef.current.state.positionX -
          columnPosition -
          COLUMNS * TILE_WIDTH) /
          TILE_WIDTH
      ) +
        1) %
      COLUMNS;

    //if player is on false tile slow them, else reset them to normal speed
    if (tiles[0] !== undefined && playerColumn < COLUMNS && playerColumn >= 0) {
      if (
        (playerRow < 0 ||
          playerRow >= 8 ||
          (playerRow >= 0 &&
            playerRow < ROWS &&
            tiles[playerColumn][playerRow] == false)) &&
        slowed == false
      ) {
        setSlowed(true);
      } else if (tiles[playerColumn][playerRow] == true && slowed) {
        setSlowed(false);
      }
    }
  }, [frame]);

  //make path be only in the center
  const centerPath = () => {
    let tempTiles = [];

    for (let i = 0; i < COLUMNS; i++) {
      tempTiles[i] = [];
    }
    for (let i = 0; i < COLUMNS; i++) {
      for (let j = 0; j < ROWS; j++) {
        if (j == Math.floor(ROWS / 2)) tempTiles[i][j] = true;
        else tempTiles[i][j] = false;
      }
    }
    return tempTiles;
  };

  // at start of game make path be in center
  useEffect(() => {
    setTiles(centerPath());
  }, []);

  //on death, reset state
  useEffect(() => {
    if (death == 2) {
      setColumnPosition(-TILE_WIDTH * (COLUMNS - 1));
      setPrevTile(Math.floor(ROWS / 2));
      setTiles(centerPath);
    }
  }, [death]);

  //move columns left
  useEffect(() => {
    setColumnPosition(columnPosition - tileSpeed);
  }, [frame, tileSpeed]);

  //algorithm for making path
  useEffect(() => {
    const makePath = (columnIndex: number) => {
      let temptiles = [...tiles]; //2d array
      let prevPath = []; // array containing the boolean values of the previous column
      let newPath = new Array(ROWS).fill(false); //array containing just the boolean values of the column we want to make

      //make a list of all the tiles that are true, in the column before this one
      tiles[columnIndex + 1 < COLUMNS ? columnIndex + 1 : 0].map(
        (tile: boolean, rowIndex: number) => {
          if (tile) prevPath.push(rowIndex);
        }
      );

      //connect newPath to prevPath, if there is no prevPath, connect it to center row
      if (prevPath.length == 0) newPath[Math.floor(ROWS / 2)] = true;
      else if (prevPath.length > 0) {
        newPath[prevTile] = true;
      }
      // this moves the path up or down
      const proliferate = (newPath: boolean[], direction: string) => {
        newPath.map((tile: boolean, index: number) => {
          if (tile) {
            if (
              direction == 'up' &&
              index - 1 > 0 &&
              Math.random() < PROLIFERATION_CHANCE &&
              newPath[index - 1] == false
            ) {
              newPath[index - 1] = true;
              setPrevTile(index - 1);
              proliferate(newPath, 'up');
            }
            if (
              direction == 'down' &&
              index + 1 < ROWS &&
              Math.random() < PROLIFERATION_CHANCE &&
              newPath[index + 1] == false
            ) {
              newPath[index + 1] = true;
              setPrevTile(index + 1);
              proliferate(newPath, 'down');
            }
          }
        });
      };
      //decide randomly if path goes up or down
      Math.random() > 0.5
        ? proliferate(newPath, 'up')
        : proliferate(newPath, 'down');
      temptiles[columnIndex] = newPath;
      setTiles(temptiles);
    };

    tiles.map((tileColumn: boolean[], columnIndex: number) => {
      let left =
        ((columnPosition + columnIndex * TILE_WIDTH) % (COLUMNS * TILE_WIDTH)) +
        TILE_WIDTH * (COLUMNS - 1);
      //change values of column when its off the screen
      if (left > -TILE_WIDTH && left <= tileSpeed - TILE_WIDTH && mode == 2) {
        makePath(columnIndex);
      }
    });
  }, [tileSpeed, columnPosition]);

  return (
    <div className="h-full w-full absolute">
      {tiles.map((tileColumn: boolean[], columnIndex: number) => {
        return (
          <div
            key={columnIndex}
            className="flex flex-col h-full absolute"
            style={{
              transform: `translateX(${
                ((columnPosition + columnIndex * TILE_WIDTH) %
                  (COLUMNS * TILE_WIDTH)) +
                TILE_WIDTH * (COLUMNS - 1)
              }px)`,

              width: TILE_WIDTH,
            }}
          >
            {tileColumn.map((tile, rowIndex) => {
              return (
                <div
                  key={rowIndex}
                  className="h-full w-full"
                  style={{
                    backgroundColor: tile ? 'transparent' : 'rgba(0,0,0,0.1)',
                  }}
                >
                  {/* {columnIndex} */}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default memo(Grid);
