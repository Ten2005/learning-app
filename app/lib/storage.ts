import {
  Roadmap,
  MotivationToGoal,
  EvaluationCriteria,
  TestQuestions,
  LearningMaterial,
} from "./api";

export interface CriterionLearningData {
  criterion: string;
  testQuestions?: TestQuestions;
  learningMaterial?: LearningMaterial;
  completed: boolean;
  score?: number;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  description: string;
  lessons: number;
  progress: number;
  createdAt: string;
  goal?: MotivationToGoal;
  roadmap?: Roadmap;
  learningData?: {
    [stepIndex: number]: {
      step: string;
      evaluationCriteria?: EvaluationCriteria;
      // Legacy support for old step-based approach
      testQuestions?: TestQuestions;
      learningMaterial?: LearningMaterial;
      completed: boolean;
      score?: number;
      // New criterion-based learning data
      criterionLearningData?: {
        [criterionIndex: number]: CriterionLearningData;
      };
    };
  };
}

export interface LearningContent {
  title: string;
  description: string;
  type: "lesson" | "quiz" | "practice";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  completed: boolean;
  stepIndex: number;
  subjectId: string;
  content?: string;
  questions?: string[];
  criteria?: string[];
  // New fields for criterion-based learning
  isCriterionBased?: boolean;
  criterionIndex?: number;
  criterion?: string;
  parentStepTitle?: string;
}

class StorageManager {
  private readonly SUBJECTS_KEY = "learning_app_subjects";
  private readonly LEARNING_CONTENT_KEY = "learning_app_content";
  private readonly USER_PROGRESS_KEY = "learning_app_progress";

