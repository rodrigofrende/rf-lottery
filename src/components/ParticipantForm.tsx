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
  const [errors, setErrors] = useState<{ name?: string; contact?: string; chances?: string }>({});
  const showPlaceholders = mode === 'create' && existingParticipants.length === 0;

  useEffect(() => {
    if (initialParticipant) {
      setForm({
        name: initialParticipant.name,
        contact: initialParticipant.contact,
        chances: initialParticipant.chances,
      });
    } else {
      setForm(defaultDraft);
    }
  }, [initialParticipant]);

  const validate = () => {
    const nextErrors: typeof errors = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Ingresá un nombre.';
    }

    const trimmedContact = form.contact.trim();

    if (!trimmedContact) {
      nextErrors.contact = 'Ingresá un usuario o email.';
    } else if (trimmedContact.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedContact)) {
      nextErrors.contact = 'Revisá el formato del email.';
    }

    if (!nextErrors.contact) {
      const normalizedContact = trimmedContact.toLowerCase();
      const exists = existingParticipants.some(
        (participant) =>
          participant.id !== editingParticipantId &&
          participant.contact.trim().toLowerCase() === normalizedContact,
      );

      if (exists) {
        nextErrors.contact = 'Ese contacto ya está cargado.';
      }
    }

    if (!Number.isFinite(form.chances) || form.chances < 1) {
      nextErrors.chances = 'Asigná al menos una chance.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    onSubmit({
      name: form.name.trim(),
      contact: form.contact.trim(),
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
        <label htmlFor="participant-name" className="text-sm font-medium text-slate-200">
          Nombre del participante
        </label>
        <input
          id="participant-name"
          type="text"
          placeholder={showPlaceholders ? 'Ej. Sofía Martínez' : undefined}
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2 text-base text-slate-100 placeholder:text-slate-500"
        />
        {errors.name ? <p className="text-sm text-rose-400">{errors.name}</p> : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="participant-contact" className="text-sm font-medium text-slate-200">
          Contacto (usuario o email)
        </label>
        <input
          id="participant-contact"
          type="text"
          placeholder={showPlaceholders ? 'Ej. sofia@email.com · @SofiMartinez' : undefined}
          value={form.contact}
          onChange={(event) => setForm((prev) => ({ ...prev, contact: event.target.value }))}
          className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2 text-base text-slate-100 placeholder:text-slate-500"
        />
        {errors.contact ? <p className="text-sm text-rose-400">{errors.contact}</p> : null}
      </div>

      <div className="grid grid-cols-2 items-end gap-3">
        <div className="space-y-2">
          <label htmlFor="participant-chances" className="text-sm font-medium text-slate-200">
            Chances asignadas
          </label>
          <input
            id="participant-chances"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            placeholder={showPlaceholders ? '1' : undefined}
            value={form.chances}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                chances: Number.parseInt(event.target.value, 10) || 1,
              }))
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2 text-base text-slate-100 placeholder:text-slate-500"
          />
          {errors.chances ? <p className="text-sm text-rose-400">{errors.chances}</p> : null}
        </div>

        <button
          type="submit"
          className="h-11 cursor-pointer rounded-xl bg-primary-500 text-sm font-semibold text-white transition hover:bg-primary-400 active:scale-[0.98]"
        >
          {mode === 'create' ? 'Sumar participante' : 'Guardar cambios'}
        </button>
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

