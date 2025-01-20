export function getFileExtension(language: string): string {
    switch (language) {
        case "C++": return "cpp";
        case "Python": return "py";
        default: return "txt";
    }
}

export function getStarterCode(language: string): string {
    switch (language) {
        case "C++": 
            return `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    return 0;\n}`;
        case "Python": 
            return `# Write your code here\ndef main():\n    pass\n\nif __name__ == "__main__":\n    main()`;
        default: 
            return "// Unsupported language";
    }
}

export function getLanguageFromExtension(extension: string): string | null {
    switch (extension) {
        case "cpp": return "C++";
        case "python": return "Python";
        default: return null;
    }
}
