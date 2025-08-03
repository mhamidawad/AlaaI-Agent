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
exports.ToolsProvider = void 0;
const vscode = __importStar(require("vscode"));
class ToolsProvider {
    constructor(agent) {
        this.agent = agent;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.tools = {
            'Analysis': [
                {
                    label: 'Analyze Current File',
                    command: 'aiCodingAgent.analyzeFile',
                    description: 'Analyze the currently open file',
                    icon: 'search',
                    category: 'Analysis'
                },
                {
                    label: 'Project Overview',
                    command: 'aiCodingAgent.projectOverview',
                    description: 'Get an overview of your project',
                    icon: 'file-directory',
                    category: 'Analysis'
                }
            ],
            'Code Generation': [
                {
                    label: 'Generate Code',
                    command: 'aiCodingAgent.generateCode',
                    description: 'Generate code from description',
                    icon: 'add',
                    category: 'Code Generation'
                }
            ],
            'Code Quality': [
                {
                    label: 'Review Code',
                    command: 'aiCodingAgent.reviewCode',
                    description: 'Review code for quality and issues',
                    icon: 'checklist',
                    category: 'Code Quality'
                },
                {
                    label: 'Fix Code Issues',
                    command: 'aiCodingAgent.fixCode',
                    description: 'Automatically fix code issues',
                    icon: 'wrench',
                    category: 'Code Quality'
                }
            ],
            'Settings': [
                {
                    label: 'Open Settings',
                    command: 'aiCodingAgent.openSettings',
                    description: 'Configure AI Coding Agent',
                    icon: 'settings',
                    category: 'Settings'
                }
            ]
        };
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        if (typeof element === 'string') {
            // Category item
            const item = new vscode.TreeItem(element, vscode.TreeItemCollapsibleState.Expanded);
            item.contextValue = 'category';
            item.iconPath = new vscode.ThemeIcon('folder');
            return item;
        }
        else {
            // Tool item
            const item = new vscode.TreeItem(element.label, vscode.TreeItemCollapsibleState.None);
            item.description = element.description;
            item.command = {
                command: element.command,
                title: element.label
            };
            item.iconPath = new vscode.ThemeIcon(element.icon);
            item.contextValue = 'tool';
            return item;
        }
    }
    getChildren(element) {
        if (!element) {
            // Return categories
            return Promise.resolve(Object.keys(this.tools));
        }
        else if (typeof element === 'string') {
            // Return tools in category
            return Promise.resolve(this.tools[element] || []);
        }
        return Promise.resolve([]);
    }
    getParent(element) {
        if (typeof element === 'string') {
            return undefined; // Categories have no parent
        }
        else {
            return element.category;
        }
    }
}
exports.ToolsProvider = ToolsProvider;
//# sourceMappingURL=toolsProvider.js.map