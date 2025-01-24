export const normalizeOutput = (output: string): string => {
    return output
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line !== '')
        .join('\n');
};
/**
 * Cleans the input string to normalize it for comparison.
 * Handles both 1D and 2D arrays:
 * - For 1D arrays, adds the size of the array and the content.
 * - For 2D arrays, adds the row count, then for each row, the column count and row content.
 *
 * @param input - The input string to clean.
 * @returns The cleaned input string with sizes included for arrays.
 */
export function cleanInput(input: string): string {
  let cleanedArray = input
      .split(/\b[a-zA-Z_0-9]+\s*=\s*/) // Split at variable assignment
      .filter(part => part.trim() !== "") // Remove empty parts
      .map(part => part.trim()) // Trim each part
      .map(part => {
          if (part.includes('[')) { // Check if it contains an array
              const arrayContent = part
                  .replace(/"/g, '') // Remove double quotes
                  .replace(/\s/g, '') // Remove extra whitespace
                  .replace(/,$/, '') // Remove trailing commas
                  .replace(/],/g, ']|') // Temporary marker for splitting rows
                  .replace(/[\[\]]/g, ''); // Remove brackets

              const rows = arrayContent.split('|'); // Split into rows

              if (rows.length === 1) {
                  // Handle 1D array
                  const columns = rows[0].split(','); // Split columns
                  const colCount = columns.length; // Number of elements in the array
                  return `${colCount}\n${columns.join(' ')}`; // Add size and content
              } else {
                  // Handle 2D array
                  const rowCount = rows.length; // Number of rows
                  const formattedRows = rows.map(row => {
                      if (row.trim() === '') return '0\n'; // Empty row
                      const columns = row.split(','); // Split columns
                      const colCount = columns.length; // Number of columns
                      return `${colCount}\n${columns.join(' ')}`; // Add size and content
                  });
                  return `${rowCount}\n${formattedRows.join('\n')}`; // Add row count and formatted rows
              }
          } else {
              return part; // Return as is if no array is detected
          }
      });

  // Join the cleaned array into a string with each part on a new line
  return cleanedArray.join('\n');
}
