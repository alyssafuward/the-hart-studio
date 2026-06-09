import { useState } from "react";

const today = new Date();
today.setHours(0, 0, 0, 0);

const events = [
  { name: "Meet & Greet", date: new Date("2026-06-18T15:30:00Z"), sub: "Paid", description: "Come say hi before the launch. A casual intro to the community — bring something you've built or created with AI." },
  { name: "Live Build Launch Session", date: new Date("2026-06-19T15:30:00Z"), type: "Live builds", sub: "Free", link: "https://us06web.zoom.us/meeting/register/PeCN3GiERy2WkfNkseBCLw", description: "A free 60-minute live session with a build demo in Claude, Claude Code, and GitHub. Open to anyone. No technical experience required." },
  { name: "Tech Setup Session", date: new Date("2026-06-19T17:00:00Z"), type: "Live builds", sub: "Paid", tag: "Onboarding", description: "30-min hands-on group tech setup for paid subscribers. Get your Claude Code + GitHub stack ready." },
  { name: "Office Hours – Mon", date: new Date("2026-06-29T21:00:00Z"), type: "Office Hours", sub: "Paid", description: "Open office hours. Sign up for a 30-min slot focused on tech setup and wherever you're getting blocked." },
  { name: "Office Hours – Tue", date: new Date("2026-06-30T16:00:00Z"), type: "Office Hours", sub: "Paid", description: "Open office hours. Sign up for a 30-min slot focused on tech setup and wherever you're getting blocked." },
  { name: "Office Hours – Wed", date: new Date("2026-07-01T21:00:00Z"), type: "Office Hours", sub: "Paid", description: "Open office hours. Sign up for a 30-min slot focused on tech setup and wherever you're getting blocked." },
  { name: "Office Hours – Thu", date: new Date("2026-07-02T16:00:00Z"), type: "Office Hours", sub: "Paid", description: "Open office hours. Sign up for a 30-min slot focused on tech setup and wherever you're getting blocked." },
  { name: "Live Build #1 – Getting started (Onboarding)", date: new Date("2026-07-17T15:30:00Z"), type: "Live builds", sub: "Paid", tag: "Onboarding", description: "Introduction to the basic  development process. Walk through an end-to-end build process from idea to development to review to live update. Tech concepts covered includes: Claude Code, GitHub, localhost (to preview changes), peer review / pull request. Will use Open Room, a platform Alyssa built for easy building." },
  { name: "Live Build #2 – Make it a habit (Onboarding)", date: new Date("2026-07-31T15:30:00Z"), type: "Live builds", sub: "Paid", tag: "Onboarding", description: "Practice what you learned in Session 1 with further builds and reps on the builder development cycle" },
  { name: "Live Build #3 – Make it your own (Onboarding)", date: new Date("2026-08-14T15:30:00Z"), type: "Live builds", sub: "Paid", tag: "Onboarding", description: "How to set up your own repo and project." },
  { name: "Office Hours – Aug", date: new Date("2026-08-07T15:30:00Z"), type: "Office Hours", sub: "Paid", description: "Open office hours. Priority goes to newcomers that need help with tech setup." },
  { name: "Live Build #4 – Focused build (planned)", date: new Date("2026-08-28T15:30:00Z"), type: "Live builds", sub: "Paid", description: "The first proper HART Studio  live build session! Start with a brief demo by Alyssa, followed by open build time where people can run with it and help each other troubleshoot. Share what you built at the end of the session." },
  { name: "Live Build #5 – Onboarding for newcomers (planned)", date: new Date("2026-09-11T15:30:00Z"), type: "Live builds", sub: "Paid", tag: "Onboarding", description: "A chance for newcomers to get up to speed with an end-to-end build overview. If there aren't enough new builders, we'll use this time for a regular build session." },
  { name: "Live Build #6 – Build and share (planned)", date: new Date("2026-09-25T15:30:00Z"), type: "Live builds", sub: "Paid", description: "Given the same prompt, everyone builds their own version. Then we share what we made." },
  { name: "Office Hours – Sep", date: new Date("2026-09-04T15:30:00Z"), type: "Office Hours", sub: "Paid", description: "Open office hours. Priority goes to newcomers that need help with tech setup." },
  { name: "Live Build #7 – Focused build (planned)", date: new Date("2026-10-09T15:30:00Z"), type: "Live builds", sub: "Paid", description: "Start with a brief demo by Alyssa, followed by open build time where people can run with it and help each other troubleshoot. Share what you built at the end of the session." },
  { name: "Office Hours – Oct", date: new Date("2026-10-02T15:30:00Z"), type: "Office Hours", sub: "Paid", description: "Open office hours. Priority goes to newcomers that need help with tech setup." },
  { name: "Live Build #8 – Onboarding for newcomers (planned)", date: new Date("2026-10-23T15:30:00Z"), type: "Live builds", sub: "Paid", tag: "Onboarding", description: "A chance for newcomers to get up to speed with an end-to-end build overview. If there aren't enough new builders, we'll use this time for a regular build session." },  
];

