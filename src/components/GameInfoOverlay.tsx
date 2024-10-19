/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader2, RocketIcon } from "lucide-react";
import React from "react";

type Props = {
  info: any;
};

const GameInfoOverlay = ({ info }: Props) => {
  const {
    isLoading,
    isDetected,
    isColliding,
    distance,
    livesRemainingState,
    isGameOver,
    isFirstTime,
  } = info;
  const lives = [];
  for (let i = 0; i < livesRemainingState; i++) {
    lives.push(<RocketIcon key={i} size={20} className="fill-red-600" />);
  }

  return (
    <div
      className={`absolute z-30 h-screen w-screen flex items-center justify-center ${
        isColliding && "border-[20px] border-red-600"
      }`}
    >
      {isLoading && <Loader2 size={80} className="animate-spin" />}
      {!isLoading && isFirstTime && !isDetected && !isGameOver && (
        <div className="text-2xl font-extrabold text-center">
          <p>Welcome to <span className="text-red-600">Space Dash</span>!</p>
          <p>Hold your hands in front of the camera to start controlling the spaceship.</p>
        </div>
      )}
      {!isLoading && !isFirstTime && !isDetected && !isGameOver && (
        <div className="text-2xl animate-ping font-extrabold">P A U S E D</div>
      )}
      {isGameOver && (
        <div className="text-2xl animate-ping font-extrabold">GAME OVER</div>
      )}
      <div className="fixed top-6 right-6">{`Distance: ${distance}`}</div>
      <div className="fixed top-12 right-6 flex flex-row gap-1">{lives}</div>
    </div>
  );
};

export default GameInfoOverlay;
