"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "../lib/api";
import { storageManager, Subject, LearningContent } from "../lib/storage";

interface LearningSessionProps {
  isOpen: boolean;
  onClose: () => void;
  content: LearningContent;
  subject: Subject;
  onComplete: (completed: boolean, score?: number) => void;
}

export default function LearningSession({
  isOpen,
  onClose,
  content,
  subject,
  onComplete,
}: LearningSessionProps) {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "overview" | "content" | "quiz" | "completed"
  >("overview");
  const [learningMaterial, setLearningMaterial] = useState<string>("");
  const [testQuestions, setTestQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (isOpen && !content.completed) {
      loadLearningContent();
    }
  }, [isOpen, content]);

  const loadLearningContent = async () => {
    if (!subject.roadmap || !subject.goal) return;

    setLoading(true);
    try {
      const stepData = subject.learningData?.[content.stepIndex];

      // Debug: Check what's actually available for API calls
      console.log("=== DEBUG: LearningSession API Request Data ===");
      console.log("subject.goal.topic:", subject.goal.topic);
      console.log(
        "subject.goal.learning_period:",
        subject.goal.learning_period,
      );
      console.log("content.title (step):", content.title);
      console.log("content.isCriterionBased:", content.isCriterionBased);
      console.log("content.criterion:", content.criterion);
      console.log("===============================================");

      // Handle criterion-based learning
      if (
        content.isCriterionBased &&
        content.criterion &&
        content.criterionIndex !== undefined
      ) {
        // This is a criterion-based learning session
        const criterionData =
          stepData?.criterionLearningData?.[content.criterionIndex];

        // Load test questions for this criterion if not exists
        let questions = criterionData?.testQuestions;
        if (!questions) {
          // Use existing API with single criterion in evaluation_criteria array
          questions = await apiClient.createTestQuestions({
            topic: subject.goal.topic,
            learning_period: subject.goal.learning_period,
            step: content.parentStepTitle || content.title,
            evaluation_criteria: [content.criterion],
          });

          // Update subject data
          const updatedSubject = { ...subject };
          if (updatedSubject.learningData?.[content.stepIndex]) {
            if (
              !updatedSubject.learningData[content.stepIndex]
                .criterionLearningData
            ) {
              updatedSubject.learningData[
                content.stepIndex
              ].criterionLearningData = {};
            }
            if (
              !updatedSubject.learningData[content.stepIndex]
                .criterionLearningData![content.criterionIndex]
            ) {
              updatedSubject.learningData[
                content.stepIndex
              ].criterionLearningData![content.criterionIndex] = {
                criterion: content.criterion,
                completed: false,
              };
            }
            updatedSubject.learningData[
              content.stepIndex
            ].criterionLearningData![content.criterionIndex].testQuestions =
              questions;
          }
          storageManager.addSubject(updatedSubject);
        }

        // Load learning material for this criterion if not exists
        let material = criterionData?.learningMaterial;
        if (!material) {
          // Use existing API with single criterion in criteria array
          material = await apiClient.createLearningMaterial({
            topic: subject.goal.topic,
            learning_period: subject.goal.learning_period,
            step: content.parentStepTitle || content.title,
            criteria: [content.criterion],
            test_questions: questions.questions,
          });

          // Update subject data
          const updatedSubject = { ...subject };
          if (
            updatedSubject.learningData?.[content.stepIndex]
              ?.criterionLearningData?.[content.criterionIndex]
          ) {
            updatedSubject.learningData[
              content.stepIndex
            ].criterionLearningData![content.criterionIndex].learningMaterial =
              material;
          }
          storageManager.addSubject(updatedSubject);
        }

        setLearningMaterial(material.material);
        setTestQuestions(questions.questions);
        setUserAnswers(new Array(questions.questions.length).fill(""));
      } else {
        // This shouldn't happen in the new flow, but keep for compatibility
        setLearningMaterial(
          "このコンテンツは学習ステップ専用ページで利用してください。",
        );
        setTestQuestions([]);
      }
    } catch (error) {
      console.error("Failed to load learning content:", error);
      alert("学習コンテンツの読み込みに失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  const handleStartLearning = () => {
    if (content.type === "lesson") {
      setCurrentStep("content");
    } else {
      setCurrentStep("quiz");
    }
  };

  const handleContentComplete = () => {
    if (content.type === "lesson") {
      setCurrentStep("quiz");
    } else {
      setCurrentStep("completed");
      onComplete(true, 100);
    }
  };

  const handleQuizComplete = () => {
    // Calculate score based on completion
    const finalScore = Math.max(50, Math.floor(Math.random() * 30) + 70); // Simulate score between 70-100
    setScore(finalScore);
    setCurrentStep("completed");
    onComplete(true, finalScore);
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center px-4"
    >
      <div
        className={`w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-r ${subject.gradient} flex items-center justify-center text-3xl md:text-4xl mx-auto mb-4 md:mb-6`}
      >
        {subject.icon}
      </div>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
        {content.title}
      </h2>
      <p className="text-gray-400 mb-4 md:mb-6 text-sm md:text-base leading-relaxed">
        {content.description}
      </p>

      <div className="bg-gray-800/50 rounded-lg p-4 mb-4 md:mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300 text-sm">種類</span>
          <span className="text-white capitalize text-sm">{content.type}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300 text-sm">難易度</span>
          <span className="text-white capitalize text-sm">
            {content.difficulty}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">推定時間</span>
          <span className="text-white text-sm">{content.estimatedTime}</span>
        </div>
      </div>

      <button
        onClick={handleStartLearning}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors text-base"
      >
        {loading ? "コンテンツを読み込み中..." : "学習を開始"}
      </button>
    </motion.div>
  );

  const renderLearningContent = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4 md:mb-6 px-4 md:px-0">
        <h2 className="text-lg md:text-xl font-bold text-white">
          {content.title}
        </h2>
        <span className="text-sm text-gray-400">レッスン</span>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 md:mb-6 px-4 md:px-0">
        <div className="prose prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-gray-300 leading-relaxed text-sm md:text-base">
            {learningMaterial || "学習コンテンツを読み込んでいます..."}
          </div>
        </div>
      </div>

      <div className="px-4 md:px-0">
        <button
          onClick={handleContentComplete}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors text-base"
        >
          内容を理解しました
        </button>
      </div>
    </motion.div>
  );

  const renderQuiz = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4 md:mb-6 px-4 md:px-0">
        <h2 className="text-lg md:text-xl font-bold text-white">
          理解度チェック
        </h2>
        <span className="text-sm text-gray-400">
          {currentQuestionIndex + 1} / {testQuestions.length}
        </span>
      </div>

      {testQuestions.length > 0 && (
        <div className="flex-1 flex flex-col px-4 md:px-0">
          <div className="bg-gray-800/50 rounded-lg p-4 md:p-6 mb-4 md:mb-6 flex-1">
            <h3 className="text-base md:text-lg font-medium text-white mb-3 md:mb-4">
              質問 {currentQuestionIndex + 1}
            </h3>
            <p className="text-gray-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
              {testQuestions[currentQuestionIndex]}
            </p>

            <textarea
              value={userAnswers[currentQuestionIndex] || ""}
              onChange={(e) =>
                handleAnswerChange(currentQuestionIndex, e.target.value)
              }
              className="w-full px-3 py-3 md:py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 md:h-32 resize-none text-base md:text-sm"
              placeholder="あなたの回答を入力してください..."
            />
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            {currentQuestionIndex > 0 && (
              <button
                onClick={() =>
                  setCurrentQuestionIndex(currentQuestionIndex - 1)
                }
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-base"
              >
                前の質問
              </button>
            )}

            {currentQuestionIndex < testQuestions.length - 1 ? (
              <button
                onClick={() =>
                  setCurrentQuestionIndex(currentQuestionIndex + 1)
                }
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-base"
              >
                次の質問
              </button>
            ) : (
              <button
                onClick={handleQuizComplete}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-base"
              >
                完了
              </button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderCompleted = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center px-4"
    >
      <motion.div
        className="w-16 h-16 md:w-20 md:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <svg
          className="w-8 h-8 md:w-10 md:h-10 text-white"
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

      <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
        お疲れ様でした！
      </h2>
      <p className="text-gray-400 mb-4 md:mb-6 text-sm md:text-base">
        {content.title}を完了しました
      </p>

      {score > 0 && (
        <div className="bg-gray-800/50 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
          <div className="text-2xl md:text-3xl font-bold text-white mb-2">
            {score}%
          </div>
          <div className="text-gray-400 text-sm md:text-base">理解度スコア</div>
        </div>
      )}

      <button
        onClick={onClose}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors text-base"
      >
        ダッシュボードに戻る
      </button>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 rounded-xl w-full max-w-2xl h-[90vh] md:h-[80vh] border border-gray-700 flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-700 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <span className="text-xl md:text-2xl">{subject.icon}</span>
                <div>
                  <h1 className="font-semibold text-white text-base md:text-lg">
                    {subject.name}
                  </h1>
                  <p className="text-xs md:text-sm text-gray-400">
                    {content.type}セッション
                  </p>
                </div>
              </div>
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

            {/* Content */}
            <div className="flex-1 p-4 md:p-6 overflow-hidden">
              {currentStep === "overview" && renderOverview()}
              {currentStep === "content" && renderLearningContent()}
              {currentStep === "quiz" && renderQuiz()}
              {currentStep === "completed" && renderCompleted()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
