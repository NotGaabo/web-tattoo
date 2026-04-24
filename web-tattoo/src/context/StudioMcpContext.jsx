import React, { createContext, useContext, useEffect, useState } from 'react';
import { appointmentService } from '../services/api';
import { getFallbackStudioMcpData, loadStudioMcpData } from '../services/studioMcp';

const StudioMcpContext = createContext(null);

export function StudioMcpProvider({ children }) {
  const [state, setState] = useState(() => ({
    ...getFallbackStudioMcpData(),
    isLoading: true,
    bookingState: 'idle',
    error: null,
  }));

  useEffect(() => {
    let active = true;

    async function syncStudioContext() {
      const payload = await loadStudioMcpData();

      if (!active) {
        return;
      }

      setState((current) => ({
        ...current,
        ...payload,
        isLoading: false,
        error: payload.error || null,
      }));
    }

    syncStudioContext();

    return () => {
      active = false;
    };
  }, []);

  const refreshStudio = async () => {
    setState((current) => ({ ...current, isLoading: true, error: null }));
    const payload = await loadStudioMcpData();
    setState((current) => ({
      ...current,
      ...payload,
      isLoading: false,
      error: payload.error || null,
    }));
  };

  const reserveAppointment = async (appointmentData) => {
    setState((current) => ({ ...current, bookingState: 'loading' }));

    try {
      const response = await appointmentService.create(appointmentData);
      setState((current) => ({ ...current, bookingState: 'success' }));
      return response;
    } catch (error) {
      setState((current) => ({ ...current, bookingState: 'error' }));
      throw error;
    }
  };

  return (
    <StudioMcpContext.Provider
      value={{
        ...state,
        refreshStudio,
        reserveAppointment,
      }}
    >
      {children}
    </StudioMcpContext.Provider>
  );
}

export function useStudioMcp() {
  const context = useContext(StudioMcpContext);

  if (!context) {
    throw new Error('useStudioMcp debe usarse dentro de StudioMcpProvider');
  }

  return context;
}
