import React, { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ShortAnswerQuestionProps {
  question: string | React.ReactNode;
  correctAnswer: number;
  tolerance?: number;
  onComplete?: (isCorrect: boolean) => void;
}

export const ShortAnswerQuestion: React.FC<ShortAnswerQuestionProps> = ({ question, correctAnswer, tolerance = 0.05, onComplete }) => {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (!value.trim()) return;
    
    // Replace comma with dot for parsing
    const numericValue = parseFloat(value.replace(',', '.'));
    
    if (isNaN(numericValue)) {
      alert("Vui lòng nhập một số hợp lệ.");
      return;
    }

    const correct = Math.abs(numericValue - correctAnswer) <= tolerance;
    setIsCorrect(correct);
    setSubmitted(true);
    if (onComplete) onComplete(correct);
  };

  return (
    <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
      <h4 className="font-bold text-secondary mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined">edit_square</span>
        Câu hỏi Trả lời ngắn
      </h4>
      <div className="text-on-surface mb-6 font-medium leading-relaxed">{question}</div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSubmitted(false);
          }}
          disabled={submitted && isCorrect}
          placeholder="Nhập đáp án (ví dụ: 4,4)"
          className="w-full sm:flex-1 px-4 py-3 rounded-xl border-2 border-outline-variant/50 focus:border-primary focus:outline-none transition-colors text-lg font-bold text-center"
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || (submitted && isCorrect)}
          className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
        >
          Kiểm tra
        </button>
      </div>

      {submitted && (
        <div className={`p-4 rounded-xl flex items-start gap-3 ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {isCorrect ? <CheckCircle2 className="w-5 h-5 mt-0.5" /> : <AlertCircle className="w-5 h-5 mt-0.5" />}
          <div>
            <p className="font-medium">{isCorrect ? 'Chính xác!' : 'Chưa chính xác. Hãy thử lại!'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortAnswerQuestion;