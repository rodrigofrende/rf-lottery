import { useEffect, useState } from 'react';
import type { Participant } from '../types.ts';

type ParticipantDraft = Omit<Participant, 'id'>;

type ParticipantFormProps = {
  mode: 'create' | 'edit';
  onSubmit: (participant: ParticipantDraft) => void;
  onCancel?: () => void;
  initialParticipant?: Participant | null;
  existingParticipants: Participant[];
  editingParticipantId?: string | null;
};

const defaultDraft: ParticipantDraft = {
  name: '',
  contact: '',
  chances: 1,
};

export const ParticipantForm = ({
  mode,
  onSubmit,
  onCancel,
  initialParticipant,
  existingParticipants,
  editingParticipantId,
}: ParticipantFormProps) => {
  const [form, setForm] = useState<ParticipantDraft>(defaultDraft);
  const [errors, setErrors] = useState<{ identifier?: string }>({});
  const showPlaceholders = mode === 'create' && existingParticipants.length === 0;

  useEffect(() => {
    if (initialParticipant) {
      const identifier = initialParticipant.contact?.trim()
        ? initialParticipant.contact
        : initialParticipant.name;
      setForm({
        name: identifier,
        contact: initialParticipant.contact || identifier,
        chances: initialParticipant.chances,
      });
    } else {
      setForm(defaultDraft);
    }
  }, [initialParticipant]);

  const validate = () => {
    const nextErrors: typeof errors = {};

    const trimmedValue = form.name.trim();

    if (!trimmedValue) {
      nextErrors.identifier = 'Ingresá un nombre o email.';
    } else if (
      trimmedValue.includes('@') &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)
    ) {
      nextErrors.identifier = 'Revisá el formato del email.';
    } else {
      const normalizedValue = trimmedValue.toLowerCase();
      const exists = existingParticipants.some((participant) => {
        const participantName = participant.name.trim().toLowerCase();
        const participantContact = participant.contact.trim().toLowerCase();
        return (
          participant.id !== editingParticipantId &&
          (participantName === normalizedValue || participantContact === normalizedValue)
        );
      });

      if (exists) {
        nextErrors.identifier = 'Ese participante ya está cargado.';
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    const trimmedValue = form.name.trim();
    onSubmit({
      name: trimmedValue,
      contact: trimmedValue,
      chances: Math.floor(form.chances),
    });

    if (mode === 'create') {
      setForm(defaultDraft);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-soft backdrop-blur"
    >
      <div className="space-y-2">
        <label htmlFor="participant-identifier" className="text-sm font-medium text-slate-200">
          Nombre o email del participante
        </label>
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="space-y-2">
            <input
              id="participant-identifier"
              type="text"
              placeholder={
                showPlaceholders ? 'Ej. Sofía Martínez · sofia@email.com · @SofiMartinez' : undefined
              }
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  name: event.target.value,
                  contact: event.target.value,
                }))
              }
              className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 text-base text-slate-100 placeholder:text-slate-500"
            />
          </div>
          <button
            type="submit"
            className="h-11 cursor-pointer rounded-xl bg-primary-500 px-6 text-sm font-semibold text-white transition hover:bg-primary-400 active:scale-[0.98]"
          >
            {mode === 'create' ? 'Sumar participante' : 'Guardar cambios'}
          </button>
        </div>
        {errors.identifier ? <p className="text-sm text-rose-400">{errors.identifier}</p> : null}
      </div>

      {mode === 'edit' && onCancel ? (
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer text-sm font-medium text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline"
        >
          Cancelar cambios
        </button>
      ) : null}
    </form>
  );
};

