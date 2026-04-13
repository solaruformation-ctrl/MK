import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Zap, TrendingUp, Crown, Video } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

type PricingTier = {
  id: string;
  name: string;
  price: number;
  period: string;
  icon: any;
  color: string;
  features: string[];
  popular?: boolean;
};

const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    period: 'mois',
    icon: Zap,
    color: Colors.grayText,
    features: [
      'Accès aux programmes de base',
      'Suivi de progression',
      'Coach IA Maïa limité',
      'Communauté',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 9.99,
    period: 'mois',
    icon: TrendingUp,
    color: Colors.success,
    features: [
      'Tous les programmes de base',
      'Suivi avancé des performances',
      'Coach IA Maïa complet',
      'Plans nutritionnels personnalisés',
      'Accès prioritaire communauté',
      'Support par email',
    ],
  },
  {
    id: 'advanced',
    name: 'Avancé',
    price: 29.99,
    period: 'mois',
    icon: Video,
    color: Colors.warning,
    popular: true,
    features: [
      'Programmes et vidéos avancés',
      'Programmes personnalisés IA',
      'Analyses détaillées des performances',
      'Plans nutritionnels sur mesure',
      'Accès aux masterclass exclusives',
      'Remises boutique 15%',
      'Support prioritaire 24/7',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 49.99,
    period: 'mois',
    icon: Crown,
    color: Colors.gold,
    features: [
      'Tout de l\'offre Avancé',
      'Séances de coaching en visio',
      '2 sessions personnelles/mois',
      'Suivi individualisé par coach',
      'Programmes 100% personnalisés',
      'Remises boutique 25%',
      'Accès anticipé nouvelles fonctionnalités',
      'Support VIP dédié',
    ],
  },
];

export default function PricingScreen() {
  const [selectedTier, setSelectedTier] = useState<string>('free');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.black, Colors.gray]}
        style={styles.header}>
        <Text style={styles.title}>Offres</Text>
        <Text style={styles.subtitle}>Choisissez le plan qui vous correspond</Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        {pricingTiers.map((tier) => {
          const Icon = tier.icon;
          const isSelected = selectedTier === tier.id;

          return (
            <TouchableOpacity
              key={tier.id}
              activeOpacity={0.9}
              onPress={() => setSelectedTier(tier.id)}>
              <View style={[
                styles.tierCard,
                tier.popular && styles.tierCardPopular,
                isSelected && styles.tierCardSelected,
              ]}>
                {tier.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>POPULAIRE</Text>
                  </View>
                )}

                <LinearGradient
                  colors={
                    tier.id === 'premium'
                      ? [Colors.gold + '20', Colors.goldDark + '10']
                      : [Colors.grayLight, Colors.gray]
                  }
                  style={styles.tierGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}>
                  <View style={styles.tierHeader}>
                    <View style={[
                      styles.tierIcon,
                      { backgroundColor: tier.color + '20' }
                    ]}>
                      <Icon size={32} color={tier.color} strokeWidth={2.5} />
                    </View>
                    <View style={styles.tierTitleContainer}>
                      <Text style={styles.tierName}>{tier.name}</Text>
                      <View style={styles.tierPriceContainer}>
                        <Text style={styles.tierPrice}>{tier.price}€</Text>
                        <Text style={styles.tierPeriod}>/ {tier.period}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.featuresContainer}>
                    {tier.features.map((feature, index) => (
                      <View key={index} style={styles.featureRow}>
                        <View style={styles.checkIcon}>
                          <Check size={18} color={tier.color} strokeWidth={3} />
                        </View>
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.selectButton}
                    activeOpacity={0.8}
                    onPress={() => setSelectedTier(tier.id)}>
                    <LinearGradient
                      colors={
                        isSelected
                          ? [Colors.gold, Colors.goldDark]
                          : tier.id === 'premium'
                          ? [Colors.gold + '40', Colors.goldDark + '40']
                          : [Colors.grayLight, Colors.gray]
                      }
                      style={styles.selectButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}>
                      <Text style={[
                        styles.selectButtonText,
                        isSelected && styles.selectButtonTextActive
                      ]}>
                        {isSelected ? 'Offre sélectionnée' : tier.price === 0 ? 'Commencer gratuitement' : 'Choisir cette offre'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.guaranteeSection}>
          <View style={styles.guaranteeIcon}>
            <Check size={24} color={Colors.gold} strokeWidth={3} />
          </View>
          <View style={styles.guaranteeTextContainer}>
            <Text style={styles.guaranteeTitle}>Garantie satisfait ou remboursé</Text>
            <Text style={styles.guaranteeText}>
              Essayez sans risque pendant 14 jours. Annulation possible à tout moment.
            </Text>
          </View>
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Questions fréquentes</Text>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Puis-je changer d'offre à tout moment ?</Text>
            <Text style={styles.faqAnswer}>
              Oui, vous pouvez passer à une offre supérieure ou inférieure à tout moment depuis votre profil.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Comment fonctionnent les séances de coaching en visio ?</Text>
            <Text style={styles.faqAnswer}>
              Les abonnés Premium bénéficient de 2 sessions d'1 heure par mois avec un coach certifié via visioconférence.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>L'offre gratuite est-elle limitée dans le temps ?</Text>
            <Text style={styles.faqAnswer}>
              Non, l'offre gratuite est disponible sans limite de temps avec accès aux fonctionnalités de base.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gold,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  tierCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.gold + '30',
  },
  tierCardPopular: {
    borderColor: Colors.warning,
    borderWidth: 3,
  },
  tierCardSelected: {
    borderColor: Colors.gold,
    borderWidth: 3,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.warning,
    paddingVertical: 8,
    zIndex: 1,
    alignItems: 'center',
  },
  popularText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.black,
    letterSpacing: 1,
  },
  tierGradient: {
    padding: 20,
    paddingTop: 25,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  tierIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  tierTitleContainer: {
    flex: 1,
  },
  tierName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 5,
  },
  tierPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  tierPrice: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.gold,
  },
  tierPeriod: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.grayText,
    marginLeft: 5,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gold + '30',
    marginBottom: 20,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.gold + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: Colors.white,
    lineHeight: 22,
    fontWeight: '600',
  },
  selectButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  selectButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.grayText,
  },
  selectButtonTextActive: {
    color: Colors.black,
  },
  guaranteeSection: {
    flexDirection: 'row',
    backgroundColor: Colors.grayLight,
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  guaranteeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gold + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  guaranteeTextContainer: {
    flex: 1,
  },
  guaranteeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.gold,
    marginBottom: 5,
  },
  guaranteeText: {
    fontSize: 14,
    color: Colors.grayText,
    lineHeight: 20,
  },
  faqSection: {
    marginBottom: 20,
  },
  faqTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 20,
  },
  faqItem: {
    backgroundColor: Colors.grayLight,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 10,
  },
  faqAnswer: {
    fontSize: 14,
    color: Colors.grayText,
    lineHeight: 20,
  },
});
