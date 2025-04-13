import { useState, useEffect, useRef } from 'react';
import type { QuestionData } from '../App';

type QuestionScreenProps = {
  question: QuestionData;
  onSubmit: (answers: string[]) => void;
  onTimeUp: () => void;
  totalQuestions: number;
  currentQuestionNumber: number;
};

export function QuestionScreen({ 
  question, 
  onSubmit, 
  onTimeUp,
  totalQuestions,
  currentQuestionNumber
}: QuestionScreenProps) {
  const [userAnswers, setUserAnswers] = useState<string[]>(
    new Array(question.correctAnswer.length).fill('')
  );
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: boolean }>({});
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const timerRef = useRef<number | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Parse the sentence to extract blank positions
  const sentenceParts = question.question.split('_____________');

  // Reset state when question changes
  useEffect(() => {
    setUserAnswers(new Array(question.correctAnswer.length).fill(''));
    setSelectedOptions({});
    setTimeLeft(30);

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Start new timer
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          onTimeUp();
          return 0;
        }
        // Warning animation when time is running low
        if (prev <= 10 && prev % 2 === 0) {
          if (progressRef.current) {
            progressRef.current.classList.add('pulse-animation');
            setTimeout(() => {
              if (progressRef.current) {
                progressRef.current.classList.remove('pulse-animation');
              }
            }, 1000);
          }
        }
        return prev - 1;
      });
    }, 1000);

    // Clean up timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [question, onTimeUp]);

  const handleSelectOption = (option: string) => {
    // Skip if already selected
    if (selectedOptions[option]) return;

    // Find the first empty blank
    const emptyIndex = userAnswers.findIndex(answer => answer === '');
    if (emptyIndex !== -1) {
      const newAnswers = [...userAnswers];
      newAnswers[emptyIndex] = option;
      setUserAnswers(newAnswers);
      setSelectedOptions({ ...selectedOptions, [option]: true });
    }
  };

  const handleRemoveAnswer = (index: number) => {
    const option = userAnswers[index];
    if (option) {
      const newAnswers = [...userAnswers];
      newAnswers[index] = '';
      setUserAnswers(newAnswers);
      
      const newSelectedOptions = { ...selectedOptions };
      newSelectedOptions[option] = false;
      setSelectedOptions(newSelectedOptions);
    }
  };

  const isAllFilled = userAnswers.every(answer => answer !== '');
  
  // Calculate progress percentage
  const progressPercentage = ((currentQuestionNumber - 1) / totalQuestions) * 100;
  
  // Determine time indicator color
  const getTimeColor = () => {
    if (timeLeft > 20) return "bg-emerald-600";
    if (timeLeft > 10) return "bg-amber-500";
    return "bg-red-600";
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-white">
      {/* Header with progress indicator */}
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-3">
          <div className="flex items-center">
            <span className="bg-indigo-100 text-indigo-700 font-medium rounded-full px-3 py-1 text-sm">
              Question {currentQuestionNumber}/{totalQuestions}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="text-sm font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className={`${timeLeft <= 10 ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="w-24 sm:w-32 bg-gray-200 rounded-full h-3 overflow-hidden flex-grow sm:flex-grow-0">
              <div 
                ref={progressRef}
                className={`h-3 rounded-full transition-all duration-1000 ${getTimeColor()}`}
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      
        {/* Overall progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-1 overflow-hidden">
          <div 
            className="h-2 bg-indigo-600 rounded-full transition-all duration-700"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Instruction banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-3 sm:p-4 rounded-r-lg text-center mb-6 sm:mb-8 shadow-sm">
        <div className="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="font-medium text-sm sm:text-base">Select the missing words in the correct order</span>
        </div>
      </div>

      {/* Sentence with blanks */}
      <div className="mb-6 sm:mb-10 bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-800">
          {sentenceParts.map((part, index) => (
            <span key={index}>
              {part}
              {index < sentenceParts.length - 1 && (
                <span 
                  onClick={() => handleRemoveAnswer(index)}
                  className={`inline-block mx-1 px-2 sm:px-3 py-1 rounded-md border-2 transition-all duration-200 ${
                    userAnswers[index] 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 cursor-pointer hover:bg-indigo-100 hover:shadow-sm' 
                      : 'border-gray-300 bg-gray-50 text-gray-400'
                  }`}
                  style={{ minWidth: '70px', textAlign: 'center' }}
                >
                  {userAnswers[index] || (
                    <span className="opacity-50">_____</span>
                  )}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Word options */}
      <div className="mb-6 sm:mb-10">
        <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2 sm:mb-3">Select words to complete the sentence:</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelectOption(option)}
              disabled={selectedOptions[option]}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm transition-all duration-200 ${
                selectedOptions[option]
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                  : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 hover:shadow-sm'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Action button */}
      <div className="flex justify-end items-center">
        <button
          onClick={() => onSubmit(userAnswers)}
          disabled={!isAllFilled}
          className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base flex items-center transition-all duration-300 ${
            isAllFilled
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-md hover:-translate-y-1'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Add CSS for animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .pulse-animation {
          animation: pulse 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
