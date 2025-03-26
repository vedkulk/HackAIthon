import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { LucideArrowLeft } from "lucide-react";
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

  const analyzePosts = () => {
    if (posts.some((post) => !post.trim())) {
      alert("Please fill in all 5 posts for analysis");
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      const mockSentiments = posts.map(() => Math.random() * 2 - 1);
      setSentiments(mockSentiments);

      const avgSentiment =
        mockSentiments.reduce((a, b) => a + b, 0) / mockSentiments.length;
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
      setIsAnalyzing(false);
    }, 1500);
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
          <div className="bg-white p-6 rounded-xl shadow-md border border-rose-100">
            <h2 className="text-xl font-semibold text-rose-800 mb-4">
              Enter 5 Social Media Posts
            </h2>
            <p className="text-rose-600 mb-6">
              These can be your posts, messages, or any text content you'd like
              to analyze.
            </p>

            {posts.map((post, index) => (
              <div key={index} className="mb-4">
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

            <button
              onClick={analyzePosts}
              disabled={isAnalyzing}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition disabled:opacity-50"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Posts"}
            </button>
          </div>

          <div className="grid grid-rows-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-rose-100">
              <h2 className="text-xl font-semibold text-rose-800 mb-4">
                Emotional Graph
              </h2>
              {sentiments.length > 0 ? (
                <div className="h-64">
                  <EmotionGraph sentiments={sentiments} />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-rose-400 border border-dashed border-rose-200 rounded-lg">
                  Enter your posts and click analyze to see your emotional graph
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-rose-100">
              <h2 className="text-xl font-semibold text-rose-800 mb-4">
                Detailed Analysis
              </h2>
              {analysis ? (
                <div className="text-rose-700">{analysis}</div>
              ) : (
                <div className="h-32 flex items-center justify-center text-rose-400 border border-dashed border-rose-200 rounded-lg">
                  Analysis will appear here after processing
                </div>
              )}
            </div>
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

  const getYCoordinate = (sentiment) => ((1 - sentiment) / 2) * graphHeight;

  const points = sentiments
    .map((sentiment, index) => {
      const x = padding + index * pointSpacing;
      const y = getYCoordinate(sentiment);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div className="relative h-full w-full">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${graphWidth} ${graphHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <polyline points={points} fill="none" stroke="#4f46e5" strokeWidth="2" />
          {sentiments.map((sentiment, index) => {
            const x = padding + index * pointSpacing;
            const y = getYCoordinate(sentiment);
            return <circle key={index} cx={x} cy={y} r="4" fill="#4f46e5" />;
          })}
        </svg>
      </div>
    </div>
  );
};

export default ContentAnalysis;
