import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { logMistake, logHelpRequest } from '../../lib/db';
import { useNavigate } from 'react-router-dom';
import { getAIHint } from '../../lib/ai';
import ShortAnswerQuestion from './ShortAnswerQuestion';

const Stage2 = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [aiHint, setAiHint] = useState<string>('');
  const [loadingHint, setLoadingHint] = useState(false);
  const [saCompleted, setSaCompleted] = useState(false);

  // Matching Game State
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [connections, setConnections] = useState<Record<string, string>>({});

  const leftItems = [
    { id: 'Z', label: 'Z', desc: 'Số hiệu nguyên tử' },
    { id: 'A', label: 'A', desc: 'Số khối' },
    { id: 'A-Z', label: 'A - Z', desc: 'Hiệu số khối' }
  ];

  const rightItems = [
    { id: 'neutron', label: 'Số neutron' },
    { id: 'proton', label: 'Số proton' },
    { id: 'nucleon', label: 'Tổng số nucleon' }
  ];

  const correctConnections = {
    'Z': 'proton',
    'A': 'nucleon',
    'A-Z': 'neutron'
  };

  const handleLeftClick = (id: string) => {
    if (connections[id]) return;
    setSelectedLeft(id === selectedLeft ? null : id);
  };

  const handleRightClick = (id: string) => {
    if (!selectedLeft) return;
    if (Object.values(connections).includes(id)) return;
    
    if (correctConnections[selectedLeft as keyof typeof correctConnections] === id) {
      setConnections(prev => ({ ...prev, [selectedLeft]: id }));
      setSelectedLeft(null);
    } else {
      setSelectedLeft(null);
    }
  };

  const isMatchingComplete = Object.keys(connections).length === 3;

  const question = "Hạt nhân nguyên tử gồm:";
  const options = [
    { id: 'A', text: 'Electron & Proton' },
    { id: 'B', text: 'Neutron & Proton' },
    { id: 'C', text: 'Neutron & Electron' }
  ];

  const handleAnswer = async (answer: string) => {
    setSelectedAnswer(answer);
    setShowHint(false);
    setAiHint('');
    if (answer === 'B') {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
      if (user) {
        await logMistake(user.uid, {
          question_id: 'stage2_q1',
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
      const correctText = options.find(o => o.id === 'B')?.text || '';
      const hint = await getAIHint(question, correctText, wrongText);
      setAiHint(hint || 'Không thể lấy gợi ý lúc này.');
    }
    setLoadingHint(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Hero Visual Section */}
      <section className="relative w-full bg-gradient-to-br from-secondary to-primary rounded-3xl mx-4 lg:mx-0 mt-6 shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between p-8 lg:p-12 gap-12">
          {/* Left: Nucleus Model Visualization */}
          <div className="relative z-10 flex flex-col items-center lg:w-1/2">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute w-full h-full border border-white/10 rounded-full animate-pulse"></div>
              <div className="grid grid-cols-3 gap-1 p-8 bg-white/5 backdrop-blur-md rounded-full shadow-2xl">
                {/* Protons */}
                <div className="w-10 h-10 bg-primary rounded-full shadow-lg shadow-primary/50 flex items-center justify-center text-white font-bold text-xs ring-4 ring-white/20">+</div>
                <div className="w-12 h-12 bg-primary rounded-full shadow-lg shadow-primary/50 flex items-center justify-center text-white font-bold text-sm ring-4 ring-white/20 translate-y-4">+</div>
                <div className="w-10 h-10 bg-primary rounded-full shadow-lg shadow-primary/50 flex items-center justify-center text-white font-bold text-xs ring-4 ring-white/20">+</div>
                {/* Neutrons */}
                <div className="w-11 h-11 bg-surface-container-highest rounded-full shadow-lg flex items-center justify-center text-secondary font-bold text-sm translate-x-4">n</div>
                <div className="w-10 h-10 bg-surface-container-highest rounded-full shadow-lg flex items-center justify-center text-secondary font-bold text-xs -translate-y-2">n</div>
                <div className="w-12 h-12 bg-surface-container-highest rounded-full shadow-lg flex items-center justify-center text-secondary font-bold text-sm -translate-x-2">n</div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <h1 className="text-white font-headline font-extrabold text-4xl tracking-tight">Chặng 2: Cấu trúc & Kí hiệu</h1>
              <p className="text-white/80 font-body text-lg mt-2 italic">Khám phá trái tim của nguyên tử</p>
            </div>
          </div>
          
          {/* Right: YouTube Video */}
          <div className="w-full lg:w-1/2 aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-white/10 bg-black/20">
            <iframe 
              className="w-full h-full" 
              src="https://www.youtube.com/embed/lP57gEWcisY" 
              title="Cấu trúc hạt nhân nguyên tử" 
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
          
          {/* Matching UI Section */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">join_inner</span>
              </span>
              <h3 className="text-2xl font-headline font-bold text-secondary">Thử thách Kết nối</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
              {/* Left Column */}
              <div className="space-y-4">
                {leftItems.map((item) => {
                  const isConnected = !!connections[item.id];
                  const isSelected = selectedLeft === item.id;
                  return (
                    <div 
                      key={item.id}
                      onClick={() => handleLeftClick(item.id)}
                      className={`p-6 rounded-lg border-2 transition-all cursor-pointer flex justify-between items-center group ${
                        isConnected ? 'bg-green-50 border-green-500' : 
                        isSelected ? 'bg-primary/10 border-primary' : 
                        'bg-surface-container-low border-transparent hover:border-primary/50'
                      }`}
                    >
                      <span className={`text-3xl font-bold font-headline ${isConnected ? 'text-green-700' : 'text-primary'}`}>{item.label}</span>
                      <span className={`font-medium ${isConnected ? 'text-green-700' : 'text-secondary'}`}>{item.desc}</span>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        isConnected ? 'bg-green-500 border-green-500' : 
                        isSelected ? 'bg-primary border-primary ring-4 ring-primary/20' : 
                        'border-primary group-hover:bg-primary/50'
                      }`}></div>
                    </div>
                  );
                })}
              </div>
              {/* Right Column */}
              <div className="space-y-4">
                {rightItems.map((item) => {
                  const connectedLeftId = Object.keys(connections).find(key => connections[key] === item.id);
                  const isConnected = !!connectedLeftId;
                  
                  return (
                    <div 
                      key={item.id}
                      onClick={() => handleRightClick(item.id)}
                      className={`p-6 rounded-lg border-2 transition-all cursor-pointer flex justify-between items-center group ${
                        isConnected ? 'bg-green-50 border-green-500' : 
                        selectedLeft ? 'bg-surface-container-low border-primary/30 hover:border-primary hover:bg-primary/5' :
                        'bg-surface-container-low border-transparent opacity-70'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        isConnected ? 'bg-green-500 border-green-500' : 
                        selectedLeft ? 'border-primary group-hover:bg-primary/50' :
                        'border-outline'
                      }`}></div>
                      <span className={`font-medium ${isConnected ? 'text-green-700 font-bold' : 'text-secondary'}`}>
                        {isConnected ? `${connectedLeftId} - ${item.label}` : item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              {isMatchingComplete && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center animate-in fade-in z-10">
                  <div className="bg-green-100 text-green-800 px-8 py-4 rounded-full font-bold text-xl flex items-center gap-3 shadow-xl">
                    <span className="material-symbols-outlined text-3xl">task_alt</span>
                    Tuyệt vời! Bạn đã nối đúng tất cả.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Unit Conversion Section */}
          <div className="mb-16 p-6 bg-primary/5 border border-primary/20 rounded-xl">
            <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">calculate</span>
              Đơn vị khối lượng nguyên tử (amu)
            </h4>
            <p className="text-on-surface-variant mb-2">
              Trong vật lý hạt nhân, khối lượng thường được đo bằng đơn vị khối lượng nguyên tử (kí hiệu là amu hoặc u).
            </p>
            <div className="bg-white p-4 rounded-lg border border-outline-variant font-mono text-center text-lg text-primary font-bold">
              1 amu ≈ 1,6605 × 10<sup>-27</sup> kg
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-on-surface-variant">
              <div className="bg-white p-3 rounded border border-outline-variant">
                Khối lượng proton (m<sub>p</sub>) ≈ 1,00728 amu
              </div>
              <div className="bg-white p-3 rounded border border-outline-variant">
                Khối lượng neutron (m<sub>n</sub>) ≈ 1,00866 amu
              </div>
            </div>
          </div>

          {/* Bento Grid for Knowledge & Application */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Knowledge Check Card */}
            <div className="lg:col-span-2 space-y-8">
              <div className="p-8 bg-surface-container-high rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-9xl">menu_book</span>
                </div>
                <h4 className="text-xl font-headline font-bold text-secondary mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined">quiz</span>
                  Kiểm tra kiến thức
                </h4>
                
                <div className="space-y-6">
                  <p className="font-bold text-secondary">{question}</p>
                  <div className="grid grid-cols-1 gap-3">
                    {options.map((option) => {
                      const isSelected = selectedAnswer === option.id;
                      const isCorrectOption = option.id === 'B';
                      
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
                            name="atom" 
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

              <ShortAnswerQuestion
                question="Tính số nguyên tử có trong 1g U235. (Cho NA = 6,022 × 10²³ mol⁻¹). Đáp án có dạng a × 10²¹, hãy điền giá trị của a (làm tròn đến 2 chữ số thập phân)."
                correctAnswer={2.56}
                tolerance={0.02}
                onComplete={(isCorrect) => {
                  if (isCorrect) {
                    setSaCompleted(true);
                  }
                }}
              />

              {isCorrect && isMatchingComplete && saCompleted && (
                <div className="mt-8 flex justify-end animate-in fade-in">
                  <button 
                    onClick={() => navigate('/learn/stage-3')}
                    className="px-8 py-3 bg-[#ad2c00] text-white rounded-full font-label text-xs uppercase tracking-widest font-bold shadow-xl hover:translate-y-[-2px] transition-all flex items-center gap-2"
                  >
                    Chặng kế tiếp
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
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

export default Stage2;
