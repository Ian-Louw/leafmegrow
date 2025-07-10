import firestore from '@react-native-firebase/firestore';

class FirestoreService {
  constructor() {
    this.db = firestore();
  }

  // Add document with offline support
  async addDocument(collection, data) {
    try {
      const docRef = await this.db.collection(collection).add({
        ...data,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      console.log('Document added:', docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.log('Add document error:', error);
      return { success: false, error: error.message };
    }
  }

  // Real-time listener with offline support
  subscribeToCollection(collection, callback, userId = null) {
    let query = this.db.collection(collection);
    
    // Filter by user if provided
    if (userId) {
      query = query.where('userId', '==', userId);
    }
    
    // Order by creation date
    query = query.orderBy('createdAt', 'desc');
    
    return query.onSnapshot(
      (snapshot) => {
        const documents = [];
        snapshot.forEach((doc) => {
          documents.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        
        // Check data source and sync status
        const source = snapshot.metadata.fromCache ? 'cache' : 'server';
        const hasPendingWrites = snapshot.metadata.hasPendingWrites;
        
        console.log(`Data from ${source}: ${documents.length} documents, pending writes: ${hasPendingWrites}`);
        
        callback({ 
          success: true, 
          data: documents, 
          fromCache: snapshot.metadata.fromCache,
          hasPendingWrites: hasPendingWrites 
        });
      },
      (error) => {
        console.log('Subscription error:', error);
        callback({ success: false, error: error.message });
      }
    );
  }

  // Update document
  async updateDocument(collection, documentId, data) {
    try {
      await this.db.collection(collection).doc(documentId).update({
        ...data,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      console.log('Document updated:', documentId);
      return { success: true };
    } catch (error) {
      console.log('Update document error:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete document
  async deleteDocument(collection, documentId) {
    try {
      await this.db.collection(collection).doc(documentId).delete();
      console.log('Document deleted:', documentId);
      return { success: true };
    } catch (error) {
      console.log('Delete document error:', error);
      return { success: false, error: error.message };
    }
  }

  // Enable network (go online)
  async enableNetwork() {
    try {
      await this.db.enableNetwork();
      console.log('Network enabled - going online');
      return { success: true };
    } catch (error) {
      console.log('Enable network error:', error);
      return { success: false, error: error.message };
    }
  }

  // Disable network (go offline for testing)
  async disableNetwork() {
    try {
      await this.db.disableNetwork();
      console.log('Network disabled - going offline');
      return { success: true };
    } catch (error) {
      console.log('Disable network error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get documents from cache only (offline)
  async getCachedDocuments(collection, userId = null) {
    try {
      let query = this.db.collection(collection);
      
      if (userId) {
        query = query.where('userId', '==', userId);
      }
      
      const snapshot = await query.get({ source: 'cache' });
      const documents = [];
      
      snapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      
      console.log('Cached documents retrieved:', documents.length);
      return { success: true, data: documents };
    } catch (error) {
      console.log('Get cached documents error:', error);
      return { success: false, error: error.message };
    }
  }

  // Clear offline cache
  async clearCache() {
    try {
      await this.db.clearPersistence();
      console.log('Cache cleared');
      return { success: true };
    } catch (error) {
      console.log('Clear cache error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new FirestoreService();