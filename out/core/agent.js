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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodingAgent = void 0;
const openai_1 = __importDefault(require("openai"));
const sdk_1 = require("@anthropic-ai/sdk");
const vscode = __importStar(require("vscode"));
class CodingAgent {
    constructor(configManager) {
        this.configManager = configManager;
        this.config = configManager.getConfig();
        this.initializeClients();
        // Listen for config changes
        configManager.onConfigChange(() => {
            this.config = configManager.getConfig();
            this.initializeClients();
        });
    }
    initializeClients() {
        if (this.config.openaiApiKey) {
            this.openaiClient = new openai_1.default({
                apiKey: this.config.openaiApiKey
            });
        }
        if (this.config.anthropicApiKey) {
            this.anthropicClient = new sdk_1.Anthropic({
                apiKey: this.config.anthropicApiKey
            });
        }
    }
    async analyzeCode(code, language) {
        const prompt = `Analyze the following ${language} code and provide:
1. A brief summary of what the code does
2. A complexity score from 1-10
3. Suggestions for improvement
4. Any potential issues

Code:
\`\`\`${language}
${code}
\`\`\`

Please format your response as JSON with the following structure:
{
  "summary": "Brief description",
  "complexity": number,
  "suggestions": ["suggestion1", "suggestion2"],
  "issues": [{"severity": "low|medium|high", "message": "issue", "description": "detailed description", "line": number}]
}`;
        try {
            const response = await this.callAI(prompt);
            return this.parseAnalysisResponse(response);
        }
        catch (error) {
            console.error('Code analysis failed:', error);
            throw new Error(`Analysis failed: ${error}`);
        }
    }
    async generateCode(description, language) {
        const prompt = `Generate ${language} code based on the following description:
${description}

Requirements:
- Write clean, well-documented code
- Follow best practices for ${language}
- Include appropriate comments
- Handle edge cases where relevant

Please provide only the code without any additional explanation.`;
        try {
            const response = await this.callAI(prompt);
            return this.extractCodeFromResponse(response);
        }
        catch (error) {
            console.error('Code generation failed:', error);
            throw new Error(`Generation failed: ${error}`);
        }
    }
    async reviewCode(code, language) {
        const prompt = `Review the following ${language} code and provide:
1. Overall assessment
2. List of issues with severity levels
3. Overall quality score (1-10)

Code:
\`\`\`${language}
${code}
\`\`\`

Focus on:
- Code quality and readability
- Performance considerations
- Security issues
- Best practices adherence
- Potential bugs

Please format your response as JSON:
{
  "assessment": "Overall assessment",
  "issues": [{"severity": "low|medium|high", "message": "issue", "description": "detailed description", "suggestion": "how to fix"}],
  "score": number
}`;
        try {
            const response = await this.callAI(prompt);
            return this.parseReviewResponse(response);
        }
        catch (error) {
            console.error('Code review failed:', error);
            throw new Error(`Review failed: ${error}`);
        }
    }
    async fixCode(code, language) {
        const prompt = `Fix any issues in the following ${language} code while maintaining its functionality:

\`\`\`${language}
${code}
\`\`\`

Please:
- Fix syntax errors
- Improve code quality
- Optimize performance where possible
- Add missing error handling
- Ensure best practices are followed

Provide only the corrected code without additional explanation.`;
        try {
            const response = await this.callAI(prompt);
            return this.extractCodeFromResponse(response);
        }
        catch (error) {
            console.error('Code fix failed:', error);
            throw new Error(`Fix failed: ${error}`);
        }
    }
    async getProjectOverview() {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }
        try {
            const structure = await this.analyzeProjectStructure(workspaceFolder.uri);
            const prompt = `Analyze this project structure and provide an overview:

${JSON.stringify(structure, null, 2)}

Please provide:
1. File and line count estimates
2. Detected programming languages
3. Project summary and purpose
4. Technology stack analysis

Format as JSON:
{
  "fileCount": number,
  "lineCount": number,
  "languages": ["lang1", "lang2"],
  "summary": "Project description"
}`;
            const response = await this.callAI(prompt);
            const overview = this.parseOverviewResponse(response);
            overview.structure = structure;
            return overview;
        }
        catch (error) {
            console.error('Project overview failed:', error);
            throw new Error(`Overview failed: ${error}`);
        }
    }
    async chat(message, context) {
        let prompt = message;
        if (context) {
            prompt = `Context:\n${context}\n\nUser: ${message}`;
        }
        try {
            return await this.callAI(prompt);
        }
        catch (error) {
            console.error('Chat failed:', error);
            throw new Error(`Chat failed: ${error}`);
        }
    }
    async callAI(prompt) {
        const isOpenAIModel = this.config.defaultModel.startsWith('gpt');
        if (isOpenAIModel && this.openaiClient) {
            return await this.callOpenAI(prompt);
        }
        else if (!isOpenAIModel && this.anthropicClient) {
            return await this.callAnthropic(prompt);
        }
        else {
            throw new Error('No valid AI client configured for the selected model');
        }
    }
    async callOpenAI(prompt) {
        if (!this.openaiClient) {
            throw new Error('OpenAI client not initialized');
        }
        const response = await this.openaiClient.chat.completions.create({
            model: this.config.defaultModel,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: this.config.maxTokens,
            temperature: this.config.temperature,
        });
        return response.choices[0]?.message?.content || '';
    }
    async callAnthropic(prompt) {
        if (!this.anthropicClient) {
            throw new Error('Anthropic client not initialized');
        }
        const response = await this.anthropicClient.completions.create({
            model: this.config.defaultModel,
            max_tokens_to_sample: this.config.maxTokens,
            temperature: this.config.temperature,
            prompt: `Human: ${prompt}\n\nAssistant:`,
        });
        return response.completion || '';
    }
    parseAnalysisResponse(response) {
        try {
            const parsed = JSON.parse(response);
            return {
                summary: parsed.summary || 'Analysis completed',
                complexity: parsed.complexity || 5,
                suggestions: parsed.suggestions || [],
                issues: parsed.issues || []
            };
        }
        catch {
            return {
                summary: response,
                complexity: 5,
                suggestions: [],
                issues: []
            };
        }
    }
    parseReviewResponse(response) {
        try {
            const parsed = JSON.parse(response);
            return {
                assessment: parsed.assessment || 'Review completed',
                issues: parsed.issues || [],
                score: parsed.score || 7
            };
        }
        catch {
            return {
                assessment: response,
                issues: [],
                score: 7
            };
        }
    }
    parseOverviewResponse(response) {
        try {
            const parsed = JSON.parse(response);
            return {
                fileCount: parsed.fileCount || 0,
                lineCount: parsed.lineCount || 0,
                languages: parsed.languages || [],
                summary: parsed.summary || 'Project overview completed',
                structure: []
            };
        }
        catch {
            return {
                fileCount: 0,
                lineCount: 0,
                languages: [],
                summary: response,
                structure: []
            };
        }
    }
    extractCodeFromResponse(response) {
        // Extract code from markdown code blocks
        const codeBlockRegex = /```[\w]*\n([\s\S]*?)\n```/g;
        const matches = response.match(codeBlockRegex);
        if (matches && matches.length > 0) {
            return matches[0].replace(/```[\w]*\n/, '').replace(/\n```$/, '');
        }
        return response;
    }
    async analyzeProjectStructure(uri) {
        const structure = [];
        try {
            const entries = await vscode.workspace.fs.readDirectory(uri);
            for (const [name, type] of entries) {
                if (this.shouldIgnoreFile(name)) {
                    continue;
                }
                const entryUri = vscode.Uri.joinPath(uri, name);
                const entry = {
                    path: name,
                    type: type === vscode.FileType.Directory ? 'directory' : 'file'
                };
                if (type === vscode.FileType.File) {
                    entry.language = this.getLanguageFromExtension(name);
                    try {
                        const stat = await vscode.workspace.fs.stat(entryUri);
                        entry.size = stat.size;
                    }
                    catch {
                        // Ignore stat errors
                    }
                }
                structure.push(entry);
            }
        }
        catch (error) {
            console.error('Error analyzing project structure:', error);
        }
        return structure;
    }
    shouldIgnoreFile(filename) {
        return this.config.ignorePatterns.some(pattern => {
            if (pattern.includes('*')) {
                const regex = new RegExp(pattern.replace(/\*/g, '.*'));
                return regex.test(filename);
            }
            return filename === pattern;
        });
    }
    getLanguageFromExtension(filename) {
        const ext = filename.split('.').pop()?.toLowerCase();
        const languageMap = {
            'ts': 'typescript',
            'js': 'javascript',
            'py': 'python',
            'java': 'java',
            'cpp': 'cpp',
            'c': 'c',
            'cs': 'csharp',
            'go': 'go',
            'rs': 'rust',
            'php': 'php',
            'rb': 'ruby',
            'swift': 'swift',
            'kt': 'kotlin',
            'dart': 'dart',
            'html': 'html',
            'css': 'css',
            'scss': 'scss',
            'json': 'json',
            'xml': 'xml',
            'yaml': 'yaml',
            'yml': 'yaml',
            'md': 'markdown'
        };
        return languageMap[ext || ''] || 'text';
    }
}
exports.CodingAgent = CodingAgent;
//# sourceMappingURL=agent.js.map