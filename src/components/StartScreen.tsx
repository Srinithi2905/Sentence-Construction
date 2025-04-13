import { useState } from 'react';

type StartScreenProps = {
  onStart: () => void;
  totalQuestions: number;
  coins: number;
};

export function StartScreen({ onStart, totalQuestions, coins }: StartScreenProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <div className="p-8 flex flex-col items-center bg-gradient-to-br from-white to-indigo-50">
      <div className="text-4xl font-bold text-indigo-600 mb-2">🧩</div>
      <h1 className="text-4xl font-bold mb-3 text-indigo-800 text-center">
        Sentence Construction
      </h1>
      <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mb-6"></div>
      
      <p className="text-center mb-8 text-gray-600 max-w-lg">
        Challenge yourself! Select the correct words to complete each sentence 
        by arranging the provided options in the right order.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mb-10">
        <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100 transition-all duration-300 hover:shadow-lg hover:border-indigo-300">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Time Per Question</h2>
              <p className="text-2xl font-bold text-indigo-700">30 sec</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100 transition-all duration-300 hover:shadow-lg hover:border-indigo-300">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Total Questions</h2>
              <p className="text-2xl font-bold text-indigo-700">{totalQuestions}</p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md border border-indigo-100 transition-all duration-300 hover:shadow-lg hover:border-indigo-300">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Your Coins</h2>
              <p className="text-2xl font-bold text-yellow-600 flex items-center">
                {coins} <span className="ml-2 text-yellow-500 text-lg">coins</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6 py-3 px-6 rounded-lg bg-indigo-50 text-indigo-700 text-sm">
        <p>🏆 Complete all questions correctly to earn bonus coins!</p>
      </div>
      
      <div className="flex space-x-4">
        <button
          className="bg-white border border-gray-300 px-8 py-3 rounded-lg text-gray-400 font-medium shadow-sm"
          disabled
        >
          Back
        </button>
        <button
          className={`bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 rounded-lg text-white font-medium shadow-md transition-all duration-300 ${isHovering ? 'shadow-lg -translate-y-1' : ''}`}
          onClick={onStart}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}
