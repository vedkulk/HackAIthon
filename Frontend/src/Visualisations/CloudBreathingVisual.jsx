import React from "react";

const CloudBreathingVisual = ({ phase, timeLeft }) => {
  // Calculate animation progress (0-100%)
  const getProgress = () => {
    const pattern = { inhale: 4, hold1: 0, exhale: 6, hold2: 2 };
    const total = pattern[phase] || 4;
    return ((total - timeLeft) / total) * 100;
  };

  const progress = getProgress();

  // Create multiple cloud bubbles
  const bubbleCount = 6;
  const bubbles = Array.from({ length: bubbleCount });

  // Determine opacity and position based on phase
  const getOpacity = () => {
    switch (phase) {
      case "inhale":
        return 0.2 + (0.8 * progress) / 100; // 0.2 to 1.0
      case "exhale":
        return 1.0 - (0.8 * progress) / 100; // 1.0 to 0.2
      default:
        return phase === "hold2" ? 0.2 : 1.0;
    }
  };

  const getYPosition = () => {
    switch (phase) {
      case "inhale":
        return 20 - (20 * progress) / 100; // 20% to 0%
      case "exhale":
        return 0 + (20 * progress) / 100; // 0% to 20%
      default:
        return phase === "hold2" ? 20 : 0;
    }
  };

  const opacity = getOpacity();
  const yPosition = getYPosition();

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div
        className="absolute w-3/4 h-3/4 transition-all duration-1000 ease-in-out"
        style={{ transform: `translateY(${yPosition}%)` }}
      >
        {/* Cloud shape created with multiple bubbles */}
        <div
          className="absolute w-1/2 h-1/2 bg-white rounded-full left-1/4 top-1/4 transition-opacity duration-1000"
          style={{ opacity }}
        ></div>

        {bubbles.map((_, index) => {
          const size = 30 + Math.random() * 20;
          const posX = 10 + Math.random() * 80;
          const posY = 10 + Math.random() * 80;
          const delay = index * 0.1;

          return (
            <div
              key={index}
              className="absolute bg-white rounded-full transition-all duration-1000"
              style={{
                width: `${size}%`,
                height: `${size}%`,
                left: `${posX - size / 2}%`,
                top: `${posY - size / 2}%`,
                opacity: opacity * (0.7 + Math.random() * 0.3),
                transitionDelay: `${delay}s`,
                boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default CloudBreathingVisual;