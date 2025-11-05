# GrayJay Dev Server Documentation Index

Complete index of all documentation files with quick links and descriptions.

## 📋 Documentation Files

### Core Documentation

#### 1. [README.md](README.md)

**Main documentation hub**

- Overview of dev server
- Quick start guide
- API endpoint overview
- Package system explanation
- Workflow examples
- Troubleshooting

**Best for**: Getting started, understanding the system

---

#### 2. [openapi.yaml](openapi.yaml)

**Complete API specification**

- OpenAPI 3.0 format
- All endpoints documented
- Request/response schemas
- Parameter definitions
- Component definitions

**Best for**: API integration, automated tools, reference

---

#### 3. [TABS_DOCUMENTATION.md](TABS_DOCUMENTATION.md)

**🆕 Complete tabs and buttons guide**

- Overview tab features
- Testing tab functionality
- Integration tab workflow
- Settings tab options
- Button reference table
- Common workflows

**Best for**: Learning the portal interface, finding specific features

---

#### 4. [TESTING_UI_WORKFLOW.md](TESTING_UI_WORKFLOW.md)

**🆕 UI-based testing guide**

- Step-by-step UI workflow
- Load plugin via web interface
- Test common methods (enable, getHome, etc.)
- Troubleshooting tips
- Visual guide with screenshots

**Best for**: Manual testing, learning the interface

---

#### 5. [TESTING_API_WORKFLOW.md](TESTING_API_WORKFLOW.md)

**🆕 API-based testing guide**

- Direct HTTP request testing
- Automated testing scripts
- cURL and Python examples
- No browser required
- CI/CD integration

**Best for**: Automated testing, API integration

---

#### 5.1 [REAL_API_EXAMPLES.md](REAL_API_EXAMPLES.md)

**🆕 Real API examples from browser**

- Actual network requests captured from DevPortal
- Complete plugin loading sequence
- Package loading examples
- Polling patterns and best practices
- Working Bash and Python scripts

**Best for**: Understanding actual API behavior, debugging

---

#### 6. [TESTING_GUIDE.md](TESTING_GUIDE.md)

**Comprehensive testing workflow**

- Step-by-step testing process
- Testing checklist
- Common test scenarios
- Performance benchmarks
- Debugging techniques
- Automated testing scripts

**Best for**: Testing methodology, quality assurance

---

#### 7. [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

**Quick command reference**

- Quick start commands
- API endpoint table
- Common curl commands
- PowerShell examples
- Troubleshooting quick fixes

**Best for**: Quick lookups, experienced developers

---

#### 8. [SUMMARY.md](SUMMARY.md)

**Documentation overview**

- What's in each file
- Server information
- Key endpoints
- Available packages
- Testing workflow summary

**Best for**: Navigating documentation, overview

---

### Examples

#### 9. [examples/example-requests.md](examples/example-requests.md)

**API request examples**

- cURL examples for all endpoints
- PowerShell examples
- JavaScript/fetch examples
- Expected responses
- Automated testing scripts

**Best for**: API usage examples, testing scripts

---

#### 10. [examples/plugin-config-example.json](examples/plugin-config-example.json)

**Plugin configuration template**

- Complete config JSON structure
- All required fields
- Example values
- Field descriptions

**Best for**: Creating new plugins, config reference

---

#### 11. [examples/testing-workflow-example.md](examples/testing-workflow-example.md)

**🆕 Complete workflow example**

- Real-world testing scenario
- Step-by-step guide
- Expected results at each step
- Debugging example
- Test matrix
- Timeline estimates

**Best for**: First-time plugin testing, learning the workflow

---

## 🎯 Quick Navigation

### I want to...

#### Learn the Basics

1. Start with [README.md](README.md)
2. Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
3. Try [examples/testing-workflow-example.md](examples/testing-workflow-example.md)

#### Test a Plugin

1. Read [TESTING_UI_WORKFLOW.md](TESTING_UI_WORKFLOW.md) for manual testing
2. Read [TESTING_API_WORKFLOW.md](TESTING_API_WORKFLOW.md) for automated testing
3. Use [TABS_DOCUMENTATION.md](TABS_DOCUMENTATION.md) for interface reference
4. Reference [TESTING_GUIDE.md](TESTING_GUIDE.md) for comprehensive methodology

#### Understand the API

1. Open [openapi.yaml](openapi.yaml) in Swagger/Postman
2. Check [examples/example-requests.md](examples/example-requests.md)
3. Refer to [README.md](README.md) for context

#### Create a Plugin

1. Use [examples/plugin-config-example.json](examples/plugin-config-example.json)
2. Follow [TESTING_GUIDE.md](TESTING_GUIDE.md)
3. Reference [TABS_DOCUMENTATION.md](TABS_DOCUMENTATION.md)

#### Debug Issues

1. Check [TESTING_GUIDE.md](TESTING_GUIDE.md) debugging section
2. Use [TABS_DOCUMENTATION.md](TABS_DOCUMENTATION.md) error messages
3. Try [examples/testing-workflow-example.md](examples/testing-workflow-example.md) debugging example

---

## 📊 File Overview

### Size & Complexity

