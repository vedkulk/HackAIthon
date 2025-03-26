import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LucideArrowLeft, LucideFileText, LucideAlertCircle } from "lucide-react";

export default function ThoughtAnalysis() {
  const [thoughts, setThoughts] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!thoughts.trim()) {
      alert("Please enter your thoughts before analyzing");
      return;
    }

    setIsAnalyzing(true);

    // Simulate analysis with a timeout
    // In a real app, this would call an API with a sentiment/content analysis model
    setTimeout(() => {
      // Generate mock analysis based on content length and keywords
      const wordCount = thoughts.trim().split(/\s+/).length;
      const lowerThoughts = thoughts.toLowerCase();

      const mockAnalysis = {
        summary: "",
        insights: [],
        recommendations: [],
      };

      // Very simple keyword detection for demo purposes
      const hasNegativeWords = [
        "sad",
        "depressed",
        "anxious",
        "worried",
        "stress",
        "lonely",
        "tired",
        "exhausted",
      ].some((word) => lowerThoughts.includes(word));

      const hasPositiveWords = ["happy", "joy", "grateful", "thankful", "excited", "love", "hope", "peaceful"].some(
        (word) => lowerThoughts.includes(word)
      );

      if (hasNegativeWords) {
        mockAnalysis.summary = "Your thoughts contain some challenging emotions, which is completely normal.";
        mockAnalysis.insights.push("You seem to be experiencing some difficult feelings right now.");
        mockAnalysis.insights.push("Expressing these thoughts is an important step in processing them.");
        mockAnalysis.recommendations.push(
          "Consider speaking with a trusted friend or professional about these feelings."
        );
        mockAnalysis.recommendations.push("Try a brief mindfulness exercise to center yourself.");
      } else if (hasPositiveWords) {
        mockAnalysis.summary = "Your thoughts reflect positive emotions and perspectives.";
        mockAnalysis.insights.push("You're expressing gratitude and positivity in your thinking.");
        mockAnalysis.insights.push("This positive outlook can be beneficial for your overall wellbeing.");
        mockAnalysis.recommendations.push("Continue nurturing these positive aspects in your life.");
        mockAnalysis.recommendations.push("Consider journaling regularly to maintain this positive momentum.");
      } else {
        mockAnalysis.summary = "Your thoughts appear to be neutral or mixed in emotional tone.";
        mockAnalysis.insights.push("Your expression shows a balanced perspective on your experiences.");
        mockAnalysis.insights.push("You're taking time to reflect, which is valuable for emotional processing.");
        mockAnalysis.recommendations.push("Regular reflection can help you better understand your emotional patterns.");
        mockAnalysis.recommendations.push(
          "Consider exploring specific aspects of your thoughts that you'd like to develop further."
        );
      }

      // Add length-based insight
      if (wordCount < 50) {
        mockAnalysis.insights.push(
          "Your expression is brief. Sometimes, expanding on your thoughts can reveal deeper patterns."
        );
      } else if (wordCount > 200) {
        mockAnalysis.insights.push(
          "You've shared detailed thoughts, which shows a willingness to explore your experiences deeply."
        );
      }

      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <Link to="/" className="inline-flex items-center text-indigo-700 hover:text-indigo-900 mb-8">
          <LucideArrowLeft className="mr-2" /> Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-rose-800 mb-8">Thought Journal</h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md border border-rose-100 mb-8">
            <h2 className="text-xl font-semibold text-rose-800 mb-4 flex items-center">
              <LucideFileText className="mr-2" /> Express Your Thoughts
            </h2>
            <p className="text-rose-600 mb-6">
              This is a safe space to express whatever is on your mind. Your thoughts will be analyzed to provide
              insights and recommendations.
            </p>

            <textarea
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              className="w-full p-4 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition"
              rows={10}
              placeholder="Start writing your thoughts here... How are you feeling today? What's on your mind?"
            />

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-rose-500">{thoughts.trim().split(/\s+/).filter(Boolean).length} words</div>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !thoughts.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Thoughts"}
              </button>
            </div>
          </div>

          {analysis && (
            <div className="bg-white p-6 rounded-xl shadow-md border border-rose-100">
              <h2 className="text-xl font-semibold text-rose-800 mb-6">Thought Analysis</h2>

              <div className="mb-6 p-4 bg-rose-50 rounded-lg border border-rose-200">
                <h3 className="font-medium text-rose-800 mb-2">Summary</h3>
                <p className="text-rose-700">{analysis.summary}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-rose-800 mb-3">Insights</h3>
                <ul className="space-y-2">
                  {analysis.insights.map((insight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-rose-500 mr-2">•</span>
                      <span className="text-rose-700">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-rose-800 mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-rose-500 mr-2">•</span>
                      <span className="text-rose-700">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200 flex items-start">
                <LucideAlertCircle className="text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-amber-800 text-sm">
                    This analysis is for informational purposes only and should not replace professional mental health
                    advice. If you're experiencing severe distress, please reach out to a mental health professional or
                    crisis service.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}