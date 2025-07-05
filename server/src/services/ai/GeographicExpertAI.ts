import { StoryVariant } from './StoryCreatorAI';
import { HuntGenerationParams } from '../AIOrchestrator';

export interface GeoVariant {
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
    }>;
  };
  source: string;
  score: number;
}

export class GeographicExpertAI {
  async validateAndEnhance(storyVariants: StoryVariant[], params: HuntGenerationParams): Promise<GeoVariant[]> {
    const geoVariants: GeoVariant[] = [];
    
    for (const variant of storyVariants) {
      const enhanced = await this.enhanceWithGeographicContext(variant, params);
      geoVariants.push(enhanced);
    }
    
    return geoVariants;
  }

  private async enhanceWithGeographicContext(variant: StoryVariant, params: HuntGenerationParams): Promise<GeoVariant> {
    // TODO: Implement actual geographic validation and enhancement
    // For now, adding mock geographic context
    
    const enhancedClues = variant.content.clues.map(clue => ({
      ...clue,
      geographic_context: this.getGeographicContext(clue.location_hint, params.location_type),
      accessibility_notes: this.getAccessibilityNotes(clue.location_hint)
    }));

    return {
      content: {
        ...variant.content,
        clues: enhancedClues
      },
      source: 'GeographicExpertAI-v1',
      score: variant.score + 0.1 // Slight boost for geographic enhancement
    };
  }

  private getGeographicContext(locationHint: string, locationType: string): string {
    const contexts = {
      indoor: "This location is inside a building, making it weather-independent and accessible year-round.",
      outdoor: "This outdoor location offers fresh air and natural surroundings, weather permitting.",
      mixed: "This location can be accessed both indoors and outdoors, providing flexibility."
    };

    return contexts[locationType as keyof typeof contexts] || contexts.mixed;
  }

  private getAccessibilityNotes(locationHint: string): string {
    if (locationHint.includes('tree') || locationHint.includes('climb')) {
      return "This location is at ground level - no climbing required for safety.";
    }
    
    if (locationHint.includes('water')) {
      return "This location is near water - always stay on dry land and have an adult with you.";
    }
    
    return "This location is easily accessible and safe for children with adult supervision.";
  }
}