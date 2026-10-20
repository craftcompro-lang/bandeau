import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeftRight, Check, FlaskConical, MessageCircle, PackagePlus, SearchX, ShieldCheck } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExchangeItemCard } from '@/components/exchange/ExchangeItemCard';
import { SwapBadge } from '@/components/exchange/SwapBadge';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Sheet } from '@/components/layout/Sheet';
import { ListingPhoto } from '@/components/listing/ListingPhoto';
import { AppText, Button, ErrorView, Skeleton, StateView } from '@/components/ui';
import { listingsRepository } from '@/data/listings-repository';
import { CONDITIONS, type Listing } from '@/domain/listing';
import { useListing, useMyListings } from '@/features/listings/hooks';
import { colors, fontFamily, radii, screenPadding, spacing } from '@/theme';

const MESSAGE_MAX = 500;

export default function ProposeExchangeScreen() {
  const { listingId } = useLocalSearchParams<{ listingId: string }>();
  const target = useListing(listingId);
  const mine = useMyListings();
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [notice, setNotice] = useState<null | 'proposal' | 'chat'>(null);
  const [message, setMessage] = useState('');

  const myListings = mine.data ?? [];
  // Par défaut, le premier objet disponible de l'utilisateur.
  const myItem = myListings.find((l) => l.id === selectedId) ?? myListings[0] ?? null;

  const loading = target.isPending || mine.isPending;
  const error = target.error ?? mine.error;

  let content: React.ReactNode;
  if (loading) {
    content = (
      <View style={styles.body}>
        <Skeleton height={160} radius={radii.lg} />
        <Skeleton height={200} radius={radii.lg} />
      </View>
    );
  } else if (error) {
    content = <ErrorView error={error} onRetry={() => void Promise.all([target.refetch(), mine.refetch()])} />;
  } else if (!target.data) {
    content = <StateView icon={SearchX} title="Annonce introuvable" message="Cet objet n’est plus disponible." />;
  } else if (target.data.owner.id === listingsRepository.currentUserId()) {
    content = <StateView icon={SearchX} title="C’est ton annonce" message="Tu ne peux pas te proposer un échange." />;
  } else if (!myItem) {
    content = (
      <StateView
        icon={PackagePlus}
        title="Publie d’abord un objet"
        message="Pour proposer un échange, tu dois avoir au moins un objet disponible."
        actionLabel="Publier un objet"
        onAction={() => router.push('/publier')}
      />
    );
  } else {
    const theirItem = target.data;
    content = (
      <>
        <ScrollView
          contentContainerStyle={[styles.body, { paddingBottom: spacing.xxl }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ExchangeItemCard
            label="Ton objet"
            listing={myItem}
            onEdit={myListings.length > 1 ? () => setPickerOpen(true) : undefined}
          />
          <SwapBadge />
          <ExchangeItemCard label="Son objet" listing={theirItem} showOwner />

          <View style={styles.messageBlock}>
            <AppText variant="labelStrong">Message (facultatif)</AppText>
            <TextInput
              value={message}
              onChangeText={(t) => setMessage(t.slice(0, MESSAGE_MAX))}
              placeholder={`Bonjour ${theirItem.owner.username}, ton objet m’intéresse…`}
              placeholderTextColor={colors.inkTertiary}
              multiline
              maxLength={MESSAGE_MAX}
              style={styles.input}
              accessibilityLabel="Message accompagnant la proposition"
              maxFontSizeMultiplier={1.3}
            />
            <AppText variant="footnote" color="inkTertiary" align="right">
              {message.length}/{MESSAGE_MAX}
            </AppText>
          </View>

          <Pressable
            onPress={() => router.push('/protect')}
            accessibilityRole="link"
            style={({ pressed }) => [styles.protect, pressed && { opacity: 0.7 }]}
          >
            <ShieldCheck size={20} color={colors.violet} strokeWidth={2.2} />
            <AppText variant="caption" color="ink" style={styles.flex}>
              L’échange n’est confirmé que si vous l’acceptez tous les deux.{' '}
              <AppText variant="caption" color="violet">
                SWAP Protect
              </AppText>
            </AppText>
          </Pressable>
        </ScrollView>

        <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
          <Button label="Proposer l’échange" variant="exchange" icon={ArrowLeftRight} onPress={() => setNotice('proposal')} />
          <Button label="Discuter" variant="secondary" icon={MessageCircle} onPress={() => setNotice('chat')} />
        </View>
      </>
    );
  }

  return (
    <Screen edges={['top']}>
      <ScreenHeader title="Proposition d’échange" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {content}
      </KeyboardAvoidingView>

      <Sheet visible={pickerOpen} onClose={() => setPickerOpen(false)} title="Choisis ton objet">
        <View style={styles.pickerList}>
          {myListings.map((l) => (
            <PickerRow
              key={l.id}
              listing={l}
              selected={l.id === myItem?.id}
              onPress={() => {
                setSelectedId(l.id);
                setPickerOpen(false);
              }}
            />
          ))}
        </View>
      </Sheet>

      <Sheet
        visible={notice !== null}
        onClose={() => setNotice(null)}
        title="Mode démonstration"
        footer={<Button label="Compris" onPress={() => setNotice(null)} style={styles.flex} />}
      >
        <View style={styles.notice}>
          <FlaskConical size={22} color={colors.coralStrong} />
          <AppText variant="callout" style={styles.flex}>
            {notice === 'chat'
              ? 'La messagerie sera activée avec les comptes utilisateurs. Aucun message n’a été envoyé.'
              : 'Aucune proposition n’a été envoyée : les annonces et profils affichés sont fictifs. L’envoi réel sera activé avec les comptes et la base de données.'}
          </AppText>
        </View>
      </Sheet>
    </Screen>
  );
}

function PickerRow({ listing, selected, onPress }: { listing: Listing; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={listing.title}
      style={({ pressed }) => [styles.pickerRow, selected && styles.pickerRowSelected, pressed && { opacity: 0.8 }]}
    >
      <ListingPhoto listing={listing} style={styles.pickerPhoto} iconSize={22} />
      <View style={styles.flex}>
        <AppText variant="labelStrong" numberOfLines={1}>
          {listing.title}
        </AppText>
        <AppText variant="caption" color="inkSecondary">
          {CONDITIONS[listing.condition]}
        </AppText>
      </View>
      {selected ? <Check size={20} color={colors.violet} strokeWidth={2.6} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: { paddingHorizontal: screenPadding, paddingTop: spacing.sm, gap: spacing.lg },
  messageBlock: { gap: spacing.sm, marginTop: spacing.sm },
  input: {
    minHeight: 92,
    borderRadius: radii.md,
    backgroundColor: colors.mist,
    padding: spacing.md,
    paddingTop: spacing.md,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 21,
    color: colors.ink,
    textAlignVertical: 'top',
  },
  protect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.violetSoft,
  },
  actions: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.md,
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  pickerList: { gap: spacing.sm },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickerRowSelected: { borderColor: colors.violet, backgroundColor: colors.violetSoft },
  pickerPhoto: { width: 56, height: 56, borderRadius: radii.sm },
  notice: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
});
