'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  getAccount,
  updateEmail,
  changePassword,
  deactivateAccount,
  clearSession,
} from '@/services/settingsService';

function BackBar() {
  const router = useRouter();
  return (
    <div className="max-w-7xl mx-auto px-4 pt-4">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-[#c0174c] transition-colors cursor-pointer"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </button>
    </div>
  );
}

const menuItems = [
  { key: 'email', label: 'Edit e-mail Address' },
  { key: 'password', label: 'Change Password' },
  { key: 'alerts', label: 'Alerts & Updates' },
  { key: 'call', label: 'Call Preferences' },
  { key: 'privacy', label: 'Privacy' },
  { key: 'profile', label: 'Profile Settings' },
  { key: 'deactivate', label: 'Deactivate Profile' },
  { key: 'delete', label: 'Delete Profile' },
  { key: 'ignored', label: 'Ignored Profiles' },
  { key: 'blocked', label: 'Blocked Profiles' },
  { key: 'logout', label: 'Logout' },
];

/* ───────────────────────────────────────────── */
/* Edit Email */
/* ───────────────────────────────────────────── */

function EditEmail() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [original, setOriginal] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    getAccount()
      .then((a) => {
        setEmail(a.email ?? '');
        setOriginal(a.email ?? '');
      })
      .catch(() => setMsg({ ok: false, text: 'Could not load your account.' }))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!email.trim()) {
      setMsg({ ok: false, text: 'Email cannot be empty.' });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      await updateEmail(email.trim());
      // Email is the login identity — the current token is now stale, so re-login.
      setMsg({ ok: true, text: 'Email updated. Please log in again…' });
      clearSession();
      setTimeout(() => router.push('/login'), 1300);
    } catch (e) {
      setMsg({
        ok: false,
        text:
          (e as { response?: { data?: { message?: string } } })?.response?.data
            ?.message || 'Could not update email.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
        Edit e-mail Address
      </h2>

      <div className="border-t border-dashed border-gray-300 my-4" />

      <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
        A valid e-mail id will be used to send you partner search mailers, member
        communication mailers and special offers.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          disabled={loading}
          onChange={(e) => {
            setEmail(e.target.value);
            setMsg(null);
          }}
          placeholder={loading ? 'Loading…' : 'you@example.com'}
          className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 text-sm md:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c0174c] shadow-sm disabled:opacity-60"
        />

        <div className="flex gap-3">
          <button
            onClick={save}
            disabled={saving || loading}
            className="px-5 py-3 rounded-2xl text-white text-sm font-semibold transition hover:opacity-90 shadow-lg disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,#c0174c,#8b0f38)' }}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>

          <button
            onClick={() => {
              setEmail(original);
              setMsg(null);
            }}
            className="px-5 py-3 rounded-2xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {msg && (
        <p
          className="text-sm mt-4 font-medium"
          style={{ color: msg.ok ? '#c0174c' : '#dc2626' }}
        >
          {msg.ok ? '✓ ' : ''}
          {msg.text}
        </p>
      )}
    </div>
  );
}

/* ───────────────────────────────────────────── */
/* Change Password */
/* ───────────────────────────────────────────── */

function ChangePassword() {
  const [form, setForm] = useState({
    current: '',
    newP: '',
    confirm: '',
  });

  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const set =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({
        ...f,
        [k]: e.target.value,
      }));

  const save = async () => {
    if (!form.current || !form.newP || !form.confirm) {
      setMsg('Please fill all fields.');
      return;
    }
    if (form.newP !== form.confirm) {
      setMsg('Passwords do not match.');
      return;
    }
    if (form.newP.length < 6) {
      setMsg('New password must be at least 6 characters.');
      return;
    }

    setSaving(true);
    setMsg('');
    try {
      await changePassword(form.current, form.newP);
      setMsg('✓ Password changed successfully.');
      setForm({ current: '', newP: '', confirm: '' });
    } catch (e) {
      setMsg(
        (e as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Could not change password.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
        Change Password
      </h2>

      <div className="border-t border-dashed border-gray-300 my-4" />

      <p className="text-sm md:text-base text-gray-600 mb-6">
        Choose a strong password to keep your
        account secure.
      </p>

      <div className="space-y-5 max-w-md">
        {[
          ['current', 'Current Password'],
          ['newP', 'New Password'],
          ['confirm', 'Confirm Password'],
        ].map(([k, label]) => (
          <div key={k}>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              {label}
            </label>

            <input
              type="password"
              value={form[k as keyof typeof form]}
              onChange={set(k)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c0174c]"
            />
          </div>
        ))}

        <div className="flex gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="px-6 py-3 rounded-2xl text-white text-sm font-semibold shadow-lg disabled:opacity-60"
            style={{
              background:
                'linear-gradient(135deg,#c0174c,#8b0f38)',
            }}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>

          <button
            onClick={() => {
              setForm({
                current: '',
                newP: '',
                confirm: '',
              });

              setMsg('');
            }}
            className="px-6 py-3 rounded-2xl text-sm font-semibold text-gray-600 bg-gray-100"
          >
            Reset
          </button>
        </div>

        {msg && (
          <p
            className="text-sm font-medium"
            style={{
              color: msg.startsWith('✓')
                ? '#c0174c'
                : '#dc2626',
            }}
          >
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────── */
/* Deactivate Profile */
/* ───────────────────────────────────────────── */

function DeactivateProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const deactivate = async () => {
    if (!confirm('Deactivate your profile? You will be logged out and hidden from matches.')) return;
    setLoading(true);
    setErr('');
    try {
      await deactivateAccount();
      clearSession();
      router.push('/login');
    } catch (e) {
      setErr(
        (e as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Could not deactivate your profile.',
      );
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Deactivate Profile</h2>
      <div className="border-t border-dashed border-gray-300 my-4" />
      <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed max-w-xl">
        Deactivating hides your profile from other members and pauses your matches. You can
        reactivate any time by logging back in. Your data is not deleted.
      </p>
      <button
        onClick={deactivate}
        disabled={loading}
        className="px-6 py-3 rounded-2xl text-white text-sm font-semibold shadow-lg disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg,#c0174c,#8b0f38)' }}
      >
        {loading ? 'Deactivating…' : 'Deactivate my profile'}
      </button>
      {err && <p className="text-sm mt-4 font-medium text-red-600">{err}</p>}
    </div>
  );
}

/* ───────────────────────────────────────────── */
/* Blank Section */
/* ───────────────────────────────────────────── */

function BlankSection({
  title,
}: {
  title: string;
}) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
        {title}
      </h2>

      <div className="border-t border-dashed border-gray-300 my-4" />

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
          style={{
            background: '#fff0f4',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c0174c"
            strokeWidth="1.8"
            className="w-8 h-8"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          </svg>
        </div>

        <p className="text-gray-500 text-base font-medium">
          No content available for{' '}
          <span
            className="font-semibold"
            style={{
              color: '#c0174c',
            }}
          >
            {title}
          </span>
        </p>

        <p className="text-gray-400 text-sm mt-2">
          This section is coming soon.
        </p>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────── */
/* Logout Modal */
/* ───────────────────────────────────────────── */

function LogoutModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div
          className="px-6 py-5"
          style={{
            background:
              'linear-gradient(135deg,#c0174c,#8b0f38)',
          }}
        >
          <h3 className="text-white font-bold text-xl">
            Logout
          </h3>
        </div>

        <div className="px-6 py-8 text-center">
          <p className="text-gray-700 font-medium">
            Are you sure you want to logout?
          </p>

          <p className="text-gray-400 text-sm mt-2">
            You need to login again.
          </p>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl text-white font-semibold shadow-lg"
            style={{
              background:
                'linear-gradient(135deg,#c0174c,#8b0f38)',
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────── */
/* Main Component */
/* ───────────────────────────────────────────── */

export default function Settings() {
  const router = useRouter();
  const [active, setActive] =
    useState('email');

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  const [showMobileMenu, setShowMobileMenu] =
    useState(false);

  const renderContent = () => {
    switch (active) {
      case 'email':
        return <EditEmail />;

      case 'password':
        return <ChangePassword />;

      case 'deactivate':
        return <DeactivateProfile />;

      default:
        return (
          <BlankSection
            title={
              menuItems.find(
                (m) => m.key === active
              )?.label || ''
            }
          />
        );
    }
  };

  return (
    <div
      className="min-h-screen bg-linear-to-br from-rose-50 via-white to-pink-50"
      style={{
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <BackBar />
      {/* Logout Modal */}
      {showLogoutModal && (
        <LogoutModal
          onConfirm={() => {
            setShowLogoutModal(false);
            clearSession();
            router.push('/login');
          }}
          onCancel={() => {
            setShowLogoutModal(false);
            setActive('email');
          }}
        />
      )}

      {/* Header */}
      <header
        className="w-full px-4 md:px-8 py-4 flex items-center justify-between shadow-lg sticky top-0 z-30"
        style={{
          background:
            'linear-gradient(135deg,#c0174c,#8b0f38)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="w-5 h-5"
            >
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>

          <div>
            <h1 className="text-white font-bold text-lg">
              MatriMatch
            </h1>

            <p className="text-white/70 text-xs">
              Profile Settings
            </p>
          </div>
        </div>

        {/* Mobile Settings Button */}
        <button
          onClick={() => setShowMobileMenu(true)}
          className="md:hidden bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-md"
        >
          Settings
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-3 md:px-6 py-5 md:py-8">
        {/* MOBILE VIEW */}
        <div className="md:hidden">
          {/* RIGHT TO LEFT MOBILE MENU */}
          <div
            className={`fixed inset-0 z-50 transition-all duration-300 ${
              showMobileMenu
                ? 'pointer-events-auto'
                : 'pointer-events-none'
            }`}
          >
            {/* Overlay */}
            <div
              onClick={() =>
                setShowMobileMenu(false)
              }
              className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
                showMobileMenu
                  ? 'opacity-100'
                  : 'opacity-0'
              }`}
            />

            {/* Sidebar */}
            <div
              className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-in-out rounded-l-3xl overflow-hidden ${
                showMobileMenu
                  ? 'translate-x-0'
                  : 'translate-x-full'
              }`}
            >
              {/* Header */}
              <div
                className="px-5 py-5 flex items-center justify-between"
                style={{
                  background:
                    'linear-gradient(135deg,#c0174c,#8b0f38)',
                }}
              >
                <div>
                  <h2 className="text-white font-bold text-lg">
                    Settings
                  </h2>

                  <p className="text-white/70 text-xs mt-1">
                    Manage your account
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShowMobileMenu(false)
                  }
                  className="w-9 h-9 rounded-xl bg-white/20 text-white text-lg"
                >
                  ✕
                </button>
              </div>

              {/* Menu Items */}
              <div className="overflow-y-auto h-[calc(100%-88px)] py-2">
                {menuItems.map((item) => {
                  const isActive =
                    active === item.key;

                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        if (
                          item.key === 'logout'
                        ) {
                          setShowLogoutModal(
                            true
                          );
                        } else {
                          setActive(item.key);
                        }

                        setShowMobileMenu(
                          false
                        );
                      }}
                      className="w-full text-left px-5 py-4 text-sm font-medium border-b border-gray-100 transition-all"
                      style={{
                        background: isActive
                          ? 'linear-gradient(135deg,#c0174c,#8b0f38)'
                          : 'white',

                        color: isActive
                          ? 'white'
                          : '#374151',
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Content */}
          <main className=" rounded-3xl  p-5">
            {renderContent()}
          </main>
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden md:flex gap-0 items-start min-h-168.75  rounded-3xl overflow-hidden lg:shadow-xl">
          {/* Sidebar */}
          <aside className="w-72 shrink-0 bg-white border-r border-gray-100">
            <div
              className="px-6 py-5"
              style={{
                background:
                  'linear-gradient(135deg,#c0174c,#8b0f38)',
              }}
            >
              <h3 className="text-white font-bold text-lg">
                Settings Menu
              </h3>

              <p className="text-white/70 text-sm mt-1">
                Manage your account
              </p>
            </div>

            {menuItems.map((item) => {
              const isActive =
                active === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() =>
                    item.key === 'logout'
                      ? setShowLogoutModal(
                          true
                        )
                      : setActive(item.key)
                  }
                  className="w-full text-left px-6 py-4 text-sm font-medium transition-all border-b border-gray-50"
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg,#c0174c,#8b0f38)'
                      : 'white',

                    color: isActive
                      ? 'white'
                      : '#1d6fa8',
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </aside>

          {/* Desktop Content */}
          <main className="flex-1 bg-white rounded-r-3xl p-8 ">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}