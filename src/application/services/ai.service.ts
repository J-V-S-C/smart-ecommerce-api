import type { ProductRepository } from '../repositories/product.repository';
import { GoogleGenAI } from '@google/genai';

interface AIInput {
  input: string;
}

interface AIResponse {}

export class AIService {
  constructor(private productRepository: ProductRepository) {}

  /* async defineRepositoryToCall({ input }: AIInput): Promise<string> {
    const ai = new GoogleGenAI({});
    const extraContext =
      'Your job is to understand what the user wants, and return the name of the product that the user is asking for';

    const interaction = await ai.interactions.create({
      model: 'gemini-3.5-flash-lite',
      input,
    });
    if (!interaction.output_text) {
      throw new Error('AI response is empty');
    }

    return interaction.output_text;
  }*/

  async callAI({ input }: AIInput): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const ai = new GoogleGenAI({ apiKey });

    const getProductsFunction = {
      type: 'function',
      name: 'searchProducts',
      description: 'Search a product specified by user at a specific category.',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          category: { type: 'string' },
        },
      },
    } as const;

    const getProductsInteraction = await ai.interactions.create({
      model: 'gemini-3.5-flash-lite',
      input,
      tools: [getProductsFunction],
    });

    const products = async () => {
      for (const step of getProductsInteraction.steps) {
        if (step.type === 'function_call') {
          console.log(`Function to call: ${step.name}`);
          console.log(JSON.stringify(step.arguments));
          const products = await this.productRepository.searchProducts(
            step.arguments.name,
            step.arguments.category,
          );
          console.log('res: ', products);
          return products;
        }
      }
    };

    const resProductsInteraction = await ai.interactions.create({
      previous_interaction_id: getProductsInteraction.id,
      model: 'gemini-3.5-flash-lite',
      input:
        'List the products to the user and compares them: ' +
        JSON.stringify(await products()),
    });
    if (!resProductsInteraction.output_text) {
      throw new Error("AI didn't answer products!");
    }

    return resProductsInteraction.output_text;
  }
}
