type RaffleControlsProps = {
  requestedWinners: number;
  onRequestedWinnersChange: (winners: number) => void;
  onDraw: () => void;
  isDrawing: boolean;
  participantCount: number;
  totalChances: number;
};

export const RaffleControls = ({
  requestedWinners,
  onRequestedWinnersChange,
  onDraw,
  isDrawing,
  participantCount,
  totalChances,
}: RaffleControlsProps) => {
  const canDraw = participantCount > 0 && requestedWinners > 0;

  return (
    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Personas en la lista</p>
          <p className="text-lg font-semibold text-white">{participantCount}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Chances totales</p>
          <p className="text-lg font-semibold text-white">{totalChances}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div className="space-y-2">
          <label htmlFor="winners-count" className="text-sm font-medium text-slate-200">
            ¿A cuántas personas premiamos?
          </label>
          <input
            id="winners-count"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            value={requestedWinners}
            onChange={(event) => {
              const value = Number.parseInt(event.target.value, 10);
              onRequestedWinnersChange(Number.isNaN(value) ? 1 : Math.max(1, value));
            }}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 text-base text-slate-100 placeholder:text-slate-500"
          />
        </div>

        <button
          type="button"
          onClick={onDraw}
          disabled={!canDraw || isDrawing}
          className="flex h-12 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 px-6 text-sm font-semibold text-white transition enabled:hover:from-primary-500 enabled:hover:to-primary-300 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 sm:self-end"
        >
          {isDrawing ? 'Sorteando...' : 'Sortear'}
        </button>

        <p className="text-xs text-slate-500 sm:col-span-2">
          Respetamos las chances de cada persona y nunca repetimos ganador.
        </p>
      </div>
    </div>
  );
};

