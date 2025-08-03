# Publishing AI Coding Agent to VS Code Marketplace

This guide will walk you through publishing your AI Coding Agent extension to the Visual Studio Code Marketplace.

## 📋 Prerequisites

### 1. Create Azure DevOps Account
- Go to [https://dev.azure.com](https://dev.azure.com)
- Sign in with your Microsoft/GitHub account
- Create a new organization if you don't have one

### 2. Create Personal Access Token (PAT)
1. In Azure DevOps, click your profile picture → **Personal access tokens**
2. Click **+ New Token**
3. Configure:
   - **Name**: `VS Code Extension Publishing`
   - **Organization**: Select your organization
   - **Expiration**: Set to 1 year or custom
   - **Scopes**: Select **Custom defined**
   - Check **Marketplace** → **Manage**
4. Click **Create** and **copy the token** (you won't see it again!)

### 3. Create Publisher Profile
1. Go to [Visual Studio Marketplace Publisher Management](https://marketplace.visualstudio.com/manage)
2. Sign in with the same Microsoft account
3. Click **Create publisher**
4. Fill in:
   - **Publisher ID**: Choose a unique ID (e.g., `your-username`, `your-company`)
   - **Publisher display name**: Your name or company name
   - **Description**: Brief description about you/your company

## 🔧 Prepare Your Extension

### 1. Update package.json
Replace placeholders in `package.json`:

```json
{
  "publisher": "YOUR_ACTUAL_PUBLISHER_ID",
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_GITHUB_USERNAME/ai-coding-agent.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_GITHUB_USERNAME/ai-coding-agent/issues"
  },
  "homepage": "https://github.com/YOUR_GITHUB_USERNAME/ai-coding-agent#readme"
}
```

### 2. Create Extension Icon (Optional but Recommended)
- Create a 128x128 PNG icon
- Add to root of `vscode-extension/` folder
- Update package.json:
```json
{
  "icon": "icon.png"
}
```

### 3. Update README.md
Ensure `vscode-extension/README.md` has:
- Clear description
- Installation instructions
- Usage examples
- Screenshots (highly recommended)
- Configuration details

## 🚀 Publishing Steps

### 1. Login to Marketplace
```bash
vsce login YOUR_PUBLISHER_ID
```
Enter your Personal Access Token when prompted.

### 2. Package the Extension (Optional - for testing)
```bash
vsce package
```
This creates a `.vsix` file you can install locally for testing:
```bash
code --install-extension ai-coding-agent-1.0.0.vsix
```

### 3. Publish to Marketplace
```bash
vsce publish
```

This will:
- Package your extension
- Upload to the marketplace
- Make it available for installation

### 4. Verify Publication
- Go to [VS Code Marketplace](https://marketplace.visualstudio.com/)
- Search for your extension
- Check that all information appears correctly

## 📝 Important Notes

### Extension Name Requirements
- Must be unique in the marketplace
- Use descriptive, searchable names
- Consider SEO keywords

### Version Management
- Follow semantic versioning (1.0.0, 1.0.1, 1.1.0, 2.0.0)
- Update version in package.json before each publish
- Cannot republish same version

### Publishing Updates
```bash
# Minor update (1.0.0 → 1.0.1)
vsce publish patch

# Feature update (1.0.0 → 1.1.0)
vsce publish minor

# Major update (1.0.0 → 2.0.0)
vsce publish major

# Specific version
vsce publish 1.2.3
```

## 🛡️ Security Considerations

### API Key Handling
- ⚠️ **NEVER** include actual API keys in the extension
- Users must provide their own API keys
- Store securely using VS Code's secret storage
- Clear documentation about API key requirements

### Privacy Policy
Consider adding a privacy policy if you:
- Collect any user data
- Send code to external services
- Store any information

## 📊 Marketplace Best Practices

### 1. Extension Metadata
- **Clear description**: What it does, how it helps
- **Good keywords**: For discoverability
- **Proper categories**: Machine Learning, Productivity, etc.
- **Version history**: Keep detailed changelog

### 2. Documentation
- **Screenshots**: Show the extension in action
- **GIFs**: Demonstrate key features
- **Clear installation steps**
- **Configuration examples**
- **Troubleshooting section**

### 3. User Experience
- **Quick start**: Users should see value immediately
- **Good defaults**: Minimize initial configuration
- **Error handling**: Clear error messages
- **Performance**: Don't slow down VS Code

## 🔄 CI/CD Pipeline (Advanced)

Consider setting up automated publishing with GitHub Actions:

```yaml
# .github/workflows/publish.yml
name: Publish Extension
on:
  release:
    types: [published]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run compile
      - run: npx vsce publish -p ${{ secrets.VSCE_PAT }}
```

## 📈 Post-Publication

### Monitor and Maintain
- **Review feedback**: Respond to user reviews
- **Fix bugs**: Address issues quickly
- **Add features**: Based on user requests
- **Update dependencies**: Keep packages current

### Analytics
- Check download stats in Publisher Management
- Monitor review ratings
- Track issue reports on GitHub

## 🆘 Troubleshooting

### Common Issues

**"Publisher not found"**
- Verify publisher ID matches exactly
- Ensure you're logged in with correct account

**"Package contains errors"**
- Run `npm run compile` to check for TypeScript errors
- Validate package.json syntax
- Check all required fields are present

**"Version already exists"**
- Increment version number in package.json
- Cannot overwrite existing versions

**"PAT expired or invalid"**
- Create new Personal Access Token
- Re-login with `vsce login`

### Getting Help
- [VS Code Extension API Documentation](https://code.visualstudio.com/api)
- [Publishing Extensions Guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [VS Code Extension Samples](https://github.com/microsoft/vscode-extension-samples)

---

**Ready to publish? Follow the steps above to share your AI Coding Agent with the world!** 🌟