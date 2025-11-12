import type { Participant } from '../types.ts';

type RaffleResultProps = {
  winners: Participant[];
  onReset: () => void;
  lastUpdatedAt: Date | null;
};

export const RaffleResult = ({ winners, onReset, lastUpdatedAt }: RaffleResultProps) => {
  if (winners.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-6 text-center text-sm text-slate-400">
        Todavía no hay ganadores. Ejecutá un sorteo para ver los resultados acá mismo ✨
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-3xl border border-brand-500/40 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-900/40 p-5 shadow-soft">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-brand-200">Ganadores del sorteo</p>
        <h2 className="text-2xl font-bold text-white">
          🎉 {winners.length} ganador{winners.length > 1 ? 'es confirmados' : ' confirmado'}
        </h2>
        {lastUpdatedAt ? (
          <p className="text-xs text-slate-400">
            Sorteo realizado el {lastUpdatedAt.toLocaleDateString()} a las {lastUpdatedAt.toLocaleTimeString()}
          </p>
        ) : null}
      </div>

      <ul className="space-y-3">
        {winners.map((winner, index) => (
          <li
            key={winner.id}
            className="rounded-2xl border border-brand-500/20 bg-slate-950/60 px-4 py-3"
          >
            <p className="text-sm font-semibold text-white">
              #{index + 1} {winner.name}
            </p>
            {winner.contact.trim() && winner.contact.trim() !== winner.name.trim() ? (
              <p className="text-xs text-slate-400">{winner.contact}</p>
            ) : null}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onReset}
        className="w-full cursor-pointer rounded-xl border border-transparent bg-slate-800/80 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 hover:text-white active:scale-[0.98]"
      >
        Reiniciar resultados
      </button>
    </div>
  );
};

