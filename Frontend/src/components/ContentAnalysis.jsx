import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LucideArrowLeft } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

const ContentAnalysis = () => {
  const [posts, setPosts] = useState(Array(5).fill(""));
  const [sentiments, setSentiments] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handlePostChange = (index, value) => {
    const newPosts = [...posts];
    newPosts[index] = value;
    setPosts(newPosts);
  };

  const analyzePosts = async () => {
    if (posts.some((post) => !post.trim())) {
      alert("Please fill in all 5 posts for analysis");
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5001/analyze",
        { paragraphs: posts },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.error) {
        alert(response.data.error);
      } else {
        const sentimentScores = response.data.map((item) => item.emotion_score);
        setSentiments(sentimentScores);

        const avgSentiment =
          sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length;

        let analysisText = "";
        if (avgSentiment < -0.3) {
          analysisText =
            "Your posts indicate some negative emotions. Consider reaching out to someone you trust or a professional for support.";
        } else if (avgSentiment > 0.3) {
          analysisText =
            "Your posts show positive emotions overall. Keep nurturing these positive aspects in your life.";
        } else {
          analysisText =
            "Your posts show a mix of emotions. It's normal to experience ups and downs.";
        }

        setAnalysis(analysisText);
      }
    } catch (error) {
      console.error("Error analyzing posts:", error);
      alert("An error occurred while analyzing. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <Link
          to="/"
          className="inline-flex items-center text-indigo-700 hover:text-indigo-900 mb-8"
        >
          <LucideArrowLeft className="mr-2" /> Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-rose-800 mb-8">
          Content Analysis
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel: Input Section */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-rose-100">
            <h2 className="text-xl font-semibold text-rose-800 mb-4">
              Enter 5 Social Media Posts
            </h2>
            <p className="text-rose-600 mb-6">
              These can be your posts, messages, or any text content you'd like
              to analyze.
            </p>

            <div className="space-y-4">
              {posts.map((post, index) => (
                <div key={index}>
                  <label className="block text-rose-700 mb-2">
                    Post {index + 1}
                  </label>
                  <textarea
                    value={post}
                    onChange={(e) => handlePostChange(index, e.target.value)}
                    className="w-full p-3 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition"
                    rows={3}
                    placeholder="Enter your post here..."
                  />
                </div>
              ))}
            </div>

            <button
              onClick={analyzePosts}
              disabled={isAnalyzing}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition disabled:opacity-50"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Posts"}
            </button>

            {analysis && (
              <div className="mt-6 p-4 bg-rose-50 border-l-4 border-rose-400 rounded-lg text-rose-800">
                {analysis}
              </div>
            )}
          </div>

         {/* Right Panel: Emotional Graph */}
<div className="bg-white p-6 rounded-xl shadow-md border border-rose-100 h-[250px] w-full flex items-center justify-center">
  <h2 className="text-xl font-semibold text-rose-800 mb-4">
    Emotional Graph
  </h2>
  {sentiments.length > 0 ? (
    <div className="w-full h-full">
      <EmotionGraph sentiments={sentiments} />
    </div>
  ) : (
    <div className="h-full w-full flex items-center justify-center text-rose-400 border border-dashed border-rose-200 rounded-lg">
      Enter your posts and click analyze to see your emotional graph
    </div>
  )}
</div>

        </div>
      </div>
    </div>
  );
};

const EmotionGraph = ({ sentiments }) => {
  const graphHeight = 200;
  const graphWidth = 300;
  const padding = 40;
  const availableWidth = graphWidth - padding * 2;
  const pointSpacing = availableWidth / (sentiments.length - 1);

  const getYCoordinate = (sentiment) =>
    ((1 - sentiment) / 2) * (graphHeight - 20) + 10;

  // Create a string of points for the polyline
  const points = sentiments
    .map((sentiment, index) => {
      const x = padding + index * pointSpacing;
      const y = getYCoordinate(sentiment);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${graphWidth} ${graphHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* X and Y Axes */}
        <line
          x1={padding}
          y1={graphHeight - 10}
          x2={graphWidth - padding}
          y2={graphHeight - 10}
          stroke="gray"
          strokeWidth="1"
        />
        <line
          x1={padding}
          y1={10}
          x2={padding}
          y2={graphHeight - 10}
          stroke="gray"
          strokeWidth="1"
        />

        {/* Animated Graph Line */}
        <motion.polyline
          points={points}
          fill="none"
          stroke="#4f46e5"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Animated Data Points */}
        {sentiments.map((sentiment, index) => {
          const x = padding + index * pointSpacing;
          const y = getYCoordinate(sentiment);
          return (
            <motion.circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="#4f46e5"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            />
          );
        })}

        {/* X-axis Labels */}
        {sentiments.map((_, index) => {
          const x = padding + index * pointSpacing;
          return (
            <text
              key={index}
              x={x}
              y={graphHeight}
              fontSize="12"
              textAnchor="middle"
              fill="gray"
            >
              {index + 1}
            </text>
          );
        })}

        {/* Y-axis Labels */}
        {[1, 0, -1].map((val) => (
          <text
            key={val}
            x={padding - 10}
            y={getYCoordinate(val)}
            fontSize="12"
            fill="gray"
          >
            {val}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default ContentAnalysis;
