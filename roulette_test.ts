import { Bet, RouletteBase, Roulette, Prediction } from './roulette';
import * as assert from 'assert';

/*function test(command: string, expected: BetCommand | undefined) {
  if (expected === undefined) {
    assert.strictEqual(typeof parse(command), 'string');
  } else {
    assert.deepStrictEqual(parse(command), expected);
  }
}*/

interface ExpectedWinning {
  didWin: boolean;
  chance: number;
  payout: number;
  amount: number;
}

function testRouletteBase(instance: RouletteBase, bets: { [key: string]: Bet }, winningNumber: number, expected: { [key: string]: ExpectedWinning }) {
  for (const playerId in bets) {
    instance.placeBet(playerId, bets[playerId].amount, bets[playerId].numbers);
  }
  instance.lastNumber = winningNumber;
  let called = {};
  instance.computeWinnings((playerId, didWin, chance, payout, amount) => {
    assert.strictEqual(playerId in expected, true);
    assert.strictEqual(didWin, expected[playerId].didWin);
    if (Math.abs(chance - expected[playerId].chance) > 0.0001) {
      assert.strictEqual(chance, expected[playerId].chance);
    }
    assert.strictEqual(payout, expected[playerId].payout);
    assert.strictEqual(amount, expected[playerId].amount);
    called[playerId] = true;
  });

  for (const playerId in expected) {
    assert.strictEqual(called[playerId], true);
  }
}

// Test all roulette bets
testRouletteBase(new Roulette(37),
  { player1: { amount: 10, numbers: [1] } }, 1,
  { player1: { didWin: true, chance: 1 / (36 + 1), payout: 35, amount: 10 } });

testRouletteBase(new Roulette(37),
  { player1: { amount: 10, numbers: [1] } }, 0,
  { player1: { didWin: false, chance: 1 - 1 / (36 + 1), payout: 0, amount: 10 } });

testRouletteBase(new Roulette(37),
  { player1: { amount: 10, numbers: [1, 2] } }, 1,
  { player1: { didWin: true, chance: 1 / (17.5 + 1), payout: 17, amount: 10 } });
testRouletteBase(new Roulette(37),
  { player1: { amount: 10, numbers: [1, 2] } }, 3,
  { player1: { didWin: false, chance: 1 - 1 / (17.5 + 1), payout: 0, amount: 10 } });

testRouletteBase(new Roulette(37),
  { player1: { amount: 10, numbers: [1, 2, 3] } }, 1,
  { player1: { didWin: true, chance: 1 / (11 + 1/3 + 1), payout: 11, amount: 10 } });
testRouletteBase(new Roulette(37),
  { player1: { amount: 10, numbers: [1, 2, 3] } }, 0,
  { player1: { didWin: false, chance: 1 - 1 / (11 + 1/3 + 1), payout: 0, amount: 10 } });

testRouletteBase(new Roulette(37),
  { player1: { amount: 10, numbers: [1, 2, 3, 4] } }, 1,
  { player1: { didWin: true, chance: 1 / (8 + 1/4 + 1), payout: 8, amount: 10 } });
testRouletteBase(new Roulette(37),
  { player1: { amount: 10, numbers: [1, 2, 3, 4] } }, 0,
  { player1: { didWin: false, chance: 1 - 1 / (8 + 1/4 + 1), payout: 0, amount: 10 } });

testRouletteBase(new Roulette(37),
  { player1: { amount: 10, numbers: [1, 2, 3, 4, 5, 6] } }, 1,
  { player1: { didWin: true, chance: 1 / (5 + 1/6 + 1), payout: 5, amount: 10 } });
testRouletteBase(new Roulette(37),
  { player1: { amount: 10, numbers: [1, 2, 3, 4, 5, 6] } }, 0,
  { player1: { didWin: false, chance: 1 - 1 / (5 + 1/6 + 1), payout: 0, amount: 10 } });

testRouletteBase(new Roulette(37),
  { player1: { amount: 10, numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] } }, 1,
  { player1: { didWin: true, chance: 1 / (2 + 1/12 + 1), payout: 2, amount: 10 } });
testRouletteBase(new Roulette(37),
  { player1: { amount: 10, numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] } }, 0,
  { player1: { didWin: false, chance: 1 - 1 / (2 + 1/12 + 1), payout: 0, amount: 10 } });

