"use client";
import { useState } from "react";
import {
  CalendarDays, CircleDollarSign, LayoutDashboard,
  Building2, Plus, TrendingUp, CheckCircle, Clock, XCircle,
  ChevronRight, Star, Settings
} from "lucide-react";
import {
  MOCK_OWNER_BOOKINGS, MOCK_TURFS,
} from "@/lib/mock-data";

type Tab = "overview" | "turfs" | "bookings" | "earnings";

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const STATUS_STYLES: Record<string, { cls: string; icon: React.ReactNode }> = {
  confirmed: { cls: "bg-green-100 text-green-700", icon: <CheckCircle size={12} /> },
  completed: { cls: "bg-slate-100 text-slate-600", icon: <CheckCircle size={12} /> },
  payment_pending: { cls: "bg-amber-100 text-amber-700", icon: <Clock size={12} /> },
  cancelled: { cls: "bg-red-100 text-red-600", icon: <XCircle size={12} /> },
};

const OWNER_TURFS = [MOCK_TURFS[0], MOCK_TURFS[2], MOCK_TURFS[5]];

export default function OwnerDashboard() {
  const [tab, setTab] = useState<Tab>("overview");

  const todayBookings = MOCK_OWNER_BOOKINGS.filter((b) => b.status === "confirmed").length;
  const monthRevenue = MOCK_OWNER_BOOKINGS.filter(
    (b) => b.status === "confirmed" || b.status === "completed"
  ).reduce((s, b) => s + b.amount, 0);
  const pendingCount = OWNER_TURFS.filter((t) => t.status !== "approved").length;

  return (
    <main className="min-h-screen md:flex bg-[#f4f6f1]">
      {/* Sidebar */}
      <aside className="w-full bg-[#1a3a2a] p-6 text-white md:w-64 md:min-h-screen">
        <div className="text-xl font-black">
          TURF<span className="text-[#C9F363]">BOOK</span>{" "}
          <span className="text-xs font-normal opacity-60">OWNER</span>
        </div>
        <div className="mt-5 rounded-xl bg-white/10 p-3">
          <p className="text-sm font-bold">Aryan Ventures</p>
          <p className="text-xs text-white/60">owner@turfbook.com</p>
          <span className="mt-1 inline-block rounded-full bg-green-400/20 px-2 py-0.5 text-xs text-green-300">
            ✓ Verified
          </span>
        </div>
        <nav className="mt-8 space-y-1 text-sm">
          {(
            [
              ["overview", "Overview", LayoutDashboard],
              ["turfs", "My Turfs", Building2],
              ["bookings", "Bookings", CalendarDays],
              ["earnings", "Earnings", CircleDollarSign],
            ] as [Tab, string, React.ElementType][]
          ).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                tab === key ? "bg-white/15 font-bold" : "hover:bg-white/8"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className="mt-6 border-t border-white/10 pt-5">
          <button className="flex w-full items-center gap-3 rounded-xl p-3 text-sm hover:bg-white/8">
            <Settings size={18} />
            Settings
          </button>
        </div>
        <div className="mt-4 rounded-xl bg-amber-400/20 p-3 text-xs text-amber-200">
          🎮 Demo Mode — no real data
        </div>
      </aside>

      {/* Main */}
      <section className="flex-1 p-6 md:p-10">
        {tab === "overview" && <Overview todayBookings={todayBookings} monthRevenue={monthRevenue} pendingCount={pendingCount} setTab={setTab} />}
        {tab === "turfs" && <MyTurfs />}
        {tab === "bookings" && <Bookings />}
        {tab === "earnings" && <Earnings />}
      </section>
    </main>
  );
}

function Overview({ todayBookings, monthRevenue, pendingCount, setTab }: {
  todayBookings: number; monthRevenue: number; pendingCount: number; setTab: (t: Tab) => void;
}) {
  return (
    <div>
      <p className="font-bold text-[#1a3a2a]">OWNER CONSOLE</p>
      <h1 className="text-4xl font-black">Good game plan.</h1>

      <div className="mt-9 grid gap-4 md:grid-cols-3">
        {[
          { label: "Today's bookings", value: String(todayBookings), Icon: CalendarDays, color: "text-blue-600" },
          { label: "Monthly revenue", value: formatINR(monthRevenue), Icon: CircleDollarSign, color: "text-green-600" },
          { label: "Active turfs", value: String(OWNER_TURFS.length), Icon: Building2, color: "text-purple-600" },
        ].map(({ label, value, Icon, color }) => (
          <article key={label} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex justify-between">
              <span className="font-bold text-slate-500">{label}</span>
              <Icon size={20} className={color} />
            </div>
            <p className="mt-6 text-3xl font-black">{value}</p>
          </article>
        ))}
      </div>

      {/* Recent bookings */}
      <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black">Recent bookings</h2>
          <button onClick={() => setTab("bookings")} className="flex items-center gap-1 text-sm font-bold text-[#1a3a2a]">
            See all <ChevronRight size={16} />
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {MOCK_OWNER_BOOKINGS.slice(0, 3).map((b) => {
            const s = STATUS_STYLES[b.status] ?? STATUS_STYLES.confirmed;
            return (
              <div key={b.id} className="flex items-center justify-between rounded-xl border p-3">
                <div>
                  <p className="font-bold">{b.customer.full_name}</p>
                  <p className="text-xs text-slate-500">
                    {b.turf_name} · {new Date(b.starts_at).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${s.cls}`}>
                    {s.icon} {b.status}
                  </span>
                  <p className="mt-1 text-sm font-bold">{formatINR(b.amount)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function MyTurfs() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-[#1a3a2a]">TURF MANAGEMENT</p>
          <h1 className="text-3xl font-black">My Venues</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-[#1a3a2a] px-4 py-3 font-bold text-white"
        >
          <Plus size={18} /> Add turf
        </button>
      </div>

      {showForm && !submitted && (
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-black text-lg">New Turf Listing</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block text-sm font-bold">
              Turf name
              <input defaultValue="My New Turf" className="mt-1 w-full rounded-xl border p-3 outline-none" />
            </label>
            <label className="block text-sm font-bold">
              City
              <input defaultValue="Mumbai" className="mt-1 w-full rounded-xl border p-3 outline-none" />
            </label>
            <label className="block text-sm font-bold md:col-span-2">
              Address
              <input defaultValue="123 Demo Street" className="mt-1 w-full rounded-xl border p-3 outline-none" />
            </label>
            <label className="block text-sm font-bold">
              Price per hour (₹)
              <input type="number" defaultValue={1000} className="mt-1 w-full rounded-xl border p-3 outline-none" />
            </label>
            <label className="block text-sm font-bold">
              Sport
              <select className="mt-1 w-full rounded-xl border p-3 outline-none">
                <option>Football</option><option>Cricket</option><option>Badminton</option><option>Tennis</option>
              </select>
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setSubmitted(true)}
              className="rounded-xl bg-[#1a3a2a] px-5 py-2.5 font-bold text-white"
            >
              Submit for approval
            </button>
            <button onClick={() => setShowForm(false)} className="rounded-xl border px-5 py-2.5 font-bold">
              Cancel
            </button>
          </div>
        </div>
      )}

      {submitted && (
        <div className="mt-4 rounded-xl bg-green-50 border border-green-200 p-4 text-green-800">
          ✅ Turf submitted for admin approval! It will appear here once approved. (Demo — not saved)
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {OWNER_TURFS.map((t) => (
          <article key={t.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-extrabold">{t.name}</h2>
                <p className="text-sm text-slate-500">{t.city} · {t.address}</p>
              </div>
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                ✓ Approved
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {t.turf_sports.map((x) => (
                <span key={x.sports.name} className="rounded-full bg-lime/30 px-2 py-0.5 text-xs font-bold text-pitch">
                  {x.sports.name}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-3">
              <p className="font-bold text-[#1a3a2a]">
                {formatINR(t.hourly_price)} / hr
              </p>
              <div className="flex items-center gap-1 text-sm font-bold">
                <Star size={14} fill="#C9F363" className="text-lime" />
                {t.rating} ({t.review_count})
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="flex-1 rounded-lg border py-2 text-xs font-bold hover:bg-slate-50">
                Edit details
              </button>
              <button className="flex-1 rounded-lg border py-2 text-xs font-bold hover:bg-slate-50">
                Block slots
              </button>
              <button className="flex-1 rounded-lg border py-2 text-xs font-bold hover:bg-slate-50">
                View bookings
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Bookings() {
  return (
    <div>
      <p className="font-bold text-[#1a3a2a]">BOOKING MANAGEMENT</p>
      <h1 className="text-3xl font-black">All Bookings</h1>
      <div className="mt-6 space-y-3">
        {MOCK_OWNER_BOOKINGS.map((b) => {
          const s = STATUS_STYLES[b.status] ?? STATUS_STYLES.confirmed;
          const start = new Date(b.starts_at);
          const end = new Date(b.ends_at);
          return (
            <article key={b.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-extrabold">{b.customer.full_name}</h2>
                  <p className="text-sm text-slate-500">{b.turf_name}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {start.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                    {" · "}
                    {start.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    {" → "}
                    {end.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p className="text-xs text-slate-400">📞 {b.customer.phone}</p>
                </div>
                <div className="text-right">
                  <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${s.cls}`}>
                    {s.icon} {b.status}
                  </span>
                  <p className="mt-2 font-black text-[#1a3a2a]">{formatINR(b.amount)}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function Earnings() {
  const confirmed = MOCK_OWNER_BOOKINGS.filter((b) => b.status === "confirmed" || b.status === "completed");
  const gross = confirmed.reduce((s, b) => s + b.amount, 0);
  const commission = Math.round(gross * 0.1);
  const net = gross - commission;

  return (
    <div>
      <p className="font-bold text-[#1a3a2a]">FINANCIALS</p>
      <h1 className="text-3xl font-black">Earnings</h1>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { label: "Gross revenue", value: formatINR(gross), Icon: TrendingUp, color: "text-blue-600" },
          { label: "Platform fee (10%)", value: `−${formatINR(commission)}`, Icon: CircleDollarSign, color: "text-red-500" },
          { label: "Net earnings", value: formatINR(net), Icon: CheckCircle, color: "text-green-600" },
        ].map(({ label, value, Icon, color }) => (
          <article key={label} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex justify-between">
              <span className="font-bold text-slate-500">{label}</span>
              <Icon size={20} className={color} />
            </div>
            <p className="mt-6 text-2xl font-black">{value}</p>
          </article>
        ))}
      </div>

      <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">Booking breakdown</h2>
        <div className="mt-4 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="pb-2 text-left font-bold">Turf</th>
                <th className="pb-2 text-left font-bold">Customer</th>
                <th className="pb-2 text-left font-bold">Date</th>
                <th className="pb-2 text-right font-bold">Amount</th>
                <th className="pb-2 text-right font-bold">Net (90%)</th>
              </tr>
            </thead>
            <tbody>
              {confirmed.map((b) => (
                <tr key={b.id} className="border-b last:border-0">
                  <td className="py-2 font-medium">{b.turf_name}</td>
                  <td className="py-2 text-slate-500">{b.customer.full_name}</td>
                  <td className="py-2 text-slate-500">
                    {new Date(b.starts_at).toLocaleDateString("en-IN")}
                  </td>
                  <td className="py-2 text-right">{formatINR(b.amount)}</td>
                  <td className="py-2 text-right font-bold text-green-700">
                    {formatINR(Math.round(b.amount * 0.9))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="rounded-xl bg-[#1a3a2a] px-5 py-2.5 font-bold text-white">
            Request settlement
          </button>
        </div>
      </section>
    </div>
  );
}
