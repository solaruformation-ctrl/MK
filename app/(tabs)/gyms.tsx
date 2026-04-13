import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Star, Phone, Clock, CheckCircle, Navigation, Filter } from 'lucide-react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

type Gym = {
  id: number;
  name: string;
  address: string;
  city: string;
  region: string;
  rating: number;
  distance: number;
  image: string;
  certified: boolean;
  equipment: string[];
  openingHours: string;
  phone: string;
  lat: number;
  lng: number;
};

const gyms: Gym[] = [
  {
    id: 1,
    name: 'MK Form Paris Centre',
    address: '45 Rue de Rivoli',
    city: 'Paris',
    region: 'Île-de-France',
    rating: 4.8,
    distance: 1.2,
    image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
    certified: true,
    equipment: ['HIIT', 'Musculation', 'Cardio'],
    openingHours: '6h - 23h',
    phone: '+33 1 42 60 30 30',
    lat: 48.8566,
    lng: 2.3522,
  },
  {
    id: 2,
    name: 'Fitness Zone Lyon',
    address: '12 Place Bellecour',
    city: 'Lyon',
    region: 'Auvergne-Rhône-Alpes',
    rating: 4.6,
    distance: 5.8,
    image: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800',
    certified: true,
    equipment: ['Crossfit', 'Yoga', 'Musculation'],
    openingHours: '7h - 22h',
    phone: '+33 4 78 42 15 15',
    lat: 45.7640,
    lng: 4.8357,
  },
  {
    id: 3,
    name: 'Body Temple Marseille',
    address: '88 Avenue du Prado',
    city: 'Marseille',
    region: 'Provence-Alpes-Côte d\'Azur',
    rating: 4.5,
    distance: 3.4,
    image: 'https://images.pexels.com/photos/3838937/pexels-photo-3838937.jpeg?auto=compress&cs=tinysrgb&w=800',
    certified: true,
    equipment: ['HIIT', 'Cardio', 'Boxing'],
    openingHours: '6h - 22h',
    phone: '+33 4 91 71 20 20',
    lat: 43.2965,
    lng: 5.3698,
  },
  {
    id: 4,
    name: 'Power Gym Toulouse',
    address: '25 Rue de Metz',
    city: 'Toulouse',
    region: 'Occitanie',
    rating: 4.7,
    distance: 2.1,
    image: 'https://images.pexels.com/photos/2247179/pexels-photo-2247179.jpeg?auto=compress&cs=tinysrgb&w=800',
    certified: true,
    equipment: ['Musculation', 'Cardio', 'Coaching'],
    openingHours: '6h - 23h',
    phone: '+33 5 61 23 45 67',
    lat: 43.6047,
    lng: 1.4442,
  },
  {
    id: 5,
    name: 'Elite Fitness Nice',
    address: '10 Promenade des Anglais',
    city: 'Nice',
    region: 'Provence-Alpes-Côte d\'Azur',
    rating: 4.9,
    distance: 0.8,
    image: 'https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=800',
    certified: true,
    equipment: ['HIIT', 'Yoga', 'Pilates', 'Cardio'],
    openingHours: '5h30 - 23h30',
    phone: '+33 4 93 87 65 43',
    lat: 43.7102,
    lng: 7.2620,
  },
  {
    id: 6,
    name: 'Urban Gym Bordeaux',
    address: '33 Cours de l\'Intendance',
    city: 'Bordeaux',
    region: 'Nouvelle-Aquitaine',
    rating: 4.4,
    distance: 4.2,
    image: 'https://images.pexels.com/photos/3253501/pexels-photo-3253501.jpeg?auto=compress&cs=tinysrgb&w=800',
    certified: true,
    equipment: ['Crossfit', 'Musculation', 'Cardio'],
    openingHours: '7h - 22h',
    phone: '+33 5 56 44 33 22',
    lat: 44.8378,
    lng: -0.5792,
  },
  {
    id: 7,
    name: 'Gym Premium Strasbourg',
    address: '15 Place Kléber',
    city: 'Strasbourg',
    region: 'Grand Est',
    rating: 4.6,
    distance: 6.5,
    image: 'https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&w=800',
    certified: true,
    equipment: ['HIIT', 'Musculation', 'Boxing'],
    openingHours: '6h - 22h',
    phone: '+33 3 88 32 10 10',
    lat: 48.5734,
    lng: 7.7521,
  },
  {
    id: 8,
    name: 'Fitness Club Nantes',
    address: '20 Rue Crébillon',
    city: 'Nantes',
    region: 'Pays de la Loire',
    rating: 4.5,
    distance: 3.9,
    image: 'https://images.pexels.com/photos/3838907/pexels-photo-3838907.jpeg?auto=compress&cs=tinysrgb&w=800',
    certified: true,
    equipment: ['Yoga', 'Cardio', 'Coaching'],
    openingHours: '7h - 21h',
    phone: '+33 2 40 47 89 89',
    lat: 47.2184,
    lng: -1.5536,
  },
];

const regions = [
  'Toutes',
  'Île-de-France',
  'Auvergne-Rhône-Alpes',
  'Provence-Alpes-Côte d\'Azur',
  'Occitanie',
  'Nouvelle-Aquitaine',
  'Grand Est',
  'Pays de la Loire',
];

