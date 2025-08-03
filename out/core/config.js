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
exports.ConfigManager = void 0;
const vscode = __importStar(require("vscode"));
class ConfigManager {
    constructor() {
        this.config = vscode.workspace.getConfiguration('aiCodingAgent');
    }
    getConfig() {
        return {
            openaiApiKey: this.config.get('openaiApiKey', ''),
            anthropicApiKey: this.config.get('anthropicApiKey', ''),
            defaultModel: this.config.get('defaultModel', 'gpt-4'),
            maxTokens: this.config.get('maxTokens', 4000),
            temperature: this.config.get('temperature', 0.1),
            debug: this.config.get('debug', false),
            ignorePatterns: this.config.get('ignorePatterns', [
                '__pycache__', '*.pyc', '.git', 'node_modules', '*.min.js', 'dist', 'build'
            ]),
            autoSave: this.config.get('autoSave', true),
            showInlineComments: this.config.get('showInlineComments', true)
        };
    }
    async updateConfig(key, value) {
        await this.config.update(key, value, vscode.ConfigurationTarget.Global);
        this.config = vscode.workspace.getConfiguration('aiCodingAgent');
    }
    onConfigChange(callback) {
        return vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration('aiCodingAgent')) {
                this.config = vscode.workspace.getConfiguration('aiCodingAgent');
                callback();
            }
        });
    }
    validateConfig() {
        const config = this.getConfig();
        const errors = [];
        if (!config.openaiApiKey && !config.anthropicApiKey) {
            errors.push('At least one API key (OpenAI or Anthropic) must be configured');
        }
        if (config.maxTokens <= 0) {
            errors.push('Max tokens must be greater than 0');
        }
        if (config.temperature < 0 || config.temperature > 1) {
            errors.push('Temperature must be between 0 and 1');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}
exports.ConfigManager = ConfigManager;
//# sourceMappingURL=config.js.map