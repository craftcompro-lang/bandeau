import {
  initialExchangeState,
  transition,
  type Actor,
  type ExchangeAction,
  type ExchangeState,
} from '../exchange';

const proposer: Actor = { kind: 'party', party: 'proposer' };
const recipient: Actor = { kind: 'party', party: 'recipient' };
const support: Actor = { kind: 'support' };

function run(steps: [ExchangeAction, Actor][], start = initialExchangeState()): ExchangeState {
  return steps.reduce((state, [action, actor]) => {
    const result = transition(state, action, actor);
    if (!result.ok) throw new Error(`${action.type} refusé : ${result.error}`);
    return result.state;
  }, start);
}

describe('acceptation', () => {
  it("le destinataire peut accepter la proposition", () => {
    expect(run([[{ type: 'accept' }, recipient]]).status).toBe('accepted');
  });

  it("le proposant ne peut jamais accepter sa propre proposition", () => {
    const result = transition(initialExchangeState(), { type: 'accept' }, proposer);
    expect(result.ok).toBe(false);
  });

  it("après une contre-proposition, seul le proposant initial peut accepter", () => {
    const countered = run([[{ type: 'counter_propose' }, recipient]]);
    expect(countered.status).toBe('counter_proposed');
    expect(transition(countered, { type: 'accept' }, recipient).ok).toBe(false);
    expect(run([[{ type: 'accept' }, proposer]], countered).status).toBe('accepted');
  });

  it('les contre-propositions alternent entre les parties', () => {
    const s = run([
      [{ type: 'counter_propose' }, recipient],
      [{ type: 'counter_propose' }, proposer],
    ]);
    expect(s.lastOfferBy).toBe('proposer');
    expect(transition(s, { type: 'counter_propose' }, proposer).ok).toBe(false);
  });
});

describe('refus et annulation', () => {
  it("seule l'autre partie peut refuser une offre", () => {
    expect(transition(initialExchangeState(), { type: 'reject' }, proposer).ok).toBe(false);
    expect(run([[{ type: 'reject' }, recipient]]).status).toBe('rejected');
  });

  it("l'auteur d'une offre peut la retirer, pas son destinataire", () => {
    expect(transition(initialExchangeState(), { type: 'cancel' }, recipient).ok).toBe(false);
    expect(run([[{ type: 'cancel' }, proposer]]).status).toBe('cancelled');
  });

  it("un échange accepté peut être annulé par l'une ou l'autre partie", () => {
    const accepted = run([[{ type: 'accept' }, recipient]]);
    expect(run([[{ type: 'cancel' }, proposer]], accepted).status).toBe('cancelled');
    expect(run([[{ type: 'cancel' }, recipient]], accepted).status).toBe('cancelled');
  });

  it('aucune action après un état terminal', () => {
    const rejected = run([[{ type: 'reject' }, recipient]]);
    for (const action of [{ type: 'accept' }, { type: 'cancel' }, { type: 'counter_propose' }] as ExchangeAction[]) {
      expect(transition(rejected, action, proposer).ok).toBe(false);
      expect(transition(rejected, action, recipient).ok).toBe(false);
    }
  });
});

describe('remise et réception : double confirmation', () => {
  const accepted = run([[{ type: 'accept' }, recipient]]);

  it('le plan de remise exige les deux confirmations', () => {
    const one = run([[{ type: 'confirm_handover_plan' }, proposer]], accepted);
    expect(one.status).toBe('accepted');
    const again = run([[{ type: 'confirm_handover_plan' }, proposer]], one);
    expect(again.status).toBe('accepted');
    expect(run([[{ type: 'confirm_handover_plan' }, recipient]], one).status).toBe('awaiting_handover');
  });

  it("l'échange n'est terminé qu'après les deux confirmations de réception", () => {
    const handover = run(
      [
        [{ type: 'confirm_handover_plan' }, proposer],
        [{ type: 'confirm_handover_plan' }, recipient],
      ],
      accepted,
    );
    const one = run([[{ type: 'confirm_receipt' }, recipient]], handover);
    expect(one.status).toBe('awaiting_handover');
    expect(run([[{ type: 'confirm_receipt' }, recipient]], one).status).toBe('awaiting_handover');
    expect(run([[{ type: 'confirm_receipt' }, proposer]], one).status).toBe('completed');
  });

  it('une annulation est impossible après une réception confirmée', () => {
    const s = run(
      [
        [{ type: 'confirm_handover_plan' }, proposer],
        [{ type: 'confirm_handover_plan' }, recipient],
        [{ type: 'confirm_receipt' }, recipient],
      ],
      accepted,
    );
    expect(transition(s, { type: 'cancel' }, proposer).ok).toBe(false);
  });
});

describe('litiges', () => {
  const handover = run([
    [{ type: 'accept' }, recipient],
    [{ type: 'confirm_handover_plan' }, proposer],
    [{ type: 'confirm_handover_plan' }, recipient],
  ]);

  it('une partie peut ouvrir un litige pendant la remise', () => {
    expect(run([[{ type: 'open_dispute' }, recipient]], handover).status).toBe('disputed');
  });

  it('seul le support peut clore un litige', () => {
    const disputed = run([[{ type: 'open_dispute' }, recipient]], handover);
    expect(transition(disputed, { type: 'resolve_dispute', outcome: 'completed' }, proposer).ok).toBe(false);
    expect(run([[{ type: 'resolve_dispute', outcome: 'cancelled' }, support]], disputed).status).toBe('cancelled');
  });

  it("le support n'intervient pas hors litige", () => {
    expect(transition(initialExchangeState(), { type: 'accept' }, support).ok).toBe(false);
  });
});
