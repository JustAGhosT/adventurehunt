import { prisma } from '../index';
import { StoryCreatorAI } from './ai/StoryCreatorAI';
import { GeographicExpertAI } from './ai/GeographicExpertAI';
import { VisualGeneratorAI } from './ai/VisualGeneratorAI';
import { SafetyValidatorAI } from './ai/SafetyValidatorAI';
import { CreativeBoosterAI } from './ai/CreativeBoosterAI';
import { io } from '../index';

export interface HuntGenerationParams {
  title: string;
  theme: string;
  difficulty: string;
  location_type: string;
  duration?: number;
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

  async generateHunt(huntId: string, params: HuntGenerationParams): Promise<void> {
    try {
      console.log(`Starting hunt generation for ${huntId}`);
      
      // Update progress to 10%
      await this.updateProgress(huntId, 10);

      // Step 1: Story Creation (20%)
      console.log('Step 1: Story Creation');
      const storyVariants = await this.storyCreator.generateStory(params);
      await this.saveVariants(huntId, 'story', storyVariants);
      await this.updateProgress(huntId, 30);

      // Step 2: Geographic Expert (40%)
      console.log('Step 2: Geographic Expert');
      const geoVariants = await this.geographicExpert.validateAndEnhance(storyVariants, params);
      await this.saveVariants(huntId, 'geographic', geoVariants);
      await this.updateProgress(huntId, 50);

      // Step 3: Visual Generator (60%)
      console.log('Step 3: Visual Generator');
      const visualVariants = await this.visualGenerator.generateVisuals(geoVariants, params);
      await this.saveVariants(huntId, 'visual', visualVariants);
      await this.updateProgress(huntId, 70);

      // Step 4: Safety Validator (80%)
      console.log('Step 4: Safety Validator');
      const safetyVariants = await this.safetyValidator.validateSafety(visualVariants, params);
      await this.saveVariants(huntId, 'safety', safetyVariants);
      await this.updateProgress(huntId, 85);

      // Step 5: Creative Booster (95%)
      console.log('Step 5: Creative Booster');
      const finalVariants = await this.creativeBooster.addInteractiveElements(safetyVariants, params);
      await this.saveVariants(huntId, 'creative', finalVariants);
      await this.updateProgress(huntId, 95);

      // Final step: Generate clues and complete hunt
      await this.generateClues(huntId, finalVariants);
      await this.completeHunt(huntId);

      console.log(`Hunt generation completed for ${huntId}`);
    } catch (error) {
      console.error(`Hunt generation failed for ${huntId}:`, error);
      await this.markHuntAsError(huntId);
      throw error;
    }
  }

  private async updateProgress(huntId: string, progress: number): Promise<void> {
    await prisma.hunt.update({
      where: { id: huntId },
      data: { progress }
    });

    // Notify clients via socket
    io.to(`hunt-${huntId}`).emit('hunt-progress', { huntId, progress });
  }

  private async saveVariants(huntId: string, stepName: string, variants: any[]): Promise<void> {
    for (const variant of variants) {
      await prisma.candidateVariant.create({
        data: {
          hunt_id: huntId,
          step_name: stepName,
          content: variant.content,
          ai_model_source: variant.source,
          ranking_score: variant.score
        }
      });
    }
  }

  private async generateClues(huntId: string, finalVariants: any[]): Promise<void> {
    // Select the best variant (highest score)
    const bestVariant = finalVariants.reduce((best, current) => 
      current.score > best.score ? current : best
    );

    const clues = bestVariant.content.clues || [];
    
    for (let i = 0; i < clues.length; i++) {
      const clue = clues[i];
      await prisma.clue.create({
        data: {
          hunt_id: huntId,
          sequence: i + 1,
          riddle_text: clue.riddle_text,
          location_hint: clue.location_hint,
          safety_notes: clue.safety_notes,
          audio_url: clue.audio_url,
          image_url: clue.image_url,
          verification_method: clue.verification_method || 'photo'
        }
      });
    }
  }

  private async completeHunt(huntId: string): Promise<void> {
    await prisma.hunt.update({
      where: { id: huntId },
      data: { 
        status: 'READY',
        progress: 100
      }
    });
  }

  private async markHuntAsError(huntId: string): Promise<void> {
    await prisma.hunt.update({
      where: { id: huntId },
      data: { status: 'ERROR' }
    });
  }
}