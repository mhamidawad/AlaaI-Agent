import { ConfigManager } from './config';
export interface AnalysisResult {
    summary: string;
    complexity: number;
    suggestions: string[];
    issues: Issue[];
}
export interface Issue {
    severity: 'low' | 'medium' | 'high';
    message: string;
    description: string;
    suggestion?: string;
    line?: number;
}
export interface ReviewResult {
    assessment: string;
    issues: Issue[];
    score: number;
}
export interface ProjectOverview {
    fileCount: number;
    lineCount: number;
    languages: string[];
    summary: string;
    structure: FileStructure[];
}
export interface FileStructure {
    path: string;
    type: 'file' | 'directory';
    language?: string;
    size?: number;
}
export declare class CodingAgent {
    private openaiClient?;
    private anthropicClient?;
    private config;
    private configManager;
    constructor(configManager: ConfigManager);
    private initializeClients;
    analyzeCode(code: string, language: string): Promise<AnalysisResult>;
    generateCode(description: string, language: string): Promise<string>;
    reviewCode(code: string, language: string): Promise<ReviewResult>;
    fixCode(code: string, language: string): Promise<string>;
    getProjectOverview(): Promise<ProjectOverview>;
    chat(message: string, context?: string): Promise<string>;
    private callAI;
    private callOpenAI;
    private callAnthropic;
    private parseAnalysisResponse;
    private parseReviewResponse;
    private parseOverviewResponse;
    private extractCodeFromResponse;
    private analyzeProjectStructure;
    private shouldIgnoreFile;
    private getLanguageFromExtension;
}
//# sourceMappingURL=agent.d.ts.map