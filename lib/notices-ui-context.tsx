'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface NoticesUiState {
  modalNoticeId: number | null;
  modalFocusRef: string | undefined;
  quickCheckNoticeId: number | null;
  openNotice: (id: number, focusRef?: string) => void;
  openQuickCheck: (id: number) => void;
  closeAll: () => void;
}

const NoticesUiContext = createContext<NoticesUiState | null>(null);

export function NoticesUiProvider({ children }: { children: React.ReactNode }) {
  const [modalNoticeId, setModalNoticeId] = useState<number | null>(null);
  const [modalFocusRef, setModalFocusRef] = useState<string | undefined>(undefined);
  const [quickCheckNoticeId, setQuickCheckNoticeId] = useState<number | null>(null);

  const openNotice = useCallback((id: number, focusRef?: string) => {
    setModalNoticeId(id);
    setModalFocusRef(focusRef);
    setQuickCheckNoticeId(null);
  }, []);

  const openQuickCheck = useCallback((id: number) => {
    setQuickCheckNoticeId(id);
    setModalNoticeId(null);
  }, []);

  const closeAll = useCallback(() => {
    setModalNoticeId(null);
    setQuickCheckNoticeId(null);
  }, []);

  const value = useMemo(
    () => ({ modalNoticeId, modalFocusRef, quickCheckNoticeId, openNotice, openQuickCheck, closeAll }),
    [modalNoticeId, modalFocusRef, quickCheckNoticeId, openNotice, openQuickCheck, closeAll],
  );

  return <NoticesUiContext.Provider value={value}>{children}</NoticesUiContext.Provider>;
}

export function useNoticesUi() {
  const ctx = useContext(NoticesUiContext);
  if (!ctx) throw new Error('useNoticesUi must be used within NoticesUiProvider');
  return ctx;
}
