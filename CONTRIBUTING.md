# Contributing to PDF Editor & AI Enhancer

Thank you for your interest in contributing to our PDF Editor & AI Enhancer project! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker
- Git

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/pdf-editor.git`
3. Install dependencies for each service:
   ```bash
   # Web app
   cd web-app && npm install
   
   # Backend
   cd ../backend && npm install
   
   # Mobile app
   cd ../mobile-app && npm install
   
   # AI services
   cd ../ai-services && pip install -r requirements.txt
   ```

## 📝 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add JSDoc comments for functions and classes

### Commit Message Format
```
type(scope): description

- Use conventional commits
- Types: feat, fix, docs, style, refactor, test, chore
- Examples:
  - feat(web): add PDF annotation feature
  - fix(backend): resolve file upload validation
  - docs: update API documentation
```

### Pull Request Process
1. Create a feature branch from `main`
2. Make your changes
3. Add tests if applicable
4. Update documentation
5. Submit a pull request

## 🧪 Testing

### Web App
```bash
cd web-app
npm run test
npm run lint
npm run type-check
```

### Backend
```bash
cd backend
npm run test
npm run lint
npm run build
```

### Mobile App
```bash
cd mobile-app
npm run test
npx tsc --noEmit
```

### AI Services
```bash
cd ai-services
python -m pytest
flake8 .
```

## 🐛 Bug Reports

When reporting bugs, please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details
- Screenshots if applicable

## ✨ Feature Requests

For feature requests, please:
- Check existing issues first
- Provide a clear description
- Explain the use case
- Consider implementation complexity

## 📋 Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested

## 🔒 Security

- Report security issues privately to maintainers
- Do not open public issues for security vulnerabilities
- Follow responsible disclosure practices

## 📞 Support

- GitHub Issues for bug reports and feature requests
- Discussions for questions and general discussion
- Check existing documentation first

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
