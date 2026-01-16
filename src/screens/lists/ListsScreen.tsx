import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS, GRADIENTS } from '../../utils/colors';
import { useListsStore } from '../../store/listsStore';
import { useAuthStore } from '../../store/authStore';
import { useResponsive } from '../../utils/responsive';
import ListCard from '../../components/lists/ListCard';
import CreateListModal from '../../components/modals/CreateListModal';
import EditListModal from '../../components/modals/EditListModal';
import ShareListModal from '../../components/modals/ShareListModal';
import { ListsStackParamList, TodoList } from '../../types';

type Props = NativeStackScreenProps<ListsStackParamList, 'Lists'>;

export default function ListsScreen({ navigation }: Props) {
  const { user } = useAuthStore();
  const { lists, isLoading, fetchLists, searchLists, selectList } = useListsStore();
  const { isDesktop, isTablet } = useResponsive();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedListForEdit, setSelectedListForEdit] = useState<TodoList | null>(null);
  const [selectedListForShare, setSelectedListForShare] = useState<TodoList | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadLists();
  }, []);

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      performSearch(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const loadLists = async () => {
    try {
      await fetchLists();
    } catch (error) {
      console.error('Error loading lists:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLists();
    setRefreshing(false);
  };

  const performSearch = async (query: string) => {
    if (query.trim() === '' && lists.length > 0) {
      // Don't search if query is empty and we already have lists
      return;
    }

    setSearching(true);
    try {
      if (query.trim()) {
        await searchLists(query);
      } else {
        await fetchLists();
      }
    } catch (error) {
      console.error('Error searching lists:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleListPress = (list: TodoList) => {
    selectList(list);
    navigation.navigate('ListDetail', {
      listId: list.id,
      listName: list.name,
    });
  };

  const handleEditList = (list: TodoList) => {
    setSelectedListForEdit(list);
    setEditModalVisible(true);
  };

  const handleShareList = (list: TodoList) => {
    setSelectedListForShare(list);
    setShareModalVisible(true);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>¡Crea Una Lista!</Text>
      <Text style={styles.emptySubtitle}>
        Comienza organizando tus tareas
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => setCreateModalVisible(true)}>
        <Text style={styles.emptyButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <LinearGradient
      colors={GRADIENTS.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}>

      {/* Decorative elements */}
      <View style={styles.headerDecoration1} />
      <View style={styles.headerDecoration2} />

      <View style={styles.headerContent}>
        <View style={styles.headerTop}>
          <View style={styles.avatarContainer}>
            {user && (
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.firstName.charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
            )}
          </View>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar listas..."
                placeholderTextColor={COLORS.gray}
                value={searchQuery}
                onChangeText={handleSearchChange}
              />
              {searching && (
                <View style={styles.searchingIndicator}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                </View>
              )}
            </View>
          </View>
        </View>
        <Text style={styles.greeting}>
          👋 Hola, {user?.firstName || 'Usuario'}
        </Text>
        <View style={styles.subtitleContainer}>
          <Ionicons name="albums" size={16} color={COLORS.white} />
          <Text style={styles.subtitle}>
            {lists.length === 0
              ? 'No tienes listas aún'
              : `${lists.length} ${lists.length === 1 ? 'lista' : 'listas'}`}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );

  if (isLoading && lists.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}

      {lists.length === 0 && !searchQuery ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={lists}
          keyExtractor={(item) => item.id}
          key={isDesktop ? 'desktop-3-col' : isTablet ? 'tablet-2-col' : 'mobile-1-col'}
          numColumns={isDesktop ? 3 : isTablet ? 2 : 1}
          renderItem={({ item }) => (
            <View style={[
              styles.listCardWrapper,
              isDesktop && styles.listCardWrapperDesktop,
              isTablet && styles.listCardWrapperTablet,
            ]}>
              <ListCard
                list={item}
                onPress={() => handleListPress(item)}
                onEdit={() => handleEditList(item)}
                onShare={() => handleShareList(item)}
              />
            </View>
          )}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptySearchContainer}>
              <Text style={styles.emptySearchText}>
                No se encontraron listas
              </Text>
            </View>
          }
        />
      )}

      {/* FAB moved to CustomTabBar for global access */}

      <CreateListModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSuccess={() => loadLists()}
      />

      <EditListModal
        visible={editModalVisible}
        list={selectedListForEdit}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedListForEdit(null);
        }}
        onSuccess={() => loadLists()}
      />

      <ShareListModal
        visible={shareModalVisible}
        list={selectedListForShare}
        onClose={() => {
          setShareModalVisible(false);
          setSelectedListForShare(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  headerDecoration1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -80,
    right: -50,
  },
  headerDecoration2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -40,
    left: -30,
  },
  headerContent: {
    zIndex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  avatarContainer: {
    width: 56,
    height: 56,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.white,
  },
  searchContainer: {
    flex: 1,
  },
  searchInputContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  searchingIndicator: {
    marginLeft: 8,
  },
  greeting: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 10,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    opacity: 0.95,
  },
  listContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  listCardWrapper: {
    flex: 1,
  },
  listCardWrapperTablet: {
    paddingHorizontal: 8,
    maxWidth: '50%',
  },
  listCardWrapperDesktop: {
    paddingHorizontal: 10,
    maxWidth: '33.333%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 18,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 40,
  },
  emptyButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  emptyButtonText: {
    fontSize: 48,
    color: COLORS.white,
    fontWeight: '300',
  },
  emptySearchContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptySearchText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
  },
});
