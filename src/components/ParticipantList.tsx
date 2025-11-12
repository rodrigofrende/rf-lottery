import type { Participant } from '../types.ts';

type ParticipantListProps = {
  participants: Participant[];
  onEdit: (participant: Participant) => void;
  onDelete: (participantId: string) => void;
  editingId?: string | null;
  onClearAll: () => void;
};

export const ParticipantList = ({
  participants,
  onEdit,
  onDelete,
  editingId,
  onClearAll,
}: ParticipantListProps) => {
  if (participants.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-6 text-center text-sm text-slate-400">
        Agregá el primer participante para empezar con el sorteo 👇
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-200">Participantes cargados</p>
        <button
          type="button"
          onClick={onClearAll}
          className="cursor-pointer rounded-lg border border-transparent bg-primary-600/90 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-500 active:scale-[0.97]"
        >
          Limpiar lista
        </button>
      </div>

      <ul className="grid gap-3">
        {participants.map((participant) => (
          <li
            key={participant.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3"
          >
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-white">{participant.name}</p>
                <span className="inline-flex items-center rounded-full bg-brand-500/15 px-2 py-0.5 text-xs font-semibold text-brand-200">
                  {participant.chances} chance{participant.chances > 1 ? 's' : ''}
                </span>
              </div>
              {participant.contact.trim() && participant.contact.trim() !== participant.name.trim() ? (
                <p className="text-sm text-slate-400">{participant.contact}</p>
              ) : null}
              {editingId === participant.id ? (
                <p className="text-xs font-medium uppercase tracking-wide text-brand-300">
                  Editando...
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(participant)}
                className="cursor-pointer rounded-lg border border-transparent bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-slate-700 hover:bg-slate-800/80 active:scale-[0.97]"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => onDelete(participant.id)}
                className="cursor-pointer rounded-lg border border-transparent bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20 active:scale-[0.97]"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