  getSubjects(): Subject[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(this.SUBJECTS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  saveSubjects(subjects: Subject[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.SUBJECTS_KEY, JSON.stringify(subjects));
  }

  addSubject(subject: Subject): void {
    const subjects = this.getSubjects();
    const existingIndex = subjects.findIndex((s) => s.id === subject.id);

    if (existingIndex >= 0) {
      subjects[existingIndex] = subject;
    } else {
      subjects.push(subject);
    }

    this.saveSubjects(subjects);
  }

  getSubject(id: string): Subject | undefined {
    return this.getSubjects().find((s) => s.id === id);
  }

  updateSubjectProgress(
    subjectId: string,
    stepIndex: number,
    completed: boolean,
    score?: number,
  ): void {
    const subjects = this.getSubjects();
    const subject = subjects.find((s) => s.id === subjectId);

    if (subject) {
      if (!subject.learningData) {
        subject.learningData = {};
      }

      if (subject.learningData[stepIndex]) {
        subject.learningData[stepIndex].completed = completed;
        if (score !== undefined) {
          subject.learningData[stepIndex].score = score;
        }
      }

      // Calculate overall progress
      const totalSteps = subject.roadmap?.steps.length || 0;
      const completedSteps = Object.values(subject.learningData).filter(
        (data) => data.completed,
      ).length;
      subject.progress =
        totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
      subject.lessons = totalSteps;

      this.saveSubjects(subjects);
    }
  }

  updateCriterionProgress(
    subjectId: string,
    stepIndex: number,
    criterionIndex: number,
    completed: boolean,
    score?: number,
  ): void {
    const subjects = this.getSubjects();
    const subject = subjects.find((s) => s.id === subjectId);

    if (subject) {
      if (!subject.learningData) {
        subject.learningData = {};
      }

      if (!subject.learningData[stepIndex]) {
        return; // Step doesn't exist
      }

      if (!subject.learningData[stepIndex].criterionLearningData) {
        subject.learningData[stepIndex].criterionLearningData = {};
      }

      if (
        subject.learningData[stepIndex].criterionLearningData![criterionIndex]
      ) {
        subject.learningData[stepIndex].criterionLearningData![
          criterionIndex
        ].completed = completed;
        if (score !== undefined) {
          subject.learningData[stepIndex].criterionLearningData![
            criterionIndex
          ].score = score;
        }
      }

      // Check if all criteria in this step are completed
      const stepData = subject.learningData[stepIndex];
      const criteriaCount = stepData.evaluationCriteria?.criteria.length || 0;
      const completedCriteria = Object.values(
        stepData.criterionLearningData || {},
      ).filter((data) => data.completed).length;

      // Mark step as completed if all criteria are completed
      if (criteriaCount > 0 && completedCriteria === criteriaCount) {
        stepData.completed = true;
        const avgScore =
          Object.values(stepData.criterionLearningData || {})
            .map((data) => data.score || 0)
            .reduce((sum, score) => sum + score, 0) / completedCriteria;
        stepData.score = Math.round(avgScore);
      }

      // Calculate overall progress
      const totalSteps = subject.roadmap?.steps.length || 0;
      const completedSteps = Object.values(subject.learningData).filter(
        (data) => data.completed,
      ).length;
      subject.progress =
        totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
      subject.lessons = totalSteps;

      this.saveSubjects(subjects);
    }
  }

  initializeCriterionLearningData(
    subjectId: string,
    stepIndex: number,
    criteria: string[],
  ): void {
    const subjects = this.getSubjects();
    const subject = subjects.find((s) => s.id === subjectId);

    if (subject) {
      if (!subject.learningData) {
        subject.learningData = {};
      }

      if (!subject.learningData[stepIndex]) {
        return; // Step doesn't exist
      }

      if (!subject.learningData[stepIndex].criterionLearningData) {
        subject.learningData[stepIndex].criterionLearningData = {};
      }

      criteria.forEach((criterion, index) => {
        if (!subject.learningData![stepIndex].criterionLearningData![index]) {
          subject.learningData![stepIndex].criterionLearningData![index] = {
            criterion,
            completed: false,
          };
        }
      });

      this.saveSubjects(subjects);
    }
  }

  getLearningContent(subjectId: string): LearningContent[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(this.LEARNING_CONTENT_KEY);
    const allContent: LearningContent[] = stored ? JSON.parse(stored) : [];
    return allContent.filter((content) => content.subjectId === subjectId);
  }

  saveLearningContent(content: LearningContent[]): void {
    if (typeof window === "undefined") return;
    const existing = this.getAllLearningContent();
    const updated = existing.filter(
      (c) => !content.some((nc) => nc.subjectId === c.subjectId),
    );
    updated.push(...content);
    localStorage.setItem(this.LEARNING_CONTENT_KEY, JSON.stringify(updated));
  }

  getAllLearningContent(): LearningContent[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(this.LEARNING_CONTENT_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  generateLearningContentFromRoadmap(subject: Subject): LearningContent[] {
    if (!subject.roadmap) return [];

    return subject.roadmap.steps.map((step, index) => {
      const stepData = subject.learningData?.[index];

      return {
        title: step,
        description: `${subject.name}の学習ステップ ${index + 1}`,
        type:
          index % 3 === 0 ? "lesson" : index % 3 === 1 ? "quiz" : "practice",
        difficulty:
          index < 2 ? "beginner" : index < 4 ? "intermediate" : "advanced",
        estimatedTime: "30分",
        completed: stepData?.completed || false,
        stepIndex: index,
        subjectId: subject.id,
        content: stepData?.learningMaterial?.material,
        questions: stepData?.testQuestions?.questions,
        criteria: stepData?.evaluationCriteria?.criteria,
      };
    });
  }

  generateCriterionBasedLearningContent(subject: Subject): LearningContent[] {
    if (!subject.roadmap || !subject.learningData) return [];

    const content: LearningContent[] = [];

    subject.roadmap.steps.forEach((step, stepIndex) => {
      const stepData = subject.learningData?.[stepIndex];

      if (!stepData?.evaluationCriteria) {
        // If no evaluation criteria exists, show a step initialization card
        content.push({
          title: step,
          description: `${step}の評価基準を作成し、学習を開始します`,
          type: "lesson",
          difficulty:
            stepIndex < 2
              ? "beginner"
              : stepIndex < 4
                ? "intermediate"
                : "advanced",
          estimatedTime: "5分",
          completed: false,
          stepIndex: stepIndex,
          subjectId: subject.id,
          isCriterionBased: false, // This is a step initialization, not criterion-based
        });
        return;
      }

      // Create content for each evaluation criterion
      stepData.evaluationCriteria.criteria.forEach(
        (criterion, criterionIndex) => {
          const criterionData =
            stepData.criterionLearningData?.[criterionIndex];

          content.push({
            title: `${criterion}`,
            description: `${step} - ${criterion}について学習します`,
            type: criterionIndex % 2 === 0 ? "lesson" : "quiz",
            difficulty:
              stepIndex < 2
                ? "beginner"
                : stepIndex < 4
                  ? "intermediate"
                  : "advanced",
            estimatedTime: "20分",
            completed: criterionData?.completed || false,
            stepIndex: stepIndex,
            subjectId: subject.id,
            content: criterionData?.learningMaterial?.material,
            questions: criterionData?.testQuestions?.questions,
            isCriterionBased: true,
            criterionIndex: criterionIndex,
            criterion: criterion,
            parentStepTitle: step,
          });
        },
      );
    });

    return content;
  }

  clearAllData(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.SUBJECTS_KEY);
    localStorage.removeItem(this.LEARNING_CONTENT_KEY);
    localStorage.removeItem(this.USER_PROGRESS_KEY);
  }

  // Default subjects for when user hasn't created any yet
  getDefaultSubjects(): Subject[] {
    return [
      {
        id: "getting-started",
        name: "学習を始める",
        icon: "🚀",
        gradient: "from-blue-500 to-purple-500",
        description: "新しい学習分野を追加してください",
        lessons: 0,
        progress: 0,
        createdAt: new Date().toISOString(),
      },
    ];
  }
}

export const storageManager = new StorageManager();
