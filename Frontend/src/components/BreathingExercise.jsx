import React,{ useState, useEffect } from "react";
import { Volume2, VolumeX, ArrowLeft } from "lucide-react";
import BoxBreathingVisual from "../Visualisations/BoxBreathingVisual";
import WaveBreathingVisual from "../Visualisations/WaveBreathing";
import GradientBreathingVisual from "../Visualisations/GradientBreathingVisual";
import EnergyBreathingVisual from "../Visualisations/EnergyBreathingVisual";
import CloudBreathingVisual from "../Visualisations/CloudBreathingVisual";




const BREATHING_PATTERNS = {
  "Box Breathing": {
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    description: "Equal parts inhale, hold, exhale, and hold",
    type: "box",
    benefit: "Reduces stress and improves concentration",
  },
  "4-7-8 Breathing": {
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    description: "Inhale for 4, hold for 7, exhale for 8",
    type: "wave",
    benefit: "Helps with anxiety and sleep issues",
  },
  "Deep Calm": {
    inhale: 5,
    hold1: 2,
    exhale: 6,
    hold2: 0,
    description: "Long exhale for deep relaxation",
    type: "gradient",
    benefit: "Promotes deep relaxation and mindfulness",
  },
  "Energizing Breath": {
    inhale: 6,
    hold1: 0,
    exhale: 4,
    hold2: 0,
    description: "Longer inhale for energy and focus",
    type: "energy",
    benefit: "Increases alertness and mental clarity",
  },
  "Relaxing Breath": {
    inhale: 4,
    hold1: 0,
    exhale: 6,
    hold2: 2,
    description: "Extended exhale for relaxation",
    type: "cloud",
    benefit: "Calms the nervous system and reduces tension",
  },
};

export default function BreathingExercise() {
  const [selectedPattern, setSelectedPattern] = useState("Box Breathing");
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState("inhale");
  const [timeLeft, setTimeLeft] = useState(BREATHING_PATTERNS[selectedPattern].inhale);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedCycles, setCompletedCycles] = useState(0);

  useEffect(() => {
    setTimeLeft(BREATHING_PATTERNS[selectedPattern].inhale);
    setCurrentPhase("inhale");
    setCompletedCycles(0);
  }, [selectedPattern]);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            const pattern = BREATHING_PATTERNS[selectedPattern];
            const phases = ["inhale", "hold1", "exhale", "hold2"];
            const currentIndex = phases.indexOf(currentPhase);
            const nextPhase = phases[(currentIndex + 1) % phases.length];

            if (nextPhase === "inhale") {
              setCompletedCycles((prev) => prev + 1);
            }

            setCurrentPhase(nextPhase);
            return pattern[nextPhase] || pattern.inhale;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, currentPhase, selectedPattern]);

  const handleStart = () => setIsActive(true);
  const handleStop = () => setIsActive(false);
  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(BREATHING_PATTERNS[selectedPattern].inhale);
    setCurrentPhase("inhale");
    setCompletedCycles(0);
  };

  const visualizationComponents = {
    box: BoxBreathingVisual,
    wave: WaveBreathingVisual,
    gradient: GradientBreathingVisual,
    energy: EnergyBreathingVisual,
    cloud: CloudBreathingVisual,
  };

  const VisualizationComponent = visualizationComponents[BREATHING_PATTERNS[selectedPattern].type] || BoxBreathingVisual;

  const getPhaseText = () => {
    switch (currentPhase) {
      case "inhale":
        return "Inhale";
      case "hold1":
      case "hold2":
        return "Hold";
      case "exhale":
        return "Exhale";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <a href="/" className="inline-flex items-center text-indigo-700 hover:text-indigo-900 mb-8">
          <ArrowLeft className="mr-2" /> Back to Home
        </a>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-indigo-900 mb-8">Breathing Exercises</h1>

          <div className="bg-white rounded-xl shadow-md border border-indigo-100 overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-indigo-900 mb-2">{selectedPattern}</h2>
              <p className="text-indigo-700">{BREATHING_PATTERNS[selectedPattern].description}</p>

              <div className="mt-4 md:mt-0">
                <select
                  value={selectedPattern}
                  onChange={(e) => setSelectedPattern(e.target.value)}
                  disabled={isActive}
                  className="p-2 pr-8 border border-indigo-200 rounded-lg bg-indigo-50 text-indigo-800 focus:ring-2 focus:ring-indigo-300 transition disabled:opacity-70"
                >
                  {Object.keys(BREATHING_PATTERNS).map((pattern) => (
                    <option key={pattern} value={pattern}>
                      {pattern}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center my-8">
                <VisualizationComponent phase={currentPhase} timeLeft={timeLeft} />
              </div>

              <div className="flex flex-col items-center">
                <div className="flex space-x-3 mb-4">
                  <button
                    onClick={isActive ? handleStop : handleStart}
                    className={`px-6 py-3 rounded-lg font-medium ${
                      isActive ? "bg-red-500 text-white" : "bg-indigo-600 text-white"
                    }`}
                  >
                    {isActive ? "Pause" : "Start"}
                  </button>
                  <button onClick={handleReset} className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg">
                    Reset
                  </button>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`p-3 rounded-lg ${soundEnabled ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  </button>
                </div>

                <div className="text-indigo-600 text-sm">
                  Completed cycles: <span className="font-medium">{completedCycles}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
