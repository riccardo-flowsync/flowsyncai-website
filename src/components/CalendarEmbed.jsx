import { useEffect, useMemo, useState } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';
import { useLang } from '../lib/lang';
import { CAL_LINK } from '../lib/cal';

// Loaded only after the visitor clicks (see Booking.jsx): nothing reaches Cal.com before that.

export default function CalendarEmbed({ prefill }) {
  const { lang } = useLang();
  const [timezone, setTimezone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Rome');
  const zones = useMemo(() => [...new Set([timezone, ...Intl.supportedValuesOf('timeZone')])], [timezone]);
  const config = useMemo(
    () => ({ layout: 'column_view', theme: 'dark', useSlotsViewOnSmallScreen: 'true', 'cal.tz': timezone, ...(prefill?.name && { name: prefill.name }), ...(prefill?.email && { email: prefill.email }) }),
    [prefill, timezone],
  );

  useEffect(() => {
    getCalApi({ namespace: 'intro' }).then((cal) =>
      cal('ui', {
        theme: 'dark',
        layout: 'column_view',
        hideEventTypeDetails: true,
        useSlotsViewOnSmallScreen: true,
        disableAutoScroll: true,
        cssVarsPerTheme: { dark: { 'cal-brand': '#9d7cff', 'cal-brand-text': '#0a0a0b' } },
      }),
    );
  }, []);

  return (
    <div>
      <label className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-4 text-sm text-muted">
        {lang === 'it' ? 'Fuso orario' : 'Time zone'}
        <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="field min-w-0 flex-1 text-sm">
          {zones.map((zone) => <option key={zone} value={zone}>{zone.replaceAll('_', ' ')}</option>)}
        </select>
      </label>
      <Cal key={timezone} namespace="intro" calLink={CAL_LINK} config={config} style={{ width: '100%', minHeight: 400 }} />
    </div>
  );
}
