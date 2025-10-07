"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
}

export default function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  message = "Êtes-vous sûr de vouloir supprimer cette candidature ?",
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 w-[90%] sm:w-[400px] text-center border border-gray-200"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex flex-col items-center gap-3">
              <AlertTriangle className="text-yellow-500 w-10 h-10" />
              <h2 className="text-lg font-semibold text-gray-800">
                Confirmation requise
              </h2>
              <p className="text-sm text-gray-600">{message}</p>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Annuler
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Supprimer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
