export const GEMINI_API_KEY = "AIzaSyCa4pclqzhR4PaUyr81irTxp1rPQzEK3IU";
export const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GeminiRequest {
  contents: GeminiMessage[];
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

export class GeminiService {
  private static async makeRequest(request: GeminiRequest): Promise<string> {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response from Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  static async processVoiceCommand(
    voiceText: string, 
    selectedAction: string,
    availableEndpoints: Record<string, any>
  ): Promise<{
    intent: string;
    action: string;
    parameters: Record<string, any>;
    apiCall: {
      endpoint: string;
      method: string;
      payload?: any;
    } | null;
    response: string;
  }> {
    const systemPrompt = `You are an AI assistant for a business management system. 

Available API endpoints:
${JSON.stringify(availableEndpoints, null, 2)}

The user wants to work with: ${selectedAction}

Analyze the voice command and return a JSON response with:
{
  "intent": "what the user wants to do",
  "action": "specific action to take", 
  "parameters": "extracted parameters",
  "apiCall": {
    "endpoint": "exact API endpoint to call",
    "method": "HTTP method",
    "payload": "request body if needed"
  },
  "response": "friendly response to user"
}

If you cannot determine a specific API call, set apiCall to null.

Voice command: "${voiceText}"`;

    const request: GeminiRequest = {
      contents: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    const response = await this.makeRequest(request);
    
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      return {
        intent: 'unknown',
        action: 'parse_error',
        parameters: {},
        apiCall: null,
        response: 'I had trouble understanding your request. Please try again with a clearer command.'
      };
    }
  }

  static async processImageAnalysis(
    imageBase64: string,
    selectedAction: string,
    availableEndpoints: Record<string, any>
  ): Promise<{
    analysis: string;
    extractedData: Record<string, any>;
    suggestedActions: string[];
    apiCalls: Array<{
      endpoint: string;
      method: string;
      payload?: any;
    }>;
    response: string;
  }> {
    const systemPrompt = `You are an AI assistant analyzing business documents/images for a management system.

Available API endpoints:
${JSON.stringify(availableEndpoints, null, 2)}

Context: User is working with ${selectedAction}

Analyze this image and extract relevant business data. Return JSON with:
{
  "analysis": "description of what you see",
  "extractedData": "structured data extracted from image",
  "suggestedActions": ["list of suggested actions"],
  "apiCalls": [{"endpoint": "api to call", "method": "HTTP method", "payload": "data to send"}],
  "response": "friendly response to user"
}`;

    const request: GeminiRequest = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: systemPrompt },
            {
              text: `data:image/jpeg;base64,${imageBase64}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    const response = await this.makeRequest(request);
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      return {
        analysis: 'Image analysis failed',
        extractedData: {},
        suggestedActions: [],
        apiCalls: [],
        response: 'I had trouble analyzing the image. Please try uploading a clearer image.'
      };
    }
  }
}