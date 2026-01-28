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
import JoinSharedListModal from '../../components/modals/JoinSharedListModal';
import { ListsStackParamList, TodoList } from '../../types';

type Props = NativeStackScreenProps<ListsStackParamList, 'Lists'>;

export default function ListsScreen({ navigation }: Props) {
  const { user } = useAuthStore();
  const { lists, isLoading, fetchLists, searchLists, selectList } = useListsStore();
  const { isDesktop, isTablet } = useResponsive();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
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
        <Text style={styles.emptyTitleBlack}>Create a</Text>
        <Text style={styles.emptyTitleBlue}>List!</Text>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>Lists</Text>
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => setJoinModalVisible(true)}>
          <Ionicons name="link-outline" size={20} color={COLORS.accent} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color={COLORS.inkLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search lists..."
          placeholderTextColor={COLORS.inkFaded}
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
        {searching && (
          <View style={styles.searchingIndicator}>
            <ActivityIndicator size="small" color={COLORS.accent} />
          </View>
        )}
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
                No lists found
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

      <JoinSharedListModal
        visible={joinModalVisible}
        onClose={() => setJoinModalVisible(false)}
        onSuccess={(listId) => {
          loadLists();
          // Optionally navigate to the newly joined list
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
    backgroundColor: COLORS.parchment,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.ink,
    letterSpacing: 0.5,
  },
  joinButton: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.ink,
    letterSpacing: 0.2,
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
    paddingBottom: 120,
  },
  emptyTextContainer: {
    alignItems: 'center',
  },
  emptyTitleBlack: {
    fontSize: 40,
    fontWeight: '600',
    color: COLORS.ink,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  emptyTitleBlue: {
    fontSize: 44,
    fontWeight: '600',
    color: COLORS.accent,
    textAlign: 'center',
    letterSpacing: 0.5,
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
