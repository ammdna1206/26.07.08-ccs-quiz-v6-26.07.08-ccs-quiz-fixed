import { AlertCircle, Check } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  confirmMode?: boolean;
  onConfirm?: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onClose,
  confirmMode = false,
  onConfirm,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Icon / Title */}
        <div className="flex items-center gap-3 text-amber-500 dark:text-amber-400 select-none">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
        </div>

        {/* Message */}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {message}
        </p>

        {/* Footer controls */}
        <div className="flex justify-end gap-2.5 mt-2 select-none">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
          >
            {confirmMode ? "取消" : "關閉"}
          </button>
          
          {confirmMode && onConfirm && (
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              確認
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
