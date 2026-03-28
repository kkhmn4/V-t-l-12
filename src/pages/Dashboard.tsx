import React, { useEffect, useState } from 'react';
import { getAllStudentProgress, ProgressData } from '../lib/db';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../lib/firebase';
import { LogOut, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [students, setStudents] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllStudentProgress();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalStudents = students.length;
  const avgTime = totalStudents > 0 ? students.reduce((acc, curr) => acc + curr.time_spent, 0) / totalStudents : 0;
  const completedStudents = students.filter(s => s.is_completed).length;
  const completionRate = totalStudents > 0 ? (completedStudents / totalStudents) * 100 : 0;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}p ${s}s`;
  };

  return (
    <div className="min-h-screen bg-[#fbf9f8] text-[#1a1a1a] font-sans">
      <header className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#000c24]">Tổng quan Lớp học</h1>
          <p className="text-sm text-gray-500">Giáo viên: {user?.email}</p>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Tổng số học sinh</p>
              <p className="text-2xl font-bold">{totalStudents}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex items-center gap-4">
            <div className="p-4 bg-orange-50 text-orange-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Thời gian TB</p>
              <p className="text-2xl font-bold">{formatTime(avgTime)}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex items-center gap-4">
            <div className="p-4 bg-green-50 text-green-600 rounded-xl">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Tỷ lệ hoàn thành</p>
              <p className="text-2xl font-bold">{completionRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 font-medium text-gray-500 text-sm">
            <div className="col-span-3">Học sinh</div>
            <div className="col-span-3">Tiến độ</div>
            <div className="col-span-2">Thời gian</div>
            <div className="col-span-3">Mức độ nhận thức</div>
            <div className="col-span-1 text-center">Cảnh báo</div>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Chưa có dữ liệu học sinh.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {students.map((student) => {
                const needsWarning = student.mistakes.length > 3 || student.time_spent < 60 || student.time_spent > 3600;
                return (
                  <div key={student.student_id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="col-span-3 font-medium text-[#000c24]">
                      {student.student_name}
                      <div className="text-xs text-gray-500 font-normal">{student.student_email}</div>
                    </div>
                    <div className="col-span-3 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${student.is_completed ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: student.is_completed ? '100%' : '50%' }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{student.is_completed ? 'Hoàn thành' : 'Đang học'}</span>
                    </div>
                    <div className="col-span-2 text-sm text-gray-600">
                      {formatTime(student.time_spent)}
                    </div>
                    <div className="col-span-3 flex gap-2">
                      <div className="px-2 py-1 bg-gray-100 rounded text-xs" title="Biết">B: {student.knowledge_levels.biet}%</div>
                      <div className="px-2 py-1 bg-gray-100 rounded text-xs" title="Hiểu">H: {student.knowledge_levels.hieu}%</div>
                      <div className="px-2 py-1 bg-gray-100 rounded text-xs" title="Vận dụng">V: {student.knowledge_levels.van_dung}%</div>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      {needsWarning && <AlertCircle className="w-5 h-5 text-[#fe5e2f]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
