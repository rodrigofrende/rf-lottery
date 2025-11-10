import type { Participant } from '../types.ts';

export const drawWinners = (
  participants: Participant[],
  requestedWinners: number,
): Participant[] => {
  const eligible = participants.filter((participant) => participant.chances > 0);
  const totalRequested = Math.min(requestedWinners, eligible.length);

  const pool = [...eligible];
  const winners: Participant[] = [];

  while (winners.length < totalRequested && pool.length > 0) {
    const totalWeight = pool.reduce((sum, participant) => sum + participant.chances, 0);
    if (totalWeight === 0) {
      break;
    }

    let randomWeight = Math.random() * totalWeight;
    let selectedIndex = 0;

    for (let index = 0; index < pool.length; index += 1) {
      randomWeight -= pool[index]!.chances;
      if (randomWeight <= 0) {
        selectedIndex = index;
        break;
      }
    }

    const [winner] = pool.splice(selectedIndex, 1);
    if (winner) {
      winners.push(winner);
    }
  }

  return winners;
};

