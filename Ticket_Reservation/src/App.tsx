import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { Session } from '@supabase/supabase-js'; 
import Auth from './components/Auth';
import EventList from './components/Eventlist';

function App() {
  const [session, setSession] = useState<Session | null>(null); // Explicitly typed
  const [loading, setLoading] = useState<boolean>(true); // Explicitly typed

  useEffect(() => {
  const getInitialSession = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    } catch (e) {
      console.error("Error fetching session:", e);
    } finally {
      setLoading(false);
    }
  };
  getInitialSession();

  const { data: listener } = supabase.auth.onAuthStateChange(
    (_event, currentSession) => {
      setSession(currentSession);
      setLoading(false);
    }
  );

  return () => {
    if (listener?.subscription?.unsubscribe) {
      listener.subscription.unsubscribe();
    }
  };
}, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-2xl font-semibold text-indigo-600 animate-pulse">
          Loading Application...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8 font-sans">
      <main className="w-full">
        {session ? (
          <EventList session={session} />
        ) : (
          <div className="w-full max-w-md mx-auto mt-16">
            <Auth />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;