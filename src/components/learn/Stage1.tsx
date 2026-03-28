import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { logMistake, logHelpRequest } from '../../lib/db';
import { useNavigate } from 'react-router-dom';
import { getAIHint } from '../../lib/ai';

const Stage1 = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [aiHint, setAiHint] = useState<string>('');
  const [loadingHint, setLoadingHint] = useState(false);

  const question = "Bản chất hạt alpha là hạt nhân của nguyên tố nào?";
  const options = [
    { id: 'A', text: 'Helium' },
    { id: 'B', text: 'Hydrogen' },
    { id: 'C', text: 'Nitrogen' },
    { id: 'D', text: 'Lithium' }
  ];

  const handleAnswer = async (answer: string) => {
    setSelectedAnswer(answer);
    setShowHint(false);
    setAiHint('');
    if (answer === 'A') {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
      if (user) {
        await logMistake(user.uid, {
          question_id: 'stage1_q1',
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

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Section 1: Visual Simulation */}
      <section className="relative h-[614px] bg-[#000c24] overflow-hidden flex flex-col items-center justify-center rounded-3xl mx-4 lg:mx-0 mt-6 shadow-2xl">
        {/* Chamber Aesthetics */}
        <div className="absolute inset-0 particle-stream opacity-10"></div>
        <div className="absolute top-8 left-12 flex flex-col gap-2">
          <span className="text-white/40 text-xs font-label uppercase tracking-[0.3em]">Chặng 1</span>
          <h1 className="text-white text-4xl font-extrabold font-headline tracking-tight">Thí nghiệm tán xạ alpha</h1>
        </div>

        {/* Simulation Stage */}
        <div className="relative w-full max-w-5xl h-64 flex items-center justify-between px-20">
          {/* Alpha Source */}
          <div className="relative flex flex-col items-center">
            <div className="w-16 h-16 bg-surface-variant/20 rounded-lg border border-white/10 flex items-center justify-center relative z-10 backdrop-blur-md">
              <div className="w-8 h-8 bg-primary rounded-full blur-sm animate-pulse"></div>
              <div className="w-4 h-4 bg-white rounded-full absolute"></div>
            </div>
            <span className="text-white/60 text-[10px] mt-2 font-label uppercase tracking-widest">Alpha Source (He2+)</span>
          </div>

          {/* Particle Beams */}
          <div className="flex-1 h-px bg-gradient-to-r from-primary/50 via-primary to-transparent relative mx-4">
            <div className="absolute top-[-4px] left-0 w-2 h-2 bg-primary-fixed-dim rounded-full shadow-[0_0_8px_#ffb5a0] translate-x-10"></div>
            <div className="absolute top-[-4px] left-0 w-2 h-2 bg-primary-fixed-dim rounded-full shadow-[0_0_8px_#ffb5a0] translate-x-40"></div>
            <div className="absolute top-[-4px] left-0 w-2 h-2 bg-primary-fixed-dim rounded-full shadow-[0_0_8px_#ffb5a0] translate-x-80"></div>
          </div>

          {/* Gold Foil */}
          <div className="relative flex flex-col items-center">
            <div className="w-2 h-40 bg-gradient-to-b from-[#ffd700]/20 via-[#ffd700] to-[#ffd700]/20 rounded-full shadow-[0_0_20px_#7e5300] relative z-20"></div>
            <span className="text-[#ffd700] text-[10px] mt-2 font-label uppercase tracking-widest">Lá vàng (Gold Foil)</span>
            {/* Deflected Particle Path */}
            <svg className="absolute top-1/2 left-0 w-32 h-32 -translate-y-1/2 -translate-x-full overflow-visible pointer-events-none">
              <path className="opacity-80" d="M 0 64 L 110 64 Q 128 64 120 20" fill="none" stroke="#ad2c00" strokeDasharray="4 4" strokeWidth="2"></path>
            </svg>
          </div>

          {/* Detector Screen */}
          <div className="w-4 h-52 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
            <div className="w-1 h-4 bg-primary/40 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Section 2: Learning Task */}
      <section className="px-4 lg:px-12 -mt-20 relative z-30">
        <div className="max-w-6xl mx-auto bg-surface-container-lowest rounded-xl shadow-[0_64px_128px_rgba(0,12,36,0.08)] p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Column: Interaction */}
          <div className="space-y-10">
            <div>
              <h3 className="text-secondary font-headline text-2xl font-bold mb-4">Quan sát & Phân tích</h3>
              <p className="text-on-surface-variant text-lg leading-relaxed">Dựa trên mô phỏng thí nghiệm của Rutherford phía trên, hãy thực hiện các nhiệm vụ sau.</p>
            </div>

            <div className="space-y-6">
              <label className="block font-label text-sm font-semibold text-secondary uppercase tracking-wider">Nhiệm vụ 1: Chọn đồ thị đúng</label>
              <p className="text-sm text-on-surface-variant italic -mt-4">Hãy chọn hình minh họa biểu diễn chính xác quỹ đạo của các hạt alpha khi va chạm với lá vàng.</p>
              <div className="grid grid-cols-2 gap-6">
                {/* Option A */}
                <div className="group relative aspect-video bg-surface-container rounded-lg p-6 border-2 border-transparent hover:border-primary/30 cursor-pointer transition-all">
                  <svg className="w-full h-full" viewBox="0 0 200 120">
                    <circle cx="100" cy="60" fill="#7e5300" r="12"></circle>
                    <path d="M 0 30 L 180 30" fill="none" opacity="0.4" stroke="#ad2c00" strokeWidth="2"></path>
                    <path d="M 0 60 L 80 60 Q 95 60 85 20" fill="none" stroke="#ad2c00" strokeWidth="2"></path>
                    <path d="M 0 90 L 180 90" fill="none" opacity="0.4" stroke="#ad2c00" strokeWidth="2"></path>
                  </svg>
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                  <span className="absolute bottom-3 right-3 text-[10px] font-bold text-primary font-label">MÔ HÌNH A</span>
                </div>
                {/* Option B */}
                <div className="group relative aspect-video bg-surface-container rounded-lg p-6 border-2 border-transparent hover:border-primary/30 cursor-pointer transition-all">
                  <svg className="w-full h-full" viewBox="0 0 200 120">
                    <circle cx="100" cy="60" fill="#7e5300" r="12"></circle>
                    <path d="M 0 30 L 200 30" fill="none" opacity="0.4" stroke="#ad2c00" strokeWidth="2"></path>
                    <path d="M 0 60 L 200 60" fill="none" opacity="0.4" stroke="#ad2c00" strokeWidth="2"></path>
                    <path d="M 0 90 L 200 90" fill="none" opacity="0.4" stroke="#ad2c00" strokeWidth="2"></path>
                  </svg>
                  <span className="absolute bottom-3 right-3 text-[10px] font-bold text-secondary font-label">MÔ HÌNH B</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-outline-variant/10">
              <label className="block font-label text-sm font-semibold text-secondary uppercase tracking-wider">Nhiệm vụ 2: Kiểm tra kiến thức</label>
              <div className="text-lg text-on-surface flex flex-wrap items-center gap-x-2 leading-loose">
                Hiện tượng lệch hướng chuyển động của hạt alpha khi đến gần hạt nhân vàng gọi là hiện tượng
                <input type="text" placeholder="..." className="border-b-2 border-primary/20 bg-transparent px-2 w-32 text-center focus:border-primary focus:ring-0 transition-all font-bold text-primary outline-none" />
              </div>
            </div>
          </div>

          {/* Right Column: Application */}
          <div className="space-y-10 bg-surface-container-low/50 p-8 rounded-xl">
            <div>
              <span className="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold font-label uppercase tracking-widest rounded-full mb-4">Câu hỏi ứng dụng</span>
              <h3 className="text-2xl text-secondary font-bold leading-tight">{question}</h3>
            </div>

            <div className="space-y-4">
              {options.map((option) => {
                const isSelected = selectedAnswer === option.id;
                const isCorrectOption = option.id === 'A';
                
                let buttonStyle = "bg-white border-transparent hover:border-primary/10";
                let iconStyle = "opacity-0";
                let iconName = "check_circle";

                if (isSelected) {
                  if (isCorrect) {
                    buttonStyle = "bg-green-50 border-green-500 text-green-800";
                    iconStyle = "opacity-100 text-green-600";
                  } else {
                    buttonStyle = "bg-red-50 border-red-500 text-red-800";
                    iconStyle = "opacity-100 text-red-600";
                    iconName = "cancel";
                  }
                } else if (selectedAnswer && isCorrectOption) {
                  // Show correct answer if they got it wrong
                  buttonStyle = "bg-green-50 border-green-500 text-green-800";
                  iconStyle = "opacity-100 text-green-600";
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    disabled={isCorrect === true}
                    className={`w-full text-left p-6 rounded-xl shadow-[0_4px_12px_rgba(0,12,36,0.02)] hover:shadow-[0_8px_24px_rgba(0,12,36,0.04)] border group transition-all flex justify-between items-center ${buttonStyle}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-colors ${isSelected ? 'bg-white/50' : 'bg-surface-container text-secondary group-hover:bg-primary/10 group-hover:text-primary'}`}>
                        {option.id}
                      </span>
                      <span className="font-medium text-lg">{option.text}</span>
                    </div>
                    <span className={`material-symbols-outlined transition-opacity ${iconStyle}`}>{iconName}</span>
                  </button>
                );
              })}
            </div>

            {/* Hint / Editorial Insight */}
            {!isCorrect && selectedAnswer && !showHint && (
              <button onClick={handleHint} className="w-full p-4 bg-tertiary-container text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-tertiary transition-colors">
                <span className="material-symbols-outlined">smart_toy</span>
                Gem Gợi ý
              </button>
            )}

            {showHint && (
              <div className="bg-primary/5 rounded-xl p-6 flex gap-4 animate-in fade-in zoom-in">
                {loadingHint ? (
                  <span className="material-symbols-outlined text-primary animate-spin">refresh</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      <strong className="text-primary">Gợi ý:</strong> {aiHint}
                    </p>
                  </>
                )}
              </div>
            )}

            {isCorrect && (
              <div className="mt-8 flex justify-end animate-in fade-in">
                <button 
                  onClick={() => navigate('/learn/stage-2')}
                  className="px-8 py-3 bg-[#ad2c00] text-white rounded-full font-label text-xs uppercase tracking-widest font-bold shadow-xl hover:translate-y-[-2px] transition-all flex items-center gap-2"
                >
                  Chặng kế tiếp: Cấu trúc hạt nhân
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 3: Signature Stats Section */}
      <section className="px-4 lg:px-12 py-24 bg-surface max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
        <div className="w-full md:w-1/2">
          <div className="relative">
            <iframe 
              className="w-full h-80 rounded-xl shadow-xl" 
              src="https://www.youtube.com/embed/kBgIMRV895w" 
              title="Rutherford Scattering Experiment" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
            <div className="absolute -bottom-10 -right-10 bg-primary-container p-8 rounded-xl shadow-2xl text-white max-w-xs hidden md:block">
              <p className="text-xs font-label uppercase tracking-widest mb-2 opacity-80">Rutherford's Legacy</p>
              <p className="text-sm italic leading-relaxed">"Nó giống như việc bạn bắn một viên đạn 15 inch vào một mảnh giấy mỏng và nó quay lại bắn trúng bạn."</p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 space-y-8">
          <div className="space-y-2">
            <span className="text-primary font-headline text-6xl font-extrabold tracking-tighter">99.9%</span>
            <p className="text-secondary font-headline text-2xl font-bold">Số lượng hạt đi thẳng</p>
            <p className="text-on-surface-variant text-base max-w-sm">Hầu hết các hạt alpha đi xuyên qua lá vàng mà không bị lệch hướng, chứng tỏ nguyên tử có cấu tạo rỗng.</p>
          </div>
          <div className="space-y-2">
            <span className="text-tertiary font-headline text-6xl font-extrabold tracking-tighter">1/8000</span>
            <p className="text-secondary font-headline text-2xl font-bold">Hạt bị bật ngược lại</p>
            <p className="text-on-surface-variant text-base max-w-sm">Tỷ lệ cực nhỏ các hạt bị tán xạ với góc lớn hơn 90 độ chứng tỏ sự tồn tại của một hạt nhân nhỏ bé nhưng cực kỳ đặc.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Stage1;
