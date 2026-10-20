/**
 * Machine à états d'un échange SWAP.
 *
 * Ce module est la SPÉCIFICATION des règles. En production, les transitions sont
 * exécutées et contrôlées côté serveur (fonction PostgreSQL / Edge Function, phase 3),
 * jamais par le client. Les mêmes cas de test serviront à valider le serveur.
 *
 * Principe clé : aucune étape décisive n'est validée par une seule personne.
 * - Une offre (proposition ou contre-proposition) ne peut être acceptée que par
 *   l'autre partie.
 * - Le plan de remise et la réception doivent être confirmés par les deux parties.
 */

export const EXCHANGE_STATUSES = [
  'proposed',
  'counter_proposed',
  'accepted',
  'rejected',
  'cancelled',
  'awaiting_handover',
  'completed',
  'disputed',
] as const;
export type ExchangeStatus = (typeof EXCHANGE_STATUSES)[number];

export type Party = 'proposer' | 'recipient';
export type Actor = { kind: 'party'; party: Party } | { kind: 'support' };

export type ExchangeState = {
  status: ExchangeStatus;
  /** Partie à l'origine de l'offre en cours (proposition ou dernière contre-proposition). */
  lastOfferBy: Party;
  handoverConfirmedBy: readonly Party[];
  receiptConfirmedBy: readonly Party[];
};

export type ExchangeAction =
  | { type: 'counter_propose' }
  | { type: 'accept' }
  | { type: 'reject' }
  | { type: 'cancel' }
  | { type: 'confirm_handover_plan' }
  | { type: 'confirm_receipt' }
  | { type: 'open_dispute' }
  | { type: 'resolve_dispute'; outcome: 'completed' | 'cancelled' };

export type TransitionResult =
  | { ok: true; state: ExchangeState }
  | { ok: false; error: string };

export const TERMINAL_STATUSES: readonly ExchangeStatus[] = ['rejected', 'cancelled', 'completed'];

export const STATUS_LABELS: Record<ExchangeStatus, string> = {
  proposed: 'Proposé',
  counter_proposed: 'Contre-proposition',
  accepted: 'Accepté',
  rejected: 'Refusé',
  cancelled: 'Annulé',
  awaiting_handover: 'Remise en cours',
  completed: 'Terminé',
  disputed: 'Litige en cours',
};

export function initialExchangeState(): ExchangeState {
  return { status: 'proposed', lastOfferBy: 'proposer', handoverConfirmedBy: [], receiptConfirmedBy: [] };
}

const other = (party: Party): Party => (party === 'proposer' ? 'recipient' : 'proposer');
const fail = (error: string): TransitionResult => ({ ok: false, error });
const addParty = (list: readonly Party[], party: Party): Party[] =>
  list.includes(party) ? [...list] : [...list, party];
const isOpenOffer = (status: ExchangeStatus) => status === 'proposed' || status === 'counter_proposed';

export function transition(state: ExchangeState, action: ExchangeAction, actor: Actor): TransitionResult {
  if (action.type === 'resolve_dispute') {
    if (actor.kind !== 'support') return fail('Seul le support peut clore un litige.');
    if (state.status !== 'disputed') return fail("Aucun litige n'est en cours.");
    return { ok: true, state: { ...state, status: action.outcome } };
  }

  if (actor.kind !== 'party') return fail("Le support n'agit que sur les litiges.");
  const party = actor.party;

  switch (action.type) {
    case 'counter_propose':
      if (!isOpenOffer(state.status)) return fail('Aucune offre en attente.');
      if (state.lastOfferBy === party) return fail("Tu ne peux pas répondre à ta propre offre.");
      return { ok: true, state: { ...state, status: 'counter_proposed', lastOfferBy: party } };

    case 'accept':
      if (!isOpenOffer(state.status)) return fail('Aucune offre en attente.');
      if (state.lastOfferBy === party) return fail("L'offre doit être acceptée par l'autre personne.");
      return { ok: true, state: { ...state, status: 'accepted' } };

    case 'reject':
      if (!isOpenOffer(state.status)) return fail('Aucune offre en attente.');
      if (state.lastOfferBy === party) return fail('Utilise « Annuler » pour retirer ta propre offre.');
      return { ok: true, state: { ...state, status: 'rejected' } };

    case 'cancel':
      if (isOpenOffer(state.status)) {
        if (state.lastOfferBy !== party) return fail("Utilise « Refuser » pour décliner l'offre reçue.");
        return { ok: true, state: { ...state, status: 'cancelled' } };
      }
      if (state.status === 'accepted') return { ok: true, state: { ...state, status: 'cancelled' } };
      if (state.status === 'awaiting_handover') {
        if (state.receiptConfirmedBy.length > 0) {
          return fail('Une réception a déjà été confirmée : ouvre un litige si besoin.');
        }
        return { ok: true, state: { ...state, status: 'cancelled' } };
      }
      return fail("Cet échange ne peut plus être annulé.");

    case 'confirm_handover_plan': {
      if (state.status !== 'accepted') return fail("L'échange doit d'abord être accepté.");
      const confirmed = addParty(state.handoverConfirmedBy, party);
      const bothConfirmed = confirmed.includes(party) && confirmed.includes(other(party));
      return {
        ok: true,
        state: { ...state, handoverConfirmedBy: confirmed, status: bothConfirmed ? 'awaiting_handover' : 'accepted' },
      };
    }

    case 'confirm_receipt': {
      if (state.status !== 'awaiting_handover') return fail("La remise n'a pas encore commencé.");
      const confirmed = addParty(state.receiptConfirmedBy, party);
      const bothConfirmed = confirmed.includes(party) && confirmed.includes(other(party));
      return {
        ok: true,
        state: { ...state, receiptConfirmedBy: confirmed, status: bothConfirmed ? 'completed' : 'awaiting_handover' },
      };
    }

    case 'open_dispute':
      if (state.status !== 'awaiting_handover') return fail('Un litige ne peut être ouvert que pendant la remise.');
      return { ok: true, state: { ...state, status: 'disputed' } };
  }
}
