export const verseOfTheDayRefs: { book_id: number; chapter: number; verse: number }[] = [
  { book_id: 1, chapter: 1, verse: 1 }, { book_id: 5, chapter: 6, verse: 5 },
  { book_id: 21, chapter: 23, verse: 1 }, { book_id: 21, chapter: 27, verse: 1 },
  { book_id: 21, chapter: 91, verse: 1 }, { book_id: 21, chapter: 118, verse: 24 },
  { book_id: 21, chapter: 121, verse: 1 }, { book_id: 21, chapter: 139, verse: 14 },
  { book_id: 22, chapter: 3, verse: 5 }, { book_id: 22, chapter: 3, verse: 6 },
  { book_id: 23, chapter: 3, verse: 1 }, { book_id: 25, chapter: 3, verse: 1 },
  { book_id: 27, chapter: 41, verse: 10 }, { book_id: 27, chapter: 53, verse: 5 },
  { book_id: 28, chapter: 29, verse: 11 }, { book_id: 33, chapter: 6, verse: 3 },
  { book_id: 47, chapter: 5, verse: 3 }, { book_id: 47, chapter: 5, verse: 14 },
  { book_id: 47, chapter: 6, verse: 33 }, { book_id: 47, chapter: 7, verse: 7 },
  { book_id: 47, chapter: 11, verse: 28 }, { book_id: 47, chapter: 28, verse: 19 },
  { book_id: 47, chapter: 28, verse: 20 }, { book_id: 48, chapter: 10, verse: 27 },
  { book_id: 48, chapter: 12, verse: 30 }, { book_id: 49, chapter: 1, verse: 37 },
  { book_id: 49, chapter: 6, verse: 31 }, { book_id: 49, chapter: 15, verse: 7 },
  { book_id: 50, chapter: 1, verse: 1 }, { book_id: 50, chapter: 3, verse: 16 },
  { book_id: 50, chapter: 8, verse: 32 }, { book_id: 50, chapter: 10, verse: 10 },
  { book_id: 50, chapter: 13, verse: 34 }, { book_id: 50, chapter: 14, verse: 6 },
  { book_id: 50, chapter: 14, verse: 27 }, { book_id: 50, chapter: 15, verse: 5 },
  { book_id: 51, chapter: 1, verse: 8 }, { book_id: 52, chapter: 5, verse: 8 },
  { book_id: 52, chapter: 8, verse: 28 }, { book_id: 52, chapter: 8, verse: 38 },
  { book_id: 52, chapter: 8, verse: 39 }, { book_id: 52, chapter: 12, verse: 2 },
  { book_id: 52, chapter: 12, verse: 12 }, { book_id: 52, chapter: 15, verse: 13 },
  { book_id: 53, chapter: 13, verse: 4 }, { book_id: 53, chapter: 13, verse: 13 },
  { book_id: 54, chapter: 5, verse: 17 }, { book_id: 54, chapter: 12, verse: 9 },
  { book_id: 55, chapter: 2, verse: 20 }, { book_id: 55, chapter: 5, verse: 22 },
  { book_id: 56, chapter: 2, verse: 8 }, { book_id: 56, chapter: 2, verse: 10 },
  { book_id: 56, chapter: 4, verse: 32 }, { book_id: 56, chapter: 6, verse: 10 },
  { book_id: 57, chapter: 4, verse: 6 }, { book_id: 57, chapter: 4, verse: 7 },
  { book_id: 57, chapter: 4, verse: 13 }, { book_id: 62, chapter: 1, verse: 7 },
  { book_id: 65, chapter: 4, verse: 12 }, { book_id: 65, chapter: 4, verse: 16 },
  { book_id: 65, chapter: 11, verse: 1 }, { book_id: 65, chapter: 12, verse: 1 },
  { book_id: 65, chapter: 13, verse: 8 }, { book_id: 66, chapter: 1, verse: 2 },
  { book_id: 66, chapter: 1, verse: 17 }, { book_id: 66, chapter: 4, verse: 10 },
  { book_id: 67, chapter: 5, verse: 7 }, { book_id: 69, chapter: 4, verse: 8 },
  { book_id: 69, chapter: 4, verse: 18 }, { book_id: 73, chapter: 3, verse: 20 },
]

export function getVerseOfTheDayIndex(date: Date): number {
  const dayOfYear = Math.floor(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 86400000
  )
  return dayOfYear % verseOfTheDayRefs.length
}