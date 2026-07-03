import React, { useEffect, useState } from 'react';
import { getTestimonials } from '../services/testimonialsService';

const Star = ({ filled }) => (
  <svg
    className={`h-4 w-4 ${filled ? 'text-amber-400' : 'text-gray-700'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.538 1.118l-3.367-2.447a1 1 0 00-1.176 0l-3.367 2.447c-.783.57-1.838-.196-1.538-1.118l1.287-3.957a1 1 0 00-.363-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.285-3.958z" />
  </svg>
);

const Testimonials = ({ service = null }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await getTestimonials(1, 6, true);
        if (!cancelled && res && res.success) {
          const data = service
            ? res.data.filter(t => !t.service || t.service === service)
            : res.data;
          setTestimonials(data);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [service]);

  if (loading || testimonials.length === 0) return null;

  return (
    <section className="mb-section">
      <div className="relative pb-3 mb-8">
        <h2 className="text-3xl font-bold text-gray-100 mb-1">What Clients Say</h2>
        <div className="absolute bottom-0 left-0 w-24 h-1 bg-brand-primary rounded-full"></div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t._id}
            className="backdrop-blur-sm bg-gray-900/80 p-6 rounded-xl shadow-md hover:shadow-xl hover:shadow-cyan-900/20 transition-all duration-300 border border-gray-800 relative overflow-hidden"
          >
            <div className="flex mb-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} filled={n <= (t.rating || 5)} />
              ))}
            </div>
            <p className="text-gray-100 mb-5 text-improved italic">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center">
              {t.avatar ? (
                <img
                  src={t.avatar}
                  alt={t.clientName}
                  loading="lazy"
                  className="h-10 w-10 rounded-full object-cover mr-3 border border-indigo-700"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {t.clientName.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <p className="text-gray-100 font-semibold text-sm">{t.clientName}</p>
                {(t.clientTitle || t.company) && (
                  <p className="text-gray-400 text-xs">
                    {[t.clientTitle, t.company].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
