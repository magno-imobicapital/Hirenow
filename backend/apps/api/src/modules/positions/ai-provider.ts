import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type ChatOptions = {
  temperature?: number;
  maxTokens?: number;
};

@Injectable()
export class AiProvider {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl =
      this.configService.get('AI_BASE_URL') || 'http://localhost:8317';
    this.apiKey = this.configService.get('AI_API_KEY') || '';
    this.model = this.configService.get('AI_MODEL') || 'gemini-2.5-flash';
  }

  async chat(
    messages: ChatMessage[],
    options: ChatOptions = {},
  ): Promise<string> {
    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey
          ? { Authorization: `Bearer ${this.apiKey}` }
          : {}),
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        stream: false,
        temperature: options.temperature ?? 0.2,
        max_tokens: options.maxTokens ?? 4096,
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `AI Provider error ${response.status}: ${body.slice(0, 200)}`,
      );
    }

    const body = await response.json();
    return body.choices?.[0]?.message?.content?.trim() || '';
  }
}