testRouletteBase(new Roulette(37),
  { player1: { amount: 10, numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] } }, 1,
  { player1: { didWin: true, chance: 1 / (1 + 1/18 + 1), payout: 1, amount: 10 } });
testRouletteBase(new Roulette(37),
  { player1: { amount: 10, numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] } }, 0,
  { player1: { didWin: false, chance: 1 - 1 / (1 + 1 / 18 + 1), payout: 0, amount: 10 } });

testRouletteBase(new Roulette(37),
  { player1: { amount: 10, numbers: RouletteBase.getAllNumbers(37) } }, 1,
  { player1: { didWin: true, chance: 1, payout: 0, amount: 10 } });

// Test that roulette bets are independent
testRouletteBase(new Roulette(37), {
  player1: { amount: 10, numbers: [1, 2] },
  player2: { amount: 10, numbers: [1, 2, 3, 4, 5, 6] }
}, 1, {
  player1: { didWin: true, chance: 1 / (17.5 + 1), payout: 17, amount: 10 },
  player2: { didWin: true, chance: 1 / (5 + 1 / 6 + 1), payout: 5, amount: 10 }
});
testRouletteBase(new Roulette(37), {
  player1: { amount: 10, numbers: [7, 8] },
  player2: { amount: 10, numbers: [1, 2, 3, 4, 5, 6] }
}, 1, {
  player1: { didWin: false, chance: 1 - 1 / (17.5 + 1), payout: 0, amount: 10 },
  player2: { didWin: true, chance: 1 / (5 + 1 / 6 + 1), payout: 5, amount: 10 }
});
testRouletteBase(new Roulette(37), {
  player1: { amount: 10, numbers: [7, 8] },
  player2: { amount: 10, numbers: [1, 2, 3, 4, 5, 6] }
}, 7, {
  player1: { didWin: true, chance: 1 / (17.5 + 1), payout: 17, amount: 10 },
  player2: { didWin: false, chance: 1 - 1 / (5 + 1 / 6 + 1), payout: 0, amount: 10 }
});
testRouletteBase(new Roulette(37), {
  player1: { amount: 10, numbers: [7, 8] },
  player2: { amount: 10, numbers: [1, 2, 3, 4, 5, 6] }
}, 10, {
  player1: { didWin: false, chance: 1 - 1 / (17.5 + 1), payout: 0, amount: 10 },
  player2: { didWin: false, chance: 1 - 1 / (5 + 1 / 6 + 1), payout: 0, amount: 10 }
});

// Test predictions
testRouletteBase(new Prediction(2),
  { player1: { amount: 10, numbers: [1] } }, 1,
  { player1: { didWin: true, chance: 1, payout: 0, amount: 10 } });
testRouletteBase(new Prediction(2), {
  player1: { amount: 10, numbers: [1] },
  player2: { amount: 10, numbers: [2] }
}, 1, {
  player1: { didWin: true, chance: 0.5, payout: 1, amount: 10 },
  player2: { didWin: false, chance: 0.5, payout: 0, amount: 10 }
});
testRouletteBase(new Prediction(2), {
  player1: { amount: 10, numbers: [1] },
  player2: { amount: 100, numbers: [2] }
}, 1, {
  player1: { didWin: true, chance: 1 / 11, payout: 10, amount: 10 },
  player2: { didWin: false, chance: 1 - 1 / 11, payout: 0, amount: 100 }
});
testRouletteBase(new Prediction(2), {
  player1: { amount: 9, numbers: [1] },
  player2: { amount: 1, numbers: [1] },
  player3: { amount: 100, numbers: [2] }
}, 1, {
  player1: { didWin: true, chance: 1 / 11, payout: 10, amount: 9 },
  player2: { didWin: true, chance: 1 / 11, payout: 10, amount: 1 },
  player3: { didWin: false, chance: 1 - 1 / 11, payout: 0, amount: 100 }
});
testRouletteBase(new Prediction(3), {
  player1: { amount: 9, numbers: [1] },
  player2: { amount: 1, numbers: [1] },
  player3: { amount: 50, numbers: [2] },
  player4: { amount: 50, numbers: [3] }
}, 1, {
  player1: { didWin: true, chance: 1 / 11, payout: 10, amount: 9 },
  player2: { didWin: true, chance: 1 / 11, payout: 10, amount: 1 },
  player3: { didWin: false, chance: 5 / 11, payout: 0, amount: 50 },
  player4: { didWin: false, chance: 5 / 11, payout: 0, amount: 50 }
});
