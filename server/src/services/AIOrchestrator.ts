import { StoryCreatorAI } from './ai/StoryCreatorAI.js';
import { GeographicExpertAI } from './ai/GeographicExpertAI.js';
import { VisualGeneratorAI } from './ai/VisualGeneratorAI.js';
import { SafetyValidatorAI } from './ai/SafetyValidatorAI.js';
import { CreativeBoosterAI } from './ai/CreativeBoosterAI.js';

export interface HuntRequest {
  theme: string;
  difficulty: 'easy' | 'medium' | 'hard';
  locationType: 'indoor' | 'outdoor' | 'mixed';
  duration: number;
  ageGroup: string;
}

export interface HuntResponse {
  id: string;
  title: string;
  description: string;
  clues: Array<{
    id: string;
    text: string;
    location: string;
    hint?: string;
  }>;
  estimatedDuration: number;
  safetyNotes: string[];
}

export class AIOrchestrator {
  private storyCreator: StoryCreatorAI;
  private geographicExpert: GeographicExpertAI;
  private visualGenerator: VisualGeneratorAI;
  private safetyValidator: SafetyValidatorAI;
  private creativeBooster: CreativeBoosterAI;

  constructor() {
    this.storyCreator = new StoryCreatorAI();
    this.geographicExpert = new GeographicExpertAI();
    this.visualGenerator = new VisualGeneratorAI();
    this.safetyValidator = new SafetyValidatorAI();
    this.creativeBooster = new CreativeBoosterAI();
  }

  async generateHunt(request: HuntRequest): Promise<HuntResponse> {
    try {
      // Step 1: Generate story and theme
      const storyData = await this.storyCreator.generateStory(request);
      
      // Step 2: Add geographic context
      const geoData = await this.geographicExpert.validateLocations(storyData, request);
      
      // Step 3: Generate visual elements
      const visualData = await this.visualGenerator.generateVisuals(geoData);
      
      // Step 4: Validate safety
      const safetyData = await this.safetyValidator.validateContent(visualData);
      
      // Step 5: Add creative enhancements
      const finalHunt = await this.creativeBooster.enhanceHunt(safetyData);
      
      return finalHunt;
    } catch (error) {
      console.error('AI Orchestration failed:', error);
      throw new Error('Failed to generate hunt');
    }
  }

  async getGenerationStatus(jobId: string): Promise<{ status: string; progress: number }> {
    // Placeholder for job status tracking
    return { status: 'completed', progress: 100 };
  }
}