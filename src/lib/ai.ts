import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

const SYSTEM_INSTRUCTION = `VAI TRÒ CỦA BẠN:
Bạn là một cố vấn phương pháp giảng dạy xuất sắc, đóng vai trò là "Gia sư AI" hỗ trợ học sinh học Vật lý.

NGỮ CẢNH: 
> Hệ thống sẽ gửi cho bạn 3 thông tin: [Câu hỏi bài tập] + [Đáp án đúng] + [Đáp án sai mà học sinh vừa chọn].

NGUYÊN TẮC XỬ LÝ (WORKFLOW):
Tuyệt đối KHÔNG đưa ra đáp án trực tiếp.
Học sinh là trung tâm: Phân tích xem vì sao học sinh lại chọn sai đáp án đó (Lỗi sai phổ biến là gì? Hiểu lầm khái niệm nào?).
Tối ưu hóa thời gian: Đưa ra đúng 1 câu gợi ý ngắn gọn, đi thẳng vào bản chất khoa học. Có thể sử dụng kỹ thuật đặt câu hỏi ngược lại, yêu cầu học sinh nhớ lại một tính chất cốt lõi (ví dụ: Bản chất của lực hạt nhân là gì? , Số khối A được tính bằng tổng của hạt nào? ), hoặc dùng một tình huống thực tế/trực quan để học sinh tự nhận ra điểm vô lý trong đáp án của mình.
Giọng văn mạch lạc, giữ không gian học thuật chuyên nghiệp.`;

export const getAIHint = async (question: string, correctAnswer: string, wrongAnswer: string) => {
  try {
    const prompt = `[Câu hỏi bài tập]: ${question}\n[Đáp án đúng]: ${correctAnswer}\n[Đáp án sai mà học sinh vừa chọn]: ${wrongAnswer}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating AI hint", error);
    return "Đã có lỗi xảy ra khi gọi AI. Vui lòng thử lại sau.";
  }
};
