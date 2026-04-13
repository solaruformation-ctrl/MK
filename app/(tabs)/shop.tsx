import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ShoppingBag, Watch, Dumbbell, Pill, Star, Heart } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

const categories = [
  { id: 'all', label: 'Tout', icon: ShoppingBag },
  { id: 'wearables', label: 'Montres', icon: Watch },
  { id: 'equipment', label: 'Équipement', icon: Dumbbell },
  { id: 'supplements', label: 'Compléments', icon: Pill },
];

type Product = {
  id: number;
  name: string;
  category: 'wearables' | 'equipment' | 'supplements';
  price: number;
  rating: number;
  reviews: number;
  description: string;
  image: string;
  discount?: number;
};

const products: Product[] = [
  {
    id: 1,
    name: 'Montre GPS Pro Runner',
    category: 'wearables',
    price: 299,
    rating: 4.8,
    reviews: 1243,
    description: 'Suivi GPS précis, moniteur cardiaque avancé, autonomie 14 jours',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 2,
    name: 'Protéine Whey Premium',
    category: 'supplements',
    price: 45,
    rating: 4.6,
    reviews: 892,
    description: '25g de protéine par dose, saveur chocolat, sans sucre ajouté',
    image: 'https://images.pexels.com/photos/4046719/pexels-photo-4046719.jpeg?auto=compress&cs=tinysrgb&w=800',
    discount: 15,
  },
  {
    id: 3,
    name: 'Tapis de Yoga Pro',
    category: 'equipment',
    price: 65,
    rating: 4.7,
    reviews: 567,
    description: 'Antidérapant, épais 6mm, écologique, sac de transport inclus',
    image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 4,
    name: 'Bracelet Fitness Connecté',
    category: 'wearables',
    price: 129,
    rating: 4.5,
    reviews: 2103,
    description: 'Suivi activité 24/7, notifications, étanche 50m',
    image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 5,
    name: 'Haltères Ajustables 20kg',
    category: 'equipment',
    price: 189,
    rating: 4.9,
    reviews: 445,
    description: 'Poids réglables 5-20kg, compact, revêtement anti-rayures',
    image: 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 6,
    name: 'BCAA Energy Boost',
    category: 'supplements',
    price: 35,
    rating: 4.4,
    reviews: 678,
    description: 'Acides aminés essentiels, récupération rapide, goût citron',
    image: 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 7,
    name: 'Montre Cardio Elite',
    category: 'wearables',
    price: 449,
    rating: 4.9,
    reviews: 856,
    description: 'ECG, oxymètre, coaching IA intégré, écran AMOLED',
    image: 'https://images.pexels.com/photos/267439/pexels-photo-267439.jpeg?auto=compress&cs=tinysrgb&w=800',
    discount: 10,
  },
  {
    id: 8,
    name: 'Bandes de Résistance Set',
    category: 'equipment',
    price: 29,
    rating: 4.6,
    reviews: 1567,
    description: '5 niveaux de résistance, latex naturel, sac de rangement',
    image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 9,
    name: 'Créatine Monohydrate',
    category: 'supplements',
    price: 28,
    rating: 4.7,
    reviews: 934,
    description: 'Pure micronisée, force et endurance, 60 doses',
    image: 'https://images.pexels.com/photos/6550835/pexels-photo-6550835.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function ShopScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.black, Colors.gray]}
        style={styles.header}>
        <Text style={styles.title}>Boutique</Text>
        <Text style={styles.subtitle}>Équipements recommandés pour vous</Text>
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContainer}>
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              activeOpacity={0.7}>
              <LinearGradient
                colors={isSelected ? [Colors.gold, Colors.goldDark] : [Colors.grayLight, Colors.grayLight]}
                style={styles.categoryChip}>
                <Icon
                  size={18}
                  color={isSelected ? Colors.black : Colors.grayText}
                  strokeWidth={2.5}
                />
                <Text style={[
                  styles.categoryLabel,
                  isSelected && styles.categoryLabelActive
                ]}>
                  {cat.label}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.productsScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsContainer}>
        {filteredProducts.map((product) => (
          <TouchableOpacity
            key={product.id}
            activeOpacity={0.8}>
            <View style={styles.productCard}>
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
                resizeMode="cover"
              />

              {product.discount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-{product.discount}%</Text>
                </View>
              )}

              <TouchableOpacity
                onPress={() => toggleFavorite(product.id)}
                style={styles.favoriteButton}
                activeOpacity={0.7}>
                <Heart
                  size={24}
                  color={favorites.has(product.id) ? Colors.error : Colors.white}
                  fill={favorites.has(product.id) ? Colors.error : 'none'}
                  strokeWidth={2.5}
                />
              </TouchableOpacity>

              <LinearGradient
                colors={[Colors.grayLight, Colors.gray]}
                style={styles.productInfo}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
                <View style={styles.productHeader}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color={Colors.gold} fill={Colors.gold} strokeWidth={0} />
                    <Text style={styles.ratingText}>{product.rating}</Text>
                    <Text style={styles.reviewsText}>({product.reviews})</Text>
                  </View>
                </View>

                <Text style={styles.productDescription}>
                  {product.description}
                </Text>

                <View style={styles.productFooter}>
                  <View style={styles.priceContainer}>
                    {product.discount && (
                      <Text style={styles.oldPrice}>{product.price}€</Text>
                    )}
                    <Text style={styles.price}>
                      {product.discount
                        ? Math.round(product.price * (1 - product.discount / 100))
                        : product.price}€
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.buyButton}
                    activeOpacity={0.8}>
                    <LinearGradient
                      colors={[Colors.gold, Colors.goldDark]}
                      style={styles.buyButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}>
                      <ShoppingBag size={18} color={Colors.black} strokeWidth={2.5} />
                      <Text style={styles.buyButtonText}>Acheter</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        ))}
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
  categoriesScroll: {
    maxHeight: 60,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    gap: 8,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.grayText,
  },
  categoryLabelActive: {
    color: Colors.black,
  },
  productsScroll: {
    flex: 1,
  },
  productsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  productCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gold + '30',
    backgroundColor: Colors.grayLight,
  },
  productImage: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.gray,
  },
  discountBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: Colors.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 2,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.white,
  },
  favoriteButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.black + '80',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  productInfo: {
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  productHeader: {
    marginBottom: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  reviewsText: {
    fontSize: 13,
    color: Colors.grayText,
    fontWeight: '600',
  },
  productDescription: {
    fontSize: 14,
    color: Colors.grayText,
    lineHeight: 20,
    marginBottom: 15,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  oldPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.grayText,
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.gold,
  },
  buyButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  buyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  buyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.black,
  },
});
