import { useEffect, useState } from 'react';
import type { QuestionData, Answer } from '../App';

type FeedbackScreenProps = {
  answers: Answer[];
  questions: QuestionData[];
  onRestart: () => void;
  totalQuestions: number;
};

export function FeedbackScreen({ 
  answers, 
  questions, 
  onRestart,
  totalQuestions
}: FeedbackScreenProps) {
  const correctCount = answers.filter(answer => answer.isCorrect).length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Determine feedback message based on score percentage
  const getFeedbackMessage = () => {
    if (percentage >= 90) return { message: "Outstanding!", emoji: "🏆", color: "text-indigo-700" };
    if (percentage >= 75) return { message: "Great job!", emoji: "🌟", color: "text-indigo-600" };
    if (percentage >= 60) return { message: "Good effort!", emoji: "👍", color: "text-indigo-500" };
    if (percentage >= 40) return { message: "Nice try!", emoji: "🙂", color: "text-indigo-400" };
    return { message: "Keep practicing!", emoji: "📚", color: "text-indigo-300" };
  };
  
  const feedback = getFeedbackMessage();
  
  // Animate the percentage counter
  useEffect(() => {
    if (percentage > 75) {
      setShowConfetti(true);
    }
    
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
    
    const animateCounter = () => {
      const duration = 1500;
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      const easeOutQuad = (t: number) => t * (2 - t);
      
      let frame = 0;
      const counter = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);
        setAnimatedPercentage(Math.round(progress * percentage));
        
        if (frame === totalFrames) {
          clearInterval(counter);
        }
      }, frameDuration);
    };
    
    animateCounter();
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="p-6 md:p-8 bg-white">
      {showConfetti && (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
          {[...Array(50)].map((_, i) => {
            const size = Math.random() * 10 + 5;
            const color = ['#FFC700', '#FF4500', '#00BFFF', '#7CFC00', '#FF1493'][Math.floor(Math.random() * 5)];
            const left = `${Math.random() * 100}%`;
            const animDuration = `${Math.random() * 3 + 2}s`;
            const animDelay = `${Math.random() * 0.5}s`;
            
            return (
              <div 
                key={i}
                className="absolute top-0 animate-confetti"
                style={{
                  left,
                  width: `${size}px`,
                  height: `${size * 1.5}px`,
                  backgroundColor: color,
                  animationDuration: animDuration,
                  animationDelay: animDelay,
                }}
              />
            );
          })}
        </div>
      )}
      
      <div className="mb-4 text-center">
        <div className="inline-block rounded-full p-3 bg-indigo-100 text-indigo-600 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-center mb-1">Your Results</h1>
        <p className="text-gray-500">See how well you did!</p>
      </div>
      
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl shadow-sm mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-lg text-gray-600">Your Score</p>
            <div className="flex items-baseline">
              <span className="text-5xl font-bold text-indigo-700 mr-2">{correctCount}</span>
              <span className="text-xl text-gray-500">/ {totalQuestions} correct</span>
            </div>
          </div>
          
          <div className="relative">
            <svg className="w-32 h-32" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#E0E7FF" 
                strokeWidth="10" 
              />
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#6366F1" 
                strokeWidth="10" 
                strokeDasharray="283" 
                strokeDashoffset={283 - (283 * animatedPercentage) / 100} 
                strokeLinecap="round" 
                transform="rotate(-90 50 50)" 
              />
              <text 
                x="50" 
                y="50" 
                dominantBaseline="middle" 
                textAnchor="middle" 
                fontSize="20" 
                fontWeight="bold" 
                fill="#4F46E5"
              >
                {animatedPercentage}%
              </text>
            </svg>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className={`text-xl font-bold ${feedback.color}`}>
            {feedback.emoji} {feedback.message}
          </p>
        </div>
      </div>
      
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Question Review</h2>
          <div className="flex space-x-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span className="text-sm text-gray-600">Correct</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
              <span className="text-sm text-gray-600">Incorrect</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl divide-y divide-gray-100">
          {questions.map((questionData, index) => {
            const answer = answers[index];
            const sentenceParts = questionData.question.split('_____________');
            
            return (
              <div 
                key={questionData.questionId} 
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-1 ${
                    answer?.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {answer?.isCorrect ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium mb-2 text-gray-700">Question {index + 1}</p>
                    
                    <div className="mb-3 text-gray-700">
                      {sentenceParts.map((part, partIndex) => (
                        <span key={partIndex}>
                          {part}
                          {partIndex < sentenceParts.length - 1 && (
                            <span className={`inline-block mx-1 px-2 py-1 rounded-md font-medium ${
                              answer?.userAnswers[partIndex] === answer?.correctAnswers[partIndex]
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {answer?.userAnswers[partIndex] || '(blank)'}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                    
                    {!answer?.isCorrect && (
                      <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                        <p className="text-sm font-medium text-gray-600 mb-1">Correct Answer:</p>
                        <div className="text-sm text-gray-700">
                          {sentenceParts.map((part, partIndex) => (
                            <span key={partIndex}>
                              {part}
                              {partIndex < sentenceParts.length - 1 && (
                                <span className="inline-block mx-1 px-2 py-1 rounded-md bg-green-100 text-green-800 font-medium">
                                  {answer?.correctAnswers[partIndex]}
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
        <button
          onClick={onRestart}
          className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-medium flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Try Again
        </button>
        
        <button
          onClick={() => window.location.href = '/'}
          className="w-full md:w-auto border border-indigo-200 text-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 transition-all duration-300 font-medium flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </button>
      </div>
    </div>
  );
}

