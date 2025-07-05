import { GeoVariant } from './GeographicExpertAI';
import { HuntGenerationParams } from '../AIOrchestrator';

export interface VisualVariant {
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
    }>;
  };
  source: string;
  score: number;
}

export class VisualGeneratorAI {
  async generateVisuals(geoVariants: GeoVariant[], params: HuntGenerationParams): Promise<VisualVariant[]> {
    const visualVariants: VisualVariant[] = [];
    
    for (const variant of geoVariants) {
      const enhanced = await this.addVisualElements(variant, params);
      visualVariants.push(enhanced);
    }
    
    return visualVariants;
  }

  private async addVisualElements(variant: GeoVariant, params: HuntGenerationParams): Promise<VisualVariant> {
    // TODO: Implement actual visual generation
    // For now, adding mock visual elements with Pexels URLs
    
    const visualClues = variant.content.clues.map((clue, index) => ({
      ...clue,
      image_url: this.getThematicImage(params.theme, index),
      visual_description: this.getVisualDescription(clue.location_hint, params.theme)
    }));

    return {
      content: {
        ...variant.content,
        clues: visualClues
      },
      source: 'VisualGeneratorAI-v1',
      score: variant.score + 0.15 // Boost for visual enhancement
    };
  }

  private getThematicImage(theme: string, index: number): string {
    const imageUrls = {
      pirates: [
        'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
        'https://images.pexels.com/photos/235985/pexels-photo-235985.jpeg'
      ],
      nature: [
        'https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg',
        'https://images.pexels.com/photos/132037/pexels-photo-132037.jpeg'
      ],
      city: [
        'https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg',
        'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg'
      ]
    };

    const urls = imageUrls[theme as keyof typeof imageUrls] || imageUrls.nature;
    return urls[index % urls.length];
  }

  private getVisualDescription(locationHint: string, theme: string): string {
    if (locationHint.includes('water')) {
      return `Look for sparkly, clear water that reflects the sky like a mirror. ${theme === 'pirates' ? 'Pirates often hid treasures near water!' : 'Nature loves water - it brings life everywhere!'}`;
    }
    
    if (locationHint.includes('tree')) {
      return `Find a tall, strong tree with branches reaching toward the sky. ${theme === 'nature' ? 'Trees are homes for many forest friends!' : 'Trees are perfect hiding spots for adventurers!'}`;
    }
    
    return `Look around carefully for something that matches the clue. You're doing great, explorer!`;
  }
}