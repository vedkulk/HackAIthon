import React from "react";

function WaveBreathingVisual({ phase, timeLeft }) {
  // Calculate animation progress (0-100%)
  const getProgress = () => {
    const pattern = { inhale: 4, hold1: 7, exhale: 8, hold2: 0 };
    const total = pattern[phase] || 4;
    return ((total - timeLeft) / total) * 100;
  };

  const progress = getProgress();

  // Determine height based on phase
  const getHeight = () => {
    switch (phase) {
      case "inhale":
        return 20 + (60 * progress) / 100; // 20% to 80%
      case "hold1":
        return 80; // Stay at 80%
      case "exhale":
        return 80 - (60 * progress) / 100; // 80% to 20%
      default:
        return 20;
    }
  };

  const height = getHeight();
  const waveCount = 5;
  const waves = Array.from({ length: waveCount });

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div className="absolute bottom-0 w-full h-full flex items-end">
        <div
          className="w-full bg-gradient-to-t from-blue-500/60 to-indigo-400/30 rounded-t-lg transition-all duration-1000 ease-in-out"
          style={{ height: `${height}%` }}
        >
          <div className="relative w-full h-8 overflow-hidden">
            {waves.map((_, index) => (
              <div
                key={index}
                className="absolute top-0 w-[200%] h-8 animate-wave"
                style={{
                  backgroundImage:
                    "url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1200 120\' preserveAspectRatio=\'none\'%3E%3Cpath d=\'M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z\' opacity=\'.25\' fill=\'%236366f1\'%3E%3C/path%3E%3Cpath d=\'M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z\' opacity=\'.5\' fill=\'%236366f1\'%3E%3C/path%3E%3Cpath d=\'M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z\' fill=\'%236366f1\'%3E%3C/path%3E%3C/svg%3E')",
                  backgroundSize: "100% 100%",
                  left: `-${index * 50}%`,
                  animationDelay: `${index * 0.5}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaveBreathingVisual;