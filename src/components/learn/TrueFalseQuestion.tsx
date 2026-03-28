import React, { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface Statement {
  id: string;
  text: string;
  isTrue: boolean;
}

interface TrueFalseQuestionProps {
  question: string;
  statements: Statement[];
  onComplete?: (isCorrect: boolean) => void;
}

export const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({ question, statements, onComplete }) => {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (id: string, value: boolean) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const allCorrect = statements.every(s => answers[s.id] === s.isTrue);
    if (onComplete) onComplete(allCorrect);
  };

  const isAllAnswered = statements.every(s => answers[s.id] !== undefined && answers[s.id] !== null);

  return (
    <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
      <h4 className="font-bold text-secondary mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined">fact_check</span>
        Trắc nghiệm Đúng/Sai
      </h4>
      <p className="text-on-surface mb-6 font-medium">{question}</p>
      
      <div className="space-y-4 mb-6">
        {statements.map((stmt) => {
          const isAnswered = answers[stmt.id] !== undefined;
          const answer = answers[stmt.id];
          const isCorrect = answer === stmt.isTrue;
          
          return (
            <div key={stmt.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-outline-variant/30">
              <span className="text-on-surface-variant flex-1">{stmt.text}</span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleSelect(stmt.id, true)}
                  disabled={submitted}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    answer === true 
                      ? submitted ? (isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-primary text-white'
                      : 'bg-surface-container hover:bg-surface-container-highest text-on-surface'
                  }`}
                >
                  ĐÚNG
                </button>
                <button
                  onClick={() => handleSelect(stmt.id, false)}
                  disabled={submitted}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    answer === false 
                      ? submitted ? (isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-error text-white'
                      : 'bg-surface-container hover:bg-surface-container-highest text-on-surface'
                  }`}
                >
                  SAI
                </button>
                {submitted && (
                  <div className="w-6 flex justify-center">
                    {isCorrect ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!isAllAnswered}
          className="w-full py-3 bg-primary text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
        >
          Kiểm tra đáp án
        </button>
      ) : (
        <div className={`p-4 rounded-xl flex items-start gap-3 ${statements.every(s => answers[s.id] === s.isTrue) ? 'bg-green-50 text-green-800' : 'bg-orange-50 text-orange-800'}`}>
          {statements.every(s => answers[s.id] === s.isTrue) ? <CheckCircle2 className="w-5 h-5 mt-0.5" /> : <AlertCircle className="w-5 h-5 mt-0.5" />}
          <div>
            <p className="font-medium">
              {statements.every(s => answers[s.id] === s.isTrue) 
                ? 'Xuất sắc! Bạn đã trả lời đúng tất cả các ý.' 
                : 'Bạn có một số câu trả lời chưa chính xác. Hãy xem lại nhé!'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrueFalseQuestion;