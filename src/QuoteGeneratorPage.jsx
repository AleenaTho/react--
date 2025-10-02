import React, { useState, useEffect } from 'react';
import { auth, firestore as db } from './firebase'; 
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';

// --- Style Objects for Inline Styling ---
const styles = {
  pageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '90vh',
    padding: '20px',
    backgroundColor: '#eef2f7',
    fontFamily: 'Georgia, serif',
  },
  quoteContainer: {
    background: '#ffffff',
    padding: '3rem 3.5rem',
    borderRadius: '15px',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.12)',
    maxWidth: '700px',
    width: '100%',
    textAlign: 'center',
    borderLeft: '8px solid #4a90e2',
  },
  quoteText: {
    fontSize: '2em',
    fontStyle: 'italic',
    color: '#4a90e2',
    marginBottom: '1.5rem',
    lineHeight: 1.5,
  },
  quoteAuthor: {
    display: 'block',
    textAlign: 'right',
    fontSize: '1.25em',
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: '2.5rem',
  },
  quoteActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  button: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1em',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#4a90e2',
    cursor: 'pointer',
  },
};

// This is our local "mock" API to provide quotes without needing the internet
const getMockQuote = () => {
  // An array of 100+ quotes for a rich offline experience
  const mockQuotes = [
    { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { content: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
    { content: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { content: "Get busy living or get busy dying.", author: "Stephen King" },
    { content: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
    { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { content: "It is our choices that show what we truly are, far more than our abilities.", author: "J.K. Rowling" },
    { content: "The only thing we have to fear is fear itself.", author: "Franklin D. Roosevelt" },
    { content: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
    { content: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", author: "Ralph Waldo Emerson" },
    { content: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost" },
    { content: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
    { content: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { content: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
    { content: "If life were predictable it would cease to be life, and be without flavor.", author: "Eleanor Roosevelt" },
    { content: "It does not do to dwell on dreams and forget to live.", author: "J.K. Rowling" },
    { content: "That which does not kill us makes us stronger.", author: "Friedrich Nietzsche" },
    { content: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
    { content: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas A. Edison" },
    { content: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
    { content: "Dream big and dare to fail.", author: "Norman Vaughan" },
    { content: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
    { content: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { content: "An unexamined life is not worth living.", author: "Socrates" },
    { content: "Eighty percent of success is showing up.", author: "Woody Allen" },
    { content: "Your imagination is your preview of life’s coming attractions.", author: "Albert Einstein" },
    { content: "The mind is everything. What you think you become.", author: "Buddha" },
    { content: "The best revenge is massive success.", author: "Frank Sinatra" },
    { content: "I am not a product of my circumstances. I am a product of my decisions.", author: "Stephen Covey" },
    { content: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
    { content: "Everything you’ve ever wanted is on the other side of fear.", author: "George Addair" },
    { content: "Believe you can and you’re halfway there.", author: "Theodore Roosevelt" },
    { content: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
    { content: "The question isn’t who is going to let me; it’s who is going to stop me.", author: "Ayn Rand" },
    { content: "When you have a dream, you've got to grab it and never let go.", author: "Carol Burnett" },
    { content: "There is nothing impossible to they who will try.", author: "Alexander the Great" },
    { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { content: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
    { content: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { content: "It’s not whether you get knocked down, it’s whether you get up.", author: "Vince Lombardi" },
    { content: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington" },
    { content: "What we think, we become.", author: "Buddha" },
    { content: "The hard days are what make you stronger.", author: "Aly Raisman" },
    { content: "If you are not willing to risk the usual, you will have to settle for the ordinary.", author: "Jim Rohn" },
    { content: "You miss 100% of the shots you don’t take.", author: "Wayne Gretzky" },
    { content: "The future starts today, not tomorrow.", author: "Pope John Paul II" },
    { content: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
    { content: "Do not let what you cannot do interfere with what you can do.", author: "John Wooden" },
    { content: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
    { content: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
    { content: "Character cannot be developed in ease and quiet. Only through experience of trial and suffering can the soul be strengthened, ambition inspired, and success achieved.", author: "Helen Keller" },
    { content: "A creative man is motivated by the desire to achieve, not by the desire to beat others.", author: "Ayn Rand" },
    { content: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
    { content: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
    { content: "Genius is one percent inspiration and ninety-nine percent perspiration.", author: "Thomas A. Edison" },
    { content: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
    { content: "A man is but the product of his thoughts. What he thinks, he becomes.", author: "Mahatma Gandhi" },
    { content: "The two most important days in your life are the day you are born and the day you find out why.", author: "Mark Twain" },
    { content: "Life is 10% what happens to us and 90% how we react to it.", author: "Charles R. Swindoll" },
    { content: "There are no shortcuts to any place worth going.", author: "Beverly Sills" },
    { content: "Act as if what you do makes a difference. It does.", author: "William James" },
    { content: "Success is the sum of small efforts, repeated day-in and day-out.", author: "Robert Collier" },
    { content: "The best way to predict the future is to invent it.", author: "Alan Kay" },
    { content: "Don’t watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { content: "Keep your face always toward the sunshine—and shadows will fall behind you.", author: "Walt Whitman" },
    { content: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
    { content: "It is never too late to be what you might have been.", author: "George Eliot" },
    { content: "You can't use up creativity. The more you use, the more you have.", author: "Maya Angelou" },
    { content: "Build your own dreams, or someone else will hire you to build theirs.", author: "Farrah Gray" },
    { content: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
    { content: "In order to succeed, we must first believe that we can.", author: "Nikos Kazantzakis" },
    { content: "Everything you can imagine is real.", author: "Pablo Picasso" },
    { content: "Do one thing every day that scares you.", author: "Eleanor Roosevelt" },
    { content: "It’s no use going back to yesterday, because I was a different person then.", author: "Lewis Carroll" },
    { content: "Smart people learn from everything and everyone, average people from their experiences, stupid people already have all the answers.", author: "Socrates" },
    { content: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
    { content: "Magic is believing in yourself. If you can do that, you can make anything happen.", author: "Johann Wolfgang von Goethe" },
    { content: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
    { content: "No masterpiece was ever created by a lazy artist.", author: "Anonymous" },
    { content: "If you’re not stubborn, you’ll give up on experiments too soon. And if you’re not flexible, you’ll pound your head against the wall and you won’t see a different solution to a problem you’re trying to solve.", author: "Jeff Bezos" },
    { content: "If you can't explain it simply, you don't understand it well enough.", author: "Albert Einstein" },
    { content: "There is no substitute for hard work.", author: "Thomas A. Edison" },
    { content: "What is the essence of life? To serve others and to do good.", author: "Aristotle" },
    { content: "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate, to have it make some difference that you have lived and lived well.", author: "Ralph Waldo Emerson" },
    { content: "You must be the change you wish to see in the world.", author: "Mahatma Gandhi" },
    { content: "Our lives begin to end the day we become silent about things that matter.", author: "Martin Luther King, Jr." },
    { content: "Be kind, for everyone you meet is fighting a hard battle.", author: "Plato" },
    { content: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
    { content: "Happiness depends upon ourselves.", author: "Aristotle" },
    { content: "I can't go back to yesterday because I was a different person then.", author: "Lewis Carroll" },
    { content: "It is not the strongest of the species that survive, nor the most intelligent, but the one most responsive to change.", author: "Charles Darwin" },
    { content: "The best way out is always through.", author: "Robert Frost" },
    { content: "For every minute you are angry you lose sixty seconds of happiness.", author: "Ralph Waldo Emerson" },
    { content: "If you look at what you have in life, you'll always have more.", author: "Oprah Winfrey" },
    { content: "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.", author: "James Cameron" },
    { content: "You will face many defeats in life, but never let yourself be defeated.", author: "Maya Angelou" },
    { content: "The real test is not whether you avoid this failure, because you won't. It's whether you let it harden or shame you into inaction, or whether you learn from it; whether you choose to persevere.", author: "Barack Obama" },
    { content: "The man who does not read has no advantage over the man who cannot read.", author: "Mark Twain" },
    { content: "To learn to read is to light a fire; every syllable that is spelled out is a spark.", author: "Victor Hugo" },
    { content: "A reader lives a thousand lives before he dies. The man who never reads lives only one.", author: "George R.R. Martin" },
    { content: "Fairy tales are more than true: not because they tell us that dragons exist, but because they tell us that dragons can be beaten.", author: "Neil Gaiman" },
    { content: "Outside of a dog, a book is man's best friend. Inside of a dog it's too dark to read.", author: "Groucho Marx" },
    { content: "There is no friend as loyal as a book.", author: "Ernest Hemingway" },
    { content: "So many books, so little time.", author: "Frank Zappa" },
    { content: "A room without books is like a body without a soul.", author: "Marcus Tullius Cicero" },
  ];
  const randomIndex = Math.floor(Math.random() * mockQuotes.length);
  return mockQuotes[randomIndex];
};


function QuoteGeneratorPage() {
  const [quote, setQuote] = useState({ 
    quoteText: 'Loading...', 
    quoteAuthor: '' 
  });

  const getDailyQuote = async (currentUser) => {
    const today = new Date().toISOString().split('T')[0];
    const userDocRef = doc(db, 'users', currentUser.uid);

    try {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().dailyQuote?.date === today) {
        setQuote(userDoc.data().dailyQuote);
      } else {
        const data = getMockQuote();
        if (data && data.content) {
          const newQuote = {
            quoteText: data.content,
            quoteAuthor: data.author,
            date: today,
          };
          await setDoc(userDocRef, { dailyQuote: newQuote }, { merge: true });
          setQuote(newQuote);
        }
      }
    } catch (error) {
      console.error("Error in getDailyQuote:", error);
    }
  };

  const handleNewQuote = () => {
    const newMockQuote = getMockQuote();
    setQuote({
      quoteText: newMockQuote.content,
      quoteAuthor: newMockQuote.author,
    });
  };
  const handleSaveFavorite = async () => {
    const user = auth.currentUser;
    if (!user || !quote.quoteText) { 
      alert("Cannot save an empty quote!");
      return; 
    }
    try {
      const favoritesCollectionRef = collection(db, 'users', user.uid, 'favorites');
      await addDoc(favoritesCollectionRef, { 
        quoteText: quote.quoteText, 
        quoteAuthor: quote.quoteAuthor, 
        savedAt: new Date() 
      });
      alert('Quote saved!');
    } catch (error) {
      console.error("Error saving favorite: ", error);
      alert('Failed to save quote.');
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        getDailyQuote(user);
      } else {
        setQuote({ quoteText: 'Please log in to see your daily quote.', quoteAuthor: '' });
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.quoteContainer}>
        <p style={styles.quoteText}>"{quote.quoteText}"</p>
        <span style={styles.quoteAuthor}>- {quote.quoteAuthor || 'Unknown'}</span>
        
        <div style={styles.quoteActions}>
            <button style={styles.button} onClick={handleSaveFavorite}>Save Favorite ❤️</button>
            <button style={styles.button} onClick={handleNewQuote}>
              New Quote 🔄
            </button>
        </div>
      </div>
    </div>
  );
}

export default QuoteGeneratorPage;