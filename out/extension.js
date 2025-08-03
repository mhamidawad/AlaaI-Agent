"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const agent_1 = require("./core/agent");
const config_1 = require("./core/config");
const chatProvider_1 = require("./providers/chatProvider");
const historyProvider_1 = require("./providers/historyProvider");
const toolsProvider_1 = require("./providers/toolsProvider");
let agent;
let chatProvider;
let historyProvider;
let toolsProvider;
function activate(context) {
    console.log('AI Coding Agent is now active!');
    // Initialize configuration
    const config = new config_1.ConfigManager();
    // Initialize the AI agent
    agent = new agent_1.CodingAgent(config);
    // Initialize providers
    chatProvider = new chatProvider_1.ChatProvider(context.extensionUri, agent);
    historyProvider = new historyProvider_1.HistoryProvider();
    toolsProvider = new toolsProvider_1.ToolsProvider(agent);
    // Register webview providers
    context.subscriptions.push(vscode.window.registerWebviewViewProvider('aiCodingAgent.chat', chatProvider));
    // Register tree data providers
    context.subscriptions.push(vscode.window.registerTreeDataProvider('aiCodingAgent.history', historyProvider), vscode.window.registerTreeDataProvider('aiCodingAgent.tools', toolsProvider));
    // Register commands
    registerCommands(context);
    // Show welcome message
    vscode.window.showInformationMessage('AI Coding Agent is ready to assist you!');
}
exports.activate = activate;
function registerCommands(context) {
    const commands = [
        vscode.commands.registerCommand('aiCodingAgent.chat', () => {
            vscode.commands.executeCommand('workbench.view.extension.aiCodingAgent');
        }),
        vscode.commands.registerCommand('aiCodingAgent.analyzeFile', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor found');
                return;
            }
            const document = editor.document;
            const selection = editor.selection;
            const text = selection.isEmpty ? document.getText() : document.getText(selection);
            try {
                vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: "Analyzing code...",
                    cancellable: false
                }, async () => {
                    const result = await agent.analyzeCode(text, document.languageId);
                    await showAnalysisResult(result);
                });
            }
            catch (error) {
                vscode.window.showErrorMessage(`Analysis failed: ${error}`);
            }
        }),
        vscode.commands.registerCommand('aiCodingAgent.generateCode', async () => {
            const description = await vscode.window.showInputBox({
                prompt: 'Describe the code you want to generate',
                placeHolder: 'e.g., Create a function to sort an array of objects by name'
            });
            if (!description) {
                return;
            }
            const editor = vscode.window.activeTextEditor;
            const language = editor?.document.languageId || 'javascript';
            try {
                vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: "Generating code...",
                    cancellable: false
                }, async () => {
                    const code = await agent.generateCode(description, language);
                    await insertGeneratedCode(code);
                });
            }
            catch (error) {
                vscode.window.showErrorMessage(`Code generation failed: ${error}`);
            }
        }),
        vscode.commands.registerCommand('aiCodingAgent.reviewCode', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor found');
                return;
            }
            const document = editor.document;
            const selection = editor.selection;
            const text = selection.isEmpty ? document.getText() : document.getText(selection);
            try {
                vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: "Reviewing code...",
                    cancellable: false
                }, async () => {
                    const review = await agent.reviewCode(text, document.languageId);
                    await showCodeReview(review);
                });
            }
            catch (error) {
                vscode.window.showErrorMessage(`Code review failed: ${error}`);
            }
        }),
        vscode.commands.registerCommand('aiCodingAgent.fixCode', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor found');
                return;
            }
            const document = editor.document;
            const selection = editor.selection;
            const text = selection.isEmpty ? document.getText() : document.getText(selection);
            try {
                vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: "Fixing code issues...",
                    cancellable: false
                }, async () => {
                    const fixedCode = await agent.fixCode(text, document.languageId);
                    await applyCodeFix(editor, selection, fixedCode);
                });
            }
            catch (error) {
                vscode.window.showErrorMessage(`Code fix failed: ${error}`);
            }
        }),
        vscode.commands.registerCommand('aiCodingAgent.projectOverview', async () => {
            try {
                vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: "Analyzing project...",
                    cancellable: false
                }, async () => {
                    const overview = await agent.getProjectOverview();
                    await showProjectOverview(overview);
                });
            }
            catch (error) {
                vscode.window.showErrorMessage(`Project analysis failed: ${error}`);
            }
        }),
        vscode.commands.registerCommand('aiCodingAgent.openSettings', () => {
            vscode.commands.executeCommand('workbench.action.openSettings', 'aiCodingAgent');
        })
    ];
    context.subscriptions.push(...commands);
}
async function showAnalysisResult(result) {
    const panel = vscode.window.createWebviewPanel('aiCodingAgent.analysis', 'Code Analysis', vscode.ViewColumn.Beside, { enableScripts: true });
    panel.webview.html = getAnalysisHtml(result);
}
async function insertGeneratedCode(code) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const position = editor.selection.active;
    await editor.edit(editBuilder => {
        editBuilder.insert(position, code);
    });
}
async function showCodeReview(review) {
    const panel = vscode.window.createWebviewPanel('aiCodingAgent.review', 'Code Review', vscode.ViewColumn.Beside, { enableScripts: true });
    panel.webview.html = getReviewHtml(review);
}
async function applyCodeFix(editor, selection, fixedCode) {
    const range = selection.isEmpty ?
        new vscode.Range(0, 0, editor.document.lineCount - 1, editor.document.lineAt(editor.document.lineCount - 1).text.length) :
        selection;
    await editor.edit(editBuilder => {
        editBuilder.replace(range, fixedCode);
    });
}
async function showProjectOverview(overview) {
    const panel = vscode.window.createWebviewPanel('aiCodingAgent.overview', 'Project Overview', vscode.ViewColumn.One, { enableScripts: true });
    panel.webview.html = getOverviewHtml(overview);
}
function getAnalysisHtml(result) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Code Analysis</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; }
                .section { margin-bottom: 20px; padding: 15px; border-left: 3px solid #007acc; background: #f8f9fa; }
                .title { font-weight: bold; margin-bottom: 10px; }
                pre { background: #f1f3f4; padding: 10px; border-radius: 4px; overflow-x: auto; }
            </style>
        </head>
        <body>
            <h1>Code Analysis Results</h1>
            <div class="section">
                <div class="title">Summary</div>
                <p>${result.summary || 'Analysis completed successfully'}</p>
            </div>
            <div class="section">
                <div class="title">Complexity</div>
                <p>Complexity Score: ${result.complexity || 'N/A'}</p>
            </div>
            <div class="section">
                <div class="title">Suggestions</div>
                <ul>
                    ${(result.suggestions || []).map((s) => `<li>${s}</li>`).join('')}
                </ul>
            </div>
        </body>
        </html>
    `;
}
function getReviewHtml(review) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Code Review</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; }
                .section { margin-bottom: 20px; padding: 15px; border-left: 3px solid #28a745; background: #f8f9fa; }
                .title { font-weight: bold; margin-bottom: 10px; }
                .issue { margin: 10px 0; padding: 10px; background: #fff3cd; border-radius: 4px; }
                .severity { font-weight: bold; }
                .high { color: #dc3545; }
                .medium { color: #fd7e14; }
                .low { color: #28a745; }
            </style>
        </head>
        <body>
            <h1>Code Review Results</h1>
            <div class="section">
                <div class="title">Overall Assessment</div>
                <p>${review.assessment || 'Code review completed'}</p>
            </div>
            <div class="section">
                <div class="title">Issues Found</div>
                ${(review.issues || []).map((issue) => `
                    <div class="issue">
                        <div class="severity ${issue.severity}">${issue.severity?.toUpperCase()}: ${issue.message}</div>
                        <p>${issue.description}</p>
                        ${issue.suggestion ? `<p><strong>Suggestion:</strong> ${issue.suggestion}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        </body>
        </html>
    `;
}
function getOverviewHtml(overview) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Project Overview</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; }
                .section { margin-bottom: 20px; padding: 15px; border-left: 3px solid #6f42c1; background: #f8f9fa; }
                .title { font-weight: bold; margin-bottom: 10px; }
                .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
                .stat { background: white; padding: 15px; border-radius: 4px; text-align: center; }
                .stat-value { font-size: 24px; font-weight: bold; color: #007acc; }
                .stat-label { font-size: 14px; color: #666; }
            </style>
        </head>
        <body>
            <h1>Project Overview</h1>
            <div class="section">
                <div class="title">Project Statistics</div>
                <div class="stats">
                    <div class="stat">
                        <div class="stat-value">${overview.fileCount || 0}</div>
                        <div class="stat-label">Files</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${overview.lineCount || 0}</div>
                        <div class="stat-label">Lines of Code</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${overview.languages?.length || 0}</div>
                        <div class="stat-label">Languages</div>
                    </div>
                </div>
            </div>
            <div class="section">
                <div class="title">Technologies Used</div>
                <ul>
                    ${(overview.languages || []).map((lang) => `<li>${lang}</li>`).join('')}
                </ul>
            </div>
            <div class="section">
                <div class="title">Summary</div>
                <p>${overview.summary || 'Project analysis completed successfully'}</p>
            </div>
        </body>
        </html>
    `;
}
function deactivate() {
    console.log('AI Coding Agent is now deactivated');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map