const PAGE_SIZE = 12;
const upcoming = events.filter((e) => e.date >= today).sort((a, b) => a.date - b.date);

const typeColors = {
  "Live builds": { bg: "#FFF7ED", text: "#9A3412" },
  "Office Hours": { bg: "#F0FDF4", text: "#166534" },
};
const subColors = {
  Free: { bg: "#EFF6FF", text: "#1D4ED8" },
  Paid: { bg: "#FAF5FF", text: "#7C3AED" },
};
const tagColors = {
  Onboarding: { bg: "#FEF9C3", text: "#854D0E" },
};

const FILTERS = [
  { label: "All", value: null },
  { label: "Live Builds", value: "Live builds" },
  { label: "Office Hours", value: "Office Hours" },
  { label: "Onboarding", value: "Onboarding" },
];

function applyFilter(events, filter) {
  if (!filter) return events;
  if (filter === "Onboarding") return events.filter((e) => e.tag === "Onboarding");
  return events.filter((e) => e.type === filter);
}

function getMonths(events) {
  return [...new Set(events.map((e) => `${e.date.getFullYear()}-${e.date.getMonth()}`))]
    .map((key) => {
      const e = events.find((ev) => `${ev.date.getFullYear()}-${ev.date.getMonth()}` === key);
      return new Date(e.date.getFullYear(), e.date.getMonth(), 1);
    })
    .sort((a, b) => a - b);
}

function daysUntil(date) {
  const diff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `In ${diff}d`;
}
function formatTime(date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Los_Angeles" }) + " PT";
}
function formatDateLong(date) {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}
function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y, m) { return new Date(y, m, 1).getDay(); }

