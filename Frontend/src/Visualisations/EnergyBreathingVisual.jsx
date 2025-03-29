import React from "react";

function EnergyBreathingVisual({ phase, timeLeft }) {
  // Calculate animation progress (0-100%)
  const getProgress = () => {
    const pattern = { inhale: 6, hold1: 0, exhale: 4, hold2: 0 };
    const total = pattern[phase] || 4;
    return ((total - timeLeft) / total) * 100;
  };

  const progress = getProgress();

  // Create rays that expand and contract
  const rayCount = 12;
  const rays = Array.from({ length: rayCount });

  // Determine ray length based on phase
  const getRayLength = () => {
    switch (phase) {
      case "inhale":
        return 30 + (70 * progress) / 100; // 30% to 100%
      case "exhale":
        return 100 - (70 * progress) / 100; // 100% to 30%
      default:
        return 30;
    }
  };

  const rayLength = getRayLength();

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Center circle */}
      <div
        className="absolute w-1/4 h-1/4 bg-yellow-400 rounded-full z-10 transition-all duration-500"
        style={{
          boxShadow: "0 0 15px rgba(250, 204, 21, 0.7)",
          transform: `scale(${phase === "inhale" ? 1 + progress / 200 : 1 - progress / 200})`,
        }}
      ></div>

      {/* Rays */}
      {rays.map((_, index) => {
        const angle = (index * 360) / rayCount;
        const delay = index * (1 / rayCount);

        return (
          <div
            key={index}
            className="absolute origin-center transition-all duration-1000 ease-in-out"
            style={{
              width: `${rayLength}%`,
              height: "4px",
              background: "linear-gradient(90deg, rgba(250,204,21,0.8) 0%, rgba(250,204,21,0) 100%)",
              transform: `rotate(${angle}deg)`,
              left: "50%",
              top: "50%",
              transitionDelay: `${delay}s`,
            }}
          ></div>
        );
      })}

      {/* Pulsing outer circle */}
      <div
        className={`absolute w-3/5 h-3/5 rounded-full transition-all duration-1000 ease-in-out ${
          phase === "inhale" ? "animate-pulse" : ""
        }`}
        style={{
          border: "2px solid rgba(250, 204, 21, 0.3)",
          transform: `scale(${phase === "inhale" ? 1 + progress / 100 : 1})`,
        }}
      ></div>
    </div>
  );
}

export default EnergyBreathingVisual;