"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "../lib/api";
import { storageManager, Subject } from "../lib/storage";
import LearningSession from "./LearningSession";

interface StepDetailPageProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject;
  stepIndex: number;
  onStepComplete: () => void;
}

interface CriterionContentItem {
  criterion: string;
  criterionIndex: number;
  completed: boolean;
  score?: number;
}

export default function StepDetailPage({
  isOpen,
  onClose,
  subject,
  stepIndex,
  onStepComplete,
}: StepDetailPageProps) {
  const [loading, setLoading] = useState(false);
  const [criteria, setCriteria] = useState<CriterionContentItem[]>([]);
  const [currentLearningSession, setCurrentLearningSession] = useState<{
    criterion: string;
    criterionIndex: number;
  } | null>(null);

  const stepData = subject.learningData?.[stepIndex];
  const stepTitle = subject.roadmap?.steps[stepIndex] || "";

  useEffect(() => {
    if (isOpen) {
      initializeStepData();
    }
  }, [isOpen]);

  const initializeStepData = async () => {
    if (!subject.goal || !stepTitle) return;

    setLoading(true);
    try {
      // Check if evaluation criteria exists
      let evaluationCriteria = stepData?.evaluationCriteria;
      if (!evaluationCriteria) {
        // Create evaluation criteria for this step
        evaluationCriteria = await apiClient.createEvaluationCriteria({
          topic: subject.goal.topic,
          learning_period: subject.goal.learning_period,
          step: stepTitle,
        });

        // Update subject data with evaluation criteria
        const updatedSubject = { ...subject };
        if (!updatedSubject.learningData) {
          updatedSubject.learningData = {};
        }
        if (!updatedSubject.learningData[stepIndex]) {
          updatedSubject.learningData[stepIndex] = {
            step: stepTitle,
            completed: false,
          };
        }
        updatedSubject.learningData[stepIndex].evaluationCriteria =
          evaluationCriteria;
        storageManager.addSubject(updatedSubject);

        // Initialize criterion learning data
        storageManager.initializeCriterionLearningData(
          subject.id,
          stepIndex,
          evaluationCriteria.criteria,
        );
      }

      // Create criteria list for display
      const criteriaItems: CriterionContentItem[] =
        evaluationCriteria.criteria.map((criterion, index) => {
          const criterionData = stepData?.criterionLearningData?.[index];
          return {
            criterion,
            criterionIndex: index,
            completed: criterionData?.completed || false,
            score: criterionData?.score,
          };
        });

      setCriteria(criteriaItems);

      // Check if all criteria are completed
      const allCompleted = criteriaItems.every((item) => item.completed);
      if (allCompleted) {
        onStepComplete();
      }
    } catch (error) {
      console.error("Failed to initialize step data:", error);
      alert("学習ステップの初期化に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  const handleCriterionStart = (criterionIndex: number, criterion: string) => {
    setCurrentLearningSession({ criterion, criterionIndex });
  };

  const handleCriterionComplete = (completed: boolean, score?: number) => {
    if (currentLearningSession) {
      // Update criterion progress
      storageManager.updateCriterionProgress(
        subject.id,
        stepIndex,
        currentLearningSession.criterionIndex,
        completed,
        score,
      );

      // Refresh criteria list
      const updatedSubject = storageManager.getSubject(subject.id);
      if (updatedSubject) {
        const updatedStepData = updatedSubject.learningData?.[stepIndex];
        if (updatedStepData?.evaluationCriteria) {
          const criteriaItems: CriterionContentItem[] =
            updatedStepData.evaluationCriteria.criteria.map(
              (criterion, index) => {
                const criterionData =
                  updatedStepData.criterionLearningData?.[index];
                return {
                  criterion,
                  criterionIndex: index,
                  completed: criterionData?.completed || false,
                  score: criterionData?.score,
                };
              },
            );
          setCriteria(criteriaItems);

          // Check if all criteria are completed
          const allCompleted = criteriaItems.every((item) => item.completed);
          if (allCompleted) {
            onStepComplete();
          }
        }

        setCurrentLearningSession(null);
      }
    }
  };

  const renderCriterionCard = (item: CriterionContentItem, index: number) => (
    <motion.div
      key={index}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: [1, 1.02], y: [0, -2] }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <span className="text-xl md:text-2xl flex-shrink-0">🎯</span>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white text-base md:text-lg leading-tight">
              {item.criterion}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              この評価基準について学習します
            </p>
          </div>
        </div>
        {item.completed && (
          <motion.div
            className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 ml-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3 md:space-x-4">
          <span className="text-gray-400 text-xs md:text-sm">⏱️ 20分</span>
          {item.score && (
            <span className="px-2 py-1 bg-green-600 rounded-full text-xs text-white">
              {item.score}%
            </span>
          )}
        </div>

        <div className="flex space-x-2">
          {item.completed && (
            <motion.button
              onClick={() =>
                handleCriterionStart(item.criterionIndex, item.criterion)
              }
              className="px-3 md:px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              復習
            </motion.button>
          )}
          <motion.button
            onClick={() =>
              handleCriterionStart(item.criterionIndex, item.criterion)
            }
            className="px-4 md:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.completed ? "再学習" : "開始"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  // Create a mock learning content for the criterion-based session
  const createCriterionLearningContent = (
    criterion: string,
    criterionIndex: number,
  ) => ({
    title: criterion,
    description: `${stepTitle} - ${criterion}について学習します`,
    type: "lesson" as const,
    difficulty: "intermediate" as const,
    estimatedTime: "20分",
    completed: false,
    stepIndex,
    subjectId: subject.id,
    isCriterionBased: true,
    criterionIndex,
    criterion,
    parentStepTitle: stepTitle,
  });

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 rounded-xl w-full max-w-4xl h-[90vh] border border-gray-700 flex flex-col"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-700 flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${subject.gradient} flex items-center justify-center text-xl`}
                  >
                    {subject.icon}
                  </div>
                  <div>
                    <h1 className="font-semibold text-white text-lg">
                      {stepTitle}
                    </h1>
                    <p className="text-sm text-gray-400">
                      評価基準ごとに学習を進めましょう
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <svg
                    className="w-6 h-6"
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

              {/* Content */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <motion.div
                      className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <span className="ml-3 text-gray-400">
                      評価基準を準備しています...
                    </span>
                  </div>
                ) : (
                  <div className="grid gap-4 md:gap-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold mb-2">
                        評価基準一覧
                      </h2>
                      <p className="text-gray-400 text-sm">
                        各評価基準をクリックして学習を開始してください。すべての評価基準を完了すると、このステップが完了します。
                      </p>
                    </div>
                    {criteria.map((item, index) =>
                      renderCriterionCard(item, index),
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Learning Session for individual criterion */}
      {currentLearningSession && (
        <LearningSession
          isOpen={true}
          onClose={() => setCurrentLearningSession(null)}
          content={createCriterionLearningContent(
            currentLearningSession.criterion,
            currentLearningSession.criterionIndex,
          )}
          subject={subject}
          onComplete={handleCriterionComplete}
        />
      )}
    </>
  );
}
