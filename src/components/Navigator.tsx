import { useState } from "react";
import { Bookmark, LayoutGrid, CheckCircle } from "lucide-react";
import { Question, ExamRange, ExamMode } from "../types";

interface NavigatorProps {
  questions: Question[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  userAnswers: { [key: string]: any };
  markedQuestions: { [key: string]: boolean };
  examRange: ExamRange;
  onChangeExamRange: (range: ExamRange) => void;
  examMode: ExamMode;
  checkIsCorrect: (q: Question, ans: any) => boolean;
}

export default function Navigator({
  questions,
  currentIndex,
  onSelectIndex,
  userAnswers,
  markedQuestions,
  examRange,
  onChangeExamRange,
  examMode,
  checkIsCorrect,
}: NavigatorProps) {
  const [filterMode, setFilterMode] = useState<"all" | "marked">("all");

  const answeredCount = questions.filter((q) => {
    const key = `${q.source || examRange}_${q.id > 45 ? q.id - 45 : q.id}`;
    return userAnswers[key] !== undefined;
  }).length;

  const totalCount = questions.length;
  const progressPercentage = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

  // Calculate current score for Study Mode
  let correctCount = 0;
  let answeredInStudy = 0;
  questions.forEach((q) => {
    const key = `${q.source || examRange}_${q.id > 45 ? q.id - 45 : q.id}`;
    const ans = userAnswers[key];
    if (ans !== undefined) {
      answeredInStudy++;
      if (checkIsCorrect(q, ans)) {
        correctCount++;
      }
    }
  });
  const currentScore = answeredInStudy > 0 ? Math.round((correctCount / answeredInStudy) * 100) : 0;

  return (
    <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4">
      {/* Selector Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors duration-300">
        <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 select-none">
          選擇試題範圍
        </label>
        <div className="relative">
          <select
            value={examRange}
            onChange={(e) => onChangeExamRange(e.target.value as ExamRange)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 appearance-none cursor-pointer"
          >
            <option value="A">模擬試題 A (1 - 45 題)</option>
            <option value="B">模擬試題 B (1 - 45 題)</option>
            <option value="ALL">雙試題總挑戰 (1 - 90 題)</option>
          </select>
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none text-xs">
            ▼
          </span>
        </div>
      </div>

      {/* Stats Module */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col gap-3 transition-colors duration-300">
        <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider select-none">
          答題進度面板
        </h3>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium select-none">已答題數</p>
            <p className="text-lg font-bold text-slate-700 dark:text-slate-200 mt-1">
              {answeredCount} <span className="text-xs text-slate-400 font-normal">/ {totalCount}</span>
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium select-none">目前得分</p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              {examMode === "study" ? `${currentScore}%` : "考照中"}
            </p>
          </div>
        </div>

        {/* Custom Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden mt-1">
          <div
            className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Navigation Box Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex-1 flex flex-col gap-3 min-h-[250px] lg:min-h-0 transition-colors duration-300">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 select-none">
            <LayoutGrid className="w-3.5 h-3.5" />
            題號快捷導覽
          </h3>
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/40 dark:border-slate-700/40">
            <button
              onClick={() => setFilterMode("all")}
              className={`text-[10px] px-2 py-1 rounded font-medium transition-colors ${
                filterMode === "all"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilterMode("marked")}
              className={`text-[10px] px-2 py-1 rounded font-medium transition-colors flex items-center gap-0.5 ${
                filterMode === "marked"
                  ? "bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400"
              }`}
            >
              <Bookmark className="w-2.5 h-2.5 fill-current" />
              標記
            </button>
          </div>
        </div>

        {/* Scrollable grid of numbers */}
        <div className="flex-1 overflow-y-auto pr-1 max-h-[280px] lg:max-h-none">
          <div className="grid grid-cols-5 gap-2" id="questionNavGrid">
            {questions.map((q, idx) => {
              const qOriginalId = q.id > 45 ? q.id - 45 : q.id;
              const qRange = q.source || examRange;
              const key = `${qRange}_${qOriginalId}`;
              const isMarked = markedQuestions[key];
              const isAnswered = userAnswers[key] !== undefined;
              const isActive = idx === currentIndex;

              if (filterMode === "marked" && !isMarked) return null;

              let btnClasses = "h-10 w-full rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center border relative ";
              
              if (isActive) {
                btnClasses += "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/15 scale-102 z-10";
              } else if (isMarked) {
                btnClasses += "bg-amber-500/10 border-amber-300 dark:border-amber-600/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/15";
              } else if (isAnswered) {
                btnClasses += "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100/60 dark:hover:bg-indigo-950/40";
              } else {
                btnClasses += "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800";
              }

              return (
                <button
                  key={key}
                  onClick={() => onSelectIndex(idx)}
                  className={btnClasses}
                >
                  <span className="text-[10px] opacity-75 font-normal scale-90 leading-none mb-0.5">
                    {qRange}
                  </span>
                  <span className="leading-none text-xs">{qOriginalId}</span>
                  {isMarked && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend of Color states */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 block"></span>
            未答
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/50 block"></span>
            已答
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500/10 border border-amber-300 dark:border-amber-600/40 block"></span>
            標記
          </div>
        </div>
      </div>
    </aside>
  );
}
