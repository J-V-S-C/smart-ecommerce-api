import type { Request, Response } from 'express';
import { z } from 'zod';
import type { AIService } from '../../application/services/ai.service';

const aiRequestSchema = z.object({ input: z.string().min(1) });

export class AIController {
  constructor(private readonly aiService: AIService) {}

  async callAI(req: Request, res: Response): Promise<Response> {
    const parsed = aiRequestSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.issues });
    return res.status(200).json({ output: await this.aiService.callAI(parsed.data) });
  }
}
