// Unity WebGL Compatibility Fixer
// This script addresses common WebAssembly runtime issues

(function() {
    'use strict';
    
    console.log('Unity WebGL Compatibility Fixer loaded');
    
    // Fix WebAssembly instantiation issues
    if (typeof WebAssembly !== 'undefined') {
        // Polyfill for older browsers
        if (!WebAssembly.instantiateStreaming) {
            WebAssembly.instantiateStreaming = function(resp, importObject) {
                return resp.arrayBuffer().then(function(bytes) {
                    return WebAssembly.instantiate(bytes, importObject);
                });
            };
        }
        
        // Fix memory allocation issues
        if (WebAssembly.Memory) {
            const originalMemory = WebAssembly.Memory;
            WebAssembly.Memory = function(descriptor) {
                try {
                    // Ensure minimum memory size
                    if (descriptor.initial < 256) {
                        descriptor.initial = 256;
                    }
                    if (descriptor.maximum && descriptor.maximum < 512) {
                        descriptor.maximum = 512;
                    }
                    return new originalMemory(descriptor);
                } catch (e) {
                    console.warn('WebAssembly.Memory creation failed, using fallback:', e);
                    // Fallback with smaller memory
                    return new originalMemory({
                        initial: 256,
                        maximum: 512
                    });
                }
            };
        }
    }
    
    // Fix Unity WebGL specific issues
    window.UnityWebGLFixer = {
        // Fix canvas context issues
        fixCanvasContext: function(canvas) {
            try {
                // Try to get WebGL2 context first
                let gl = canvas.getContext('webgl2', {
                    preserveDrawingBuffer: false,
                    powerPreference: 'high-performance',
                    antialias: false,
                    depth: true,
                    stencil: false,
                    alpha: false
                });
                
                if (!gl) {
                    // Fallback to WebGL1
                    gl = canvas.getContext('webgl', {
                        preserveDrawingBuffer: false,
                        powerPreference: 'high-performance',
                        antialias: false,
                        depth: true,
                        stencil: false,
                        alpha: false
                    });
                }
                
                if (gl) {
                    console.log('Canvas WebGL context created successfully');
                    return gl;
                } else {
                    throw new Error('WebGL not supported');
                }
            } catch (e) {
                console.error('Failed to create WebGL context:', e);
                return null;
            }
        },
        
        // Fix memory issues
        fixMemoryIssues: function() {
            // Increase memory limits if possible
            if (window.performance && window.performance.memory) {
                const memory = window.performance.memory;
                console.log('Memory info:', {
                    used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
                    total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
                    limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
                });
            }
            
            // Force garbage collection if available
            if (window.gc) {
                try {
                    window.gc();
                    console.log('Garbage collection triggered');
                } catch (e) {
                    console.log('Garbage collection not available');
                }
            }
        },
        
        // Fix timing issues
        fixTimingIssues: function() {
            // Ensure requestAnimationFrame is available
            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = function(callback) {
                    return setTimeout(callback, 1000 / 60);
                };
            }
            
            // Fix performance.now if not available
            if (!window.performance || !window.performance.now) {
                window.performance = window.performance || {};
                window.performance.now = function() {
                    return Date.now();
                };
            }
        },
        
        // Apply all fixes
        applyAllFixes: function() {
            console.log('Applying Unity WebGL compatibility fixes...');
            
            this.fixTimingIssues();
            this.fixMemoryIssues();
            
            // Monitor for WebAssembly errors
            window.addEventListener('error', function(e) {
                if (e.error && e.error.message && e.error.message.includes('wasm')) {
                    console.error('WebAssembly error detected:', e.error);
                    
                    // Try to recover from certain errors
                    if (e.error.message.includes('null function') || e.error.message.includes('function signature mismatch')) {
                        console.log('Attempting to recover from WebAssembly error...');
                        
                        // Reload the page after a short delay
                        setTimeout(function() {
                            if (confirm('Unity WebGL encountered an error. Would you like to reload the page?')) {
                                window.location.reload();
                            }
                        }, 1000);
                    }
                }
            });
            
            console.log('Unity WebGL compatibility fixes applied');
        }
    };
    
    // Auto-apply fixes
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.UnityWebGLFixer.applyAllFixes();
        });
    } else {
        window.UnityWebGLFixer.applyAllFixes();
    }
    
})();
