import * as vscode from 'vscode';
import puppeteer from 'puppeteer';
import { cleanInput } from './normalizeOutput';
import * as fs from 'fs/promises';
import * as path from 'path';
import { getLanguageFromExtension } from './getLanguageFromExtension';
import { getFileExtension } from './languageUtils';
import { getStarterCode } from './languageUtils';
import { normalizeOutput } from './normalizeOutput';
import { runUserCode } from './runUserCode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "cp-leetcode" starts ...');

    const fetchTestCasesCommand = vscode.commands.registerCommand(
        'cp-leetcode.fetchTestCases',
        async () => {
            const inputFiles = await vscode.workspace.findFiles('**/inputs.txt', '**/node_modules/**', 1);
            let inputFilePath: vscode.Uri;
            if (inputFiles.length === 0) {
                if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
                    vscode.window.showErrorMessage("Please open a folder in VS Code to proceed.");
                    return;
            }
            const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
            const inputFilePath = path.join(workspacePath, 'inputs.txt');
            try {
                await fs.writeFile(inputFilePath, '', { flag: 'wx' });
                vscode.window.showInformationMessage('An empty inputs.txt file has been created.');
            } catch {
                console.log('inputs.txt already exists.');
            }
            } else {
                inputFilePath = inputFiles[0];
            }

            const languages = ["C++", "Python"];
            const selectedLanguage = await vscode.window.showQuickPick(languages, {
                placeHolder: "Select a programming language",
            });
            if (!selectedLanguage) {
                vscode.window.showErrorMessage("Language selection is required");
                console.log("No language selected");
                return;
            }

            const url = await vscode.window.showInputBox({
                placeHolder: 'Enter the URL of the Leetcode problem',
                validateInput: (input: string) => {
                    const regex = /^(https?:\/\/)(www\.)?leetcode\.com\/problems\/[a-zA-Z0-9-]+(\/description\/?)?$/;
                    return regex.test(input) ? null : 'Please enter a valid LeetCode problem URL';
                },
            });

            if (!url) {
                vscode.window.showErrorMessage('URL is required');
                return;
            }

            const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
            const page = await browser.newPage();

            try {
                console.log('Navigating to URL...');
                await page.goto(url, { waitUntil: 'domcontentloaded' });
                console.log('Page loaded successfully.');
                await page.waitForSelector(".elfjS", { timeout: 7000 });

                const content = await page.evaluate(() => {
                    const element = document.querySelector('.elfjS');
                    return (element as HTMLElement) ? (element as HTMLElement).innerText : "Element not found";
                });

                console.log('Extracted Content:', content);
                // const inputs = Array.from(content.matchAll(/Input:\s*(.*?)\s*Output:/gs)).map(match => cleanInput(match[1]));
                // const outputs = Array.from(content.matchAll(/Output:\s*(.*?)(?=Explanation:|Example|Constraints:|$)/gs)).map(match => cleanInput(match[1]));
                const inputRegex = /Input:\s*(.*?)(?=Output:|$)/gs;
                const outputRegex = /Output:\s*(.*?)(?=Explanation:|Example|Constraints:|$)/gs;

                const inputs: string[] = [];
                const outputs: string[] = [];

                let inputMatch: RegExpExecArray | null;
                while ((inputMatch = inputRegex.exec(content)) !== null) {
                    inputs.push(cleanInput(inputMatch[1].trim()));
                }

                let outputMatch: RegExpExecArray | null;
                while ((outputMatch = outputRegex.exec(content)) !== null) {
                    outputs.push(cleanInput(outputMatch[1].trim()));
                }

                console.log('Inputs:', inputs);
                console.log('Outputs:', outputs);

                if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
                    vscode.window.showErrorMessage('Please open a folder in VS Code to save the test cases.');
                    return;
                }

                const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;

                // Create "inputs" and "outputs" directories
                const inputFilesDir = path.join(workspacePath, 'inputs');
                const outputFilesDir = path.join(workspacePath, 'outputs');
                await fs.mkdir(inputFilesDir, { recursive: true });
                await fs.mkdir(outputFilesDir, { recursive: true });

                // Save each input and output in separate files
                for (let i = 0; i < inputs.length; i++) {
                    const inputFilePath = path.join(inputFilesDir, `input_${i + 1}.txt`);
                    const outputFilePath = path.join(outputFilesDir, `output_${i + 1}.txt`);

                    await fs.writeFile(inputFilePath, inputs[i], 'utf8');
                    await fs.writeFile(outputFilePath, outputs[i], 'utf8');
                }

                vscode.window.showInformationMessage('Test cases have been written to the "inputs" and "outputs" folders.');

                // Generate a starter code file
                const inputFileUri = inputFiles[0];
                const folderPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
                const fileName = `solution.${getFileExtension(selectedLanguage)}`;
                const filePath = path.join(folderPath, fileName);

                const starterCode = getStarterCode(selectedLanguage);

                await fs.writeFile(filePath, Buffer.from(starterCode, 'utf8'));

                const document1 = await vscode.workspace.openTextDocument(filePath);
                await vscode.window.showTextDocument(document1);
            } catch (error: any) {
                vscode.window.showErrorMessage(`Error fetching test cases: ${error.message}`);
                console.error('Error:', error);
            } finally {
                await browser.close();
            }
        }
    );

    const runAndCompareCommand = vscode.commands.registerCommand('cp-leetcode.runAndCompare', async () => {
        try {
            // Find all input and output files
            const inputFiles = await vscode.workspace.findFiles('inputs/input_*.txt', '**/node_modules/**');
            const outputFiles = await vscode.workspace.findFiles('outputs/output_*.txt', '**/node_modules/**');
    
            if (inputFiles.length === 0 || outputFiles.length === 0) {
                vscode.window.showErrorMessage('No input or output files found.');
                return;
            }
    
            const activeEditor = vscode.window.activeTextEditor;
            if (!activeEditor) {
                vscode.window.showErrorMessage('No active editor found.');
                return;
            }
    
            const language = getLanguageFromExtension(activeEditor.document.languageId);
            const filePath = activeEditor.document.uri.fsPath;
    
            if (!language) {
                vscode.window.showErrorMessage('Unsupported language.');
                return;
            }
    
            // Ensure input and output files are matched properly
            if (inputFiles.length !== outputFiles.length) {
                vscode.window.showErrorMessage('Mismatch in the number of input and output files.');
                return;
            }
    
            // Process all test cases
            for (let i = 0; i < inputFiles.length; i++) {
                const inputFilePath = inputFiles[i].fsPath;
                const outputFilePath = outputFiles[i].fsPath;
    
                // Run user code with the current input file
                const userOutputRaw = await runUserCode(filePath, inputFilePath, language);
                if (!userOutputRaw) {
                    vscode.window.showErrorMessage(`Failed to execute user code for test case ${i + 1}.`);
                    continue;
                }
    
                // Normalize outputs for comparison
                const output = normalizeOutput(userOutputRaw);
                const expectedOutputRaw = await fs.readFile(outputFilePath, 'utf8');
                const expectedOutput = normalizeOutput(expectedOutputRaw);
    
                // Compare the outputs
                if (output === expectedOutput) {
                    vscode.window.showInformationMessage(`Test case ${i + 1}: Passed`);
                } else {
                    vscode.window.showErrorMessage(
                        `Test case ${i + 1}: Failed\n\nExpected:\n${expectedOutput}\n\nReceived:\n${output}`
                    );
                }
            }
        } catch (error: any) {
            vscode.window.showErrorMessage(`Error: ${error.message}`);
        }
    });
    

    context.subscriptions.push(fetchTestCasesCommand, runAndCompareCommand);
    console.log('Extension "cp-leetcode" activated');
}

export function deactivate() {}
