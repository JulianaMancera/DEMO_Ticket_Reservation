import { useEffect, useState } from "react";
import { supabase } from '../../supabaseClient'; 
import Account from './Account';
import type { Session } from '@supabase/supabase-js';

interface RawEvent {
  id: number;
  name: string;
  data: string; 
  total_seats: number;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  tickets: number;
  price: number;
}

const EventList = ({ session }: { session: Session | null }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    console.log('[FETCH] Fetching Events from Supabase...');

    const { data, error } = await supabase
      .from('events')
      .select('id, name, data, total_seats');

    if (error) {
      console.error('Error fetching events:', error.message);
    } else {
      const transformedEvents = (data as RawEvent[]).map(event => ({
        id: event.id,
        title: event.name,
        date: event.data ? new Date(event.data).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
        time: event.data ? new Date(event.data).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '',
        tickets: event.total_seats || 0,
        price: 0,
      }));
      setEvents(transformedEvents);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const reserveTicket = async (eventId: number) => {
    const { data, error } = await supabase
      .from('events')
      .select('total_seats')
      .eq('id', eventId)
      .single();

    if (error || !data) {
      console.error('Error fetching event:', error?.message);
      return;
    }

    if (data.total_seats > 0) {
      const { error: updateError } = await supabase
        .from('events')
        .update({ total_seats: data.total_seats - 1 })
        .eq('id', eventId);

      if (updateError) {
        console.error('Error updating seats:', updateError.message);
      } else {
        fetchEvents(); 
      }
    }
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <header className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-indigo-800">Available Events</h1>
        {session && <Account session={session} />}
      </header>

      {loading ? (
        <div className="text-center p-10 text-xl text-gray-500">Loading events...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {events.map(event => (
            <div key={event.id} className="bg-white shadow-xl rounded-xl p-5 transform hover:scale-[1.02] transition duration-300 border-t-4 border-indigo-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
              <p className="text-gray-600 mb-3"><span className="font-semibold text-indigo-600">Date:</span> {event.date} @ {event.time}</p>
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-green-600">${event.price.toFixed(2)}</span>
                <span className="text-sm font-medium text-yellow-600">{event.tickets} tickets left</span>
              </div>
              <button
                onClick={() => reserveTicket(event.id)}
                className="mt-4 w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
                disabled={event.tickets === 0}
              >
                {event.tickets === 0 ? 'Sold Out' : 'Reserve Ticket'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;