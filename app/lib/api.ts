const API_BASE_URL = "http://127.0.0.1:8000";

export interface GoalRequest {
  topic: string;
  motivation: string;
  learning_period: string;
}

export interface RoadmapRequest {
  topic: string;
  goal: string;
  learning_period: string;
}

export interface EvaluationCriteriaRequest {
  topic: string;
  learning_period: string;
  step: string;
}

export interface TestQuestionsRequest {
  topic: string;
  learning_period: string;
  step: string;
  evaluation_criteria: string[];
}

export interface LearningMaterialRequest {
  topic: string;
  learning_period: string;
  step: string;
  criteria: string[];
  test_questions: string[];
}

export interface MotivationToGoal {
  topic: string;
  goal: string;
  motivation: string;
  learning_period: string;
}

export interface Roadmap {
  topic: string;
  goal: string;
  learning_period: string;
  steps: string[];
}

export interface EvaluationCriteria {
  topic: string;
  learning_period: string;
  step: string;
  criteria: string[];
}

export interface TestQuestions {
  topic: string;
  learning_period: string;
  step: string;
  evaluation_criteria: string[];
  questions: string[];
}

export interface LearningMaterial {
  topic: string;
  learning_period: string;
  step: string;
  criteria: string[];
  test_questions: string[];
  material: string;
}

class APIClient {
  private async makeRequest<T>(
    endpoint: string,
    data:
      | GoalRequest
      | RoadmapRequest
      | EvaluationCriteriaRequest
      | TestQuestionsRequest
      | LearningMaterialRequest,
  ): Promise<T> {
    try {
      console.log(`API Request to ${endpoint}:`, JSON.stringify(data, null, 2));

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error(
          `API Response Error for ${endpoint}:`,
          response.status,
          response.statusText,
        );

        // Try to get the error details from response body
        try {
          const errorBody = await response.text();
          console.error(`API Error Body for ${endpoint}:`, errorBody);
          throw new Error(
            `HTTP error! status: ${response.status}, body: ${errorBody}`,
          );
        } catch {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const result = await response.json();
      console.log(`API Response from ${endpoint}:`, result);
      return result;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async createGoal(request: GoalRequest): Promise<MotivationToGoal> {
    return this.makeRequest<MotivationToGoal>("/goal", request);
  }

  async createRoadmap(request: RoadmapRequest): Promise<Roadmap> {
    return this.makeRequest<Roadmap>("/roadmap", request);
  }

  async createEvaluationCriteria(
    request: EvaluationCriteriaRequest,
  ): Promise<EvaluationCriteria> {
    return this.makeRequest<EvaluationCriteria>(
      "/evaluation-criteria",
      request,
    );
  }

  async createTestQuestions(
    request: TestQuestionsRequest,
  ): Promise<TestQuestions> {
    return this.makeRequest<TestQuestions>("/test-questions", request);
  }

  async createLearningMaterial(
    request: LearningMaterialRequest,
  ): Promise<LearningMaterial> {
    return this.makeRequest<LearningMaterial>("/learning-material", request);
  }
}

export const apiClient = new APIClient();
