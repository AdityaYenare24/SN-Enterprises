import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminSection from '../../components/admin/AdminSection';
import PageLoader from '../../components/common/PageLoader';
import { useAuth } from '../../context/AuthContext';
import { createAdminUser, deleteAdminUser, fetchUsers } from '../../services/adminService';
import { formatDate } from '../../utils/format';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'user',
};

export default function AdminUsersPage() {
  const { user: loggedInUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [refreshTick, setRefreshTick] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetchUsers({ role: roleFilter || undefined, limit: 100 });
        setUsers(response.data || []);
      } catch (_error) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [roleFilter, refreshTick]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setShowAddForm(false);
  };

  const addUser = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error('Name, email, and password are required.');
      return;
    }

    setSaving(true);
    try {
      await createAdminUser({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: form.role,
      });
      toast.success('User added successfully.');
      resetForm();
      setRefreshTick((prev) => prev + 1);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to add user.');
    } finally {
      setSaving(false);
    }
  };

  const removeUser = async (targetUser) => {
    if (targetUser.id === loggedInUser?.id) {
      toast.error('You cannot delete your own admin account.');
      return;
    }

    if (!window.confirm(`Delete ${targetUser.name}?`)) return;

    setDeletingId(targetUser.id);
    try {
      await deleteAdminUser(targetUser.id);
      toast.success('User deleted successfully.');
      setRefreshTick((prev) => prev + 1);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to delete user.');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <AdminSection
      title="User Directory"
      subtitle="Registered user and admin accounts"
      rightSlot={
        <div className="flex flex-wrap items-center justify-end gap-2">
          <select className="form-input !w-auto" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="button" className="btn-primary !px-4 !py-2" onClick={() => setShowAddForm((prev) => !prev)}>
            {showAddForm ? 'Close' : 'Add User'}
          </button>
        </div>
      }
    >
      {showAddForm ? (
        <form className="mb-5 grid gap-3 rounded-xl border border-brand-steel/30 bg-brand-dark p-4 md:grid-cols-2" onSubmit={addUser}>
          <input className="form-input" name="name" placeholder="Full name*" value={form.name} onChange={handleChange} />
          <input className="form-input" name="email" type="email" placeholder="Email*" value={form.email} onChange={handleChange} />
          <input className="form-input" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
          <input
            className="form-input"
            name="password"
            type="password"
            placeholder="Password*"
            value={form.password}
            onChange={handleChange}
          />
          <select className="form-input" name="role" value={form.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex flex-wrap items-center gap-2">
            <button type="submit" className="btn-primary !px-4 !py-2" disabled={saving}>
              {saving ? 'Adding...' : 'Add'}
            </button>
            <button
              type="button"
              className="rounded-full border border-brand-steel/50 px-4 py-2 text-xs uppercase tracking-[0.12em] text-brand-grey-light"
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {loading ? (
        <PageLoader label="Loading users" />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-brand-grey-light">
            <thead>
              <tr className="border-b border-brand-steel/30 text-xs uppercase tracking-[0.12em] text-brand-grey">
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">Phone</th>
                <th className="py-2 pr-3">Role</th>
                <th className="py-2 pr-3">Joined</th>
                <th className="py-2 pr-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-brand-steel/20">
                  <td className="py-3 pr-3 text-brand-white">{user.name}</td>
                  <td className="py-3 pr-3">{user.email}</td>
                  <td className="py-3 pr-3">{user.phone || '-'}</td>
                  <td className="py-3 pr-3 uppercase">{user.role}</td>
                  <td className="py-3 pr-3">{formatDate(user.createdAt)}</td>
                  <td className="py-3 pr-3">
                    <button
                      type="button"
                      className="rounded-full border border-red-500/40 px-3 py-1 text-xs text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => removeUser(user)}
                      disabled={deletingId === user.id || user.id === loggedInUser?.id}
                    >
                      {deletingId === user.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminSection>
  );
}
