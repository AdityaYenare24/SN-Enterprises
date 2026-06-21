import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import AdminSection from '../../components/admin/AdminSection';
import PageLoader from '../../components/common/PageLoader';
import { deleteEnquiry, fetchEnquiries, updateEnquiry } from '../../services/enquiryService';
import { enquiryStatusOptions } from '../../utils/constants';
import { formatDate } from '../../utils/format';

const getBookingReference = (id) => `SNB-${String(id || '').slice(-6).toUpperCase()}`;

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sort, setSort] = useState('latest');
  const [refreshTick, setRefreshTick] = useState(0);

  const queryParams = useMemo(
    () => ({
      status: statusFilter || undefined,
      search: searchTerm.trim() || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      sort: sort === 'oldest' ? 'oldest' : 'latest',
      limit: 100,
    }),
    [statusFilter, searchTerm, dateFrom, dateTo, sort]
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetchEnquiries(queryParams);
        setEnquiries(response.data || []);
      } catch (_error) {
        setEnquiries([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [queryParams, refreshTick]);

  const updateStatus = async (item, status) => {
    const payload = { status };

    if (status === 'Rejected') {
      const adminMessage = window.prompt('Enter rejection message for customer:', item.adminMessage || '');

      if (adminMessage === null) {
        setEnquiries((prev) => [...prev]);
        return;
      }
      if (!adminMessage.trim()) {
        toast.error('Please enter rejection message.');
        setEnquiries((prev) => [...prev]);
        return;
      }

      payload.adminMessage = adminMessage.trim();
    }

    try {
      const response = await updateEnquiry(item._id, payload);
      const emailDelivery = response.emailDelivery;

      if (emailDelivery?.failed) {
        toast.error('Booking updated, but email failed to send.');
      } else if (emailDelivery?.skipped) {
        toast.success('Booking updated. Email is not configured.');
      } else if (status === 'Approved' || status === 'Rejected') {
        toast.success('Booking updated and customer email sent.');
      } else {
        toast.success('Booking status updated.');
      }

      setRefreshTick((prev) => prev + 1);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to update booking.');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    try {
      await deleteEnquiry(id);
      toast.success('Booking deleted.');
      setRefreshTick((prev) => prev + 1);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to delete booking.');
    }
  };

  return (
    <AdminSection
      title="Booking Management"
      subtitle="Track, prioritize, and update customer rental bookings"
      rightSlot={
        <div className="flex flex-wrap items-center justify-end gap-2">
          <input
            className="form-input !w-52"
            placeholder="Search name, phone, email"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <input className="form-input !w-40" type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
          <input className="form-input !w-40" type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
          <select className="form-input !w-auto" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <select className="form-input !w-auto" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All Statuses</option>
            {enquiryStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="rounded-full border border-brand-steel/50 px-3 py-2 text-xs uppercase tracking-[0.08em] text-brand-grey-light"
            onClick={() => {
              setStatusFilter('');
              setSearchTerm('');
              setDateFrom('');
              setDateTo('');
              setSort('latest');
            }}
          >
            Reset
          </button>
        </div>
      }
    >
      {loading ? (
        <PageLoader label="Loading bookings" />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-brand-grey-light">
            <thead>
              <tr className="border-b border-brand-steel/30 text-xs uppercase tracking-[0.12em] text-brand-grey">
                <th className="py-2 pr-3">Booking ID</th>
                <th className="py-2 pr-3">Customer</th>
                <th className="py-2 pr-3">Product</th>
                <th className="py-2 pr-3">Schedule</th>
                <th className="py-2 pr-3">Quantity</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Booked On</th>
                <th className="py-2 pr-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.length ? (
                enquiries.map((item) => (
                  <tr key={item._id} className="border-b border-brand-steel/20 align-top">
                    <td className="py-3 pr-3 font-display text-xs uppercase tracking-[0.12em] text-brand-yellow">
                      {getBookingReference(item._id)}
                    </td>
                    <td className="py-3 pr-3">
                      <p className="text-brand-white">{item.name}</p>
                      <p className="text-xs">{item.phone}</p>
                      <p className="text-xs">{item.email}</p>
                    </td>
                    <td className="py-3 pr-3">
                      <p>{item.productSelected?.name || 'Unknown'}</p>
                      <p className="text-xs">{item.productSelected?.category}</p>
                    </td>
                    <td className="py-3 pr-3">
                      <p>{formatDate(item.rentalStartDate)}</p>
                      <p>{formatDate(item.rentalEndDate)}</p>
                    </td>
                    <td className="py-3 pr-3">{item.quantity}</td>
                    <td className="py-3 pr-3">
                      <select
                        className="form-input !w-auto"
                        value={item.status}
                        onChange={(event) => updateStatus(item, event.target.value)}
                      >
                        {enquiryStatusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      {item.status === 'Rejected' && item.adminMessage ? (
                        <p className="mt-2 max-w-xs text-xs text-brand-grey-light">Reason: {item.adminMessage}</p>
                      ) : null}
                    </td>
                    <td className="py-3 pr-3">{formatDate(item.createdAt)}</td>
                    <td className="py-3 pr-3">
                      <button
                        type="button"
                        className="rounded-full border border-red-500/40 px-3 py-1 text-xs text-red-300"
                        onClick={() => remove(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-sm text-brand-grey-light">
                    No bookings found for selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminSection>
  );
}
