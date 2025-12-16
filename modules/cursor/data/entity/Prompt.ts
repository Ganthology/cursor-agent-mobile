import { Image } from './Image';

/**
 * Prompt with text and optional images
 */
export interface Prompt {
  /**
   * The task or instructions for the agent to execute
   */
  text: string;
  /**
   * Optional array of base64 encoded images (max 5)
   */
  images?: Image[];
}
