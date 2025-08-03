import * as vscode from 'vscode';
export interface AgentConfig {
    openaiApiKey: string;
    anthropicApiKey: string;
    defaultModel: string;
    maxTokens: number;
    temperature: number;
    debug: boolean;
    ignorePatterns: string[];
    autoSave: boolean;
    showInlineComments: boolean;
}
export declare class ConfigManager {
    private config;
    constructor();
    getConfig(): AgentConfig;
    updateConfig(key: string, value: any): Promise<void>;
    onConfigChange(callback: () => void): vscode.Disposable;
    validateConfig(): {
        isValid: boolean;
        errors: string[];
    };
}
//# sourceMappingURL=config.d.ts.map