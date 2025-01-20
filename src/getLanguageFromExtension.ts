export function getLanguageFromExtension(extension: string): string | null {
    switch (extension) {
        case "cpp": return "C++";
        case "python": return "Python";
        default: return null;
    }
}
