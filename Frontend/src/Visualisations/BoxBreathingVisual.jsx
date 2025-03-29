import React, { useRef, useEffect } from "react";

function BoxBreathingVisual({ phase, timeLeft, instructionText }) {
  const circleRef = useRef(null);

  useEffect(() => {
    if (!circleRef.current) return;

    const element = circleRef.current;

    if (phase === "inhale") {
      element.style.transform = "scaxale(1.3)";
      element.style.backgroundColor = "rgba(129, 140, 248, 0.6)";
    } else if (phase === "exhale") {
      element.style.transform = "scale(1)";
      element.style.backgroundColor = "rgba(96, 165, 250, 0.6)";
    }
  }, [phase]);

  return (
    <div
      ref={circleRef}
      style={{
        width: "9rem",
        height: "9rem",
        borderRadius: "50%",
        backgroundColor: "rgba(96, 165, 250, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 1s ease-in-out"
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{timeLeft}</div>
        <div style={{ fontSize: "1.125rem", fontWeight: "500" }}>{instructionText}</div>
      </div>
    </div>
  );
}

export default BoxBreathingVisual;