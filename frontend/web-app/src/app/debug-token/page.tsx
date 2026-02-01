"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function DebugTokenPage() {
  const { user, accessToken, isAuthenticated } = useAuth();
  const [decodedToken, setDecodedToken] = useState<any>(null);

  useEffect(() => {
    if (accessToken) {
      try {
        // Decode JWT token (base64)
        const parts = accessToken.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          setDecodedToken(payload);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [accessToken]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug Token Information</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Authentication Status</h2>
          <p><strong>Is Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">User Info</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Access Token</h2>
          <div className="bg-gray-100 p-4 rounded overflow-auto break-all text-xs">
            {accessToken || "No token"}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Decoded Token Payload</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {decodedToken ? JSON.stringify(decodedToken, null, 2) : "No token to decode"}
          </pre>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">LocalStorage</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {typeof window !== 'undefined' ? JSON.stringify({
              access_token: localStorage.getItem('access_token')?.substring(0, 50) + '...',
              refresh_token: localStorage.getItem('refresh_token')?.substring(0, 50) + '...',
              user: localStorage.getItem('user')
            }, null, 2) : 'Not available'}
          </pre>
        </div>
      </div>
    </div>
  );
}
