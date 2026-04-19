import { create } from 'zustand';

export type ChapterId =
  | 'home'
  | 'brain'
  | 'ingest'
  | 'customers'
  | 'inbox'
  | 'sales'
  | 'workflows'
  | 'operations'
  | 'analytics'
  | 'admin';

interface ShellState {
  telemetryOpen: boolean;
  commandOpen: boolean;
  setTelemetryOpen: (v: boolean) => void;
  setCommandOpen: (v: boolean) => void;
}

export const useShellStore = create<ShellState>((set) => ({
  telemetryOpen: true,
  commandOpen: false,
  setTelemetryOpen: (telemetryOpen) => set({ telemetryOpen }),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
}));
