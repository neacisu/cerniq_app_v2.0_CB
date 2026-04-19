import { useShellStore } from './shell-store';

describe('useShellStore', () => {
  afterEach(() => {
    useShellStore.setState({ telemetryOpen: true, commandOpen: false });
  });

  it('pornește cu telemetria vizibilă și paleta de comenzi închisă', () => {
    const s = useShellStore.getState();
    expect(s.telemetryOpen).toBe(true);
    expect(s.commandOpen).toBe(false);
  });

  it('actualizează starea prin setteri', () => {
    useShellStore.getState().setCommandOpen(true);
    expect(useShellStore.getState().commandOpen).toBe(true);
    useShellStore.getState().setTelemetryOpen(false);
    expect(useShellStore.getState().telemetryOpen).toBe(false);
    useShellStore.setState({
      telemetryOpen: true,
      commandOpen: false,
    });
  });
});