export default function GymsScreen() {
  const [selectedRegion, setSelectedRegion] = useState('Toutes');
  const [showFilters, setShowFilters] = useState(false);

  const filteredGyms = gyms.filter(gym =>
    selectedRegion === 'Toutes' || gym.region === selectedRegion
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.black, Colors.gray]}
        style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Salles Partenaires</Text>
            <Text style={styles.subtitle}>{filteredGyms.length} salles certifiées MK Form</Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            activeOpacity={0.7}>
            <View style={styles.filterButton}>
              <Filter size={20} color={Colors.gold} strokeWidth={2.5} />
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.mapContainer}>
        <View style={styles.franceMap}>
          <Svg width="100%" height="100%" viewBox="0 0 400 450">
            <Path
              d="M 180 40 L 220 50 L 250 45 L 280 55 L 310 65 L 330 85 L 350 110 L 360 140 L 365 170 L 360 200 L 350 230 L 340 260 L 320 290 L 290 310 L 260 320 L 230 330 L 200 340 L 170 345 L 140 340 L 110 330 L 85 315 L 65 295 L 50 270 L 40 240 L 35 210 L 35 180 L 40 150 L 50 120 L 65 95 L 85 75 L 110 60 L 140 48 Z"
              fill={Colors.grayLight}
              stroke={Colors.gold}
              strokeWidth="2"
            />
            {filteredGyms.map((gym) => {
              const x = ((gym.lng + 5) / 15) * 400;
              const y = ((52 - gym.lat) / 10) * 450;
              return (
                <G key={gym.id}>
                  <Circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill={Colors.gold}
                    opacity="0.8"
                  />
                  <Circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill={Colors.white}
                  />
                </G>
              );
            })}
          </Svg>
        </View>
        <LinearGradient
          colors={['transparent', Colors.black + 'DD']}
          style={styles.mapOverlay}>
          <View style={styles.mapInfo}>
            <MapPin size={20} color={Colors.gold} strokeWidth={2.5} />
            <Text style={styles.mapInfoText}>{filteredGyms.length} salles disponibles</Text>
          </View>
        </LinearGradient>
      </View>

      {showFilters && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContainer}>
          {regions.map((region) => {
            const isSelected = selectedRegion === region;
            return (
              <TouchableOpacity
                key={region}
                onPress={() => setSelectedRegion(region)}
                activeOpacity={0.7}>
                <LinearGradient
                  colors={isSelected ? [Colors.gold, Colors.goldDark] : [Colors.grayLight, Colors.grayLight]}
                  style={styles.filterChip}>
                  <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                    {region}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <ScrollView
        style={styles.gymsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gymsListContent}>
        {filteredGyms.map((gym) => (
          <TouchableOpacity key={gym.id} activeOpacity={0.8}>
            <View style={styles.gymCard}>
              <Image
                source={{ uri: gym.image }}
                style={styles.gymImage}
                resizeMode="cover"
              />

              {gym.certified && (
                <View style={styles.certifiedBadge}>
                  <CheckCircle size={16} color={Colors.success} fill={Colors.success} strokeWidth={0} />
                  <Text style={styles.certifiedText}>Certifié</Text>
                </View>
              )}

              <View style={styles.distanceBadge}>
                <Navigation size={14} color={Colors.white} strokeWidth={2.5} />
                <Text style={styles.distanceText}>{gym.distance} km</Text>
              </View>

              <LinearGradient
                colors={[Colors.grayLight, Colors.gray]}
                style={styles.gymInfo}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
                <View style={styles.gymHeader}>
                  <View style={styles.gymTitleContainer}>
                    <Text style={styles.gymName}>{gym.name}</Text>
                    <View style={styles.gymRating}>
                      <Star size={14} color={Colors.gold} fill={Colors.gold} strokeWidth={0} />
                      <Text style={styles.ratingText}>{gym.rating}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.gymAddress}>
                  <MapPin size={14} color={Colors.grayText} strokeWidth={2.5} />
                  <Text style={styles.addressText}>{gym.address}, {gym.city}</Text>
                </View>

                <View style={styles.gymEquipment}>
                  {gym.equipment.map((eq, index) => (
                    <View key={index} style={styles.equipmentTag}>
                      <Text style={styles.equipmentText}>{eq}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.gymFooter}>
                  <View style={styles.gymFooterItem}>
                    <Clock size={14} color={Colors.gold} strokeWidth={2.5} />
                    <Text style={styles.footerText}>{gym.openingHours}</Text>
                  </View>
                  <View style={styles.gymFooterItem}>
                    <Phone size={14} color={Colors.gold} strokeWidth={2.5} />
                    <Text style={styles.footerText}>Contacter</Text>
                  </View>
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
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gold,
    fontWeight: '600',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  mapContainer: {
    height: 120,
    backgroundColor: Colors.gray,
    position: 'relative',
  },
  franceMap: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: 'flex-end',
    padding: 15,
  },
  mapInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.black + '80',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  mapInfoText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  filtersScroll: {
    maxHeight: 60,
    backgroundColor: Colors.black,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.grayText,
  },
  filterChipTextActive: {
    color: Colors.black,
  },
  gymsList: {
    flex: 1,
  },
  gymsListContent: {
    padding: 20,
  },
  gymCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gold + '30',
    backgroundColor: Colors.grayLight,
  },
  gymImage: {
    width: '100%',
    height: 140,
    backgroundColor: Colors.gray,
  },
  certifiedBadge: {
    position: 'absolute',
    top: 15,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  certifiedText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.success,
  },
  distanceBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.black + '80',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  gymInfo: {
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  gymHeader: {
    marginBottom: 12,
  },
  gymTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gymName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
    flex: 1,
    marginRight: 10,
  },
  gymRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.gold + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.gold,
  },
  gymAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 15,
  },
  addressText: {
    fontSize: 13,
    color: Colors.grayText,
    fontWeight: '600',
    flex: 1,
  },
  gymEquipment: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  equipmentTag: {
    backgroundColor: Colors.gold + '20',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  equipmentText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.gold,
  },
  gymFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.gold + '20',
  },
  gymFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    color: Colors.gold,
    fontWeight: '600',
  },
});
