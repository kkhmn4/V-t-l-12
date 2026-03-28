import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { logMistake, logHelpRequest } from '../../lib/db';
import { useNavigate } from 'react-router-dom';
import { getAIHint } from '../../lib/ai';
import TrueFalseQuestion from './TrueFalseQuestion';
import ForceVectorTask from './ForceVectorTask';

const Stage1 = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [aiHint, setAiHint] = useState<string>('');
  const [loadingHint, setLoadingHint] = useState(false);
  const [tfCompleted, setTfCompleted] = useState(false);
  const [forceTaskCompleted, setForceTaskCompleted] = useState(false);

  const question = "Bản chất hạt alpha là hạt nhân của nguyên tố nào?";
  const options = [
    { id: 'A', text: 'Helium' },
    { id: 'B', text: 'Hydrogen' },
    { id: 'C', text: 'Nitrogen' },
    { id: 'D', text: 'Lithium' }
  ];

  const tfStatements = [
    { id: 'a', text: 'Phần lớn thể tích của nguyên tử vàng là khoảng trống.', isTrue: true },
    { id: 'b', text: 'Lực làm lệch hướng hạt alpha là lực hấp dẫn giữa hai khối lượng.', isTrue: false },
    { id: 'c', text: 'Kích thước của hạt nhân lớn hơn nhiều so với kích thước nguyên tử.', isTrue: false },
    { id: 'd', text: 'Hạt nhân vàng tập trung hầu hết khối lượng của nguyên tử.', isTrue: true }
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

  const handleTfComplete = (success: boolean) => {
    setTfCompleted(success);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Hero Visual Section */}
      <section className="relative w-full bg-gradient-to-br from-[#000c24] to-primary/20 rounded-3xl mx-4 lg:mx-0 mt-6 shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between p-8 lg:p-12 gap-12">
          {/* Left: Title & Description */}
          <div className="relative z-10 flex flex-col lg:w-1/2 text-white">
            <span className="text-white/60 text-sm font-label uppercase tracking-[0.3em] mb-4">Chặng 1</span>
            <h1 className="text-4xl lg:text-5xl font-extrabold font-headline tracking-tight mb-6">Thí nghiệm tán xạ alpha</h1>
            <p className="text-lg text-white/80 leading-relaxed mb-8">
              Khám phá thí nghiệm lịch sử của Ernest Rutherford đã làm thay đổi hoàn toàn quan niệm của chúng ta về cấu trúc nguyên tử, chứng minh sự tồn tại của hạt nhân.
            </p>
            <div className="flex items-center gap-4 text-sm text-white/60 bg-white/5 p-4 rounded-xl border border-white/10 w-fit">
              <span className="material-symbols-outlined text-primary">info</span>
              <span>Xem video mô phỏng để hiểu rõ quá trình tán xạ</span>
            </div>
          </div>
          
          {/* Right: YouTube Video */}
          <div className="w-full lg:w-1/2 aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-white/10 bg-black/20">
            <iframe 
              className="w-full h-full" 
              src="https://www.youtube.com/embed/kBgIMRV895w" 
              title="Rutherford Scattering Experiment" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              referrerPolicy="no-referrer"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Section 2: Learning Task */}
      <section className="px-4 lg:px-12 -mt-8 relative z-30">
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
              <label className="block font-label text-sm font-semibold text-secondary uppercase tracking-wider">Nhiệm vụ 2: Bản chất lực tương tác</label>
              <div className="text-base text-on-surface-variant leading-relaxed bg-primary/5 p-4 rounded-xl border border-primary/10">
                <p className="mb-2">Hạt <span className="font-bold text-primary">α</span> mang điện tích dương (+2e), hạt nhân Vàng cũng mang điện dương rất lớn (+79e).</p>
                <p>Sự lệch hướng đột ngột của hạt α khi tiến gần hạt nhân chính là do <strong>lực đẩy tĩnh điện Coulomb</strong>. Lực này tỉ lệ nghịch với bình phương khoảng cách, nên khi tiến càng gần, lực đẩy càng mạnh khiến hạt bị bật ngược trở lại.</p>
              </div>
              <ForceVectorTask onComplete={(correct) => setForceTaskCompleted(correct)} />
            </div>
          </div>

          {/* Right Column: Application */}
          <div className="space-y-10 bg-surface-container-low/50 p-8 rounded-xl">
            <div>
              <span className="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold font-label uppercase tracking-widest rounded-full mb-4">Phần 1: Trắc nghiệm 4 lựa chọn</span>
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

            <div className="pt-8 border-t border-outline-variant/20">
              <span className="inline-block py-1 px-3 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold font-label uppercase tracking-widest rounded-full mb-4">Phần 2: Trắc nghiệm Đúng/Sai</span>
              <TrueFalseQuestion 
                question="Cho đoạn thông tin về kết quả thí nghiệm tán xạ α. Xác định tính Đúng/Sai của các phát biểu sau:"
                statements={tfStatements}
                onComplete={handleTfComplete}
              />
            </div>

            {isCorrect && tfCompleted && forceTaskCompleted && (
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
            {(!isCorrect || !tfCompleted || !forceTaskCompleted) && (
              <div className="mt-8 p-4 bg-surface-container-low rounded-xl text-center">
                <p className="text-sm text-on-surface-variant">
                  * Hoàn thành tất cả các nhiệm vụ và câu hỏi để mở khóa chặng tiếp theo
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Stage1;
