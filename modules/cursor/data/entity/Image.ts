import { ImageDimension } from './ImageDimension';

/**
 * Base64 encoded image with optional dimensions
 * @example
 * {
 *   "data": "iVBORw0KGgoAAAANSUhEUgAA...",
 *   "dimension": { "width": 1024, "height": 768 }
 * }
 */
export interface Image {
  /**
   * Base64 encoded image data
   */
  data: string;
  /**
   * Optional image dimensions
   */
  dimension?: ImageDimension;
}
