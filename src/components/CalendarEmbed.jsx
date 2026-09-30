import { useEffect, useMemo } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';
import { CAL_LINK } from '../lib/cal';

// Loaded only after the visitor clicks (see Booking.jsx): nothing reaches Cal.com before that.

export default function CalendarEmbed({ prefill }) {
  const config = useMemo(
    () => ({ layout: 'month_view', theme: 'dark', ...(prefill?.name && { name: prefill.name }), ...(prefill?.email && { email: prefill.email }) }),
    [prefill],
  );

  useEffect(() => {
    getCalApi({ namespace: 'intro' }).then((cal) =>
      cal('ui', {
        theme: 'dark',
        layout: 'month_view',
        cssVarsPerTheme: { dark: { 'cal-brand': '#9d7cff', 'cal-brand-text': '#0a0a0b' } },
      }),
    );
  }, []);

  return <Cal namespace="intro" calLink={CAL_LINK} config={config} style={{ width: '100%', minHeight: 560 }} />;
}
