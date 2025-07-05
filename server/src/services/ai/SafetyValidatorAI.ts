import { VisualVariant } from './VisualGeneratorAI';
import { HuntGenerationParams } from '../AIOrchestrator';

export interface SafetyVariant {
  content: {
    narrative: string;
    characters: string[];
    setting: string;
    clues: Array<{
      riddle_text: string;
      location_hint: string;
      safety_notes: string;
      geographic_context: string;
      accessibility_notes: string;
      image_url?: string;
      visual_description: string;
      safety_level: 'low' | 'medium' | 'high';
      parental_guidance_required: boolean;
    }>;
  };
  source: string;
  score: number;
}

export class SafetyValidatorAI {
  async validateSafety(visualVariants: VisualVariant[], params: HuntGenerationParams): Promise<SafetyVariant[]> {
    const safetyVariants: SafetyVariant[] = [];
    
    for (const variant of visualVariants) {
      const validated = await this.validateAndEnhanceSafety(variant, params);
      safetyVariants.push(validated);
    }
    
    return safetyVariants;
  }

  private async validateAndEnhanceSafety(variant: VisualVariant, params: HuntGenerationParams): Promise<SafetyVariant> {
    // TODO: Implement actual safety validation
    // For now, adding mock safety enhancements
    
    const safetyClues = variant.content.clues.map(clue => ({
      ...clue,
      safety_level: this.assessSafetyLevel(clue.location_hint) as 'low' | 'medium' | 'high',
      parental_guidance_required: this.requiresParentalGuidance(clue.location_hint),
      safety_notes: this.enhanceSafetyNotes(clue.safety_notes, clue.location_hint)
    }));

    // Calculate safety score
    const avgSafetyLevel = safetyClues.reduce((sum, clue) => {
      const levelScore = clue.safety_level === 'low' ? 1 : clue.safety_level === 'medium' ? 2 : 3;
      return sum + levelScore;
    }, 0) / safetyClues.length;

    // Higher score for safer activities
    const safetyBonus = avgSafetyLevel < 1.5 ? 0.2 : avgSafetyLevel < 2.5 ? 0.1 : 0;

    return {
      content: {
        ...variant.content,
        clues: safetyClues
      },
      source: 'SafetyValidatorAI-v1',
      score: variant.score + safetyBonus
    };
  }

  private assessSafetyLevel(locationHint: string): string {
    if (locationHint.includes('water') || locationHint.includes('climb') || locationHint.includes('road')) {
      return 'high';
    }
    
    if (locationHint.includes('tree') || locationHint.includes('garden')) {
      return 'medium';
    }
    
    return 'low';
  }

  private requiresParentalGuidance(locationHint: string): boolean {
    return locationHint.includes('water') || 
           locationHint.includes('road') || 
           locationHint.includes('stranger') ||
           locationHint.includes('climb');
  }

  private enhanceSafetyNotes(originalNotes: string, locationHint: string): string {
    let enhanced = originalNotes;
    
    if (locationHint.includes('water')) {
      enhanced += " Never go in the water alone - always have a grown-up with you.";
    }
    
    if (locationHint.includes('tree')) {
      enhanced += " Stay on the ground - no climbing needed for this adventure!";
    }
    
    if (locationHint.includes('road') || locationHint.includes('street')) {
      enhanced += " Always hold hands with an adult near roads and look both ways.";
    }
    
    enhanced += " If you feel unsafe or confused, find your grown-up right away!";
    
    return enhanced;
  }
}