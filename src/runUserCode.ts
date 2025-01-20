import { exec } from 'child_process';

export const runUserCode = (filePath: string, inputFilePath: string, language: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const command = getRunCommand(filePath, inputFilePath, language);
        if (!command) {
            reject(new Error('Unsupported language'));
            return;
        }

        exec(command, (error, stdout, stderr) => {
            if (error || stderr) {
                if(error!=null) reject(new Error(stderr || error.message));
                return;
            }
            resolve(stdout.trim());
        });
    });
};

const getRunCommand = (filePath: string, inputFilePath: string, language: string): string | null => {
    switch (language) {
        case 'C++': return `g++ "${filePath}" -o "${filePath}.exe" && "${filePath}.exe" < "${inputFilePath}"`;
        case 'Python': return `python "${filePath}" < "${inputFilePath}"`;
        default: return null;
    }
};
