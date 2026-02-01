
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ScanType, RiskLevel, ScanResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    riskScore: { type: Type.INTEGER, description: "Risk score from 0 to 100" },
    riskLevel: { type: Type.STRING, description: "LOW, MEDIUM, HIGH, or CRITICAL" },
    analysis: { type: Type.STRING, description: "Detailed summary of the security analysis" },
    findings: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of specific red flags or positive indicators"
    },
    recommendations: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Actionable steps for the user"
    }
  },
  required: ["riskScore", "riskLevel", "analysis", "findings", "recommendations"]
};

export async function analyzeUrl(url: string): Promise<ScanResult> {
  const prompt = `Perform a comprehensive security analysis of the following URL: ${url}. 
  Check for phishing patterns, reputation, malicious redirection, and potential data harvesting. 
  Use Google Search grounding to verify the domain's reputation and any known reports of malicious activity.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA
    }
  });

  const data = JSON.parse(response.text);
  
  // Extract grounding sources
  const sources: any[] = [];
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (groundingChunks) {
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web) {
        sources.push({
          uri: chunk.web.uri,
          title: chunk.web.title
        });
      }
    });
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
    type: ScanType.LINK,
    target: url,
    ...data,
    sources
  };
}

export async function analyzeFile(fileName: string, fileContent: string, mimeType: string): Promise<ScanResult> {
  const prompt = `Analyze this file for security risks. 
  File Name: ${fileName}
  Mime Type: ${mimeType}
  
  Examine the file content for malicious code, suspicious patterns (like base64 encoded payloads in scripts, unusual API calls, or data exfiltration logic). 
  If the content is binary or large, provide analysis based on typical risks associated with this file type and the visible header/structure provided.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      { text: prompt },
      { inlineData: { data: fileContent, mimeType: mimeType } }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA
    }
  });

  const data = JSON.parse(response.text);

  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
    type: ScanType.FILE,
    target: fileName,
    ...data
  };
}
