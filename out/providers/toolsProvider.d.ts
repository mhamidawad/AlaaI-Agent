import * as vscode from 'vscode';
import { CodingAgent } from '../core/agent';
export interface ToolItem {
    label: string;
    command: string;
    description: string;
    icon: string;
    category: string;
}
export declare class ToolsProvider implements vscode.TreeDataProvider<ToolItem | string> {
    private agent;
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<ToolItem | string | undefined | null | void>;
    private tools;
    constructor(agent: CodingAgent);
    refresh(): void;
    getTreeItem(element: ToolItem | string): vscode.TreeItem;
    getChildren(element?: ToolItem | string): Thenable<(ToolItem | string)[]>;
    getParent(element: ToolItem | string): vscode.ProviderResult<ToolItem | string>;
}
//# sourceMappingURL=toolsProvider.d.ts.map