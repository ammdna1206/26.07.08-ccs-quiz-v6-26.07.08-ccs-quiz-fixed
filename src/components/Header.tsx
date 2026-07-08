import { useState } from "react";
import { Brain, Moon, Sun, Hourglass, Pause, Play, GraduationCap, FileText, RotateCcw, Eye, EyeOff } from "lucide-react";
import { ExamMode } from "../types";

interface HeaderProps {
  timerSeconds: number;
  timerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  examMode: ExamMode;
  onChangeExamMode: (mode: ExamMode) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Header({
  timerSeconds,
  timerRunning,
  onToggleTimer,
  onResetTimer,
  examMode,
  onChangeExamMode,
  darkMode,
  onToggleDarkMode,
 }: HeaderProps) {
  const [timerVisible, setTimerVisible] = useState<boolean>(true);

  const formatTime = (secs: number) => {
    const hrs = String(Math.floor(secs / 3600)).padStart(2, "0");
    const mins = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const seconds = String(secs % 60).padStart(2, "0");
    return `${hrs}:${mins}:${seconds}`;
  };

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Brain className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-400 dark:to-indigo-300 bg-clip-text text-transparent leading-tight">
              CCS 生成式 AI 國際認證
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              核心能力國際認證模擬測驗系統 v2.0
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white cursor-pointer"
            title="切換深/淺色主題"
            id="themeToggleBtn"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Time Controller Control Board */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
            {/* Show/Hide Button */}
            <button
              onClick={() => setTimerVisible((prev) => !prev)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
              title={timerVisible ? "隱藏計時器" : "顯示計時器"}
            >
              {timerVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-indigo-500" />}
            </button>

            {/* Timer Core Display Box */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                timerVisible
                  ? "bg-white dark:bg-slate-900 shadow-sm"
                  : "bg-transparent border border-dashed border-slate-300 dark:border-slate-700"
              }`}
            >
              <div className={`${timerRunning && timerVisible ? "animate-[spin_4s_linear_infinite]" : ""}`}>
                <Hourglass
                  className={`w-3.5 h-3.5 ${
                    timerRunning ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"
                  }`}
                />
              </div>
              <span
                className={`font-mono text-xs font-bold transition-all ${
                  timerVisible
                    ? "text-slate-800 dark:text-slate-100"
                    : "text-slate-400 dark:text-slate-600 tracking-wider"
                }`}
              >
                {timerVisible ? formatTime(timerSeconds) : "••:••:••"}
              </span>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={onToggleTimer}
              className={`p-1.5 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                timerRunning
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
              }`}
              title={timerRunning ? "暫停計時" : "開始計時"}
            >
              {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* Reset Button */}
            <button
              onClick={() => {
                if (timerSeconds > 0) {
                  onResetTimer();
                }
              }}
              className={`p-1.5 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                timerSeconds > 0
                  ? "text-slate-500 hover:text-rose-500 hover:bg-rose-500/10"
                  : "text-slate-300 dark:text-slate-600 cursor-not-allowed"
              }`}
              disabled={timerSeconds === 0}
              title="計時器歸零"
            >
              <RotateCcw className={`w-3.5 h-3.5 transition-transform ${timerSeconds > 0 ? "active:scale-90" : ""}`} />
            </button>
          </div>

          {/* Mode Selectors */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex gap-1 border border-slate-200/50 dark:border-slate-700/50">
            <button
              onClick={() => onChangeExamMode("study")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                examMode === "study"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              學習模式
            </button>
            <button
              onClick={() => onChangeExamMode("exam")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                examMode === "exam"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              考照模式
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
