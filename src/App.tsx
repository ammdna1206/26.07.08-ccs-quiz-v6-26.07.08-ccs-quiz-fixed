import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileSignature, Send } from "lucide-react";

import Header from "./components/Header";
import Navigator from "./components/Navigator";
import QuestionCard from "./components/QuestionCard";
import ReportModal from "./components/ReportModal";
import ConfirmModal from "./components/ConfirmModal";

import { questionDatabase } from "./data/questions";
import { Question, ExamMode, ExamRange } from "./types";

export default function App() {
  const [examRange, setExamRange] = useState<ExamRange>("A");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: any }>({});
  const [markedQuestions, setMarkedQuestions] = useState<{ [key: string]: boolean }>({});
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(true);
  const [examMode, setExamMode] = useState<ExamMode>("study");
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Modal States
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    title: string;
    message: string;
    confirmMode: boolean;
    onConfirm?: () => void;
  }>({
    title: "",
    message: "",
    confirmMode: false,
  });

  // Dark Mode side-effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Load range questions
  useEffect(() => {
    let list: Question[] = [];
    if (examRange === "A") {
      list = JSON.parse(JSON.stringify(questionDatabase.A));
    } else if (examRange === "B") {
      list = JSON.parse(JSON.stringify(questionDatabase.B));
    } else {
      // ALL: merge both
      const partA: Question[] = JSON.parse(JSON.stringify(questionDatabase.A));
      const partB: Question[] = JSON.parse(JSON.stringify(questionDatabase.B));
      partA.forEach((q) => (q.source = "A"));
      partB.forEach((q) => {
        q.source = "B";
        q.id = q.id + 45; // Avoid ID collision
      });
      list = [...partA, ...partB];
    }
    setQuestions(list);
    setCurrentIndex(0);
    setShowExplanation(false);
  }, [examRange]);

  // Timer side-effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);

  // Helper function to check answers
  const checkIsCorrect = (q: Question, ans: any): boolean => {
    if (ans === undefined) return false;

    if (q.type === "single") {
      return ans === q.answer;
    } else if (q.type === "multiple") {
      if (!Array.isArray(ans) || !Array.isArray(q.answer)) return false;
      const sortedAns = [...ans].sort();
      const sortedGold = [...(q.answer as number[])].sort();
      return (
        sortedAns.length === sortedGold.length &&
        sortedAns.every((val, i) => val === sortedGold[i])
      );
    } else if (q.type === "tf") {
      if (typeof ans !== "object" || ans === null) return false;
      const gold = q.answer as { [key: number]: string };
      return Object.keys(gold).every((k) => ans[Number(k)] === gold[Number(k)]);
    } else if (q.type === "sort") {
      if (!Array.isArray(ans) || !Array.isArray(q.answer)) return false;
      return ans.length === q.answer.length && ans.every((val, i) => val === q.answer[i]);
    } else if (q.type === "matching") {
      if (typeof ans !== "object" || ans === null) return false;
      const gold = q.answer as { [key: number]: number };
      return Object.keys(gold).every((k) => ans[Number(k)] === gold[Number(k)]);
    }
    return false;
  };

  // Safe navigation alert
  const handleExamRangeChange = (nextRange: ExamRange) => {
    if (examMode === "exam" && Object.keys(userAnswers).length > 0) {
      setConfirmModalConfig({
        title: "確定切換試題範圍？",
        message: "切換題庫範圍會重置當前所有答題紀錄與計時器，是否確認？",
        confirmMode: true,
        onConfirm: () => {
          setUserAnswers({});
          setMarkedQuestions({});
          setTimerSeconds(0);
          setExamRange(nextRange);
        },
      });
      setConfirmModalOpen(true);
    } else {
      setExamRange(nextRange);
    }
  };

  const handleUpdateAnswer = (answer: any) => {
    const q = questions[currentIndex];
    if (!q) return;
    const cleanId = q.id > 45 ? q.id - 45 : q.id;
    const rangePrefix = q.source || examRange;
    const key = `${rangePrefix}_${cleanId}`;

    setUserAnswers((prev) => ({
      ...prev,
      [key]: answer,
    }));
  };

  const handleToggleMark = () => {
    const q = questions[currentIndex];
    if (!q) return;
    const cleanId = q.id > 45 ? q.id - 45 : q.id;
    const rangePrefix = q.source || examRange;
    const key = `${rangePrefix}_${cleanId}`;

    setMarkedQuestions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowExplanation(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowExplanation(false);
    }
  };

  const handleCheckAnswer = () => {
    const q = questions[currentIndex];
    if (!q) return;
    const cleanId = q.id > 45 ? q.id - 45 : q.id;
    const rangePrefix = q.source || examRange;
    const key = `${rangePrefix}_${cleanId}`;

    if (userAnswers[key] === undefined) {
      setConfirmModalConfig({
        title: "作答提示",
        message: "請先完成該題的作答，再進行答案核對！",
        confirmMode: false,
      });
      setConfirmModalOpen(true);
      return;
    }

    setShowExplanation(true);
  };

  const handleSubmitExam = () => {
    const unanswered = questions.filter((q) => {
      const cleanId = q.id > 45 ? q.id - 45 : q.id;
      const rangePrefix = q.source || examRange;
      const key = `${rangePrefix}_${cleanId}`;
      return userAnswers[key] === undefined;
    }).length;

    if (unanswered > 0) {
      setConfirmModalConfig({
        title: "確認送出試卷",
        message: `您還有 ${unanswered} 題未作答。確定要現在提交試卷進行成績結算嗎？`,
        confirmMode: true,
        onConfirm: () => {
          setTimerRunning(false);
          setReportModalOpen(true);
        },
      });
      setConfirmModalOpen(true);
    } else {
      setConfirmModalConfig({
        title: "確認送出試卷",
        message: "恭喜您完成所有試題！確定送出並查看深度診斷報告嗎？",
        confirmMode: true,
        onConfirm: () => {
          setTimerRunning(false);
          setReportModalOpen(true);
        },
      });
      setConfirmModalOpen(true);
    }
  };

  const handleRetry = () => {
    setUserAnswers({});
    setMarkedQuestions({});
    setTimerSeconds(0);
    setTimerRunning(true);
    setCurrentIndex(0);
    setShowExplanation(false);
    setReportModalOpen(false);
  };

  const handleReviewMistakes = () => {
    setReportModalOpen(false);
    setExamMode("study");
    setConfirmModalConfig({
      title: "檢視指引",
      message: "您現在可以在學習模式中，透過左側導覽盤點閱或直接使用『下一題』逐一複習答錯的題目。",
      confirmMode: false,
    });
    setConfirmModalOpen(true);
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 font-sans">
      {/* Header */}
      <Header
        timerSeconds={timerSeconds}
        timerRunning={timerRunning}
        onToggleTimer={() => setTimerRunning((prev) => !prev)}
        onResetTimer={() => setTimerSeconds(0)}
        examMode={examMode}
        onChangeExamMode={setExamMode}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 relative">
        {/* Left Side: Navigator */}
        <Navigator
          questions={questions}
          currentIndex={currentIndex}
          onSelectIndex={(idx) => {
            setCurrentIndex(idx);
            setShowExplanation(false);
          }}
          userAnswers={userAnswers}
          markedQuestions={markedQuestions}
          examRange={examRange}
          onChangeExamRange={handleExamRangeChange}
          examMode={examMode}
          checkIsCorrect={checkIsCorrect}
        />

        {/* Right Side: Question Card and Submit Panel */}
        <section className="flex-1 flex flex-col gap-6">
          {questions.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
              >
                <QuestionCard
                  question={questions[currentIndex]}
                  currentIndex={currentIndex}
                  totalQuestions={questions.length}
                  userAnswers={userAnswers}
                  onUpdateAnswer={handleUpdateAnswer}
                  markedQuestions={markedQuestions}
                  onToggleMark={handleToggleMark}
                  examMode={examMode}
                  examRange={examRange}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  showExplanation={showExplanation}
                  onCheckAnswer={handleCheckAnswer}
                />
              </motion.div>
            </AnimatePresence>
          )}

          {/* Submit Banner */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm transition-colors duration-300">
            <div className="flex items-center gap-3">
              <FileSignature className="text-indigo-600 dark:text-indigo-400 w-6 h-6 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  準備好提交您的成果了嗎？
                </h4>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  送出後，系統將結算您的準確率並自動生成強大的弱點考量分析報告。
                </p>
              </div>
            </div>
            <button
              onClick={handleSubmitExam}
              className="w-full md:w-auto px-5 py-3 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-md shadow-indigo-500/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              送出結算試卷
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-400 dark:text-slate-600 mt-auto bg-white dark:bg-slate-950 transition-colors duration-300">
        <p>© 2026 CCS 生成式 AI 核心能力國際認證培訓系統. 全功能無聲無字幕認證大師模組</p>
      </footer>

      {/* Confirm Popup Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        onClose={() => setConfirmModalOpen(false)}
        confirmMode={confirmModalConfig.confirmMode}
        onConfirm={confirmModalConfig.onConfirm}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => {
          setReportModalOpen(false);
          setTimerRunning(true);
        }}
        questions={questions}
        userAnswers={userAnswers}
        examRange={examRange}
        timerSeconds={timerSeconds}
        onRetry={handleRetry}
        onReviewMistakes={handleReviewMistakes}
        checkIsCorrect={checkIsCorrect}
      />
    </div>
  );
}
