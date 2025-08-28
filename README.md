# Shan Web 3 - Unity WebGL Project

This is a Unity WebGL project called "GoldenMM" that has been deployed to the web.

## Project Structure

- `index.html` - Main HTML file with Unity WebGL integration
- `Build/` - Unity WebGL build files
  - `SKMWebDelight.wasm` - WebAssembly binary
  - `SKMWebDelight.data` - Unity data files
  - `SKMWebDelight.framework.js` - Unity framework
  - `SKMWebDelight.loader.js` - Unity loader script
- `TemplateData/` - Unity template assets (CSS, images, etc.)
- `vercel.json` - Vercel deployment configuration
- `package.json` - Development dependencies and scripts
- `start-server.bat` - Windows batch file to start development server
- `start-server.ps1` - PowerShell script to start development server
- `unity-fix.js` - Unity WebGL compatibility fixer script
- `diagnostic.html` - Comprehensive diagnostic tool for WebAssembly errors
- `test.html` - Basic Unity integration test

## Issues Fixed

1. **WebAssembly Runtime Error**: Fixed "RuntimeError: null function or function signature mismatch"
2. **Missing StreamingAssets**: Removed reference to non-existent StreamingAssets directory
3. **MIME Type Issues**: Added proper Content-Type headers for .wasm files
4. **Error Handling**: Improved error handling and user feedback
5. **Canvas Configuration**: Enhanced WebGL context attributes
6. **Port Conflicts**: Added multiple port options to avoid permission denied errors
7. **WebAssembly Compatibility**: Added comprehensive compatibility fixes and polyfills
8. **Memory Management**: Enhanced memory allocation and garbage collection
9. **Error Recovery**: Added automatic error recovery mechanisms

## Local Development

### Quick Start (Recommended)

**Windows Users:**
```bash
# Double-click the batch file
start-server.bat

# Or run PowerShell script
.\start-server.ps1
```

**All Users:**
```bash
# Install dependencies
npm install

# Start development server (multiple options)
npm start          # Port 3000
npm run start-alt  # Port 5000
npm run start-local # Auto-assign port
```

### Port Options

- **Port 3000** (default): `http://localhost:3000`
- **Port 5000** (alternative): `http://localhost:5000`
- **Auto-assign**: Server automatically finds available port

### Troubleshooting Port Issues

If you get "permission denied" errors:

1. **Use different ports:**
   ```bash
   npm run start-alt    # Try port 5000
   npm run start-local  # Auto-assign port
   ```

2. **Check what's using port 8080:**
   ```bash
   # Windows
   netstat -ano | findstr :8080
   
   # PowerShell
   .\start-server.ps1
   # Choose option 4 to check available ports
   ```

3. **Run as Administrator** (if needed):
   - Right-click PowerShell/Command Prompt
   - Select "Run as Administrator"

4. **Use the provided scripts:**
   - `start-server.bat` - Simple batch file
   - `start-server.ps1` - Advanced PowerShell script

## Diagnostic Tools

### 🔧 Comprehensive Diagnostic Tool

Open `diagnostic.html` in your browser for a complete Unity WebGL analysis:

- **System Analysis**: Browser compatibility, WebGL support, WebAssembly support
- **Unity File Analysis**: Check all Unity build files for availability and size
- **WebAssembly Validation**: Verify .wasm file integrity and format
- **Performance Analysis**: Memory usage, hardware acceleration, security context
- **Auto-Fixes**: Apply compatibility fixes automatically
- **Detailed Logging**: Export diagnostic results for troubleshooting

### 🧪 Basic Test Tool

Open `test.html` for quick Unity integration testing:

- Browser compatibility check
- File availability test
- Unity loader verification

### 🛠️ Compatibility Fixer

The `unity-fix.js` script automatically applies fixes for:

- WebAssembly instantiation issues
- Memory allocation problems
- Canvas context creation
- Timing and performance issues
- Error recovery mechanisms

## Deployment

This project is configured for Vercel deployment with:

- Proper MIME types for WebAssembly files
- Caching headers for better performance
- SPA routing support

## Troubleshooting

### Common Issues

1. **WebAssembly not loading**: Ensure your server supports `application/wasm` MIME type
2. **CORS errors**: Use a local development server (npm start)
3. **Memory issues**: Check browser console for memory allocation errors
4. **Mobile compatibility**: The project includes orientation detection for mobile devices
5. **Port conflicts**: Use the provided scripts or different port numbers
6. **WebAssembly runtime errors**: Use the diagnostic tool and compatibility fixer

### WebAssembly Runtime Error Solutions

If you still get "RuntimeError: null function or function signature mismatch":

1. **Use the diagnostic tool:**
   - Open `diagnostic.html`
   - Run full diagnostic
   - Apply auto-fixes

2. **Check Unity build settings:**
   - WebGL Memory Size: Set to 512MB or higher
   - Compression Format: Disabled
   - Exception Support: Enabled
   - Development Build: Enabled for debugging

3. **Browser compatibility:**
   - Chrome/Edge: Full support
   - Firefox: Full support
   - Safari: iOS 15+ or Safari 15+
   - Mobile browsers: Limited support, may require landscape orientation

4. **Memory management:**
   - Close other browser tabs
   - Restart browser if memory usage is high
   - Use the compatibility fixer script

## Unity Build Settings

If rebuilding from Unity:

1. Set WebGL Memory Size to 512MB or higher
2. Enable "Development Build" for debugging
3. Set Compression Format to "Disabled" for better compatibility
4. Ensure "Exception Support" is enabled
5. Set "WebGL Template" to "Default" or "Minimal"
6. Enable "Run In Background" for better performance

## Support

For Unity-specific issues, check the Unity WebGL documentation and ensure your Unity version supports the target browsers.

### Quick Test

After starting the server, open these files in order:

1. **`diagnostic.html`** - Run comprehensive analysis
2. **`test.html`** - Verify basic functionality
3. **`index.html`** - Main Unity project

### Error Recovery

The project now includes automatic error recovery:

- WebAssembly errors are caught and handled gracefully
- Memory issues trigger automatic cleanup
- Failed loads are retried automatically
- User-friendly error messages with recovery options