| File                        | Size   | Complexity | Read Time |
| --------------------------- | ------ | ---------- | --------- |
| INDEX.md                    | Small  | Low        | 2 min     |
| QUICK_REFERENCE.md          | Small  | Low        | 3 min     |
| SUMMARY.md                  | Medium | Low        | 5 min     |
| README.md                   | Large  | Medium     | 15 min    |
| TABS_DOCUMENTATION.md       | Large  | Medium     | 15 min    |
| TESTING_UI_WORKFLOW.md      | Medium | Low        | 8 min     |
| TESTING_API_WORKFLOW.md     | Large  | Medium     | 12 min    |
| TESTING_GUIDE.md            | Large  | High       | 20 min    |
| openapi.yaml                | Large  | High       | 30 min    |
| example-requests.md         | Medium | Medium     | 10 min    |
| testing-workflow-example.md | Medium | Medium     | 10 min    |
| plugin-config-example.json  | Small  | Low        | 2 min     |

---

## 🗺️ Documentation Map

```
dev-server/
│
├── START HERE
│   ├── INDEX.md (this file)
│   ├── README.md (overview)
│   └── QUICK_REFERENCE.md (commands)
│
├── LEARNING
│   ├── TABS_DOCUMENTATION.md (interface guide)
│   ├── TESTING_UI_WORKFLOW.md (UI testing)
│   ├── TESTING_API_WORKFLOW.md (API testing)
│   ├── TESTING_GUIDE.md (methodology)
│   └── examples/testing-workflow-example.md (hands-on)
│
├── REFERENCE
│   ├── openapi.yaml (API spec)
│   ├── SUMMARY.md (overview)
│   └── examples/example-requests.md (API examples)
│
└── TEMPLATES
    └── examples/plugin-config-example.json (config)
```

---

## 🎓 Learning Path

### Beginner (Start Here)

1. **READ**: INDEX.md (this file)
2. **READ**: README.md sections "Overview" and "Getting Started"
3. **DO**: Load an example plugin
4. **READ**: TESTING_UI_WORKFLOW.md
5. **DO**: Test the plugin following the UI workflow

### Intermediate

1. **READ**: TESTING_API_WORKFLOW.md
2. **READ**: TABS_DOCUMENTATION.md completely
3. **READ**: TESTING_GUIDE.md
4. **DO**: Follow examples/testing-workflow-example.md
5. **DO**: Create your own plugin
6. **DO**: Test all methods with automation

### Advanced

1. **READ**: openapi.yaml
2. **READ**: All example files
3. **DO**: Create automated tests
4. **DO**: Build complex features
5. **DO**: Contribute to documentation

---

## 📝 What's New

### Latest Additions

✨ **REAL_API_EXAMPLES.md** (NEWEST!)

- **Actual network requests** captured from browser
- Complete plugin loading sequence with real data
- Package loading patterns (bridge, http)
- Polling strategies and timing
- Working copy-paste scripts (Bash & Python)
- API design patterns and best practices

✨ **TESTING_UI_WORKFLOW.md** (NEW)

- Step-by-step UI testing guide
- Load and test plugins via web interface
- Test methods: enable, getHome, isContentDetailsUrl, getContentDetails
- Visual interface guide
- Troubleshooting tips

✨ **TESTING_API_WORKFLOW.md** (NEW)

- Direct HTTP request testing
- No browser required
- Automated testing scripts (Bash, Python)
- cURL examples for all endpoints
- CI/CD integration ready

✨ **TABS_DOCUMENTATION.md**

- Complete guide to all portal tabs
- Every button documented
- Common workflows
- Error messages
- Best practices

✨ **testing-workflow-example.md**

- Real-world testing scenario
- Step-by-step instructions
- Expected results
- Debugging example
- Test matrix

---

## 🔗 External Resources

### In the Repo

- `/sample/SampleScript.js` - Plugin template
- `/sample/plugin.d.ts` - TypeScript definitions
- `/sources/` - Example plugins

### Online

- **GrayJay**: https://grayjay.app/
- **Plugin Repositories**: GitHub
- **Community**: Developer channels

---

## 💡 Tips for Using This Documentation

### For First-Time Users

1. Start with this INDEX
2. Read README.md overview
3. Follow QUICK_REFERENCE for commands
4. Try testing-workflow-example.md

### For Plugin Developers

1. Keep TABS_DOCUMENTATION.md open
2. Reference TESTING_GUIDE.md
3. Use example-requests.md for API calls
4. Check openapi.yaml for details

### For Troubleshooting

1. Check error in TABS_DOCUMENTATION.md
2. Try solutions in TESTING_GUIDE.md
3. Review testing-workflow-example.md
4. Consult QUICK_REFERENCE.md

---

## ✅ Documentation Checklist

All documentation provides:

- ✅ OpenAPI 3.0 specification
- ✅ Complete tabs and buttons guide
- ✅ Testing methodology
- ✅ Workflow examples
- ✅ API request examples
- ✅ Quick reference
- ✅ Troubleshooting guide
- ✅ Configuration templates
- ✅ Best practices
- ✅ Clear navigation

---

## 🎉 Summary

This documentation suite covers:

**For Beginners**:

- Getting started guides
- Interface documentation
- Example workflows

**For Developers**:

- Complete API reference
- Testing methodologies
- Code examples

**For Troubleshooting**:

- Error messages
- Common issues
- Solutions

**For Advanced Users**:

- OpenAPI specification
- Automated testing
- Integration patterns

Everything you need to successfully develop and test GrayJay plugins! 🚀

---

**Need Help?**

1. Check this INDEX for the right document
2. Read the suggested files
3. Try the examples
4. Check troubleshooting sections

**Still Stuck?**

- Review all example files
- Check browser console
- Verify dev server is running
- Test with sample plugin first
