import React, { useState, useEffect } from 'react';
import { auth, firestore as db } from './firebase';
import { collection, getDocs, orderBy, query, doc, deleteDoc } from 'firebase/firestore';

// --- Style Objects for this page ---
const styles = {
  profilePage: {
    padding: '40px 20px',
    fontFamily: "'Montserrat', sans-serif",
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    minHeight: '100vh',
  },
  header: {
    fontSize: '3em',
    color: '#5c84abff',
    textAlign: 'center',
    marginBottom: '50px',
  },
  quoteList: {
    display: 'grid',
    // This creates a responsive grid that shows as many columns as will fit
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  quoteCard: {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 10px 25px rgba(178, 70, 70, 0.1)',
  },
  quoteText: {
    fontFamily: "'Lora', serif",
    fontSize: '1.5em',
    fontStyle: 'italic',
    color: '#2c3e50',
    marginBottom: '20px',
    minHeight: '100px', // Helps align cards a bit better
  },
  quoteAuthor: {
    textAlign: 'right',
    fontWeight: 'bold',
    color: '#34495e',
    display: 'block', // Ensures it takes its own line
  },
  deleteButton: {
    float: 'right',
    marginTop: '15px',
    padding: '8px 15px',
    fontSize: '0.9em',
    backgroundColor: '#3cabe7ff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  loadingOrEmptyText: {
    textAlign: 'center',
    fontSize: '1.5em',
    color: '#6c757d',
    marginTop: '50px',
  }
};


function ProfilePage() {
  const [favoriteQuotes, setFavoriteQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        try {
          const favoritesCollectionRef = collection(db, 'users', user.uid, 'favorites');
          const q = query(favoritesCollectionRef, orderBy('savedAt', 'desc'));
          const querySnapshot = await getDocs(q);
          const quotes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setFavoriteQuotes(quotes);
        } catch (err) {
          console.error("Error fetching favorites:", err);
          setError("Failed to load your favorite quotes.");
        }
      }
      setIsLoading(false);
    };
    fetchFavorites();
  }, [user]);

  const handleDeleteQuote = async (idToDelete) => {
    if (!user) return;
    try {
      const quoteDocRef = doc(db, 'users', user.uid, 'favorites', idToDelete);
      await deleteDoc(quoteDocRef);
      setFavoriteQuotes(prevQuotes => prevQuotes.filter(quote => quote.id !== idToDelete));
    } catch (error) {
      console.error("Error deleting quote: ", error);
      alert("Failed to delete quote.");
    }
  };

  if (isLoading) {
    return <div style={styles.loadingOrEmptyText}>Loading Your Favorites...</div>;
  }
  
  if (error) {
    return <div style={styles.loadingOrEmptyText}>{error}</div>;
  }

  return (
    <div style={styles.profilePage}>
      <h1 style={styles.header}>My Favorite Quotes</h1>
      {favoriteQuotes.length > 0 ? (
        <div style={styles.quoteList}>
          {favoriteQuotes.map(quote => (
            <div key={quote.id} style={styles.quoteCard}>
              <p style={styles.quoteText}>"{quote.quoteText}"</p>
              <span style={styles.quoteAuthor}>- {quote.quoteAuthor || 'Unknown'}</span>
              <button 
                style={styles.deleteButton} 
                onClick={() => handleDeleteQuote(quote.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.loadingOrEmptyText}>You haven't saved any quotes yet.</p>
      )}
    </div>
  );
}

export default ProfilePage;