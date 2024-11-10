import React, { useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const Popup: React.FC = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!apiKey) {
            throw new Error("VITE_GEMINI_API_KEY is missing");
        }
        const genAI = new GoogleGenerativeAI(apiKey);          
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = "Write a story about a magic backpack.";
        
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
      } catch (error) {
        console.error("Error generating content:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run once when the component loads

  return (
    <div className="p-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg shadow-lg">
      <h1 className="text-xl font-extrabold text-white mb-2">
        Hello, Chrome Extension!
      </h1>
      <p className="text-sm text-gray-100">
        This is a sample popup styled with Tailwind CSS.
      </p>
    </div>
  );
};

export default Popup;
