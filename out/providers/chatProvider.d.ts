import * as vscode from 'vscode';
import { CodingAgent } from '../core/agent';
export declare class ChatProvider implements vscode.WebviewViewProvider {
    private readonly _extensionUri;
    private readonly agent;
    static readonly viewType = "aiCodingAgent.chat";
    private _view?;
    constructor(_extensionUri: vscode.Uri, agent: CodingAgent);
    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken): void;
    private handleChatMessage;
    private clearChat;
    private getHtmlForWebview;
}
//# sourceMappingURL=chatProvider.d.ts.map