import { useState } from 'react';
import {
  testTokenRefresh,
  simulateTokenRefresh,
  exampleApiCalls,
} from '@/lib/api/test-interceptor';

/**
 * Hook to test the axios interceptor functionality
 * This can be used in any React component to test token refresh
 */
export const useTestInterceptor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testBasicRequest = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await testTokenRefresh();
      setResult(data);
      console.log('✅ Basic request test passed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test failed');
      console.error('❌ Basic request test failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const testTokenRefreshScenario = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await simulateTokenRefresh();
      setResult(data);
      console.log('✅ Token refresh test passed');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Token refresh test failed'
      );
      console.error('❌ Token refresh test failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const testUserProfile = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await exampleApiCalls.getUserProfile(userId);
      setResult(data);
      console.log('✅ User profile test passed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'User profile test failed');
      console.error('❌ User profile test failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const testUserCarCounts = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await exampleApiCalls.getUserCarCounts(userId);
      setResult(data);
      console.log('✅ User car counts test passed');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'User car counts test failed'
      );
      console.error('❌ User car counts test failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    result,
    error,
    testBasicRequest,
    testTokenRefreshScenario,
    testUserProfile,
    testUserCarCounts,
  };
};

// Example component showing how to use the test hook
export const InterceptorTestComponent = () => {
  const {
    isLoading,
    result,
    error,
    testBasicRequest,
    testTokenRefreshScenario,
    testUserProfile,
    testUserCarCounts,
  } = useTestInterceptor();

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Axios Interceptor Test</h2>

      <div className="space-x-2">
        <button
          onClick={testBasicRequest}
          disabled={isLoading}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
        >
          Test Basic Request
        </button>

        <button
          onClick={testTokenRefreshScenario}
          disabled={isLoading}
          className="rounded bg-green-500 px-4 py-2 text-white disabled:opacity-50"
        >
          Test Token Refresh
        </button>

        <button
          onClick={() => testUserProfile('68b9f10358b467ec538bce4d')}
          disabled={isLoading}
          className="rounded bg-purple-500 px-4 py-2 text-white disabled:opacity-50"
        >
          Test User Profile
        </button>

        <button
          onClick={() => testUserCarCounts('68b9f10358b467ec538bce4d')}
          disabled={isLoading}
          className="rounded bg-orange-500 px-4 py-2 text-white disabled:opacity-50"
        >
          Test Car Counts
        </button>
      </div>

      {isLoading && <div className="text-blue-600">Loading...</div>}

      {error && (
        <div className="rounded border border-red-400 bg-red-100 p-3 text-red-700">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="rounded border border-green-400 bg-green-100 p-3 text-green-700">
          <h3 className="font-bold">Result:</h3>
          <pre className="mt-2 overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
