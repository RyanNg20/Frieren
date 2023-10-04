const DeathScreen = ({
  DEATH_TIME,
  death,
  setMode,
  setDeath,
  setTileSpeed,
  setIntroPosition,
  score,
}) => {
  return (
    <div
      className="absolute w-[100vw] h-[100vh] z-[3] bg-black flex items-center justify-center flex-col"
      style={{
        transition: `opacity ${DEATH_TIME}s`,
        pointerEvents: death == 2 ? 'auto' : 'none',
        opacity: death == 0 ? 0 : 1,
      }}
    >
      <div
        className="flex flex-col gap-8 items-center"
        style={{ opacity: death == 2 ? 1 : 0, transition: 'opacity 1s' }}
      >
        {/* scoring system comments */}
        <h2>You travelled {score} meters</h2>
        {score >= 0 && score < 10000 && <h1>HUH?</h1>}
        {score >= 10000 && score < 20000 && <h1>DO BETTER</h1>}
        {score >= 20000 && score < 30000 && <h1>GOOD TRY</h1>}
        {score >= 30000 && score < 40000 && <h1>GREAT DISTANCE</h1>}
        {score >= 50000 && score < 80000 && <h1>ASTOUNDING</h1>}
        {score >= 80000 && <h1>PERFECT</h1>}

        <div className="flex flex-row gap-8 w-full justify-between">
          <button
            className="px-10 py-2 rounded-lg bg-[rgba(255,255,255,0.1)] hover:bg-[white] hover:text-black"
            style={{ transition: 'color 1s, background 1s' }}
            // player gives up, take them to start menu
            onClick={() => {
              setDeath(0);
            }}
          >
            <h3>Give Up</h3>
          </button>
          <button
            className="px-10 py-2 rounded-lg bg-[rgba(255,255,255,0.1)] hover:bg-[white] hover:text-black"
            style={{ transition: 'color 1s, background 1s' }}
            // skips intro
            onClick={() => {
              setMode(2);
              setDeath(0);
              setIntroPosition(-95);
            }}
          >
            <h3>Try Again</h3>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeathScreen;
