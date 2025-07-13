'use client';

import { useState, useEffect } from 'react';

// Test basic functionality without complex imports
export function MallaDebug() {
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setStatus('Testing basic functionality...');
      
      // Test 1: Basic state
      console.log('✅ React hooks working');
      
      // Test 2: localStorage access
      if (typeof window !== 'undefined') {
        localStorage.setItem('test', 'works');
        const test = localStorage.getItem('test');
        if (test === 'works') {
          console.log('✅ localStorage working');
        } else {
          throw new Error('localStorage not working');
        }
        localStorage.removeItem('test');
      }
      
      // Test 3: Import mallaStorage
      import('@/lib/mallaStorage').then((mallaStorage) => {
        console.log('✅ mallaStorage imported successfully:', Object.keys(mallaStorage));
        
        // Test 4: Call getSavedMallaData
        const data = mallaStorage.getSavedMallaData();
        console.log('✅ getSavedMallaData returned:', data);
        
        setStatus('All tests passed! 🎉');
      }).catch((importError) => {
        console.error('❌ Import error:', importError);
        setError(`Import error: ${importError.message}`);
        setStatus('Failed at import stage');
      });
      
    } catch (testError) {
      console.error('❌ Test error:', testError);
      setError(`Test error: ${testError.message}`);
      setStatus('Failed during basic tests');
    }
  }, []);

  return (
    <div className="p-8 border border-border rounded-md">
      <h2 className="text-xl font-bold mb-4">🔧 Malla Debug Component</h2>
      <div className="space-y-2">
        <p><strong>Status:</strong> {status}</p>
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800">
            <strong>Error:</strong> {error}
          </div>
        )}
        <div className="text-xs text-muted-foreground">
          <p>Check browser console for detailed logs</p>
        </div>
      </div>
    </div>
  );
}