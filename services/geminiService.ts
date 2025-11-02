import { GoogleGenAI, Type } from "@google/genai";
import { CreativePrompts } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export interface AudioAnalysisResult {
  emotion: string;
  transcription: string;
}

export const analyzeEmotionFromImage = async (base64Image: string, mimeType: string): Promise<string> => {
  const imagePart = {
    inlineData: {
      mimeType: mimeType,
      data: base64Image,
    },
  };
  const textPart = {
    text: "Analyze the facial expression in this image. Describe the primary emotion in one or two words (e.g., 'Joyful', 'Sad', 'Contemplative')."
  };
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
  });

  return response.text.trim();
};

export const analyzeEmotionFromText = async (text: string): Promise<string> => {
  const prompt = `Analyze the sentiment of the following text and describe the primary emotion in one or two words (e.g., 'Joyful', 'Angry', 'Calm'). Text: "${text}"`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text.trim();
};

export const transcribeAndAnalyzeEmotionFromAudio = async (base64Audio: string, mimeType: string): Promise<AudioAnalysisResult> => {
  const audioPart = {
    inlineData: {
      mimeType,
      data: base64Audio,
    },
  };
  const promptPart = {
    text: `1. Transcribe the spoken words in this audio file.
           2. Analyze the transcription and the speaker's tone to determine the primary emotion. Describe this emotion in one or two words (e.g., 'Happy', 'Frustrated').
           Return a single, raw JSON object with "transcription" and "emotion" keys only.`
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts: [audioPart, promptPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          transcription: {
            type: Type.STRING,
            description: "The transcribed text from the audio.",
          },
          emotion: {
            type: Type.STRING,
            description: "The analyzed emotion from the audio.",
          },
        },
        required: ["transcription", "emotion"],
      },
    },
  });

  const jsonText = response.text.trim();
  return JSON.parse(jsonText);
};


export const generateCreativePrompts = async (emotion: string): Promise<CreativePrompts> => {
  const prompt = `Based on the emotion "${emotion}", generate an art prompt for an AI image generator. The prompt should be detailed, evocative, and describe a scene, character, or abstract concept that visually represents this emotion.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          artPrompt: {
            type: Type.STRING,
            description: "The detailed prompt for image generation.",
          },
        },
        required: ["artPrompt"],
      },
    },
  });

  const jsonText = response.text.trim();
  return JSON.parse(jsonText);
};

export const generateImage = async (prompt: string): Promise<string> => {
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '1:1',
    },
  });

  if (response.generatedImages && response.generatedImages.length > 0) {
    return response.generatedImages[0].image.imageBytes;
  }
  
  throw new Error("Image generation failed or returned no images.");
};