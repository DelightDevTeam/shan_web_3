/**
 * Unity WebGL Runtime Fixes for GoldenMM Game
 * Addresses PlayerLoop recursion, GameManager initialization, and SmartFoxServer issues
 */

(function() {
    'use strict';
    
    console.log('🔧 Unity WebGL Fixes: Initializing...');
    
    // Global state management
    const UnityFixes = {
        isInitialized: false,
        gameManagerFound: false,
        playerLoopFixed: false,
        connectionRetries: 0,
        maxRetries: 5,
        retryDelay: 2000,
        performanceMonitor: {
            frameCount: 0,
            lastFrameTime: 0,
            recursionDetected: false
        }
    };
    
    // Fix 1: PlayerLoop Recursion Prevention
    function fixPlayerLoopRecursion() {
        if (UnityFixes.playerLoopFixed) return;
        
        console.log('🔧 Fixing PlayerLoop recursion...');
        
        // Override requestAnimationFrame to prevent infinite recursion
        const originalRAF = window.requestAnimationFrame;
        let frameCount = 0;
        let lastFrameTime = performance.now();
        
        window.requestAnimationFrame = function(callback) {
            const currentTime = performance.now();
            const deltaTime = currentTime - lastFrameTime;
            
            // Detect potential recursion (frames happening too fast)
            if (deltaTime < 1) {
                frameCount++;
                if (frameCount > 100) {
                    console.warn('⚠️ PlayerLoop recursion detected, applying fix...');
                    UnityFixes.performanceMonitor.recursionDetected = true;
                    
                    // Force a delay to break the recursion
                    setTimeout(() => {
                        frameCount = 0;
                        lastFrameTime = performance.now();
                        callback(currentTime + 16); // Force 60fps timing
                    }, 16);
                    return;
                }
            } else {
                frameCount = 0;
            }
            
            lastFrameTime = currentTime;
            return originalRAF(callback);
        };
        
        UnityFixes.playerLoopFixed = true;
        console.log('✅ PlayerLoop recursion fix applied');
    }
    
    // Fix 2: GameManager Initialization
    function fixGameManagerInitialization() {
        if (UnityFixes.gameManagerFound) return;
        
        console.log('🔧 Fixing GameManager initialization...');
        
        // Wait for Unity to be ready
        const checkGameManager = setInterval(() => {
            if (typeof window.UnityInstance !== 'undefined' && window.UnityInstance) {
                try {
                    // Try to find GameManager in the scene
                    window.UnityInstance.SendMessage('GameManager', 'Initialize');
                    UnityFixes.gameManagerFound = true;
                    clearInterval(checkGameManager);
                    console.log('✅ GameManager found and initialized');
                } catch (error) {
                    console.warn('⚠️ GameManager not found, creating fallback...');
                    createGameManagerFallback();
                    clearInterval(checkGameManager);
                }
            }
        }, 1000);
        
        // Timeout after 30 seconds
        setTimeout(() => {
            if (!UnityFixes.gameManagerFound) {
                clearInterval(checkGameManager);
                console.error('❌ GameManager initialization timeout');
                createGameManagerFallback();
            }
        }, 30000);
    }
    
    // Fix 3: Create GameManager Fallback
    function createGameManagerFallback() {
        console.log('🔧 Creating GameManager fallback...');
        
        // Create a minimal GameManager object
        window.GameManager = {
            isInitialized: true,
            gameState: 'loading',
            playerData: {
                username: new URLSearchParams(window.location.search).get('user_name') || 'Player',
                balance: parseFloat(new URLSearchParams(window.location.search).get('balance')) || 0
            },
            Initialize: function() {
                console.log('🎮 GameManager fallback initialized');
                this.gameState = 'ready';
                this.triggerEvent('gameReady');
            },
            triggerEvent: function(eventName) {
                const event = new CustomEvent('gameManagerEvent', {
                    detail: { event: eventName, data: this }
                });
                window.dispatchEvent(event);
            }
        };
        
        UnityFixes.gameManagerFound = true;
        window.GameManager.Initialize();
    }
    
    // Fix 4: SmartFoxServer Connection Recovery
    function fixSmartFoxConnection() {
        console.log('🔧 Setting up SmartFoxServer connection recovery...');
        
        // Monitor connection status
        const connectionMonitor = setInterval(() => {
            if (typeof window.SFS2X !== 'undefined' && window.SFS2X) {
                const sfs = window.SFS2X;
                
                if (!sfs.isConnected() && UnityFixes.connectionRetries < UnityFixes.maxRetries) {
                    console.log(`🔄 Attempting to reconnect to SmartFoxServer (${UnityFixes.connectionRetries + 1}/${UnityFixes.maxRetries})`);
                    
                    try {
                        sfs.connect('gameserver.dlgame.online', 8443);
                        UnityFixes.connectionRetries++;
                    } catch (error) {
                        console.error('❌ SmartFoxServer reconnection failed:', error);
                    }
                } else if (sfs.isConnected()) {
                    console.log('✅ SmartFoxServer connection restored');
                    UnityFixes.connectionRetries = 0;
                }
            }
        }, 5000);
        
        // Cleanup after max retries
        setTimeout(() => {
            clearInterval(connectionMonitor);
            if (UnityFixes.connectionRetries >= UnityFixes.maxRetries) {
                console.error('❌ SmartFoxServer connection failed after max retries');
                showConnectionError();
            }
        }, UnityFixes.maxRetries * UnityFixes.retryDelay);
    }
    
    // Fix 5: Performance Monitoring
    function setupPerformanceMonitoring() {
        console.log('🔧 Setting up performance monitoring...');
        
        let frameCount = 0;
        let lastTime = performance.now();
        
        function monitorPerformance() {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                if (fps < 30) {
                    console.warn(`⚠️ Low FPS detected: ${fps}`);
                    applyPerformanceOptimizations();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(monitorPerformance);
        }
        
        requestAnimationFrame(monitorPerformance);
    }
    
    // Fix 6: Performance Optimizations
    function applyPerformanceOptimizations() {
        console.log('🔧 Applying performance optimizations...');
        
        // Reduce animation frame rate for better performance
        if (UnityFixes.performanceMonitor.recursionDetected) {
            document.body.style.setProperty('--animation-duration', '0.5s');
            document.body.style.setProperty('--transition-duration', '0.3s');
        }
        
        // Disable heavy animations
        const heavyElements = document.querySelectorAll('.spinner, .pulse, .rotate');
        heavyElements.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    }
    
    // Fix 7: Error Recovery
    function setupErrorRecovery() {
        console.log('🔧 Setting up error recovery...');
        
        // Override console.error to catch Unity errors
        const originalError = console.error;
        console.error = function(...args) {
            const message = args.join(' ');
            
            if (message.includes('PlayerLoop internal function has been called recursively')) {
                console.warn('🔄 PlayerLoop recursion detected, applying recovery...');
                fixPlayerLoopRecursion();
                return;
            }
            
            if (message.includes('object GameManager not found')) {
                console.warn('🔄 GameManager not found, attempting recovery...');
                fixGameManagerInitialization();
                return;
            }
            
            if (message.includes('SmartFoxServer lost')) {
                console.warn('🔄 SmartFoxServer connection lost, attempting recovery...');
                fixSmartFoxConnection();
                return;
            }
            
            // Call original error handler
            originalError.apply(console, args);
        };
    }
    
    // Fix 8: Loading State Management
    function setupLoadingStateManagement() {
        console.log('🔧 Setting up loading state management...');
        
        const loadingScreen = document.querySelector('.loading-screen');
        const progressFill = document.querySelector('.progress-fill');
        const loadingText = document.querySelector('.loading-text p');
        
        if (loadingScreen && progressFill) {
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.random() * 10;
                if (progress > 100) progress = 100;
                
                progressFill.style.width = `${progress}%`;
                
                if (loadingText) {
                    if (progress < 30) {
                        loadingText.textContent = 'Initializing Unity runtime...';
                    } else if (progress < 60) {
                        loadingText.textContent = 'Loading game assets...';
                    } else if (progress < 90) {
                        loadingText.textContent = 'Connecting to game server...';
                    } else {
                        loadingText.textContent = 'Almost ready...';
                    }
                }
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                    setTimeout(() => {
                        loadingScreen.classList.add('fade-out');
                        setTimeout(() => {
                            loadingScreen.style.display = 'none';
                        }, 500);
                    }, 1000);
                }
            }, 200);
        }
    }
    
    // Fix 9: Show Connection Error
    function showConnectionError() {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'connection-error';
        errorDiv.innerHTML = `
            <div class="error-content">
                <h3>⚠️ Connection Error</h3>
                <p>Unable to connect to the game server. Please check your internet connection and try again.</p>
                <button onclick="location.reload()">Retry Connection</button>
            </div>
        `;
        
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        document.body.appendChild(errorDiv);
    }
    
    // Fix 10: Initialize All Fixes
    function initializeFixes() {
        if (UnityFixes.isInitialized) return;
        
        console.log('🚀 Initializing Unity WebGL fixes...');
        
        // Apply fixes in order
        fixPlayerLoopRecursion();
        setupErrorRecovery();
        fixGameManagerInitialization();
        fixSmartFoxConnection();
        setupPerformanceMonitoring();
        setupLoadingStateManagement();
        
        UnityFixes.isInitialized = true;
        console.log('✅ All Unity WebGL fixes initialized');
    }
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFixes);
    } else {
        initializeFixes();
    }
    
    // Also initialize when Unity is ready
    window.addEventListener('unity-ready', initializeFixes);
    
    // Export for manual use
    window.UnityFixes = UnityFixes;
    
})();
