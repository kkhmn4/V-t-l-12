import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { logMistake, logHelpRequest, completeLesson } from '../../lib/db';
import { useNavigate } from 'react-router-dom';
import { getAIHint } from '../../lib/ai';
import TrueFalseQuestion from './TrueFalseQuestion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Stage4 = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [aiHint, setAiHint] = useState<string>('');
  const [loadingHint, setLoadingHint] = useState(false);
  const [tfCompleted, setTfCompleted] = useState(false);

  const question = "Đồng vị là những nguyên tử mà hạt nhân có:";
  const options = [
    { id: 'A', text: 'Cùng số proton, khác số neutron' },
    { id: 'B', text: 'Cùng số neutron, khác số proton' },
    { id: 'C', text: 'Cùng số khối A' }
  ];

  const tfQuestion = "Cho các phát biểu sau về các đồng vị của Hydrogen:";
  const tfStatements = [
    { id: 'a', text: "Các đồng vị của Hydrogen có cùng tính chất hóa học.", isTrue: true },
    { id: 'b', text: "Tritium là đồng vị bền của Hydrogen.", isTrue: false },
    { id: 'c', text: "Nước nặng (D₂O) được tạo thành từ đồng vị Deuterium.", isTrue: true },
    { id: 'd', text: "Hạt nhân Protium không chứa neutron.", isTrue: true }
  ];

  const handleAnswer = async (answer: string) => {
    setSelectedAnswer(answer);
    setShowHint(false);
    setAiHint('');
    if (answer === 'A') {
      setIsCorrect(true);
      if (user && !isCompleted && tfCompleted) {
        // Just a mock calculation for knowledge levels
        await completeLesson(user.uid, { biet: 100, hieu: 100, van_dung: 100 });
        setIsCompleted(true);
      }
    } else {
      setIsCorrect(false);
      if (user) {
        await logMistake(user.uid, {
          question_id: 'stage4_q1',
          wrong_answer: answer,
          timestamp: Date.now()
        });
      }
    }
  };

  const handleHint = async () => {
    setShowHint(true);
    setLoadingHint(true);
    if (user) {
      await logHelpRequest(user.uid);
    }
    
    if (selectedAnswer) {
      const wrongText = options.find(o => o.id === selectedAnswer)?.text || '';
      const correctText = options.find(o => o.id === 'A')?.text || '';
      const hint = await getAIHint(question, correctText, wrongText);
      setAiHint(hint || 'Không thể lấy gợi ý lúc này.');
    }
    setLoadingHint(false);
  };

  const carbonData = [
    { name: 'C-12', abundance: 98.9 },
    { name: 'C-13', abundance: 1.1 },
    { name: 'C-14', abundance: 0.0000000001 } // Trace amount, just for illustration
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Hero Visual Section */}
      <section className="relative w-full bg-gradient-to-br from-primary to-secondary rounded-3xl mx-4 lg:mx-0 mt-6 shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between p-8 lg:p-12 gap-12">
          {/* Left: Isotopes Visualization */}
          <div className="relative z-10 flex flex-col items-center lg:w-1/2">
            <div className="flex items-center justify-center gap-4 sm:gap-8 w-full mb-8">
              {/* Hydrogen-1 (Protium) */}
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center relative shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-primary rounded-full shadow-lg shadow-primary/50 flex items-center justify-center text-white font-bold text-[10px] ring-2 ring-white/20">+</div>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-white font-bold text-sm sm:text-base block">Protium</span>
                  <span className="text-white/70 font-mono text-[10px] sm:text-xs">¹H (1p, 0n)</span>
                </div>
              </div>
              
              {/* Hydrogen-2 (Deuterium) */}
              <div className="flex flex-col items-center group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center relative shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform">
                  <div className="flex gap-1">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-primary rounded-full shadow-lg shadow-primary/50 flex items-center justify-center text-white font-bold text-[10px] ring-2 ring-white/20">+</div>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-surface-container-highest rounded-full shadow-lg flex items-center justify-center text-secondary font-bold text-[10px]">n</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-white font-bold text-sm sm:text-base block">Deuterium</span>
                  <span className="text-white/70 font-mono text-[10px] sm:text-xs">²H (1p, 1n)</span>
                </div>
              </div>

              {/* Hydrogen-3 (Tritium) */}
              <div className="flex flex-col items-center group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center relative shadow-[0_0_30px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform">
                  <div className="flex flex-wrap justify-center items-center w-12 sm:w-14 gap-1">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-primary rounded-full shadow-lg shadow-primary/50 flex items-center justify-center text-white font-bold text-[10px] ring-2 ring-white/20">+</div>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-surface-container-highest rounded-full shadow-lg flex items-center justify-center text-secondary font-bold text-[10px]">n</div>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-surface-container-highest rounded-full shadow-lg flex items-center justify-center text-secondary font-bold text-[10px]">n</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-white font-bold text-sm sm:text-base block">Tritium</span>
                  <span className="text-white/70 font-mono text-[10px] sm:text-xs">³H (1p, 2n)</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-white font-headline font-extrabold text-3xl sm:text-4xl tracking-tight">Chặng 4: Đồng vị</h1>
              <p className="text-white/80 font-body text-base sm:text-lg mt-2 italic">Những người anh em cùng họ khác cân nặng</p>
            </div>
          </div>

          {/* Right: YouTube Video */}
          <div className="w-full lg:w-1/2 aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-white/10 bg-black/20">
            <iframe 
              className="w-full h-full" 
              src="https://www.youtube.com/embed/EboWeWlOpb8" 
              title="Đồng vị" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Learning Tasks Section */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 -mt-16 relative z-20">
        <div className="bg-surface-container-lowest rounded-xl shadow-2xl p-8 lg:p-12 border border-outline-variant/10">
          
          {/* Isotope Comparison & Mass Spectrum */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">family_history</span>
              </span>
              <h3 className="text-2xl font-headline font-bold text-secondary">Đặc điểm nhận dạng & Phổ khối lượng</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col gap-6">
                <div className="bg-surface-container-low p-6 rounded-2xl border-l-4 border-primary">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <h4 className="font-bold text-lg text-on-surface">Giống nhau</h4>
                  </div>
                  <p className="text-on-surface-variant">Cùng số proton (Z). Do đó chúng có cùng vị trí trong bảng tuần hoàn và tính chất hóa học giống nhau.</p>
                </div>
                
                <div className="bg-surface-container-low p-6 rounded-2xl border-l-4 border-tertiary">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-tertiary">difference</span>
                    <h4 className="font-bold text-lg text-on-surface">Khác nhau</h4>
                  </div>
                  <p className="text-on-surface-variant">Khác số neutron (N). Dẫn đến số khối (A) khác nhau và tính chất vật lý có thể khác nhau (ví dụ tính phóng xạ).</p>
                </div>
              </div>

              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
                <h4 className="font-bold text-lg text-on-surface mb-2 text-center">Phổ khối lượng của Carbon</h4>
                <p className="text-sm text-on-surface-variant mb-6 text-center">Tỉ lệ phần trăm các đồng vị trong tự nhiên</p>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={carbonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                      <XAxis dataKey="name" tick={{fontSize: 12}} />
                      <YAxis tick={{fontSize: 12}} label={{ value: 'Tỉ lệ (%)', angle: -90, position: 'insideLeft', fontSize: 12 }} />
                      <Tooltip formatter={(value: number) => [`${value}%`, 'Tỉ lệ']} />
                      <Bar dataKey="abundance" fill="#005cbb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Grid for Knowledge */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Knowledge Check Card */}
            <div className="lg:col-span-2 space-y-8">
              <div className="p-8 bg-surface-container-high rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-9xl">quiz</span>
                </div>
                <h4 className="text-xl font-headline font-bold text-secondary mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined">school</span>
                  Kiểm tra kiến thức
                </h4>
                
                <div className="space-y-6">
                  <p className="font-bold text-secondary text-lg">{question}</p>
                  <div className="grid grid-cols-1 gap-3">
                    {options.map((option) => {
                      const isSelected = selectedAnswer === option.id;
                      const isCorrectOption = option.id === 'A';
                      
                      let labelStyle = "bg-white/50 border-transparent hover:border-primary/20 hover:bg-white";
                      let textStyle = "text-on-surface-variant";
                      let iconStyle = "opacity-0 hidden";
                      let iconName = "check_circle";

                      if (isSelected) {
                        if (isCorrect) {
                          labelStyle = "bg-green-50 border-green-500";
                          textStyle = "text-green-700 font-bold";
                          iconStyle = "opacity-100 text-green-600 block";
                        } else {
                          labelStyle = "bg-red-50 border-red-500";
                          textStyle = "text-red-700 font-bold";
                          iconStyle = "opacity-100 text-red-600 block";
                          iconName = "cancel";
                        }
                      } else if (selectedAnswer && isCorrectOption) {
                        labelStyle = "bg-green-50 border-green-500";
                        textStyle = "text-green-700 font-bold";
                        iconStyle = "opacity-100 text-green-600 block";
                      }

                      return (
                        <label 
                          key={option.id}
                          className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all border group ${labelStyle}`}
                        >
                          <input 
                            type="radio" 
                            name="isotope" 
                            className="w-5 h-5 text-primary border-outline focus:ring-primary"
                            checked={isSelected}
                            onChange={() => handleAnswer(option.id)}
                            disabled={isCorrect === true}
                          />
                          <span className={`font-medium ${textStyle}`}>{option.id}. {option.text}</span>
                          <span className={`ml-auto material-symbols-outlined ${iconStyle}`} style={{ fontVariationSettings: "'FILL' 1" }}>{iconName}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <TrueFalseQuestion
                question={tfQuestion}
                statements={tfStatements}
                onComplete={(isCorrect) => {
                  if (isCorrect) {
                    setTfCompleted(true);
                    if (user && isCorrect === true && !isCompleted) {
                      completeLesson(user.uid, { biet: 100, hieu: 100, van_dung: 100 });
                      setIsCompleted(true);
                    }
                  }
                }}
              />

              {isCompleted && (
                <div className="mt-8 p-6 bg-primary-container border border-primary/20 rounded-2xl flex flex-col items-center text-center animate-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-primary text-on-primary rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
                    <span className="material-symbols-outlined text-3xl">workspace_premium</span>
                  </div>
                  <h3 className="text-xl font-headline font-bold text-on-primary-container mb-2">Chúc mừng bạn đã hoàn thành bài học!</h3>
                  <p className="text-on-primary-container/80">Kết quả học tập của bạn đã được lưu lại. Bạn đã nắm vững kiến thức về cấu trúc hạt nhân.</p>
                </div>
              )}
            </div>

            {/* Gem Gợi ý Card */}
            <div 
              className={`p-8 rounded-xl flex flex-col justify-between text-white relative group overflow-hidden transition-colors ${
                !isCorrect && selectedAnswer && !showHint ? 'bg-tertiary-container cursor-pointer hover:bg-tertiary' : 'bg-surface-container-highest'
              }`}
              onClick={() => {
                if (!isCorrect && selectedAnswer && !showHint) {
                  handleHint();
                }
              }}
            >
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className={`w-16 h-16 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-xl border ${
                  !isCorrect && selectedAnswer && !showHint ? 'bg-white/20 border-white/30' : 'bg-secondary/20 border-secondary/30 text-secondary'
                }`}>
                  {loadingHint ? (
                    <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
                  ) : (
                    <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                  )}
                </div>
                <h4 className={`text-2xl font-headline font-extrabold mb-2 ${!isCorrect && selectedAnswer && !showHint ? '' : 'text-secondary'}`}>Gem Gợi ý</h4>
                
                {showHint ? (
                  <p className="text-secondary leading-snug animate-in fade-in">{aiHint}</p>
                ) : (
                  <p className={`${!isCorrect && selectedAnswer && !showHint ? 'text-white/80' : 'text-secondary/60'} leading-snug`}>
                    {!isCorrect && selectedAnswer ? 'Chạm vào mình để biết bí mật!' : 'Trả lời sai để nhận gợi ý nhé!'}
                  </p>
                )}
              </div>
              
              {!isCorrect && selectedAnswer && !showHint && (
                <div className="mt-8 flex items-center gap-2 group/btn">
                  <span className="font-label uppercase text-sm font-bold tracking-widest">Mở kho tàng</span>
                  <span className="material-symbols-outlined group-hover/btn:translate-x-2 transition-transform">arrow_forward_ios</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Stage4;
