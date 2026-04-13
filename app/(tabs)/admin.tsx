import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import { supabase, Video } from '@/lib/supabase';
import { Colors } from '@/constants/colors';
import { Plus, Edit, Trash2, X, Activity } from 'lucide-react-native';

export default function AdminScreen() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtube_url: '',
    thumbnail_url: '',
    category: 'workout',
    duration: '10 min',
    difficulty: 'intermediate',
    is_premium: false,
    order_index: 0,
  });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingVideo(null);
    setFormData({
      title: '',
      description: '',
      youtube_url: '',
      thumbnail_url: '',
      category: 'workout',
      duration: '10 min',
      difficulty: 'intermediate',
      is_premium: false,
      order_index: videos.length + 1,
    });
    setModalVisible(true);
  };

  const openEditModal = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      youtube_url: video.youtube_url,
      thumbnail_url: video.thumbnail_url,
      category: video.category,
      duration: video.duration,
      difficulty: video.difficulty,
      is_premium: video.is_premium,
      order_index: video.order_index,
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.youtube_url) {
      Alert.alert('Erreur', 'Le titre et l\'URL YouTube sont requis');
      return;
    }

    try {
      if (editingVideo) {
        const { error } = await supabase
          .from('videos')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingVideo.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('videos').insert([formData]);

        if (error) throw error;
      }

      setModalVisible(false);
      loadVideos();
    } catch (error) {
      console.error('Error saving video:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder la vidéo');
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Confirmer la suppression',
      'Voulez-vous vraiment supprimer cette vidéo ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.from('videos').delete().eq('id', id);

              if (error) throw error;
              loadVideos();
            } catch (error) {
              console.error('Error deleting video:', error);
              Alert.alert('Erreur', 'Impossible de supprimer la vidéo');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin - Vidéos</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Plus color="#000" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <Text style={styles.loadingText}>Chargement...</Text>
        ) : videos.length === 0 ? (
          <Text style={styles.emptyText}>Aucune vidéo</Text>
        ) : (
          videos.map((video) => (
            <View key={video.id} style={styles.videoCard}>
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle}>{video.title}</Text>
                <Text style={styles.videoDetails}>
                  {video.category} • {video.duration} • {video.difficulty}
                </Text>
                {video.is_premium && (
                  <Text style={styles.premiumBadge}>Premium</Text>
                )}
              </View>
              <View style={styles.videoActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openEditModal(video)}>
                  <Edit color="#4A90E2" size={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDelete(video.id)}>
                  <Trash2 color="#E74C3C" size={20} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingVideo ? 'Modifier la vidéo' : 'Ajouter une vidéo'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color="#666" size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.form}>
              <Text style={styles.label}>Titre *</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
                placeholder="Titre de la vidéo"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
                placeholder="Description de la vidéo"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />

              <Text style={styles.label}>URL YouTube *</Text>
              <TextInput
                style={styles.input}
                value={formData.youtube_url}
                onChangeText={(text) =>
                  setFormData({ ...formData, youtube_url: text })
                }
                placeholder="https://www.youtube.com/watch?v=..."
                placeholderTextColor="#999"
                autoCapitalize="none"
              />

              <Text style={styles.label}>URL Thumbnail</Text>
              <TextInput
                style={styles.input}
                value={formData.thumbnail_url}
                onChangeText={(text) =>
                  setFormData({ ...formData, thumbnail_url: text })
                }
                placeholder="https://..."
                placeholderTextColor="#999"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Catégorie</Text>
              <TextInput
                style={styles.input}
                value={formData.category}
                onChangeText={(text) =>
                  setFormData({ ...formData, category: text })
                }
                placeholder="workout, nutrition, tips..."
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Durée</Text>
              <TextInput
                style={styles.input}
                value={formData.duration}
                onChangeText={(text) =>
                  setFormData({ ...formData, duration: text })
                }
                placeholder="10 min"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Difficulté</Text>
              <TextInput
                style={styles.input}
                value={formData.difficulty}
                onChangeText={(text) =>
                  setFormData({ ...formData, difficulty: text })
                }
                placeholder="beginner, intermediate, advanced"
                placeholderTextColor="#999"
              />

              <View style={styles.switchRow}>
                <Text style={styles.label}>Premium</Text>
                <Switch
                  value={formData.is_premium}
                  onValueChange={(value) =>
                    setFormData({ ...formData, is_premium: value })
                  }
                  trackColor={{ false: '#767577', true: '#FFD700' }}
                  thumbColor={formData.is_premium ? '#FFF' : '#f4f3f4'}
                />
              </View>

              <Text style={styles.label}>Ordre d'affichage</Text>
              <TextInput
                style={styles.input}
                value={formData.order_index.toString()}
                onChangeText={(text) =>
                  setFormData({ ...formData, order_index: parseInt(text) || 0 })
                }
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>
                  {editingVideo ? 'Modifier' : 'Ajouter'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  videoCard: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  videoDetails: {
    fontSize: 14,
    color: '#999',
  },
  premiumBadge: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
    marginTop: 4,
  },
  videoActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  saveButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
