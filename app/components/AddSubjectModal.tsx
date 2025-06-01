"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient, GoalRequest } from "../lib/api";
import { storageManager, Subject } from "../lib/storage";

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubjectAdded: (subject: Subject) => void;
}

const subjectIcons = [
  "📚",
  "💻",
  "🔬",
  "🎨",
  "🏛️",
  "🗣️",
  "📐",
  "🎵",
  "🏃‍♂️",
  "🍳",
];
const gradients = [
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-purple-500 to-pink-500",
  "from-orange-500 to-red-500",
  "from-yellow-500 to-orange-500",
  "from-indigo-500 to-purple-500",
  "from-pink-500 to-rose-500",
  "from-teal-500 to-cyan-500",
  "from-red-500 to-pink-500",
  "from-emerald-500 to-teal-500",
];

export default function AddSubjectModal({
  isOpen,
  onClose,
  onSubjectAdded,
}: AddSubjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: "",
    motivation: "",
    learning_period: "1ヶ月",
  });
  const [selectedIcon, setSelectedIcon] = useState(subjectIcons[0]);
  const [selectedGradient, setSelectedGradient] = useState(gradients[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim() || !formData.motivation.trim()) return;

    setLoading(true);
    try {
      // Step 1: Create goal
      const goalRequest: GoalRequest = {
        topic: formData.topic,
        motivation: formData.motivation,
        learning_period: formData.learning_period,
      };

      const goal = await apiClient.createGoal(goalRequest);

      // Debug: Check what data we received from createGoal
      console.log("=== DEBUG: AddSubjectModal Data ===");
      console.log("goalRequest sent:", goalRequest);
      console.log("goal received from API:", goal);
      console.log("===================================");

      // Step 2: Create roadmap
      const roadmap = await apiClient.createRoadmap({
        topic: formData.topic,
        goal: goal.goal,
        learning_period: formData.learning_period,
      });

      // Step 3: Create subject
      const subject: Subject = {
        id: Date.now().toString(),
        name: goal.topic || formData.topic,
        icon: selectedIcon,
        gradient: selectedGradient,
        description: goal.goal,
        lessons: roadmap.steps.length,
        progress: 0,
        createdAt: new Date().toISOString(),
        goal: {
          ...goal,
          topic: goal.topic || formData.topic,
          learning_period: goal.learning_period || formData.learning_period,
        },
        roadmap,
        learningData: {},
      };

      // Debug: Check what subject data we're saving
      console.log("=== DEBUG: Subject to be saved ===");
      console.log("subject object:", subject);
      console.log("subject.goal:", subject.goal);
      console.log("==================================");

      // Initialize learning data for each step
      roadmap.steps.forEach((step, index) => {
        if (subject.learningData) {
          subject.learningData[index] = {
            step,
            completed: false,
          };
        }
      });

      // Save subject
      storageManager.addSubject(subject);

      // Generate and save learning content
      const content =
        storageManager.generateCriterionBasedLearningContent(subject);
      storageManager.saveLearningContent(content);

      onSubjectAdded(subject);
      onClose();
      setFormData({ topic: "", motivation: "", learning_period: "1ヶ月" });
    } catch (error) {
      console.error("Failed to create subject:", error);
      alert(
        "学習コースの作成に失敗しました。APIサーバーが起動していることを確認してください。",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-900 rounded-xl p-4 md:p-6 w-full max-w-md border border-gray-700 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-white">
                新しい学習コースを追加
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  学習トピック
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) =>
                    setFormData({ ...formData, topic: e.target.value })
                  }
                  className="w-full px-3 py-2.5 md:py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base md:text-sm"
                  placeholder="例: React、英語、数学"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  学習の動機・目標
                </label>
                <textarea
                  value={formData.motivation}
                  onChange={(e) =>
                    setFormData({ ...formData, motivation: e.target.value })
                  }
                  className="w-full px-3 py-2.5 md:py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none text-base md:text-sm"
                  placeholder="なぜこのトピックを学習したいですか？"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  学習期間
                </label>
                <select
                  value={formData.learning_period}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      learning_period: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2.5 md:py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base md:text-sm"
                >
                  <option value="1週間">1週間</option>
                  <option value="2週間">2週間</option>
                  <option value="1ヶ月">1ヶ月</option>
                  <option value="2ヶ月">2ヶ月</option>
                  <option value="3ヶ月">3ヶ月</option>
                  <option value="6ヶ月">6ヶ月</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  アイコン
                </label>
                <div className="grid grid-cols-5 gap-2 md:gap-2">
                  {subjectIcons.map((icon, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedIcon(icon)}
                      className={`w-12 h-12 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-xl md:text-xl transition-all ${
                        selectedIcon === icon
                          ? "bg-blue-600 ring-2 ring-blue-400"
                          : "bg-gray-800 hover:bg-gray-700"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  色テーマ
                </label>
                <div className="grid grid-cols-5 gap-2 md:gap-2">
                  {gradients.map((gradient, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedGradient(gradient)}
                      className={`w-12 h-12 md:w-10 md:h-10 rounded-lg bg-gradient-to-r ${gradient} transition-all ${
                        selectedGradient === gradient
                          ? "ring-2 ring-white"
                          : "hover:scale-105"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 md:py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-base md:text-sm font-medium"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={
                    loading ||
                    !formData.topic.trim() ||
                    !formData.motivation.trim()
                  }
                  className="flex-1 px-4 py-3 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-base md:text-sm font-medium"
                >
                  {loading ? (
                    <motion.div
                      className="w-5 h-5 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ) : (
                    "作成"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
