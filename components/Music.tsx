import { useEffect, useRef } from 'react';

const Music = ({ mode, death }) => {
  const audioRef = useRef(null);

  //pause music on death and set song to beginning
  useEffect(() => {
    if (audioRef && death == 2) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [death]);

  //unmute audio and set volume after introduction finishes
  useEffect(() => {
    if (audioRef && mode == 2) {
      audioRef.current.volume = 0.1;
      audioRef.current.muted = false;
      audioRef.current.play();
    }
  }, [mode]);

  return (
    <audio
      loop
      ref={audioRef}
      muted
      controls
      onPause={() => {
        console.log('PAUSE MUSIC');
      }}
    >
      {/* <source src="/music.wav" /> */}
      <source src="/phoenix.mp3" />
    </audio>
  );
};

export default Music;
