import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const isTogglingRef = useRef(false);

  // Load favorites from localStorage on mount (only if user is logged in)
  useEffect(() => {
    if (user) {
      loadFavoritesFromStorage();
    } else {
      setFavorites([]);
      setIsLoading(false);
    }
  }, [user]);

  // When user logs in, fetch from server and merge
  useEffect(() => {
    if (user && token) {
      console.log('👤 User logged in, fetching favorites from server...');
      fetchAndMergeFavorites();
    } else {
      console.log('👤 User logged out, clearing favorites...');
      setFavorites([]);
      setIsLoading(false);
    }
  }, [user, token]);

  const loadFavoritesFromStorage = () => {
    try {
      const stored = localStorage.getItem('favorites');
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('📂 Loaded favorites from localStorage:', parsed.length);
        setFavorites(parsed);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error loading favorites from storage:', error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFavoritesToStorage = (favoritesList) => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favoritesList));
      console.log('💾 Saved favorites to localStorage:', favoritesList.length);
    } catch (error) {
      console.error('Error saving favorites to storage:', error);
    }
  };

  const fetchAndMergeFavorites = async () => {
    if (!user || !token) {
      console.log('❌ Cannot fetch: User not logged in');
      return;
    }

    try {
      setIsLoading(true);
      console.log('📂 Fetching favorites from server...');
      
      const response = await axios.get('http://localhost:5000/api/auth/favorites', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const serverFavorites = response.data || [];
      console.log('📂 Server favorites loaded:', serverFavorites.length);
      
      // Get local favorites from localStorage
      const stored = localStorage.getItem('favorites');
      let localFavorites = [];
      if (stored) {
        try {
          localFavorites = JSON.parse(stored);
          console.log('📂 Local favorites loaded:', localFavorites.length);
        } catch (e) {
          console.error('Error parsing stored favorites:', e);
        }
      }
      
      // Create a map of server favorite IDs
      const serverIds = new Set();
      serverFavorites.forEach(p => {
        const id = p._id || p.id;
        if (id) serverIds.add(String(id));
      });
      
      // Keep local favorites that are video properties or not in server
      const localOnlyFavorites = localFavorites.filter(p => {
        const id = p._id || p.id;
        // Keep video properties
        if (String(id).startsWith('video_') || p.isVideo === true) {
          return true;
        }
        // Keep properties that are not in server
        return !serverIds.has(String(id));
      });
      
      // Merge: Server favorites + Local favorites that aren't in server
      const mergedFavorites = [...serverFavorites, ...localOnlyFavorites];
      
      console.log('📂 Server favorites:', serverFavorites.length);
      console.log('📂 Local only favorites kept:', localOnlyFavorites.length);
      console.log('📂 Total favorites after merge:', mergedFavorites.length);
      
      setFavorites(mergedFavorites);
      saveFavoritesToStorage(mergedFavorites);
    } catch (error) {
      console.error('❌ Error fetching server favorites:', error);
      if (error.response?.status === 401) {
        console.log('⚠️ Token expired');
      }
      // Don't clear favorites on error, keep localStorage data
    } finally {
      setIsLoading(false);
    }
  };

  const syncWithServer = async (propertyId, action) => {
    if (!user || !token) {
      console.log('❌ Cannot sync: User not logged in');
      return false;
    }

    // Skip sync for video properties
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(String(propertyId));
    if (!isValidObjectId) {
      console.log('📹 Video property, skipping server sync:', propertyId);
      return true;
    }

    try {
      setIsSyncing(true);
      console.log(`🔄 Syncing with server: ${action} for ${propertyId}`);
      
      const response = await axios.post(
        'http://localhost:5000/api/auth/favorites',
        { propertyId, action },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('✅ Sync successful:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Sync error:', error);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  const getPropertyId = (property) => {
    return property?._id || property?.id || null;
  };

  const isFavorited = (propertyId) => {
    if (!user) return false; // Only check favorites if user is logged in
    if (!propertyId) return false;
    const idStr = String(propertyId);
    return favorites.some(p => {
      const pId = p._id || p.id;
      return String(pId) === idStr;
    });
  };

  const isVideoProperty = (property) => {
    if (!property) return false;
    const id = property._id || property.id;
    return String(id).startsWith('video_') || property.isVideo === true;
  };

  const addToFavorites = async (property) => {
    if (!property) {
      console.error('❌ No property provided');
      return;
    }
    
    if (!user) {
      console.log('❌ User not logged in, cannot add favorites');
      return;
    }
    
    const propertyId = getPropertyId(property);
    if (!propertyId) {
      console.error('❌ No property ID found');
      return;
    }

    const idStr = String(propertyId);

    if (isFavorited(idStr)) {
      console.log('⚠️ Property already in favorites:', idStr);
      return;
    }

    const isVideo = isVideoProperty(property);
    
    const propertyToAdd = {
      ...property,
      _id: property._id || property.id || idStr,
      id: property.id || property._id || idStr,
      isVideo: isVideo
    };

    console.log('➕ Adding to favorites:', propertyToAdd.title || 'Property', idStr);

    // Update state and localStorage immediately
    setFavorites(prev => {
      const updated = [...prev, propertyToAdd];
      saveFavoritesToStorage(updated);
      return updated;
    });

    // Sync with server only for real properties
    if (!isVideo) {
      await syncWithServer(idStr, 'add');
    }
  };

  const removeFromFavorites = async (propertyId) => {
    if (!propertyId) {
      console.error('❌ No property ID provided');
      return;
    }
    
    if (!user) {
      console.log('❌ User not logged in, cannot remove favorites');
      return;
    }

    const idStr = String(propertyId);

    if (!isFavorited(idStr)) {
      console.log('⚠️ Property not in favorites:', idStr);
      return;
    }

    const property = favorites.find(p => {
      const pId = p._id || p.id;
      return String(pId) === idStr;
    });
    
    const isVideo = property ? isVideoProperty(property) : false;

    console.log('➖ Removing from favorites:', idStr);

    // Update state and localStorage immediately
    setFavorites(prev => {
      const updated = prev.filter(p => {
        const pId = p._id || p.id;
        return String(pId) !== idStr;
      });
      saveFavoritesToStorage(updated);
      return updated;
    });

    // Sync with server only for real properties
    if (!isVideo) {
      await syncWithServer(idStr, 'remove');
    }
  };

  const toggleFavorite = async (property) => {
    if (!property) {
      console.error('❌ No property provided');
      return;
    }

    if (!user) {
      console.log('❌ User not logged in');
      return;
    }

    const propertyId = getPropertyId(property);
    if (!propertyId) {
      console.error('❌ No property ID found');
      return;
    }

    const idStr = String(propertyId);
    
    if (isTogglingRef.current) {
      console.log('⏳ Toggle already in progress, skipping...');
      return;
    }

    isTogglingRef.current = true;
    
    console.log('🔄 Toggling favorite for:', property.title || 'Property', idStr);
    
    try {
      if (isFavorited(idStr)) {
        await removeFromFavorites(idStr);
      } else {
        await addToFavorites(property);
      }
    } catch (error) {
      console.error('❌ Toggle error:', error);
    } finally {
      setTimeout(() => {
        isTogglingRef.current = false;
      }, 500);
    }
  };

  const clearFavorites = async () => {
    if (!user) {
      console.log('❌ User not logged in, cannot clear favorites');
      return;
    }
    
    if (!window.confirm('Are you sure you want to clear all favorites?')) return;
    
    const ids = favorites.map(p => p._id || p.id).filter(Boolean);
    
    setFavorites([]);
    localStorage.removeItem('favorites');
    
    for (const id of ids) {
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(String(id));
      if (isValidObjectId) {
        await syncWithServer(id, 'remove');
      }
    }
    
    console.log('🗑️ All favorites cleared');
  };

  const refreshFavorites = async () => {
    if (user && token) {
      await fetchAndMergeFavorites();
    } else {
      setFavorites([]);
      setIsLoading(false);
    }
  };

  const getFavoriteCount = () => {
    if (!user) return 0; // Only return count if user is logged in
    return favorites.length;
  };

  return (
    <FavoritesContext.Provider value={{
      favorites: user ? favorites : [], // Only return favorites if user is logged in
      isLoading,
      isSyncing,
      isFavorited,
      toggleFavorite,
      addToFavorites,
      removeFromFavorites,
      clearFavorites,
      refreshFavorites,
      favoriteCount: getFavoriteCount(),
      isVideoProperty
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};