import React,{ useEffect, useRef } from "react";

const GradientBreathingVisual = ({ phase, timeLeft, instructionText }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;

    // Set gradient based on phase
    if (phase === "inhale") {
      element.style.background = "linear-gradient(135deg, #c4b5fd 0%, #818cf8 100%)";
      element.style.transform = "scale(1.05)";
    } else if (phase === "hold1") {
      element.style.background = "linear-gradient(135deg, #818cf8 0%, #60a5fa 100%)";
    } else if (phase === "exhale") {
      element.style.background = "linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%)";
      element.style.transform = "scale(1)";
    } else if (phase === "hold2") {
      element.style.background = "linear-gradient(135deg, #93c5fd 0%, #c4b5fd 100%)";
    }
  }, [phase]);

  return (
    <div
      ref={containerRef}
      className="w-48 h-48 rounded-lg flex items-center justify-center transition-all duration-1000 ease-in-out shadow-lg"
      style={{ background: "linear-gradient(135deg, #c4b5fd 0%, #818cf8 100%)" }}
    >
      <div className="text-center text-white">
        <div className="text-5xl font-bold drop-shadow-md">{timeLeft}</div>
        <div className="text-xl font-medium mt-2 drop-shadow-sm">{instructionText}</div>
      </div>
    </div>
  );
};

export default GradientBreathingVisual;