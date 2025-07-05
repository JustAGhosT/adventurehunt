import { HuntGenerationParams } from '../AIOrchestrator';

export interface StoryVariant {
  content: {
    narrative: string;
    characters: string[];
    setting: string;
    clues: Array<{
      riddle_text: string;
      location_hint: string;
      safety_notes: string;
    }>;
  };
  source: string;
  score: number;
}

export class StoryCreatorAI {
  async generateStory(params: HuntGenerationParams): Promise<StoryVariant[]> {
    // TODO: Implement actual AI service calls
    // For now, returning mock data for different themes
    
    const variants: StoryVariant[] = [];
    
    // Generate 2-3 story variants
    for (let i = 0; i < 2; i++) {
      const variant = await this.generateStoryVariant(params, i);
      variants.push(variant);
    }
    
    return variants;
  }

  private async generateStoryVariant(params: HuntGenerationParams, index: number): Promise<StoryVariant> {
    // Mock story generation based on theme
    const storyTemplates = {
      pirates: {
        narrative: "Captain Redbeard has hidden his treasure somewhere around here! Follow the clues to find the legendary treasure chest before other pirates discover it.",
        characters: ["Captain Redbeard", "Parrot Pete", "Treasure Guardian"],
        setting: "A mysterious island with hidden caves and ancient trees",
        clues: [
          {
            riddle_text: "Where the sun rises bright and the grass grows green, look for the spot where water can be seen.",
            location_hint: "Near a water source in the morning sun area",
            safety_notes: "Stay on marked paths, don't go near deep water without an adult"
          },
          {
            riddle_text: "Count the steps of the tallest friend, beneath its shade your search won't end.",
            location_hint: "Under the biggest tree in the area",
            safety_notes: "Look but don't climb, always have an adult nearby"
          }
        ]
      },
      nature: {
        narrative: "The Forest Friends need your help! Animals have lost their special treasures and only a brave explorer can help them find what's missing.",
        characters: ["Wise Owl", "Busy Squirrel", "Friendly Rabbit"],
        setting: "A magical forest where animals talk and adventures await",
        clues: [
          {
            riddle_text: "Where flowers bloom and bees like to play, look for the colors that brighten the day.",
            location_hint: "In the garden or flower bed area",
            safety_notes: "Don't touch unknown plants, watch for bees but don't disturb them"
          },
          {
            riddle_text: "Where birds gather to sing their song, on something strong and tall and long.",
            location_hint: "Near a fence, pole, or tree where birds perch",
            safety_notes: "Observe birds from a safe distance, don't make loud noises"
          }
        ]
      },
      city: {
        narrative: "Welcome to the Amazing City Adventure! You're a city detective on a mission to solve the mystery of the missing smile stones that make everyone happy.",
        characters: ["Detective Bright", "Mayor Cheerful", "City Helper"],
        setting: "A vibrant city with friendly shops, colorful streets, and helpful people",
        clues: [
          {
            riddle_text: "Where people gather to buy and eat, look for the place with the tasty treat.",
            location_hint: "Near a store, market, or food area",
            safety_notes: "Stay with your grown-up, don't talk to strangers, look both ways"
          },
          {
            riddle_text: "Where wheels go round and people wait, find the spot by the city gate.",
            location_hint: "Near a bus stop, parking area, or entrance",
            safety_notes: "Stay away from moving vehicles, hold an adult's hand near roads"
          }
        ]
      }
    };

    const template = storyTemplates[params.theme as keyof typeof storyTemplates] || storyTemplates.nature;
    
    // Adjust difficulty
    const difficultyMultiplier = params.difficulty === 'easy' ? 0.8 : params.difficulty === 'hard' ? 1.2 : 1.0;
    const baseScore = 0.7 + (index * 0.1) + (Math.random() * 0.2);
    
    return {
      content: {
        ...template,
        clues: template.clues.slice(0, Math.ceil(template.clues.length * difficultyMultiplier))
      },
      source: 'StoryCreatorAI-v1',
      score: baseScore
    };
  }
}