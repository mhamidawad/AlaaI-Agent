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
exports.HistoryProvider = void 0;
const vscode = __importStar(require("vscode"));
class HistoryProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.history = [];
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        const item = new vscode.TreeItem(element.title, vscode.TreeItemCollapsibleState.None);
        item.tooltip = `${element.type.toUpperCase()} - ${element.timestamp.toLocaleString()}`;
        item.description = element.summary;
        item.contextValue = 'historyItem';
        // Set different icons based on type
        switch (element.type) {
            case 'chat':
                item.iconPath = new vscode.ThemeIcon('comment');
                break;
            case 'analysis':
                item.iconPath = new vscode.ThemeIcon('search');
                break;
            case 'generation':
                item.iconPath = new vscode.ThemeIcon('add');
                break;
            case 'review':
                item.iconPath = new vscode.ThemeIcon('checklist');
                break;
            case 'fix':
                item.iconPath = new vscode.ThemeIcon('wrench');
                break;
            default:
                item.iconPath = new vscode.ThemeIcon('file');
        }
        return item;
    }
    getChildren(element) {
        if (!element) {
            // Return sorted history (newest first)
            return Promise.resolve(this.history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
        }
        return Promise.resolve([]);
    }
    addHistoryItem(item) {
        const historyItem = {
            ...item,
            id: this.generateId(),
            timestamp: new Date()
        };
        this.history.push(historyItem);
        // Keep only the last 50 items
        if (this.history.length > 50) {
            this.history = this.history.slice(-50);
        }
        this.refresh();
    }
    clearHistory() {
        this.history = [];
        this.refresh();
    }
    getHistoryItem(id) {
        return this.history.find(item => item.id === id);
    }
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}
exports.HistoryProvider = HistoryProvider;
//# sourceMappingURL=historyProvider.js.map