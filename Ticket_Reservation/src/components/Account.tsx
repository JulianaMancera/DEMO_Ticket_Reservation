import React, { useState } from 'react';
import { supabase } from "../../supabaseClient";

const Account = ({ session }) => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 border border-gray-200 mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Account</h3>
      <div className="text-sm text-gray-500">
        <p><span className="font-medium text-gray-700">Email:</span> {session?.user?.email || 'N/A'}</p>
        <p><span className="font-medium text-gray-700">Auth Method:</span> {session?.user?.app_metadata.provider === 'email' ? 'Magic Link' : session?.user?.app_metadata.provider || 'Unknown'}</p>
      </div>
      <button
        onClick={handleLogout}
        disabled={loading}
        className={`mt-4 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white transition duration-200 ${
          loading
            ? 'bg-red-400 cursor-not-allowed'
            : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
        }`}
      >
        {loading ? 'Logging Out...' : 'Sign Out'}
      </button>
    </div>
  );
};

export default Account;