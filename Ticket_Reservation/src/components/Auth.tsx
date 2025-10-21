import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Handle authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setMessage('Successfully signed in! Redirecting...');
        // Redirect to event list or protected route
        window.location.href = '/events'; // Adjust to your route
      }
    });

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    console.log('Attempting email login with:', email);
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    console.log('Auth response:', { data, error });
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Success! Check your email for the login link.');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: window.location.origin,
        skipBrowserRedirect: false
      }
    });

    if (error) {
      setMessage(`Google login failed: ${error.message}`);
      setLoading(false);
    }
    // Note: If successful, the browser will redirect and this component will unmount
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-10 border border-indigo-100 animate-in fade-in duration-500 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          Ticket System Login
        </h2>
      
        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center py-3 px-4 mb-6 border border-gray-300 rounded-xl shadow-md text-lg font-medium text-white bg-white hover:bg-gray-50 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="h-6 w-6 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
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
    </div>
  );
};

export default Auth;