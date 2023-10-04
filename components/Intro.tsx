const Intro = ({ mode, setMode, introPosition, setIntroPosition }) => {
  return (
    <div
      className="top-[40%] translate-y-[-50%] absolute flex flex-row items-center justify-between gap-[300px] z-[2]"
      style={{
        left: `calc(${introPosition}% + ${window.innerWidth / 2}px - 70px)`, // so we can slowly move the intro left
      }}
    >
      {/* Start Menu */}
      <div
        className="flex flex-col items-center gap-2 relative"
        style={{
          transition: 'opacity 3s',
          opacity: introPosition >= -7 ? 1 : 0,
        }}
      >
        {/* Title */}
        <h1 className="absolute top-[-60px]">Frieren</h1>
        <button
          className={`py-2 px-10 rounded-2xl bg-[#758F76] hover:bg-white hover:text-black text-white z-[10000] whitespace-nowrap outline-none`}
          style={{
            transition: 'background 1s, color 1s',
          }}
          onClick={() => {
            setMode(1);
          }}
        >
          <h2>Embark</h2>
        </button>
        <button
          onClick={() => {
            setMode(2);
            setIntroPosition(-95);
          }}
        >
          <h3
            className="text-gray-300 text-[12px] hover:text-white"
            style={{ transition: 'color 0.5s' }}
          >
            Skip Tutorial
          </h3>
        </button>
      </div>

      {/* Controls */}
      <div
        className="flex flex-row flex-wrap w-[200px] gap-2"
        style={{
          transition: 'opacity 3s',
          opacity: introPosition < -7 && introPosition > -30 ? 1 : 0,
        }}
      >
        <div className="w-[60px] h-[60px]" />
        <h2 className="w-[60px] h-[60px] rounded-lg bg-[#758F76] flex items-center justify-center">
          W
        </h2>
        <div className="w-[60px] h-[60px]" />
        <h2 className="w-[60px] h-[60px] rounded-lg bg-[#758F76] flex items-center justify-center">
          A
        </h2>
        <h2 className="w-[60px] h-[60px] rounded-lg bg-[#758F76] flex items-center justify-center">
          S
        </h2>
        <h2 className="w-[60px] h-[60px] rounded-lg bg-[#758F76] flex items-center justify-center">
          D
        </h2>
      </div>

      {/* Mechanics */}
      <h2
        className="whitespace-nowrap"
        style={{
          transition: 'opacity 3s',
          opacity: introPosition < -30 && introPosition >= -54 ? 1 : 0,
        }}
      >
        Answer Questions to Move Faster!
      </h2>
    </div>
  );
};

export default Intro;
