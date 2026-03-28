import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { logMistake, logHelpRequest } from '../../lib/db';
import { useNavigate } from 'react-router-dom';
import { getAIHint } from '../../lib/ai';

const Stage3 = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [aiHint, setAiHint] = useState<string>('');
  const [loadingHint, setLoadingHint] = useState(false);

  const question = "Lực hạt nhân có bản chất là:";
  const options = [
    { id: 'A', text: 'Lực tĩnh điện' },
    { id: 'B', text: 'Lực hấp dẫn' },
    { id: 'C', text: 'Lực tương tác mạnh' }
  ];

  const handleAnswer = async (answer: string) => {
    setSelectedAnswer(answer);
    setShowHint(false);
    setAiHint('');
    if (answer === 'C') {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
      if (user) {
        await logMistake(user.uid, {
          question_id: 'stage3_q1',
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
      const correctText = options.find(o => o.id === 'C')?.text || '';
      const hint = await getAIHint(question, correctText, wrongText);
      setAiHint(hint || 'Không thể lấy gợi ý lúc này.');
    }
    setLoadingHint(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Hero Visual Section */}
      <section className="relative w-full bg-gradient-to-br from-tertiary to-secondary rounded-3xl mx-4 lg:mx-0 mt-6 shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between p-8 lg:p-12 gap-12">
          {/* Left: Size Comparison & Force Visualization */}
          <div className="relative z-10 flex flex-col items-center lg:w-1/2">
            <div className="flex items-center justify-between w-full mb-12">
              {/* Atom Size */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-white/30 border-dashed flex items-center justify-center relative">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="absolute -bottom-8 text-white/80 font-mono text-xs sm:text-sm">~ 10⁻¹⁰ m</div>
                </div>
                <span className="text-white font-bold mt-10 text-sm sm:text-base">Nguyên tử</span>
              </div>
              
              {/* Zoom Indicator */}
              <div className="flex-1 flex flex-col items-center px-4 sm:px-8">
                <span className="material-symbols-outlined text-white/50 text-2xl sm:text-4xl mb-2">zoom_in</span>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                <span className="text-white/80 font-label text-[10px] sm:text-xs uppercase tracking-widest mt-2 text-center">Phóng to 10,000 lần</span>
              </div>

              {/* Nucleus Size */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center relative shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full"></div>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-surface-container-highest rounded-full"></div>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full"></div>
                  </div>
                  <div className="absolute -bottom-8 text-white/80 font-mono text-xs sm:text-sm">~ 10⁻¹⁵ m</div>
                </div>
                <span className="text-white font-bold mt-10 text-sm sm:text-base">Hạt nhân</span>
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-white font-headline font-extrabold text-3xl sm:text-4xl tracking-tight">Chặng 3: Kích thước & Lực</h1>
              <p className="text-white/80 font-body text-base sm:text-lg mt-2 italic">Sức mạnh tiềm ẩn trong không gian siêu nhỏ</p>
            </div>
          </div>

          {/* Right: YouTube Video */}
          <div className="w-full lg:w-1/2 aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-white/10 bg-black/20">
            <iframe 
              className="w-full h-full" 
              src="https://www.youtube.com/embed/B_zD3NxUMCE" 
              title="Lực hạt nhân" 
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
          
          {/* Interactive Force Balance */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined">compare_arrows</span>
              </span>
              <h3 className="text-2xl font-headline font-bold text-secondary">Cuộc chiến các lực</h3>
            </div>
            
            <div className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant/20">
              <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                {/* Electrostatic Repulsion */}
                <div className="flex flex-col items-center text-center max-w-xs">
                  <div className="w-20 h-20 rounded-full bg-error-container text-error flex items-center justify-center mb-4 shadow-lg">
                    <span className="material-symbols-outlined text-4xl">electric_bolt</span>
                  </div>
                  <h4 className="font-bold text-on-surface mb-2">Lực tĩnh điện</h4>
                  <p className="text-sm text-on-surface-variant">Đẩy các proton ra xa nhau vì chúng cùng mang điện dương.</p>
                </div>

                {/* VS */}
                <div className="text-4xl font-headline font-black text-outline-variant italic">VS</div>

                {/* Strong Nuclear Force */}
                <div className="flex flex-col items-center text-center max-w-xs">
                  <div className="w-24 h-24 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center mb-4 shadow-xl ring-8 ring-tertiary/20">
                    <span className="material-symbols-outlined text-5xl">link</span>
                  </div>
                  <h4 className="font-bold text-on-surface mb-2 text-lg">Lực hạt nhân</h4>
                  <p className="text-sm text-on-surface-variant">Lực hút cực mạnh giữ các nucleon lại với nhau, chiến thắng lực đẩy tĩnh điện.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Grid for Knowledge */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Knowledge Check Card */}
            <div className="lg:col-span-2 p-8 bg-surface-container-high rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-9xl">science</span>
              </div>
              <h4 className="text-xl font-headline font-bold text-secondary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">quiz</span>
                Kiểm tra kiến thức
              </h4>
              
              <div className="space-y-6">
                <p className="font-bold text-secondary text-lg">{question}</p>
                <div className="grid grid-cols-1 gap-3">
                  {options.map((option) => {
                    const isSelected = selectedAnswer === option.id;
                    const isCorrectOption = option.id === 'C';
                    
                    let labelStyle = "bg-white/50 border-transparent hover:border-tertiary/20 hover:bg-white";
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
                          name="force" 
                          className="w-5 h-5 text-tertiary border-outline focus:ring-tertiary"
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

              {isCorrect && (
                <div className="mt-8 flex justify-end animate-in fade-in">
                  <button 
                    onClick={() => navigate('/learn/stage-4')}
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

export default Stage3;
