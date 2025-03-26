import React from "react";
import { Link } from "react-router-dom";

import {
  LucideHeart,
  LucideMessageCircle,
  LucideBarChart2,
  LucidePhone,
  LucideUsers,
  LucideAlertTriangle,
} from "lucide-react";

export default function Hero() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 ">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4">
            Teenage Suicide Awareness
          </h1>
          <p className="text-xl text-indigo-700 max-w-3xl mx-auto">
            Recognizing the signs, providing support, and taking action to prevent teenage suicide
          </p>
        </div>

        {/* Tools Section */}
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-8 text-center">Our Support Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
          <FeatureCard
            title="Content Analysis"
            description="Analyze social media posts to identify emotional patterns and potential warning signs."
            icon={<LucideBarChart2 className="h-10 w-10 text-indigo-600" />}
            href="/content-analysis"
            color="bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
          />
          <FeatureCard
            title="Support Chat"
            description="Talk with our empathetic chatbot for guidance, resources, and music recommendations."
            icon={<LucideMessageCircle className="h-10 w-10 text-purple-600" />}
            href="/chat"
            color="bg-purple-50 border-purple-200 hover:bg-purple-100"
          />
          <FeatureCard
            title="Thought Journal"
            description="Express thoughts freely in a safe space and receive thoughtful analysis and support."
            icon={<LucideHeart className="h-10 w-10 text-pink-600" />}
            href="/thought-analysis"
            color="bg-pink-50 border-pink-200 hover:bg-pink-100"
          />
        </div>
        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
          <StatCard
            number="2nd"
            text="Leading cause of death among teenagers"
            icon={<LucideAlertTriangle className="h-10 w-10 text-red-500" />}
            color="bg-red-50 border-red-200"
            textColor="text-red-700"
          />
          <StatCard
            number="20%"
            text="Of teens consider suicide each year"
            icon={<LucideUsers className="h-10 w-10 text-amber-500" />}
            color="bg-amber-50 border-amber-200"
            textColor="text-amber-700"
          />
          <StatCard
            number="988"
            text="National Suicide Prevention Lifeline"
            icon={<LucidePhone className="h-10 w-10 text-green-500" />}
            color="bg-green-50 border-green-200"
            textColor="text-green-700"
          />
        </div>

        {/* Warning Signs Section */}
        <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6 md:p-8 mb-16 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-6 text-center">
            Warning Signs to Watch For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <WarningSign text="Talking about wanting to die or suicide" />
            <WarningSign text="Feeling hopeless or having no purpose" />
            <WarningSign text="Feeling trapped or unbearable pain" />
            <WarningSign text="Increased use of alcohol or drugs" />
            <WarningSign text="Withdrawing from activities and friends" />
            <WarningSign text="Extreme mood swings or changes in behavior" />
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center max-w-3xl mx-auto">
          <p className="text-lg text-indigo-800 mb-6">
            If you or someone you know is in crisis, please call or text the 988 Suicide & Crisis Lifeline at 988, or
            contact the Crisis Text Line by texting HOME to 741741.
          </p>
          <p className="text-indigo-600">Remember: You are not alone. Help is available.</p>
        </div>
      </div>
    </main>
  );
}

function StatCard({ number, text, icon, color, textColor }) {
  return (
    <div className={`${color} rounded-xl shadow-md border p-6 text-center`}>
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-3xl md:text-4xl font-bold mb-2">{number}</h3>
      <p className={`${textColor}`}>{text}</p>
    </div>
  );
}

function WarningSign({ text }) {
  return (
    <div className="flex items-start">
      <div className="bg-red-100 p-2 rounded-full mr-3 mt-1">
        <LucideAlertTriangle className="h-5 w-5 text-red-600" />
      </div>
      <p className="text-indigo-800">{text}</p>
    </div>
  );
}

function FeatureCard({ title, description, icon, href, color }) {
  return (
    <Link to={href} className="no-underline">
      <div className={`${color} rounded-xl shadow-md border p-6 h-full flex flex-col items-center text-center cursor-pointer transition-colors duration-300`}>
        <div className="bg-white p-4 rounded-full mb-4 shadow-sm">{icon}</div>
        <h2 className="text-xl font-semibold text-indigo-900 mb-3">{title}</h2>
        <p className="text-indigo-700">{description}</p>
      </div>
    </Link>
  );
}