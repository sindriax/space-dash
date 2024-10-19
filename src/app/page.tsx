/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import BoulderComponent from "@/components/BoulderComponent";
import GameInfoOverlay from "@/components/GameInfoOverlay";
import HandRecognizer from "@/components/HandRecognizer";
import RocketComponent from "@/components/RocketComponent";
import LevelManager from "@/components/LevelManager";
import { playBackground, playFX } from "@/utils/audiohandler";
import { useEffect, useRef, useState } from "react";

let generationInterval: any;
let removalInterval: any;
let distanceInterval: any;

let isInvincible = false;
let livesRemaining: number;

export default function Home() {
  const [rocketLeft, setRocketLeft] = useState(0);
  const [isDetected, setIsDetected] = useState(false);
  const [degrees, setDegrees] = useState(0);
  const [boulders, setBoulders] = useState<any[]>([]);
  const [detectCollisionTrigger, setDetectCollisionTrigger] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isColliding, setIsColliding] = useState(false);
  const [distance, setDistance] = useState(0);
  const [livesRemainingState, setLivesRemainingState] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [speed, setSpeed] = useState(1000);

  const rocketRef = useRef(null);
  const [rocket, setRocket] = useState<any>();

  useEffect(() => {
    setRocketLeft(window.innerWidth / 2);
    livesRemaining = 4;
    setLivesRemainingState(livesRemaining);
  }, []);

  useEffect(() => {
    if (isDetected && !isGameOver) {
      distanceInterval = setInterval(() => {
        setDistance((prev) => prev + 1);
      }, 100);
    }

    return () => {
      clearInterval(distanceInterval);
    };
  }, [isDetected, isGameOver]);

  useEffect(() => {
    if (isDetected && !isGameOver) {
      generationInterval = setInterval(() => {
        setBoulders((prevArr) => {
          let retArr = [...prevArr];
          for (let i = 0; i < 4; i++) {
            const now = Date.now();
            retArr = [
              ...retArr,
              {
                timestamp: now,
                key: `${now}-${Math.random()}`,
              },
            ];
          }
          return retArr;
        });
      }, speed);

      removalInterval = setInterval(() => {
        const now = Date.now();
        setBoulders((prevArr) => {
          return prevArr.filter((b) => now - b.timestamp < 5000);
        });
      }, 5000);
    }

    return () => {
      clearInterval(generationInterval);
      clearInterval(removalInterval);
    };
  }, [isDetected, isGameOver, speed]);

  const setHandResults = (result: any) => {
    setIsLoading(result.isLoading);
    setIsDetected(result.isDetected);
    setDegrees(result.degrees);

    if (result.isDetected && isFirstTime) {
      setIsFirstTime(false);
    }

    if (result.degrees && result.degrees !== 0) {
      setDetectCollisionTrigger(Math.random());
      setRocketLeft((prev) => {
        const ret = prev - result.degrees / 6;
        if (ret < 20) {
          return prev;
        }
        if (ret > window.innerWidth - 52) {
          return prev;
        }
        return ret;
      });
    }
    setRocket((rocketRef.current as any).getBoundingClientRect());
  };

  const collisionHandler = () => {
    if (!isInvincible && !isGameOver) {
      console.log("COLLISION");
      isInvincible = true;
      setIsColliding(isInvincible);
      playFX();
      livesRemaining--;
      setLivesRemainingState(livesRemaining);
      if (livesRemaining <= 0) {
        setIsGameOver(true);
      }
      setTimeout(() => {
        isInvincible = false;
        setIsColliding(isInvincible);
      }, 1500);
    }
  };

  const handleLevelChange = (newLevel: number, newSpeed: number) => {
    setSpeed(newSpeed);
  };

  useEffect(() => {
    if (isDetected && !isGameOver) {
      playBackground(false);
    } else {
      playBackground(true);
    }
  }, [isDetected, isGameOver]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div
        className={`absolute left-3 top-3 z-30 transition-all duration-500 ${
          isDetected ? "w-24" : "w-48"
        } `}
      >
        <HandRecognizer setHandResults={setHandResults} />
      </div>
      <div
        ref={rocketRef}
        id="rocket-container"
        className={`${isInvincible && "wiggle"}`}
        style={{
          position: "absolute",
          left: rocketLeft,
          transition: "all",
          animationDuration: "10ms",
          marginTop: `${isInvincible ? "507px" : "500px"}`,
        }}
      >
        <RocketComponent degrees={degrees} />
      </div>
      <div className="absolute z-10 h-screen w-screen overflow-hidden">
        {boulders.map((b) => (
          <BoulderComponent
            key={b.key}
            isMoving={isDetected}
            what={rocket}
            soWhat={collisionHandler}
            when={detectCollisionTrigger}
          />
        ))}
      </div>
      <GameInfoOverlay
        info={{
          isLoading,
          isDetected,
          isColliding,
          distance,
          livesRemainingState,
          isGameOver,
          isFirstTime,
        }}
      />
      <LevelManager distance={distance} onLevelChange={handleLevelChange} />
    </main>
  );
}