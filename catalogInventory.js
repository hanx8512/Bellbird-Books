/**
 * US-BB-01: Catalog management and ISBN validation
 * US-BB-02: Store section inventory filtering and safe empty return
 * Developer: Yang Shiyuan (yssyy)
 */

class CatalogInventoryService {
  constructor(dbConnection = null) {
    this.db = dbConnection;
    // In-memory catalog baseline fixtures
    this.catalog = [
      { id: 1, isbn: '978-0141439518', title: 'Pride and Prejudice', author: 'Jane Austen', section: 'Fiction', stock: 12, isSecondHand: false },
      { id: 2, isbn: '978-0061120084', title: 'To Kill a Mockingbird', author: 'Harper Lee', section: 'Fiction', stock: 8, isSecondHand: false },
      { id: 3, isbn: '978-0743273565', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', section: 'Classics', stock: 5, isSecondHand: false },
      { id: 4, isbn: '978-0451524935', title: '1984', author: 'George Orwell', section: 'Dystopian', stock: 15, isSecondHand: false }
    ];
  }

  // US-BB-01: Validate ISBN-10 / ISBN-13 format
  validateISBN(isbn) {
    if (!isbn || typeof isbn !== 'string') return false;
    const clean = isbn.replace(/[-\s]/g, '');
    return clean.length === 10 || clean.length === 13;
  }

  // US-BB-01: Register new book into catalog with field validation
  addBook(bookData) {
    const { isbn, title, author, section, stock } = bookData;
    if (!this.validateISBN(isbn)) {
      throw new Error('Invalid ISBN format');
    }
    if (!title || !author || !section) {
      throw new Error('Missing required catalog fields');
    }

    const newBook = {
      id: this.catalog.length + 1,
      isbn,
      title: title.trim(),
      author: author.trim(),
      section: section.trim(),
      stock: Math.max(0, parseInt(stock, 10) || 0),
      isSecondHand: false
    };

    this.catalog.push(newBook);
    return newBook;
  }

  // US-BB-02: Filter inventory by store section
  // Acceptance Criteria: Return empty array safely when querying empty or non-existent section
  getInventoryBySection(sectionName) {
    if (!sectionName || typeof sectionName !== 'string') {
      return [];
    }

    const targetSection = sectionName.trim().toLowerCase();
    return this.catalog.filter(
      book => book.section.toLowerCase() === targetSection
    );
  }

  // US-BB-02: Aggregate stock count summary per section
  getSectionStockSummary() {
    const summary = {};
    this.catalog.forEach(book => {
      summary[book.section] = (summary[book.section] || 0) + book.stock;
    });
    return summary;
  }
}

module.exports = CatalogInventoryService;
