"use client";

import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { storageManager, Subject, LearningContent } from "../lib/storage";
import AddSubjectModal from "../components/AddSubjectModal";
import LearningSession from "../components/LearningSession";
import StepDetailPage from "../components/StepDetailPage";

const inter = Inter({ subsets: ["latin"] });

const SidebarItem = ({
  subject,
  isActive,
  onClick,
  onDelete,
}: {
  subject: Subject;
  isActive: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) => {
  return (
    <motion.div
      className={`relative p-3 md:p-4 rounded-xl cursor-pointer transition-all duration-300 group ${
        isActive ? "bg-gray-800/80" : "hover:bg-gray-800/40"
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center space-x-3 mb-2 md:mb-3">
        <motion.div
          className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-r ${subject.gradient} flex items-center justify-center text-xl md:text-2xl flex-shrink-0`}
          whileHover={{ rotate: 5 }}
        >
          {subject.icon}
        </motion.div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm md:text-base truncate">
            {subject.name}
          </h3>
          <p className="text-xs md:text-sm text-gray-400">
            {subject.lessons}ステップ
          </p>
        </div>
        {subject.id !== "getting-started" && (
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded flex-shrink-0"
          >
            <svg
              className="w-4 h-4 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>

      {subject.lessons > 0 && (
        <div className="mb-2">
          <div className="flex justify-between text-xs md:text-sm">
            <span className="text-gray-400">進捗</span>
            <span className="text-white font-medium">{subject.progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
            <motion.div
              className={`h-2 bg-gradient-to-r ${subject.gradient} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${subject.progress}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 line-clamp-2">
        {subject.description}
      </p>

      {isActive && (
        <motion.div
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="w-1 h-6 md:h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full" />
        </motion.div>
      )}
    </motion.div>
  );
};

const ContentCard = ({
  content,
  index,
  onStart,
  onRestart,
}: {
  content: LearningContent;
  index: number;
  onStart: (content: LearningContent) => void;
  onRestart: (content: LearningContent) => void;
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "from-green-500 to-green-600";
      case "intermediate":
        return "from-yellow-500 to-orange-500";
      case "advanced":
        return "from-red-500 to-red-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lesson":
        return "📚";
      case "quiz":
        return "❓";
      case "practice":
        return "💪";
      default:
        return "📖";
    }
  };

  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: [1, 1.02], y: [0, -2] }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <span className="text-xl md:text-2xl flex-shrink-0">
            {getTypeIcon(content.type)}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white text-base md:text-lg leading-tight">
              {content.title}
            </h3>
            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
              {content.description}
            </p>
          </div>
        </div>
        {content.completed && (
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
          <motion.span
            className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor(content.difficulty)} text-white`}
            whileHover={{ scale: 1.05 }}
          >
            {content.difficulty}
          </motion.span>
          <span className="text-gray-400 text-xs md:text-sm">
            ⏱️ {content.estimatedTime}
          </span>
        </div>

        <div className="flex space-x-2">
          {content.completed && (
            <motion.button
              onClick={() => onRestart(content)}
              className="px-3 md:px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              復習
            </motion.button>
          )}
          <motion.button
            onClick={() => onStart(content)}
            className="px-4 md:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {content.completed ? "再学習" : "開始"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const GetStartedCard = ({ onAddSubject }: { onAddSubject: () => void }) => (
  <motion.div
    className="text-center py-8 md:py-12 px-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <motion.div
      className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-3xl md:text-4xl mx-auto mb-4 md:mb-6"
      whileHover={{ scale: 1.05, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
    >
      🚀
    </motion.div>
    <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
      学習を始めましょう！
    </h2>
    <p className="text-gray-400 mb-6 md:mb-8 max-w-md mx-auto text-sm md:text-base leading-relaxed">
      AIが
      あなたの学習目標に合わせてパーソナライズされた学習プランを作成します。
      何を学びたいか教えてください。
    </p>
    <motion.button
      onClick={onAddSubject}
      className="px-6 md:px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm md:text-base"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      新しい学習コースを追加
    </motion.button>
  </motion.div>
);

export default function Dashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeSubject, setActiveSubject] = useState<string>("getting-started");
  const [showAddModal, setShowAddModal] = useState(false);
  const [learningContent, setLearningContent] = useState<LearningContent[]>([]);
  const [currentLearningSession, setCurrentLearningSession] = useState<{
    content: LearningContent;
    subject: Subject;
  } | null>(null);
  const [currentStepDetail, setCurrentStepDetail] = useState<{
    subject: Subject;
    stepIndex: number;
  } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Load subjects from localStorage
    const savedSubjects = storageManager.getSubjects();
    if (savedSubjects.length === 0) {
      setSubjects(storageManager.getDefaultSubjects());
    } else {
      setSubjects(savedSubjects);
      setActiveSubject(savedSubjects[0].id);
    }
  }, []);

  useEffect(() => {
    // Load learning content for active subject
    if (activeSubject && activeSubject !== "getting-started") {
      const content = storageManager.getLearningContent(activeSubject);
      const subject = subjects.find((s) => s.id === activeSubject);

      if (content.length === 0 && subject?.roadmap) {
        // Generate content from roadmap
        const generatedContent =
          storageManager.generateCriterionBasedLearningContent(subject);
        setLearningContent(generatedContent);
        storageManager.saveLearningContent(generatedContent);
      } else {
        setLearningContent(content);
      }
    } else {
      setLearningContent([]);
    }
  }, [activeSubject, subjects]);

  const handleSubjectAdded = (newSubject: Subject) => {
    const updatedSubjects = subjects.filter((s) => s.id !== "getting-started");
    updatedSubjects.push(newSubject);
    setSubjects(updatedSubjects);
    setActiveSubject(newSubject.id);
    setShowAddModal(false);
    setSidebarOpen(false); // Close sidebar on mobile after adding
  };

  const handleDeleteSubject = (e: React.MouseEvent, subjectId: string) => {
    e.stopPropagation();
    const updatedSubjects = subjects.filter((s) => s.id !== subjectId);

    if (updatedSubjects.length === 0) {
      setSubjects(storageManager.getDefaultSubjects());
      setActiveSubject("getting-started");
    } else {
      setSubjects(updatedSubjects);
      if (activeSubject === subjectId) {
        setActiveSubject(updatedSubjects[0].id);
      }
    }

    storageManager.saveSubjects(updatedSubjects);

    // Clear learning content for deleted subject
    const allContent = storageManager.getAllLearningContent();
    const filteredContent = allContent.filter((c) => c.subjectId !== subjectId);
    localStorage.setItem(
      "learning_app_content",
      JSON.stringify(filteredContent),
    );
  };

  const handleStartLearning = (content: LearningContent) => {
    const subject = subjects.find((s) => s.id === content.subjectId);
    if (subject) {
      // Check if this content is criterion-based or a step initialization
      if (content.isCriterionBased) {
        // This is a specific criterion, use the regular learning session
        setCurrentLearningSession({ content, subject });
      } else {
        // This is a step that needs evaluation criteria, show step detail page
        setCurrentStepDetail({ subject, stepIndex: content.stepIndex });
      }
    }
  };

  const handleLearningComplete = (completed: boolean, score?: number) => {
    if (currentLearningSession) {
      const { content } = currentLearningSession;

      if (content.isCriterionBased && content.criterionIndex !== undefined) {
        // Update criterion-based progress
        storageManager.updateCriterionProgress(
          content.subjectId,
          content.stepIndex,
          content.criterionIndex,
          completed,
          score,
        );
      } else {
        // Legacy step-based progress (for backward compatibility)
        storageManager.updateSubjectProgress(
          content.subjectId,
          content.stepIndex,
          completed,
          score,
        );
      }

      // Refresh subjects to update progress
      const updatedSubjects = storageManager.getSubjects();
      setSubjects(updatedSubjects);

      // Update learning content with new criterion-based content
      const subject = updatedSubjects.find((s) => s.id === activeSubject);
      if (subject) {
        const updatedContent =
          storageManager.generateCriterionBasedLearningContent(subject);
        setLearningContent(updatedContent);
        storageManager.saveLearningContent(updatedContent);
      }

      setCurrentLearningSession(null);
    }
  };

  const handleSubjectSelect = (subjectId: string) => {
    setActiveSubject(subjectId);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleStepComplete = () => {
    // Refresh subjects and content when a step is completed
    const updatedSubjects = storageManager.getSubjects();
    setSubjects(updatedSubjects);

    // Update learning content
    const subject = updatedSubjects.find((s) => s.id === activeSubject);
    if (subject) {
      const updatedContent =
        storageManager.generateCriterionBasedLearningContent(subject);
      setLearningContent(updatedContent);
      storageManager.saveLearningContent(updatedContent);
    }

    setCurrentStepDetail(null);
  };

  const currentSubject = subjects.find((s) => s.id === activeSubject);

  return (
    <div
      className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white`}
    >
      {/* Header */}
      <motion.header
        className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 px-4 md:px-6 py-3 md:py-4 relative z-30"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <motion.div
              className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-white font-bold text-sm md:text-base">
                AI
              </span>
            </motion.div>
            <h1 className="text-base md:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI学習アシスタント
            </h1>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <motion.button
              onClick={() => setShowAddModal(true)}
              className="px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-1 md:space-x-2 text-sm md:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="hidden sm:inline">コース追加</span>
            </motion.button>

            <motion.button
              onClick={() => {
                if (confirm("すべての学習データを削除しますか？")) {
                  storageManager.clearAllData();
                  setSubjects(storageManager.getDefaultSubjects());
                  setActiveSubject("getting-started");
                  setLearningContent([]);
                }
              }}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="データをリセット"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="flex h-[calc(100vh-theme(spacing.16))] md:h-[calc(100vh-80px)] relative">
        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          className={`fixed md:relative top-0 left-0 w-80 md:w-80 bg-gray-900/95 md:bg-gray-900/60 backdrop-blur-sm border-r border-gray-700/50 p-4 md:p-6 overflow-y-auto z-30 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 h-full`}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base md:text-lg font-semibold">学習コース</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1 text-gray-400 hover:text-white"
              >
                <svg
                  className="w-5 h-5"
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
            <p className="text-gray-400 text-xs md:text-sm">
              興味のある分野を選択してください
            </p>
          </div>

          <div className="space-y-3 md:space-y-4">
            {subjects.map((subject) => (
              <SidebarItem
                key={subject.id}
                subject={subject}
                isActive={activeSubject === subject.id}
                onClick={() => handleSubjectSelect(subject.id)}
                onDelete={(e) => handleDeleteSubject(e, subject.id)}
              />
            ))}
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubject}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeSubject === "getting-started" ? (
                <GetStartedCard onAddSubject={() => setShowAddModal(true)} />
              ) : (
                currentSubject && (
                  <>
                    {/* Subject Header */}
                    <div className="mb-6 md:mb-8">
                      <motion.div
                        className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                      >
                        <motion.div
                          className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-r ${currentSubject.gradient} flex items-center justify-center text-2xl md:text-3xl`}
                          whileHover={{ scale: 1.05, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {currentSubject.icon}
                        </motion.div>
                        <div className="min-w-0">
                          <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                            {currentSubject.name}
                          </h1>
                          <p className="text-gray-400 text-sm md:text-base">
                            {currentSubject.description}
                          </p>
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-gray-800/50 rounded-xl p-4 md:p-6"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-3 md:mb-4">
                          <span className="text-gray-300 text-sm md:text-base">
                            学習進捗
                          </span>
                          <span className="text-lg md:text-xl font-bold">
                            {currentSubject.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 md:h-3">
                          <motion.div
                            className={`h-2 md:h-3 bg-gradient-to-r ${currentSubject.gradient} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${currentSubject.progress}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                          />
                        </div>
                        <div className="flex justify-between text-xs md:text-sm text-gray-400 mt-2">
                          <span>
                            完了:{" "}
                            {Math.floor(
                              (currentSubject.lessons *
                                currentSubject.progress) /
                                100,
                            )}
                          </span>
                          <span>
                            残り:{" "}
                            {currentSubject.lessons -
                              Math.floor(
                                (currentSubject.lessons *
                                  currentSubject.progress) /
                                  100,
                              )}
                          </span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Learning Content */}
                    <div className="mb-6">
                      <h2 className="text-lg md:text-xl font-semibold mb-4">
                        学習ステップ
                      </h2>
                      <div className="grid gap-4 md:gap-6">
                        {learningContent.length > 0 ? (
                          learningContent.map((content, index) => (
                            <ContentCard
                              key={index}
                              content={content}
                              index={index}
                              onStart={handleStartLearning}
                              onRestart={handleStartLearning}
                            />
                          ))
                        ) : (
                          <motion.div
                            className="text-center py-8 md:py-12 text-gray-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <span className="text-3xl md:text-4xl mb-4 block">
                              📚
                            </span>
                            <p className="text-sm md:text-base">
                              学習コンテンツを準備しています...
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </>
                )
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Modals */}
      <AddSubjectModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubjectAdded={handleSubjectAdded}
      />

      {currentLearningSession && (
        <LearningSession
          isOpen={true}
          onClose={() => setCurrentLearningSession(null)}
          content={currentLearningSession.content}
          subject={currentLearningSession.subject}
          onComplete={handleLearningComplete}
        />
      )}

      {currentStepDetail && (
        <StepDetailPage
          isOpen={true}
          onClose={() => setCurrentStepDetail(null)}
          subject={currentStepDetail.subject}
          stepIndex={currentStepDetail.stepIndex}
          onStepComplete={handleStepComplete}
        />
      )}
    </div>
  );
}
