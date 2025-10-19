import React, { useState, useEffect } from 'react';
import Account from './Account';

const EventList = ({ session }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      console.log('[MOCK] Fetching Events...');
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockEvents = [
        { id: 1, title: "The Cosmic Symphony", date: "Oct 28th", time: "8:00 PM", tickets: 150, price: 55.00 },
        { id: 2, title: "Future Tech Expo 2024", date: "Nov 5th", time: "10:00 AM", tickets: 50, price: 120.00 },
        { id: 3, title: "Comedy Night Live", date: "Nov 12th", time: "7:30 PM", tickets: 30, price: 30.00 },
      ];
      
      setEvents(mockEvents);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-indigo-800">Available Events</h1>
        <Account session={session} />
      </header>

      {loading ? (
        <div className="text-center p-10 text-xl text-gray-500">Loading events...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white shadow-xl rounded-xl p-5 transform hover:scale-[1.02] transition duration-300 border-t-4 border-indigo-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
              <p className="text-gray-600 mb-3"><span className="font-semibold text-indigo-600">Date:</span> {event.date} @ {event.time}</p>
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-green-600">${event.price.toFixed(2)}</span>
                <span className="text-sm font-medium text-yellow-600">{event.tickets} tickets left</span>
              </div>
              <button className="mt-4 w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md">
                Reserve Ticket
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;