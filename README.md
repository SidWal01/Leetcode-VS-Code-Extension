# cp-leetcode VS Code Extension

## Overview

The `cp-leetcode` extension for Visual Studio Code simplifies competitive programming workflows by automating the fetching of test cases from LeetCode problems and enabling seamless testing of user solutions against these test cases. It is tailored for programmers looking to streamline problem-solving directly within VS Code.

## Features

1. **Fetch Test Cases:**
   - Extracts input and output test cases from a given LeetCode problem URL.
   - Saves each input and output in separate files (`input_1.txt`, `output_1.txt`, etc.) under `inputs/` and `outputs/` directories.
2. **Run and Compare:**
   - Executes the user’s code against all test cases.
   - Compares the user’s output with the expected output.
   - Displays success or failure for each test case.
3. **Starter Code Generation:**
   - Creates a starter solution file based on the selected programming language (e.g., C++, Python).

## Installation

### Prerequisites

1. **Install Node.js and npm:**
   - [Download Node.js](https://nodejs.org/) and follow the installation instructions for your operating system.
   - Verify the installation by running:
     ```bash
     node -v
     npm -v
     ```

2. **Install Visual Studio Code:**
   - [Download VS Code](https://code.visualstudio.com/) and install it.

### Clone and Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-repo-name/cp-leetcode.git
   cd cp-leetcode
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Open the Extension in VS Code:**
   - Open the `cp-leetcode` folder in Visual Studio Code.

4. **Run the Extension:**
   - Open the Debug panel in VS Code (`Ctrl+Shift+D` or `Cmd+Shift+D` on macOS).
   - Select `Run Extension` and click the play button.

## Commands

### 1. Fetch Test Cases

- **Command Name:** `cp-leetcode.fetchTestCases`
- **Description:**
  - Prompts the user to select a programming language and input a LeetCode problem URL.
  - Extracts test cases (inputs and outputs) from the problem.
  - Saves them in `inputs/` and `outputs/` directories within the workspace.

### 2. Run and Compare

- **Command Name:** `cp-leetcode.runAndCompare`
- **Description:**
  - Executes the user’s solution against the test cases.
  - Compares the user’s output with the expected output for each test case.
  - Displays results for all test cases, indicating success or failure.

## Usage

### Fetching Test Cases

1. Open a folder in VS Code where you want to save the test cases.
2. Trigger the `Fetch Test Cases` command from the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
3. Follow the prompts:
   - Select a programming language.
   - Provide the LeetCode problem URL.
4. Check the `inputs/` and `outputs/` directories for the extracted test cases.

### Running and Comparing

1. Open your solution file in the editor.
2. Trigger the `Run and Compare` command from the Command Palette.
3. View the results for each test case directly in the VS Code interface.

## Project Structure

```
.
├── .vscode/                    # VS Code configuration files.
│   ├── extensions.json
│   ├── launch.json
│   ├── settings.json
│   └── tasks.json
├── dist/                       # Compiled output files.
│   ├── extension.js
│   ├── extension.js.map
│   └── extension.js.LICENSE.txt
├── inputs/                     # Directory for input files.
├── outputs/                    # Directory for output files.
├── node_modules/               # Node.js dependencies.
├── src/                        # Source code directory.
│   ├── extension.ts            # Main extension logic.
│   ├── normalizeOutput.ts      # Utility functions for cleaning and normalizing outputs.
│   ├── runUserCode.ts          # Executes user code and captures output.
│   ├── languageUtils.ts        # Helper functions for language-specific operations.
│   └── getLanguageFromExtension.ts # Helper to determine programming language.
├── .gitignore                  # Ignored files for Git.
├── .vscodeignore               # Ignored files for VS Code extension packaging.
├── package.json                # Extension metadata and dependencies.
├── package-lock.json           # Locked dependency versions.
├── README.md                   # Documentation for the extension.
├── tsconfig.json               # TypeScript configuration.
├── webpack.config.js           # Webpack bundler configuration.
└── CHANGELOG.md                # Extension changelog.
```

## Dependencies

- [Puppeteer](https://pptr.dev/): For web scraping test cases from LeetCode.
- [Visual Studio Code API](https://code.visualstudio.com/api): For creating and managing extension commands.
- Node.js and npm: For managing the project and its dependencies.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push the branch.
4. Submit a pull request describing your changes.


## Known Issues

- Ensure the LeetCode URL provided is valid and accessible.
- Inputs and outputs are saved based on the order extracted; mismatches might occur if the problem format changes.
- Sometimes after do some changes in code, do "npm run compile" in cp-leetcode directory. 

## Future Enhancements

- Support for additional programming languages.
- Improved error handling for test case extraction.
- Integration with LeetCode’s API for a more robust solution.
- Better GUI.
- Directly code submission to the respective leetcode problem only if all the test cases successfully passed.

## Acknowledgments

- The VS Code team for the extension framework.
- OpenAI for insights and assistance in developing this extension.

