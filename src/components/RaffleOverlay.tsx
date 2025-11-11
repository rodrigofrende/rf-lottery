import Confetti from 'react-confetti';
import type { Participant } from '../types.ts';

type RaffleOverlayProps = {
  winners: Participant[];
  onClose: () => void;
  showConfetti: boolean;
  viewportWidth: number;
  viewportHeight: number;
};

export const RaffleOverlay = ({
  winners,
  onClose,
  showConfetti,
  viewportWidth,
  viewportHeight,
}: RaffleOverlayProps) => {
  if (winners.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 -z-10 bg-slate-950/85 backdrop-blur" />

      {showConfetti && viewportWidth > 0 && viewportHeight > 0 ? (
        <div className="pointer-events-none absolute inset-0 z-0">
          <Confetti
            width={viewportWidth}
            height={viewportHeight}
            numberOfPieces={420}
            recycle={false}
            gravity={0.2}
            style={{ pointerEvents: 'none' }}
          />
        </div>
      ) : null}

      <div className="relative z-10 w-full max-w-lg space-y-5 rounded-3xl border border-brand-500/40 bg-slate-900/95 p-6 shadow-2xl">
        <header className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-200">Ganadores</p>
          <h2 className="text-3xl font-bold text-white">
            🎉 {winners.length} ganador{winners.length > 1 ? 'es' : ''} del sorteo
          </h2>
          <p className="text-sm text-slate-400">
            Compartí los nombres en vivo, agradecé la participación y seguí con la dinámica.
          </p>
        </header>

        <ul className="space-y-3">
          {winners.map((winner, index) => (
            <li
              key={winner.id}
              className="rounded-2xl border border-brand-500/25 bg-slate-950/70 px-4 py-3"
            >
              <p className="text-sm font-semibold text-white">
                #{index + 1} {winner.name}
              </p>
              <p className="text-xs text-slate-400">{winner.contact}</p>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onClose}
          className="w-full cursor-pointer rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-400 active:scale-[0.98]"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};
