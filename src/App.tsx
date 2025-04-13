import { useState, useEffect } from 'react';
import { QuestionScreen } from './components/QuestionScreen';
import { FeedbackScreen } from './components/FeedbackScreen';
import { StartScreen } from './components/StartScreen';
import './App.css';

// Types based on your exact JSON structure
export type QuestionData = {
  questionId: string;
  question: string;
  questionType: string;
  answerType: string;
  options: string[];
  correctAnswer: string[];
};

export type TestData = {
  testId: string;
  questions: QuestionData[];
};

export type ActivityData = {
  id: string;
  userId: string;
  type: string;
  coinType: string;
  coins: number;
  description: string;
  createdAt: string;
};

export type ApiResponse = {
  status: string;
  data: TestData;
  message: string;
  activity: ActivityData;
};

export type Answer = {
  questionId: string;
  userAnswers: string[];
  correctAnswers: string[];
  isCorrect: boolean;
};

function App() {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'feedback'>('start');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);           
      const response = await fetch('https://raw.githubusercontent.com/Srinithi2905/Sentence-Construction/main/db.json');

      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const apiResponse = await response.json();
      
      if (apiResponse.status === 'SUCCESS') {
        setApiData(apiResponse);
      } else {
        throw new Error('API returned unsuccessful status');
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load questions. Make sure your JSON server is running.');
      setLoading(false);
      console.error(err);
    }
  };

  const handleStartGame = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  const handleSubmitAnswer = (userAnswers: string[]) => {
    if (!apiData?.data.questions) return;
    
    const currentQuestion = apiData.data.questions[currentQuestionIndex];
    
    // Compare user answers with correct answers
    const isCorrect = userAnswers.every((answer, index) => 
      answer === currentQuestion.correctAnswer[index]
    );
     
    // Save the answer
    setAnswers([...answers, {
      questionId: currentQuestion.questionId,
      userAnswers,
      correctAnswers: [...currentQuestion.correctAnswer],
      isCorrect
    }]);
    
    // Move to next question or feedback screen
    if (currentQuestionIndex < apiData.data.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setGameState('feedback');
    }
  };

  const handleTimeUp = () => {
    // If time is up, submit whatever is currently filled (or empty array if nothing)
    if (!apiData?.data.questions) return;
    
    const currentQuestion = apiData.data.questions[currentQuestionIndex];
    handleSubmitAnswer(new Array(currentQuestion.correctAnswer.length).fill(''));
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-white">Loading your quiz...</h2>
          <p className="text-indigo-100 mt-2">Please wait while we prepare your questions</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-r from-red-500 to-pink-600">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button 
            onClick={() => fetchData()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!apiData) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-orange-600 mb-4">No Quiz Data Available</h2>
          <p className="text-gray-700 mb-6">We couldn't find any questions for this quiz.</p>
          <button 
            onClick={() => fetchData()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const testData = apiData.data;
  const coins = apiData.activity.coins;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
        {gameState === 'start' && (
          <StartScreen 
            onStart={handleStartGame} 
            totalQuestions={testData.questions.length}
            coins={coins}
          />
        )}
        
        {gameState === 'playing' && testData.questions.length > 0 && (
          <QuestionScreen 
            question={testData.questions[currentQuestionIndex]} 
            onSubmit={handleSubmitAnswer}
            onTimeUp={handleTimeUp}
            totalQuestions={testData.questions.length}
            currentQuestionNumber={currentQuestionIndex + 1}
          />
        )}
        
        {gameState === 'feedback' && (
          <FeedbackScreen 
            answers={answers} 
            questions={testData.questions}
            onRestart={handleStartGame}
            totalQuestions={testData.questions.length}
          />
        )}
      </div>
      <div className="mt-6 text-center text-sm text-indigo-600">
        <p>© 2025 Quiz App - Learn and Earn Coins</p>
      </div>
    </div>
  );
}

export default App;

