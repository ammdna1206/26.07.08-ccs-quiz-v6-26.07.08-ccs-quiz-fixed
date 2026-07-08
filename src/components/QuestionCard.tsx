import { Bookmark, ArrowLeft, ArrowRight, HelpCircle, Check, ArrowUp, ArrowDown } from "lucide-react";
import { Question, ExamMode, ExamRange } from "../types";

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  userAnswers: { [key: string]: any };
  onUpdateAnswer: (answer: any) => void;
  markedQuestions: { [key: string]: boolean };
  onToggleMark: () => void;
  examMode: ExamMode;
  examRange: ExamRange;
  onPrev: () => void;
  onNext: () => void;
  showExplanation: boolean;
  onCheckAnswer: () => void;
}

export default function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  userAnswers,
  onUpdateAnswer,
  markedQuestions,
  onToggleMark,
  examMode,
  examRange,
  onPrev,
  onNext,
  showExplanation,
  onCheckAnswer,
}: QuestionCardProps) {
  const cleanId = question.id > 45 ? question.id - 45 : question.id;
  const rangePrefix = question.source || examRange;
  const key = `${rangePrefix}_${cleanId}`;
  const savedAns = userAnswers[key];
  const isMarked = markedQuestions[key];

  // Render sub-question option prefixes
  const optionPrefixes = ["A", "B", "C", "D", "E"];

  // 1. Single Choice Renderer
  const renderSingleChoice = () => {
    const options = question.options || [];
    return (
      <div className="flex flex-col gap-3">
        {options.map((opt, idx) => {
          const isSelected = savedAns === idx;
          const letter = optionPrefixes[idx] || String(idx + 1);
          return (
            <button
              key={idx}
              onClick={() => onUpdateAnswer(idx)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
                isSelected
                  ? "bg-indigo-50/70 dark:bg-indigo-950/20 border-indigo-500 text-slate-800 dark:text-slate-100"
                  : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-3 pr-4">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs border transition-colors select-none ${
                    isSelected
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:text-white"
                  }`}
                >
                  {letter}
                </span>
                <span className="text-sm font-medium leading-relaxed">{opt}</span>
              </div>
              <span
                className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${
                  isSelected
                    ? "border-indigo-500"
                    : "border-slate-300 dark:border-slate-700 group-hover:border-indigo-400"
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-500 transform transition-transform ${
                    isSelected ? "scale-100" : "scale-0"
                  }`}
                ></span>
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  // 2. Multiple Choice Renderer
  const renderMultipleChoice = () => {
    const options = question.options || [];
    const selection: number[] = Array.isArray(savedAns) ? savedAns : [];

    const handleToggle = (idx: number) => {
      let nextSelection = [...selection];
      if (nextSelection.includes(idx)) {
        nextSelection = nextSelection.filter((i) => i !== idx);
      } else {
        nextSelection.push(idx);
      }
      onUpdateAnswer(nextSelection.length > 0 ? nextSelection : undefined);
    };

    return (
      <div className="flex flex-col gap-3">
        {options.map((opt, idx) => {
          const isSelected = selection.includes(idx);
          const letter = optionPrefixes[idx] || String(idx + 1);
          return (
            <button
              key={idx}
              onClick={() => handleToggle(idx)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
                isSelected
                  ? "bg-indigo-50/70 dark:bg-indigo-950/20 border-indigo-500 text-slate-800 dark:text-slate-100"
                  : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-3 pr-4">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs border transition-colors select-none ${
                    isSelected
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:text-white"
                  }`}
                >
                  {letter}
                </span>
                <span className="text-sm font-medium leading-relaxed">{opt}</span>
              </div>
              <span
                className={`w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-colors ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-500 text-white"
                    : "border-slate-300 dark:border-slate-700 group-hover:border-indigo-400"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  // 3. True/False Sublist Renderer
  const renderTrueFalse = () => {
    const subs = question.subQuestions || [];
    const answers = typeof savedAns === "object" && savedAns !== null ? { ...savedAns } : {};

    const handleSelect = (idx: number, choice: string) => {
      answers[idx] = choice;
      onUpdateAnswer(answers);
    };

    return (
      <div className="flex flex-col gap-4">
        {subs.map((sub, idx) => {
          const currentChoice = answers[idx];
          return (
            <div
              key={idx}
              className="bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {idx + 1}. {sub.text}
              </p>
              <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleSelect(idx, "是")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    currentChoice === "是"
                      ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  是
                </button>
                <button
                  type="button"
                  onClick={() => handleSelect(idx, "否")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    currentChoice === "否"
                      ? "bg-rose-50 dark:bg-rose-950/20 border-rose-500 text-rose-600 dark:text-rose-400"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  否
                </button>
                {/* Optional additional choice like "可能", "不可能", "①", "②", "有", "無" */}
                {question.id === 10 && question.source === "B" && (
                  <div className="flex items-center gap-1 ml-1 pl-1 border-l border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => handleSelect(idx, "可能")}
                      className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all border cursor-pointer ${
                        currentChoice === "可能"
                          ? "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-500 text-indigo-600"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                      }`}
                    >
                      可能
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelect(idx, "不可能")}
                      className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all border cursor-pointer ${
                        currentChoice === "不可能"
                          ? "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-500 text-indigo-600"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                      }`}
                    >
                      不可能
                    </button>
                  </div>
                )}
                {question.id === 2 && question.source === "B" && (
                  <div className="flex items-center gap-1 ml-1 pl-1 border-l border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => handleSelect(idx, "①")}
                      className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all border cursor-pointer ${
                        currentChoice === "①"
                          ? "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-500 text-indigo-600"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                      }`}
                    >
                      ①
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelect(idx, "②")}
                      className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all border cursor-pointer ${
                        currentChoice === "②"
                          ? "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-500 text-indigo-600"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                      }`}
                    >
                      ②
                    </button>
                  </div>
                )}
                {question.id === 37 && question.source === "B" && (
                  <div className="flex items-center gap-1 ml-1 pl-1 border-l border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => handleSelect(idx, "有")}
                      className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all border cursor-pointer ${
                        currentChoice === "有"
                          ? "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-500 text-indigo-600"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                      }`}
                    >
                      有
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelect(idx, "無")}
                      className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all border cursor-pointer ${
                        currentChoice === "無"
                          ? "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-500 text-indigo-600"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                      }`}
                    >
                      無
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 4. Sorting Renderer
  const renderSorting = () => {
    const items = question.items || [];
    const currentOrder: number[] = Array.isArray(savedAns) ? savedAns : items.map((_, i) => i);

    const handleMove = (viewIndex: number, direction: "up" | "down") => {
      const nextOrder = [...currentOrder];
      const targetIndex = direction === "up" ? viewIndex - 1 : viewIndex + 1;
      
      // Swap elements
      const temp = nextOrder[viewIndex];
      nextOrder[viewIndex] = nextOrder[targetIndex];
      nextOrder[targetIndex] = temp;

      onUpdateAnswer(nextOrder);
    };

    return (
      <div className="flex flex-col gap-3">
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-2 select-none flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          請點選上下箭頭調整項目至正確順序（由上到下，即第 1 步至最後一步）。
        </p>
        {currentOrder.map((originalIndex, viewIndex) => {
          const text = items[originalIndex];
          return (
            <div
              key={originalIndex}
              className="bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 flex items-center justify-between gap-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/40"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-bold text-xs select-none">
                  {viewIndex + 1}
                </span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{text}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  disabled={viewIndex === 0}
                  onClick={() => handleMove(viewIndex, "up")}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={viewIndex === currentOrder.length - 1}
                  onClick={() => handleMove(viewIndex, "down")}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 5. Matching Renderer
  const renderMatching = () => {
    const leftItems = question.leftItems || [];
    const rightItems = question.rightItems || [];
    const savedMatching = typeof savedAns === "object" && savedAns !== null ? { ...savedAns } : {};

    const handleSelectRight = (leftIdx: number, rightValue: string) => {
      const nextMatching = { ...savedMatching };
      if (rightValue === "") {
        delete nextMatching[leftIdx];
      } else {
        nextMatching[leftIdx] = parseInt(rightValue, 10);
      }
      onUpdateAnswer(Object.keys(nextMatching).length > 0 ? nextMatching : undefined);
    };

    return (
      <div className="flex flex-col gap-4">
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-1 select-none flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          請利用右側下拉選單為左側項目選擇其正確的功能/敘述配對。
        </p>
        {leftItems.map((leftItem, leftIdx) => {
          const selectedRightIdx = savedMatching[leftIdx];
          return (
            <div
              key={leftIdx}
              className="bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
            >
              <div className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200 pr-2">
                {leftItem}
              </div>
              <div className="relative w-full md:w-80 flex-shrink-0">
                <select
                  value={selectedRightIdx !== undefined ? selectedRightIdx : ""}
                  onChange={(e) => handleSelectRight(leftIdx, e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                >
                  <option value="">== 請選擇正確功能 ==</option>
                  {rightItems.map((rightItem, rightIdx) => (
                    <option key={rightIdx} value={rightIdx}>
                      {rightItem.length > 50 ? rightItem.substring(0, 50) + "..." : rightItem}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none text-[10px]">
                  ▼
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderContentByQuestionType = () => {
    switch (question.type) {
      case "single":
        return renderSingleChoice();
      case "multiple":
        return renderMultipleChoice();
      case "tf":
        return renderTrueFalse();
      case "sort":
        return renderSorting();
      case "matching":
        return renderMatching();
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col min-h-[480px] transition-colors duration-300">
      {/* Question Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center flex-wrap gap-2 select-none">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
            模擬試題 {rangePrefix}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {question.category}
          </span>
        </div>
        <button
          onClick={onToggleMark}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
            isMarked
              ? "text-amber-600 dark:text-amber-400 bg-amber-500/5 border-amber-300 dark:border-amber-500/20 font-medium"
              : "text-slate-500 hover:text-amber-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-300"
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isMarked ? "fill-current" : ""}`} />
          <span>{isMarked ? "已標記" : "標記此題"}</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
        {/* Text Area */}
        <div>
          <h2 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-start gap-3 leading-relaxed">
            <span className="text-indigo-600 dark:text-indigo-400 text-lg md:text-xl font-black select-none font-mono">
              Q{cleanId}.
            </span>
            <span>{question.text}</span>
          </h2>
        </div>

        {/* Dynamic Options Area */}
        <div className="flex-1">{renderContentByQuestionType()}</div>

        {/* Explanation Panel */}
        {showExplanation && (
          <div className="mt-4 p-5 rounded-2xl bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100/60 dark:border-indigo-900/30 flex flex-col gap-2.5 transition-all">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm select-none">
              <HelpCircle className="w-4 h-4" />
              <span>解析說明</span>
            </div>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="px-6 py-4.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-3xl flex justify-between items-center select-none">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> 上一題
        </button>

        {examMode === "study" && (
          <button
            onClick={onCheckAnswer}
            disabled={savedAns === undefined}
            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40 transition-all shadow-sm disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            核對答案
          </button>
        )}

        <button
          onClick={onNext}
          disabled={currentIndex === totalQuestions - 1}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          下一題 <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
