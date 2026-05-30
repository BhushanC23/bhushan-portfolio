import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SESSION_KEY = 'bx_admin_session';
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const CHECK_INTERVAL_MS = 60 * 1000;         // check every 60s

export default function AdminGuard({ children }) {
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  function checkSession() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
      navigate('/bx-studio', { replace: true });
      return false;
    }
    try {
      const { timestamp } = JSON.parse(raw);
      if (Date.now() - timestamp > SESSION_DURATION_MS) {
        sessionStorage.removeItem(SESSION_KEY);
        navigate('/bx-studio', { replace: true });
        return false;
      }
      return true;
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
      navigate('/bx-studio', { replace: true });
      return false;
    }
  }

  useEffect(() => {
    // Immediate check on mount
    const valid = checkSession();
    if (!valid) return;

    // Periodic expiry check every 60s
    intervalRef.current = setInterval(() => {
      checkSession();
    }, CHECK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Don't render children if no session exists
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const { timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > SESSION_DURATION_MS) return null;
  } catch {
    return null;
  }

  return children;
}
