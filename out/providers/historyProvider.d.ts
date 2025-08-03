import * as vscode from 'vscode';
export interface HistoryItem {
    id: string;
    title: string;
    timestamp: Date;
    type: 'chat' | 'analysis' | 'generation' | 'review' | 'fix';
    summary?: string;
}
export declare class HistoryProvider implements vscode.TreeDataProvider<HistoryItem> {
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<HistoryItem | undefined | null | void>;
    private history;
    constructor();
    refresh(): void;
    getTreeItem(element: HistoryItem): vscode.TreeItem;
    getChildren(element?: HistoryItem): Thenable<HistoryItem[]>;
    addHistoryItem(item: Omit<HistoryItem, 'id' | 'timestamp'>): void;
    clearHistory(): void;
    getHistoryItem(id: string): HistoryItem | undefined;
    private generateId;
}
//# sourceMappingURL=historyProvider.d.ts.map