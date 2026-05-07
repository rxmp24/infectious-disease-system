import { useState, useEffect } from 'react';

export function useSessionUuid() {
  const [sessionUuid, setSessionUuid] = useState<string>('');

  useEffect(() => {
    let uuid = localStorage.getItem('anonymous_session_id');
    if (!uuid) {
      uuid = crypto.randomUUID();
      localStorage.setItem('anonymous_session_id', uuid);
    }
    setSessionUuid(uuid);
  }, []);

  return sessionUuid;
}
