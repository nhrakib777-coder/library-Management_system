export const getStorage = (key, fallback = []) => {
  if (typeof window === "undefined") return fallback;

  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

export const setStorage = (key, value) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(key, JSON.stringify(value));

  // 🔥 global sync event
  window.dispatchEvent(new Event("storage-update"));
};

// ================= USERS =================
export const getUsers = () => getStorage("users", []);
export const setUsers = (users) => setStorage("users", users);

// ================= BOOKS =================
export const getBooks = () => getStorage("books", []);
export const setBooks = (books) => setStorage("books", books);

// ================= BORROWS =================
export const getBorrows = () => getStorage("borrows", []);
export const setBorrows = (borrows) => setStorage("borrows", borrows);

// ================= BORROW BOOK =================
export const borrowBook = (userId, book) => {
  const books = getBooks();
  const borrows = getBorrows();

  // prevent duplicate borrow
  const exists = borrows.some(
    b => b.userId === userId &&
         b.bookId === book.id &&
         b.status === "borrowed"
  );

  if (exists) return;

  const updatedBooks = books.map(b =>
    b.id === book.id ? { ...b, status: "borrowed" } : b
  );

  const newBorrow = {
    id: crypto.randomUUID(),
    userId,
    bookId: book.id,
    title: book.title,
    status: "borrowed",
    date: Date.now(),
  };

  setBooks(updatedBooks);
  setBorrows([...borrows, newBorrow]);
};

// ================= RETURN BOOK =================
export const returnBook = (userId, bookId) => {
  const books = getBooks();
  const borrows = getBorrows();

  const updatedBooks = books.map(b =>
    b.id === bookId ? { ...b, status: "available" } : b
  );

  const updatedBorrows = borrows.map(b =>
    b.userId === userId && b.bookId === bookId
      ? { ...b, status: "returned" }
      : b
  );

  setBooks(updatedBooks);
  setBorrows(updatedBorrows);
};