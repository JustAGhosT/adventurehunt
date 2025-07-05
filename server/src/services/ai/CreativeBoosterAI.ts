import { SafetyVariant } from './SafetyValidatorAI';
import { HuntGenerationParams } from '../AIOrchestrator';

export interface CreativeVariant {
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
      audio_url?: string;
      interactive_elements: string[];
      success_message: string;
    }>;
    completion_reward: {
      message: string;
      badge_name: string;
      certificate_text: string;
    };
  };
  source: string;
  score: number;
}

export class CreativeBoosterAI {
  async addInteractiveElements(safetyVariants: SafetyVariant[], params: HuntGenerationParams): Promise<CreativeVariant[]> {
    const creativeVariants: CreativeVariant[] = [];
    
    for (const variant of safetyVariants) {
      const enhanced = await this.addCreativeElements(variant, params);
      creativeVariants.push(enhanced);
    }
    
    return creativeVariants;
  }

  private async addCreativeElements(variant: SafetyVariant, params: HuntGenerationParams): Promise<CreativeVariant> {
    // TODO: Implement actual creative enhancement
    // For now, adding mock interactive elements
    
    const creativeClues = variant.content.clues.map((clue, index) => ({
      ...clue,
      audio_url: this.getAudioUrl(params.theme, index),
      interactive_elements: this.getInteractiveElements(clue.location_hint, params.theme),
      success_message: this.getSuccessMessage(params.theme, index)
    }));

    const completionReward = this.getCompletionReward(params.theme, params.difficulty);

    return {
      content: {
        ...variant.content,
        clues: creativeClues,
        completion_reward: completionReward
      },
      source: 'CreativeBoosterAI-v1',
      score: variant.score + 0.25 // Boost for creative enhancement
    };
  }

  private getAudioUrl(theme: string, index: number): string {
    // TODO: Generate actual audio URLs
    // For now, returning placeholder URLs
    return `https://example.com/audio/${theme}-clue-${index + 1}.mp3`;
  }

  private getInteractiveElements(locationHint: string, theme: string): string[] {
    const elements = [];
    
    if (locationHint.includes('water')) {
      elements.push('Take a photo of your reflection in the water');
      elements.push('Count how many different things you can see in the water');
    }
    
    if (locationHint.includes('tree')) {
      elements.push('Find three different types of leaves near the tree');
      elements.push('Make a rubbing of the tree bark with paper');
    }
    
    if (locationHint.includes('flower')) {
      elements.push('Count how many different colors of flowers you can see');
      elements.push('Draw your favorite flower you discover');
    }
    
    // Add theme-specific elements
    if (theme === 'pirates') {
      elements.push('Strike a pirate pose and take a photo');
      elements.push('Make a pirate "Arrr!" sound');
    }
    
    if (theme === 'nature') {
      elements.push('Listen for bird sounds and try to copy them');
      elements.push('Find something that feels rough and something that feels smooth');
    }
    
    return elements.length > 0 ? elements : ['Take a photo of what you found', 'Give yourself a high five for being awesome!'];
  }

  private getSuccessMessage(theme: string, clueIndex: number): string {
    const messages = {
      pirates: [
        "Arrr! Ye found it, brave pirate! The treasure is getting closer!",
        "Shiver me timbers! Ye be a true treasure hunter!",
        "Yo ho ho! Captain Redbeard would be proud of ye!"
      ],
      nature: [
        "Amazing! The forest friends are so happy you found this!",
        "You're a wonderful nature explorer! The animals are cheering!",
        "Fantastic! You're helping save the forest treasures!"
      ],
      city: [
        "Great detective work! You're solving the mystery!",
        "Excellent! The city is smiling because of your help!",
        "Wonderful! You're making the city a happier place!"
      ]
    };

    const themeMessages = messages[theme as keyof typeof messages] || messages.nature;
    return themeMessages[clueIndex % themeMessages.length];
  }

  private getCompletionReward(theme: string, difficulty: string): { message: string; badge_name: string; certificate_text: string } {
    const rewards = {
      pirates: {
        message: "Congratulations, brave pirate! You've found Captain Redbeard's treasure and proven yourself a true adventure seeker!",
        badge_name: "Treasure Hunter Supreme",
        certificate_text: "This certifies that you are an official Pirate Treasure Hunter who has successfully completed the great treasure quest!"
      },
      nature: {
        message: "Amazing work, nature explorer! You've helped all the forest friends and shown great care for the environment!",
        badge_name: "Forest Guardian",
        certificate_text: "This certifies that you are an official Nature Explorer who has helped protect and discover the wonders of the natural world!"
      },
      city: {
        message: "Excellent detective work! You've solved the mystery and made the whole city smile again!",
        badge_name: "City Detective",
        certificate_text: "This certifies that you are an official City Detective who has successfully solved the mystery and helped the community!"
      }
    };

    return rewards[theme as keyof typeof rewards] || rewards.nature;
  }
}