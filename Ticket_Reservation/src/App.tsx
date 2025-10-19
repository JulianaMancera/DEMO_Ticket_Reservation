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
    }
  );

  return () => {
    listener?.subscription?.unsubscribe();
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
    <div className="min-h-screen w-full bg-gray-50 font-sans">
      {session ? (
        <EventList session={session} />
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;