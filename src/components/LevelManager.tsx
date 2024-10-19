import React, { useEffect, useState } from 'react';

type LevelManagerProps = {
  distance: number;
  onLevelChange: (level: number, speed: number) => void;
};

const LevelManager = ({ distance, onLevelChange }: LevelManagerProps) => {
  const [level, setLevel] = useState(1);

  useEffect(() => {
    if (distance > 100 && level === 1) {
      setLevel(2);
      onLevelChange(2, 800);
    } else if (distance > 300 && level === 2) {
      setLevel(3);
      onLevelChange(3, 600);
    } else if (distance > 500 && level === 3) {
      setLevel(4);
      onLevelChange(4, 400);
    }
  }, [distance, level, onLevelChange]);

  return (
    <div className="fixed top-20 left-4">
      <div className="text-lg font-bold">Level: {level}</div>
    </div>
  );
};

export default LevelManager;