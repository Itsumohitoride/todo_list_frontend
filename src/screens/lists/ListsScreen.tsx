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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '../../utils/colors';
import { useListsStore } from '../../store/listsStore';
import { useAuthStore } from '../../store/authStore';
import ListCard from '../../components/lists/ListCard';
import CreateListModal from '../../components/modals/CreateListModal';
import EditListModal from '../../components/modals/EditListModal';
import ShareListModal from '../../components/modals/ShareListModal';
import { ListsStackParamList, TodoList } from '../../types';

type Props = NativeStackScreenProps<ListsStackParamList, 'Lists'>;

export default function ListsScreen({ navigation }: Props) {
  const { user } = useAuthStore();
  const { lists, isLoading, fetchLists, searchLists, selectList } = useListsStore();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedListForEdit, setSelectedListForEdit] = useState<TodoList | null>(null);
  const [selectedListForShare, setSelectedListForShare] = useState<TodoList | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLists();
  }, []);

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

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    try {
      if (query.trim()) {
        await searchLists(query);
      } else {
        await fetchLists();
      }
    } catch (error) {
      console.error('Error searching lists:', error);
    }
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
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.avatarContainer}>
          {user && (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.firstName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar listas..."
            placeholderTextColor={COLORS.gray}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>
      <Text style={styles.greeting}>
        Hola, {user?.firstName || 'Usuario'}
      </Text>
      <Text style={styles.subtitle}>
        {lists.length === 0
          ? 'No tienes listas aún'
          : `Tienes ${lists.length} ${lists.length === 1 ? 'lista' : 'listas'}`}
      </Text>
    </View>
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
          renderItem={({ item }) => (
            <ListCard
              list={item}
              onPress={() => handleListPress(item)}
              onEdit={() => handleEditList(item)}
              onShare={() => handleShareList(item)}
            />
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
    backgroundColor: COLORS.white,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 15,
  },
  avatarContainer: {
    width: 50,
    height: 50,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  searchContainer: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: COLORS.background,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.black,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
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
