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
      <View style={styles.emptyTextContainer}>
        <Text style={styles.emptyTitleBlack}>Crea Una</Text>
        <Text style={styles.emptyTitleBlue}>¡Lista!</Text>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        {user && (
          <View style={styles.avatar}>
            <Ionicons name="person" size={28} color={COLORS.gray} />
          </View>
        )}

        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder=""
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

        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={28} color={COLORS.darkGray} />
        </TouchableOpacity>
      </View>
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
    backgroundColor: COLORS.backgroundSecondary,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInput: {
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  searchingIndicator: {
    position: 'absolute',
    right: 12,
  },
  searchButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingBottom: 120,
  },
  emptyTextContainer: {
    alignItems: 'center',
  },
  emptyTitleBlack: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyTitleBlue: {
    fontSize: 56,
    fontWeight: '800',
    color: '#2196F3',
    textAlign: 'center',
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
