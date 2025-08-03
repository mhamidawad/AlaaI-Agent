# AI Coding Agent - VS Code Extension

A sophisticated AI-powered coding assistant extension for Visual Studio Code that can analyze, understand, and generate code across multiple programming languages. This extension combines the power of large language models with advanced code analysis tools to provide intelligent coding assistance directly in your editor.

## Features

- **🤖 AI Chat Interface**: Interactive chat panel for natural language coding assistance
- **🔍 Code Analysis**: Deep understanding of your code with complexity analysis and suggestions
- **✨ Code Generation**: Generate high-quality code snippets, functions, and modules from descriptions
- **🔍 Code Review**: Automated code review with quality scoring and improvement suggestions
- **🔧 Auto-Fix**: Automatically fix code issues and improve code quality
- **📊 Project Overview**: Get comprehensive insights about your project structure and technologies
- **🎯 Multi-Language Support**: Works with Python, JavaScript, TypeScript, Java, C++, and more
- **🎨 Beautiful UI**: Modern interface integrated seamlessly with VS Code's design system
- **⚙️ Flexible Configuration**: Support for both OpenAI and Anthropic AI models

## Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "AI Coding Agent"
4. Click Install

### Manual Installation
1. Download the `.vsix` file from the releases page
2. Open VS Code
3. Run `Extensions: Install from VSIX...` from the Command Palette
4. Select the downloaded `.vsix` file

## Setup

1. **Configure API Keys**: After installation, you'll need to configure at least one AI provider:
   - Open VS Code Settings (Ctrl+,)
   - Search for "AI Coding Agent"
   - Add your OpenAI API key and/or Anthropic API key

2. **Choose Default Model**: Select your preferred AI model from the dropdown:
   - GPT-4, GPT-4 Turbo, GPT-3.5 Turbo (OpenAI)
   - Claude-3 Sonnet, Claude-3 Opus, Claude-3 Haiku (Anthropic)

## Usage

### Chat Interface
- Click the AI Coding Agent icon in the activity bar
- Use the chat panel to ask questions, request explanations, or get coding help
- The AI maintains context throughout your conversation

### Quick Actions
Use the Command Palette (Ctrl+Shift+P) and search for:

- **AI Coding Agent: Start AI Chat** - Open the chat interface
- **AI Coding Agent: Analyze Current File** - Analyze the active file
- **AI Coding Agent: Generate Code** - Generate code from description
- **AI Coding Agent: Review Code** - Review selected code or entire file
- **AI Coding Agent: Fix Code Issues** - Automatically fix code problems
- **AI Coding Agent: Get Project Overview** - Analyze your entire project

### Context Menu
Right-click in any code file to access:
- Analyze File
- Review Code
- Fix Code Issues

### Sidebar Panel
The extension adds a dedicated sidebar with:
- **AI Chat**: Interactive conversation interface
- **Conversation History**: Track your recent interactions
- **Quick Tools**: Easy access to common features

## Configuration

| Setting | Description | Default |
|---------|-------------|---------|
| `aiCodingAgent.openaiApiKey` | OpenAI API Key for GPT models | "" |
| `aiCodingAgent.anthropicApiKey` | Anthropic API Key for Claude models | "" |
| `aiCodingAgent.defaultModel` | Default AI model to use | "gpt-4" |
| `aiCodingAgent.maxTokens` | Maximum tokens for AI responses | 4000 |
| `aiCodingAgent.temperature` | AI creativity level (0-1) | 0.1 |
| `aiCodingAgent.debug` | Enable debug mode | false |
| `aiCodingAgent.ignorePatterns` | File patterns to ignore | `["__pycache__", "*.pyc", ".git", "node_modules"]` |
| `aiCodingAgent.autoSave` | Auto-save files after AI modifications | true |
| `aiCodingAgent.showInlineComments` | Show inline comments for suggestions | true |

## Examples

### Code Analysis
```typescript
// Select code and run "Analyze Current File"
function calculateFibonacci(n: number): number {
    if (n <= 1) return n;
    return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
}
```
**AI Analysis**: "This is a recursive Fibonacci implementation with exponential time complexity. Consider using memoization or iterative approach for better performance."

### Code Generation
**Prompt**: "Create a TypeScript function to validate email addresses"

**Generated Code**:
```typescript
function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
```

### Code Review
The AI reviews your code and provides:
- Overall quality score
- Specific issues with severity levels
- Improvement suggestions
- Best practice recommendations

## Supported Languages

- TypeScript / JavaScript
- Python
- Java
- C / C++
- C#
- Go
- Rust
- PHP
- Ruby
- Swift
- Kotlin
- Dart
- HTML / CSS
- And many more...

## Requirements

- Visual Studio Code 1.74.0 or higher
- Active internet connection
- OpenAI API key and/or Anthropic API key

## Privacy & Security

- Your code is only sent to the configured AI provider when you explicitly use AI features
- API keys are stored securely in VS Code's configuration
- No code is stored or logged by the extension
- All communication with AI providers is encrypted

## Troubleshooting

### Common Issues

**"No API key configured"**
- Go to Settings → Extensions → AI Coding Agent
- Add your OpenAI or Anthropic API key

**"AI request failed"**
- Check your internet connection
- Verify your API key is valid and has sufficient credits
- Try switching to a different AI model

**Extension not loading**
- Restart VS Code
- Check for extension updates
- Look for errors in the Developer Console (Help → Toggle Developer Tools)

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:
- Setting up the development environment
- Code style guidelines
- Submitting pull requests
- Reporting bugs

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed list of changes in each version.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/ai-coding-agent/vscode-extension/wiki)
- 🐛 [Report Issues](https://github.com/ai-coding-agent/vscode-extension/issues)
- 💬 [Discussions](https://github.com/ai-coding-agent/vscode-extension/discussions)
- 📧 [Email Support](mailto:support@ai-coding-agent.com)

---

**Boost your coding productivity with AI assistance!** ⚡