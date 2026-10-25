import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Product } from '../../../src/application/domain/product';
import { InMemoryProductRepository } from '../../../src/application/repositories/in-memory/in-memory.product.repository';
import { AIService } from '../../../src/application/services/ai.service';

const createMock = vi.fn();

vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(function () {
    return {
      interactions: {
        create: createMock,
      },
    };
  }),
}));

describe('AIService', () => {
  let repository: InMemoryProductRepository;
  let service: AIService;

  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test-key';
    repository = new InMemoryProductRepository();
    service = new AIService(repository);
    createMock.mockReset();
  });

  it('uses Gemini function calling with the product catalog', async () => {
    await repository.create(
      new Product(
        'product-1',
        'Óculos de Sol',
        'acessorios',
        'Óculos de sol com lente polarizada e proteção UV400.',
        149.9,
      ),
    );

    createMock
      .mockResolvedValueOnce({
        id: 'interaction-1',
        steps: [
          {
            type: 'function_call',
            id: 'call-1',
            name: 'getProducts',
            arguments: {
              name: 'óculos',
              category: 'acessorios',
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        id: 'interaction-2',
        output_text: 'Encontrei um produto ideal: Óculos de Sol por R$ 149.90.',
      });

    const result = await service.callAI({
      input: 'Quero os óculos de sol mais baratos',
    });

    expect(createMock).toHaveBeenCalledTimes(2);
    expect(result).toContain('Óculos de Sol');
    expect(result).toContain('149.90');
  });
});
