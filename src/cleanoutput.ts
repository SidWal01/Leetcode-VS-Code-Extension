/**
 * Cleans the input string to normalize it for comparison.
 * This function removes extra whitespaces, trims leading/trailing spaces,
 * and ensures a consistent format.
 *
 * @param input - The input string to clean.
 * @returns The cleaned input string.
 */
export function cleanInput1(input: string): string {
    let cleanedArray = input
    .split(/\b[a-zA-Z_0-9]+\s*=\s*/) // Split at variable assignment
    .filter(part => part.trim() !== "") // Remove empty parts
    .map(part => part.trim()) // Trim each part
    .map(part => part
      .replace(/"/g, '') // Remove double quotes
      .replace(/[\[\]]/g, '') // Remove brackets
      .replace(/,/g, ' ') // Replace commas with spaces
    );

  // Join the cleaned array into a string with each part on a new line
  let cleaned = cleanedArray.join('\n');
  return cleaned;
}