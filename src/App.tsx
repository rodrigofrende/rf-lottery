import { useEffect, useMemo, useState } from 'react';
import { ParticipantForm } from './components/ParticipantForm.tsx';
import { ParticipantList } from './components/ParticipantList.tsx';
import { RaffleControls } from './components/RaffleControls.tsx';
import { RaffleResult } from './components/RaffleResult.tsx';
import { RaffleOverlay } from './components/RaffleOverlay.tsx';
import { AdBanner } from './components/AdBanner.tsx';
import { useWindowSize } from './hooks/useWindowSize.ts';
import { drawWinners } from './utils/raffle.ts';
import type { Participant } from './types.ts';

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2, 11);
};

const STORAGE_KEY = 'rf-lottery::participants';

const App = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [requestedWinners, setRequestedWinners] = useState(1);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastDrawAt, setLastDrawAt] = useState<Date | null>(null);
  const [isResultOverlayOpen, setIsResultOverlayOpen] = useState(false);
  const adSlotId = import.meta.env.VITE_ADSENSE_SLOT_ID ?? '0000000000';

  const { width, height } = useWindowSize();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        return;
      }

      const restored: Participant[] = parsed
        .filter(
          (item): item is Participant =>
            item &&
            typeof item.id === 'string' &&
            typeof item.name === 'string' &&
            typeof item.contact === 'string' &&
            Number.isFinite(item.chances),
        )
        .map((item) => ({
          id: item.id,
          name: item.name,
          contact: item.contact,
          chances: Math.max(1, Math.floor(item.chances)),
        }));

      if (restored.length > 0) {
        setParticipants(restored);
      }
    } catch (error) {
      console.warn('No se pudo recuperar la lista de participantes desde localStorage', error);
    }
  }, []);

  const totalChances = useMemo(
    () => participants.reduce((sum, participant) => sum + participant.chances, 0),
    [participants],
  );

  useEffect(() => {
    setRequestedWinners((prev) => {
      if (participants.length === 0) {
        return 1;
      }

      return Math.min(Math.max(prev, 1), participants.length);
    });
  }, [participants.length]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (participants.length > 0) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [participants]);

  useEffect(() => {
    setWinners((prev) => {
      const stillValid = prev.filter((winner) =>
        participants.some((participant) => participant.id === winner.id),
      );

      if (stillValid.length === 0) {
        setLastDrawAt(null);
        setShowConfetti(false);
        setIsResultOverlayOpen(false);
      }

      return stillValid;
    });
  }, [participants]);

  const handleCreateOrUpdate = (draft: Omit<Participant, 'id'>) => {
    const normalizedContact = draft.contact.trim().toLowerCase();
    const duplicate = participants.some(
      (participant) =>
        participant.contact.trim().toLowerCase() === normalizedContact &&
        (!editingParticipant || participant.id !== editingParticipant.id),
    );

    if (duplicate) {
      return;
    }

    if (editingParticipant) {
      setParticipants((prev) =>
        prev.map((participant) =>
          participant.id === editingParticipant.id
            ? { ...participant, ...draft }
            : participant,
        ),
      );
      setEditingParticipant(null);
    } else {
      setParticipants((prev) => [
        ...prev,
        {
          id: generateId(),
          ...draft,
        },
      ]);
    }
  };

  const handleDelete = (participantId: string) => {
    setParticipants((prev) => prev.filter((participant) => participant.id !== participantId));
    if (editingParticipant?.id === participantId) {
      setEditingParticipant(null);
    }
  };

  const handleDraw = () => {
    if (participants.length === 0) {
      return;
    }

    setIsDrawing(true);
    setTimeout(() => {
      const nextWinners = drawWinners(participants, requestedWinners);
      setWinners(nextWinners);
      setIsDrawing(false);
      setShowConfetti(nextWinners.length > 0);
      setLastDrawAt(nextWinners.length > 0 ? new Date() : null);
      setIsResultOverlayOpen(nextWinners.length > 0);
    }, 450);
  };

  const handleResetResult = () => {
    setWinners([]);
    setLastDrawAt(null);
    setShowConfetti(false);
    setIsResultOverlayOpen(false);
  };

  const handleClearParticipants = () => {
    setParticipants([]);
    setEditingParticipant(null);
    handleResetResult();
  };

  const handleCloseOverlay = () => {
    setShowConfetti(false);
    setIsResultOverlayOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0ea5e933,_#020617_55%)]" />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        {isResultOverlayOpen ? (
          <RaffleOverlay
            winners={winners}
            onClose={handleCloseOverlay}
            showConfetti={showConfetti}
            viewportWidth={width}
            viewportHeight={height}
          />
        ) : null}

        <header className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/50 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-200">
            RF Lottery
          </span>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Armá sorteos al toque con tu comunidad
          </h1>
          <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
            Sumá gente, repartí chances y largá ganadores en segundos. Ideal para streams, activaciones
            relámpago y cualquier giveaway donde quieras sumar energía sin fumar planillas.
          </p>
        </header>

        <section className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex w-full flex-col gap-6 lg:max-w-xl">
            <ParticipantForm
              mode={editingParticipant ? 'edit' : 'create'}
              onSubmit={handleCreateOrUpdate}
              onCancel={() => setEditingParticipant(null)}
              initialParticipant={editingParticipant ?? undefined}
              existingParticipants={participants}
              editingParticipantId={editingParticipant?.id ?? null}
            />

            <RaffleControls
              requestedWinners={requestedWinners}
              onRequestedWinnersChange={setRequestedWinners}
              onDraw={handleDraw}
              isDrawing={isDrawing}
              participantCount={participants.length}
              totalChances={totalChances}
            />

            <RaffleResult
              winners={winners}
              onReset={handleResetResult}
              lastUpdatedAt={lastDrawAt}
            />
          </div>

          <div className="flex-1 space-y-3">
            <ParticipantList
              participants={participants}
              onEdit={(participant) => setEditingParticipant(participant)}
              onDelete={handleDelete}
              editingId={editingParticipant?.id ?? null}
              onClearAll={handleClearParticipants}
            />

            <AdBanner adSlot={adSlotId} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;

