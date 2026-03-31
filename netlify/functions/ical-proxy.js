export default async (req, context) => {
  const ICAL_URL = 'http://www.vrbo.com/icalendar/8913f89a2041436182e2d827e85ab495.ics';

  try {
    const response = await fetch(ICAL_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CalendarBot/1.0)' }
    });

    if (!response.ok) {
      return new Response('Failed to fetch calendar', { status: 502 });
    }

    const icsText = await response.text();

    return new Response(icsText, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
      }
    });
  } catch (err) {
    return new Response('Error: ' + err.message, { status: 500 });
  }
};

export const config = {
  path: '/api/ical',
};
