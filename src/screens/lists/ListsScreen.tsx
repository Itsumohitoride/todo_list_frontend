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
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../utils/colors';
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
      colors={[COLORS.primary, COLORS.primaryLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>
              Hola, {user?.firstName || 'Usuario'} 👋
            </Text>
            <Text style={styles.subtitle}>
              {lists.length === 0
                ? 'No tienes listas aún'
                : `${lists.length} ${lists.length === 1 ? 'lista' : 'listas'}`}
            </Text>
          </View>
          {user && (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.firstName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.searchWrapper}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar listas..."
            placeholderTextColor={COLORS.textLight}
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
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    paddingHorizontal: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 3,
    borderColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 6,
    ...(Platform.OS === 'web' && {
      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }),
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  searchingIndicator: {
    marginLeft: 8,
  },
  listContainer: {
    padding: 20,
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
