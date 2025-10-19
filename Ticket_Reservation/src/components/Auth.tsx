import { useState } from "react";
import { supabase } from "../../supabaseClient";
const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Handles Email Magic Link Login
  const handleEmailLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithOtp({ 
      email, 
      options: { emailRedirectTo: window.location.origin }
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Success! Check your email for the login link.');
      setEmail('');
    }
    setLoading(false);
  };
  
  // Handles Google OAuth Login
  const handleGoogleLogin = async () => {
    setMessage('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });

    if (error) {
      setMessage(`Google login failed: ${error.message}`);
    }
  };

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-10 border border-indigo-100 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
        Ticket System Login
      </h2>
      
      {/* Google Login Button */}
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center py-3 px-4 mb-6 border border-gray-300 rounded-xl shadow-md text-lg font-medium text-gray-700 bg-white hover:bg-gray-100 transition duration-150"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-6 w-6 mr-3">
          <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.697-5.38 7.37-9.303 7.37-5.837 0-10.601-4.763-10.601-10.601S13.064 14.251 18.899 14.251c2.68 0 4.954 0.966 6.581 2.396l5.772-5.772C28.52 7.79 24.582 6.5 18.899 6.5 8.921 6.5 0 15.42 0 25.399s8.921 18.899 18.899 18.899c11.006 0 18.33-7.859 18.33-17.771 0-1.168-0.103-2.28-0.28-3.376z"/>
          <path fill="#FF3D00" d="M6.5 24.001l6.101 4.717 1.838-5.711z"/>
          <path fill="#4CAF50" d="M18.899 43.001c-5.18 0-9.843-2.673-12.516-7.184l7.143-5.526c0.812 2.766 2.879 4.833 5.526 5.526 2.385 0.604 4.887 0.407 7.184-0.604l7.184 5.526c-3.15 2.434-7.051 3.447-11.458 3.447z"/>
          <path fill="#1976D2" d="M43.611 20.083c0-1.077-0.198-2.091-0.548-3.051H24v8h11.303c-0.792 2.237-1.782 4.192-3.303 5.618l5.772 5.772c3.555-3.528 5.618-8.243 5.618-14.339 0-0.278-0.013-0.556-0.038-0.834z"/>
        </svg>
        Continue with Google
      </button>

      {/* Separator */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">OR</span>
        </div>
      </div>

      {/* Email Magic Link Form */}
      <form onSubmit={handleEmailLogin} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="mt-1">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !email}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-lg font-medium text-white transition duration-200 ${
            loading || !email
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {loading ? 'Sending Link...' : 'Send Magic Link'}
        </button>
      </form>

      {/* Message Box */}
      {message && (
        <div 
          className="mt-6 p-4 text-sm font-semibold rounded-xl"
          style={{ 
            backgroundColor: message.startsWith('Success') ? '#d1fae5' : '#fee2e2',
            color: message.startsWith('Success') ? '#065f46' : '#991b1b'
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};