function EventModal({ event, onClose, onPrev, onNext, index, total }) {
  const tc = event.type ? typeColors[event.type] : null;
  const sc = subColors[event.sub];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 150, padding: 24 }}>
      <div style={{ background: "#FAFAF8", borderRadius: 16, padding: "28px 28px", maxWidth: 420, width: "100%", boxShadow: "0 24px 48px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column", height: 520 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {tc && <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: tc.bg, color: tc.text }}>{event.type}</span>}
            <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: sc.bg, color: sc.text }}>{event.sub}</span>
            {event.tag && <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: tagColors[event.tag].bg, color: tagColors[event.tag].text }}>{event.tag}</span>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#CCC", lineHeight: 1 }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A", margin: "0 0 6px", letterSpacing: "-0.02em" }}>{event.name}</h2>
          <p style={{ fontSize: 13, color: "#888", margin: "0 0 16px" }}>{formatDateLong(event.date)} · {formatTime(event.date)}</p>
          {event.description && <p style={{ fontSize: 14, color: "#444", margin: "0 0 8px", lineHeight: 1.6 }}>{event.description}</p>}
        </div>
        <div style={{ flexShrink: 0, paddingTop: 16 }}>
          <div style={{ padding: "12px 16px", borderRadius: 10, background: "#F9F9F9", border: "1px solid #EBEBEB", textAlign: "center", marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: "#888", margin: 0 }}>
              {event.sub === "Free"
                ? event.link ? "This session is open to everyone." : "This session is open to everyone. Registration link coming soon."
                : "Registration links available to HART Builders (paid subscribers)."}
            </p>
            {event.sub === "Free" && event.link && (
              <a href={event.link} target="_blank" rel="noreferrer"
                style={{ display: "inline-block", marginTop: 10, padding: "7px 16px", borderRadius: 8, background: "#1A1A1A", color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                Register now →
              </a>
            )}
            {event.sub === "Free" && !event.link && (
              <a href="https://thehartstudio.substack.com" target="_blank" rel="noreferrer"
                style={{ display: "inline-block", marginTop: 10, padding: "7px 16px", borderRadius: 8, background: "#1A1A1A", color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                Subscribe to get updates →
              </a>
            )}
            {event.sub === "Paid" && (
              <a href="https://thehartstudio.substack.com" target="_blank" rel="noreferrer"
                style={{ display: "inline-block", marginTop: 10, padding: "7px 16px", borderRadius: 8, background: "#F97316", color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                Become a HART Builder →
              </a>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={onPrev} disabled={index === 0}
            style={{ padding: "7px 16px", borderRadius: 8, border: "1.5px solid #E5E5E5", background: "#fff", color: index === 0 ? "#CCC" : "#555", fontSize: 12, cursor: index === 0 ? "default" : "pointer", fontFamily: "inherit" }}>← Prev</button>
          <span style={{ fontSize: 11, color: "#BBB", fontFamily: "monospace" }}>{index + 1} / {total}</span>
          <button onClick={onNext} disabled={index === total - 1}
            style={{ padding: "7px 16px", borderRadius: 8, border: "1.5px solid #E5E5E5", background: "#fff", color: index === total - 1 ? "#CCC" : "#555", fontSize: 12, cursor: index === total - 1 ? "default" : "pointer", fontFamily: "inherit" }}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListView({ events, onEventClick }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(events.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageEvents = events.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 20 }}>
        {pageEvents.length === 0 && (
          <p style={{ fontSize: 13, color: "#BBB", textAlign: "center", padding: "32px 0" }}>No events in this category.</p>
        )}
        {pageEvents.map((event, i) => {
          const tc = event.type ? typeColors[event.type] : null;
          const sc = subColors[event.sub];
          const isFirst = safePage === 0 && i === 0;
          return (
            <div key={i} onClick={() => onEventClick(event)}
              style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 16px", borderRadius: 10, cursor: "pointer", background: isFirst ? "#FFFBF7" : "#fff", border: isFirst ? "1px solid #FDE8D0" : "1px solid #F0F0EE", transition: "box-shadow 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}>
              <div style={{ minWidth: 52, textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", lineHeight: 1 }}>{event.date.getDate()}</div>
                <div style={{ fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>{event.date.toLocaleString("en-US", { month: "short" })}</div>
              </div>
              <div style={{ width: 1, height: 36, background: "#EBEBEB" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{event.name}</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: "#888" }}>{formatTime(event.date)}</span>
                  {tc && <><span style={{ fontSize: 11, color: "#CCC" }}>·</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: tc.bg, color: tc.text }}>{event.type}</span></>}
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: sc.bg, color: sc.text }}>{event.sub}</span>
                </div>
              </div>
              <span style={{ fontSize: 11, color: "#BBB", fontFamily: "monospace", whiteSpace: "nowrap" }}>{daysUntil(event.date)}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={safePage === 0}
          style={{ padding: "7px 16px", borderRadius: 8, border: "1.5px solid #E5E5E5", background: "#fff", color: safePage === 0 ? "#CCC" : "#555", fontSize: 12, cursor: safePage === 0 ? "default" : "pointer", fontFamily: "inherit" }}>← Prev</button>
        <span style={{ fontSize: 11, color: "#BBB", fontFamily: "monospace" }}>{safePage + 1} / {totalPages}</span>
        <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={safePage === totalPages - 1}
          style={{ padding: "7px 16px", borderRadius: 8, border: "1.5px solid #E5E5E5", background: "#fff", color: safePage === totalPages - 1 ? "#CCC" : "#555", fontSize: 12, cursor: safePage === totalPages - 1 ? "default" : "pointer", fontFamily: "inherit" }}>Next →</button>
      </div>
    </div>
  );
}

function CalendarView({ events, onEventClick }) {
  const months = getMonths(events);
  const [monthIndex, setMonthIndex] = useState(0);

  if (months.length === 0) {
    return <p style={{ fontSize: 13, color: "#BBB", textAlign: "center", padding: "32px 0" }}>No events in this category.</p>;
  }

  const safeIndex = Math.min(monthIndex, months.length - 1);
  const currentMonth = months[safeIndex];
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);
  const monthEvents = events.filter((e) => e.date.getFullYear() === year && e.date.getMonth() === month);
  const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <button onClick={() => setMonthIndex((i) => Math.max(0, i - 1))} disabled={safeIndex === 0}
          style={{ padding: "6px 12px", borderRadius: 8, border: "1.5px solid #E5E5E5", background: "#fff", color: safeIndex === 0 ? "#CCC" : "#555", fontSize: 12, cursor: safeIndex === 0 ? "default" : "pointer", fontFamily: "inherit" }}>←</button>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A" }}>{currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
        <button onClick={() => setMonthIndex((i) => Math.min(months.length - 1, i + 1))} disabled={safeIndex === months.length - 1}
          style={{ padding: "6px 12px", borderRadius: 8, border: "1.5px solid #E5E5E5", background: "#fff", color: safeIndex === months.length - 1 ? "#CCC" : "#555", fontSize: 12, cursor: safeIndex === months.length - 1 ? "default" : "pointer", fontFamily: "inherit" }}>→</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 }}>
        {DAYS.map((d) => <div key={d} style={{ textAlign: "center", fontSize: 10, color: "#BBB", fontFamily: "monospace", padding: "4px 0" }}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dayEvents = monthEvents.filter((e) => e.date.getDate() === day);
          const isToday = isCurrentMonth && today.getDate() === day;
          return (
            <div key={i} style={{ minHeight: 64, borderRadius: 8, background: isToday ? "#FFFBF7" : "#fff", border: isToday ? "1.5px solid #FDE8D0" : "1px solid #F0F0EE", padding: "6px 6px 4px" }}>
              <div style={{ fontSize: 11, fontWeight: isToday ? 700 : 400, color: isToday ? "#F97316" : "#999", marginBottom: 4, textAlign: "right" }}>{day}</div>
              {dayEvents.map((ev, j) => {
                const tc = typeColors[ev.type];
                return (
                  <div key={j} onClick={() => onEventClick(ev)}
                    style={{ fontSize: 9, fontWeight: 600, padding: "2px 4px", borderRadius: 3, background: tc.bg, color: tc.text, cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.4, marginBottom: 2 }}>
                    {ev.name.replace("Live Build Launch Session", "Launch").replace("Tech Setup Session", "Tech Setup").replace("Office Hours", "OH").replace(/Live Build #\d+ – /, "").replace(/ \(Onboarding\)| \(planned\)/g, "")}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {monthEvents.length > 0 && (
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 2 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#BBB", margin: "0 0 8px", fontFamily: "monospace" }}>This month</p>
          {monthEvents.sort((a, b) => a.date - b.date).map((ev, i) => (
            <div key={i} onClick={() => onEventClick(ev)}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#fff", border: "1px solid #F0F0EE", cursor: "pointer", transition: "box-shadow 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 2 }}>{ev.name}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{ev.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {formatTime(ev.date)}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: subColors[ev.sub].bg, color: subColors[ev.sub].text }}>{ev.sub}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Schedule() {
  const [view, setView] = useState("list");
  const [filter, setFilter] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const filtered = applyFilter(upcoming, filter);
  const next = upcoming[0];

  const selectedEvent = selectedIndex !== null ? filtered[selectedIndex] : null;
  const openEvent = (event) => setSelectedIndex(filtered.indexOf(event));

  const handleFilterChange = (value) => {
    setFilter(value);
    setSelectedIndex(null);
  };

  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#FAFAF8", minHeight: "100vh", padding: "32px 24px", maxWidth: 680, margin: "0 auto" }}>
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          index={selectedIndex}
          total={filtered.length}
          onClose={() => setSelectedIndex(null)}
          onPrev={() => setSelectedIndex((i) => Math.max(0, i - 1))}
          onNext={() => setSelectedIndex((i) => Math.min(filtered.length - 1, i + 1))}
        />
      )}

      <div style={{ marginBottom: 28 }}>
        <a href="https://thehartstudio.substack.com" target="_blank" rel="noreferrer"
          style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#999", margin: "0 0 6px", display: "block", textDecoration: "none" }}>The HART Studio</a>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1A1A1A", margin: "0 0 4px", letterSpacing: "-0.02em" }}>What&apos;s Coming Up</h1>
        <p style={{ fontSize: 12, color: "#888", margin: 0 }}>{upcoming.length} upcoming events · Season 1</p>
      </div>

      {next && (
        <div onClick={() => openEvent(next)}
          style={{ background: "#1A1A1A", borderRadius: 12, padding: "16px 20px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#F97316", margin: "0 0 4px", fontFamily: "monospace" }}>Next up</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#FAFAF8", margin: "0 0 2px" }}>{next.name}</p>
            <p style={{ fontSize: 11, color: "#888", margin: 0 }}>{next.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {formatTime(next.date)}</p>
          </div>
          <div style={{ background: "#F97316", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", fontFamily: "monospace" }}>
            {daysUntil(next.date)}
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {FILTERS.map(({ label, value }) => (
            <button key={label} onClick={() => handleFilterChange(value)}
              style={{ padding: "5px 12px", borderRadius: 20, border: "1.5px solid", borderColor: filter === value ? "#1A1A1A" : "#E5E5E5", background: filter === value ? "#1A1A1A" : "#fff", color: filter === value ? "#fff" : "#666", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", background: "#fff", border: "1.5px solid #E5E5E5", borderRadius: 8, overflow: "hidden" }}>
          {["list", "calendar"].map((v) => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "6px 14px", border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", background: view === v ? "#1A1A1A" : "#fff", color: view === v ? "#fff" : "#888" }}>
              {v === "list" ? "List" : "Calendar"}
            </button>
          ))}
        </div>
      </div>

      {view === "list"
        ? <ListView key={filter} events={filtered} onEventClick={openEvent} />
        : <CalendarView key={filter} events={filtered} onEventClick={openEvent} />
      }

      <div style={{ marginTop: 28, padding: "18px 20px", borderRadius: 12, background: "#fff", border: "1px solid #F0F0EE", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "#555", margin: "0 0 10px", lineHeight: 1.5 }}>
          Want to join live sessions and build with us?
        </p>
        <a href="https://thehartstudio.substack.com" target="_blank" rel="noreferrer"
          style={{ display: "inline-block", padding: "9px 20px", borderRadius: 8, background: "#F97316", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          Join The HART Studio →
        </a>
      </div>

      <p style={{ fontSize: 11, color: "#CCC", textAlign: "center", marginTop: 20 }}>
        © The HART Studio with Alyssa Fu Ward, PhD
      </p>
    </div>
  );
}
