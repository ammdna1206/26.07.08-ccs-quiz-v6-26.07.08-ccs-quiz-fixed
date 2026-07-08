import { Trophy, X, RefreshCw, AlertTriangle, CheckCircle, BookOpen } from "lucide-react";
import { Question } from "../types";

interface CategoryStat {
  correct: number;
  total: number;
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  userAnswers: { [key: string]: any };
  examRange: string;
  timerSeconds: number;
  onRetry: () => void;
  onReviewMistakes: () => void;
  checkIsCorrect: (q: Question, ans: any) => boolean;
}

export default function ReportModal({
  isOpen,
  onClose,
  questions,
  userAnswers,
  examRange,
  timerSeconds,
  onRetry,
  onReviewMistakes,
  checkIsCorrect,
}: ReportModalProps) {
  if (!isOpen) return null;

  let correctCount = 0;
  const totalCount = questions.length;

  const categories: { [key: string]: CategoryStat } = {
    "生成式人工智慧方法與方法論": { correct: 0, total: 0 },
    "基礎提示工程 (Prompt Engineering)": { correct: 0, total: 0 },
    "提示優化 (Prompt Refinement)": { correct: 0, total: 0 },
    "倫理、法律與社會影響": { correct: 0, total: 0 },
  };

  questions.forEach((q) => {
    const key = `${q.source || examRange}_${q.id > 45 ? q.id - 45 : q.id}`;
    const ans = userAnswers[key];
    const isCorrect = ans !== undefined && checkIsCorrect(q, ans);

    if (isCorrect) correctCount++;

    if (categories[q.category]) {
      categories[q.category].total++;
      if (isCorrect) {
        categories[q.category].correct++;
      }
    }
  });

  const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const isPassed = score >= 70;

  // Formatting timer
  const formatTime = (secs: number) => {
    const hrs = String(Math.floor(secs / 3600)).padStart(2, "0");
    const mins = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const seconds = String(secs % 60).padStart(2, "0");
    return `${hrs}:${mins}:${seconds}`;
  };

  const circumference = 2 * Math.PI * 64; // ~402.12
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="fixed inset-0 bg-slate-950/80 dark:bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-4xl w-full shadow-2xl flex flex-col gap-6 my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Trophy className={`w-7 h-7 ${isPassed ? "text-amber-500" : "text-slate-400"}`} />
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 select-none">
                模擬試卷結算報告
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 select-none">
                即時評估您的認證實力與落點分析
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Circular Score display */}
          <div className="bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 select-none">
              最終測驗分數
            </p>
            <div className="relative w-36 h-36 flex items-center justify-center my-2">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="64"
                  className="stroke-slate-200 dark:stroke-slate-800 fill-none"
                  strokeWidth="8"
                ></circle>
                <circle
                  cx="72"
                  cy="72"
                  r="64"
                  className={`fill-none transition-all duration-1000 ${
                    isPassed ? "stroke-emerald-500" : "stroke-indigo-500"
                  }`}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                ></circle>
              </svg>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-slate-800 dark:text-slate-100 font-mono leading-none">
                  {score}%
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full mt-1.5 font-bold uppercase select-none ${
                    isPassed
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  }`}
                >
                  {isPassed ? "合格通過" : "尚須努力"}
                </span>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 space-y-1 w-full border-t border-slate-200/50 dark:border-slate-800/50 pt-3">
              <div className="flex justify-between">
                <span className="select-none">答對題數:</span>
                <span className="font-bold text-emerald-500">{correctCount} / {totalCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="select-none">歷時時間:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">{formatTime(timerSeconds)}</span>
              </div>
            </div>
          </div>

          {/* Performance categories diagnostic */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4 bg-slate-50 dark:bg-slate-800/10 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl">
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 select-none">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              四大命題大綱落點精準診斷
            </h4>
            
            <div className="flex flex-col gap-4 mt-1">
              {Object.entries(categories).map(([catName, stat], idx) => {
                const percent = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                let colorClass = "bg-indigo-500";
                let textClass = "text-indigo-600 dark:text-indigo-400";
                if (idx === 1) {
                  colorClass = "bg-teal-500";
                  textClass = "text-teal-600 dark:text-teal-400";
                } else if (idx === 2) {
                  colorClass = "bg-violet-500";
                  textClass = "text-violet-600 dark:text-violet-400";
                } else if (idx === 3) {
                  colorClass = "bg-rose-500";
                  textClass = "text-rose-600 dark:text-rose-400";
                }

                return (
                  <div key={catName}>
                    <div className="flex justify-between text-xs mb-1 font-medium select-none">
                      <span className="text-slate-600 dark:text-slate-300">{catName}</span>
                      <span className={`${textClass} font-bold font-mono`}>
                        {percent}% <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">({stat.correct}/{stat.total})</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`${colorClass} h-2 rounded-full transition-all duration-1000`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 select-none">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center md:text-left leading-relaxed">
            合格標準一般為 <span className="font-bold text-indigo-600 dark:text-indigo-400">70%</span>。若成績未滿，建議切換為 <span className="text-indigo-600 dark:text-indigo-400 font-bold">學習模式</span> 逐題核實觀念。
          </p>
          <div className="flex gap-2.5 w-full md:w-auto">
            <button
              onClick={onRetry}
              className="flex-1 md:flex-none px-5 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              重新測試
            </button>
            <button
              onClick={onReviewMistakes}
              className="flex-1 md:flex-none px-5 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              檢視答錯題目
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
