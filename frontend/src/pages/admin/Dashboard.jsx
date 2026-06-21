import React, { useEffect, useMemo, useState } from 'react';
import { formatDate } from '../../utils/format';
import { fetchAnalytics, fetchDashboardStats } from '../../services/adminService';
import StatCard from '../../components/admin/StatCard';
import AdminSection from '../../components/admin/AdminSection';
import PageLoader from '../../components/common/PageLoader';
import EmptyState from '../../components/common/EmptyState';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [statsResponse, analyticsResponse] = await Promise.all([fetchDashboardStats(), fetchAnalytics()]);
        setStats(statsResponse.data);
        setAnalytics(analyticsResponse.data);
      } catch (_error) {
        setStats(null);
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const categoryRows = useMemo(() => analytics?.categoryStats || [], [analytics]);

  if (loading) return <PageLoader label="Loading admin dashboard" />;

  if (!stats) {
    return <EmptyState title="Unable to load dashboard" description="Please refresh or login again." />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Products" value={stats.totalProducts} accent="yellow" />
        <StatCard label="Total Bookings" value={stats.totalEnquiries} accent="blue" />
        <StatCard label="Total Users" value={stats.totalUsers} accent="green" />
        <StatCard label="Available Products" value={stats.availableProducts} accent="orange" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Pending Bookings" value={stats.pendingEnquiries || 0} accent="blue" />
        <StatCard label="Approved Bookings" value={stats.approvedEnquiries || 0} accent="green" />
        <StatCard label="Closed Bookings" value={stats.closedEnquiries || 0} accent="orange" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminSection title="Recent Bookings" subtitle="Latest incoming rental requests">
          {stats.recentEnquiries?.length ? (
            <div className="space-y-3">
              {stats.recentEnquiries.map((item) => (
                <article key={item._id} className="rounded-xl border border-brand-steel/30 bg-brand-dark px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-display text-base uppercase text-brand-white">{item.name}</p>
                    <span className="text-xs uppercase tracking-[0.12em] text-brand-yellow">{item.status}</span>
                  </div>
                  <p className="text-xs uppercase tracking-[0.12em] text-brand-grey">SNB-{String(item._id).slice(-6).toUpperCase()}</p>
                  <p className="text-sm text-brand-grey-light">
                    {item.productSelected?.name} | Qty {item.quantity}
                  </p>
                  <p className="text-xs text-brand-grey">{formatDate(item.createdAt)}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-brand-grey-light">No bookings available.</p>
          )}
        </AdminSection>

        <AdminSection title="Category Mix" subtitle="Active product distribution by category">
          {categoryRows.length ? (
            <div className="space-y-3">
              {categoryRows.map((row) => (
                <div key={row._id} className="rounded-xl border border-brand-steel/30 bg-brand-dark px-4 py-3">
                  <div className="flex items-center justify-between text-sm text-brand-white">
                    <span>{row._id}</span>
                    <span className="font-display text-xl text-brand-yellow">{row.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-brand-grey-light">No analytics found.</p>
          )}
        </AdminSection>
      </div>

      <AdminSection title="Recent Contact Messages" subtitle="Latest leads from contact page">
        {stats.recentContacts?.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-brand-grey-light">
              <thead>
                <tr className="border-b border-brand-steel/30 text-xs uppercase tracking-[0.12em] text-brand-grey">
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Email</th>
                  <th className="py-2 pr-3">Phone</th>
                  <th className="py-2 pr-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentContacts.map((contact) => (
                  <tr key={contact._id} className="border-b border-brand-steel/20">
                    <td className="py-2 pr-3 text-brand-white">{contact.name}</td>
                    <td className="py-2 pr-3">{contact.email}</td>
                    <td className="py-2 pr-3">{contact.phone}</td>
                    <td className="py-2 pr-3">{formatDate(contact.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-brand-grey-light">No contact messages yet.</p>
        )}
      </AdminSection>
    </div>
  );
}
