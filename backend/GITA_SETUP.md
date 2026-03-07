# Gita Setup Guide - Backend Database

## What's New

Instead of fetching from external API, we now:
1. Store all Bhagavad Gita verses in Supabase
2. Backend API serves verses from database
3. Frontend loads from our API (faster, more reliable)

## Setup Steps

### 1. Create Supabase Tables

Run this SQL in your Supabase SQL Editor:

```sql
-- Create gita_chapters table
CREATE TABLE IF NOT EXISTS gita_chapters (
  id BIGSERIAL PRIMARY KEY,
  chapterNumber INT NOT NULL UNIQUE,
  chapterName VARCHAR(255) NOT NULL,
  sanskritName VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  verseCount INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create gita_verses table
CREATE TABLE IF NOT EXISTS gita_verses (
  id BIGSERIAL PRIMARY KEY,
  chapterNumber INT NOT NULL,
  verseNumber INT NOT NULL,
  chapterName VARCHAR(255) NOT NULL,
  sanskritName VARCHAR(255) NOT NULL,
  sanskrit TEXT NOT NULL,
  transliteration TEXT NOT NULL,
  meaning TEXT NOT NULL,
  audioUrl VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(chapterNumber, verseNumber),
  FOREIGN KEY (chapterNumber) REFERENCES gita_chapters(chapterNumber)
);

-- Enable Row Level Security
ALTER TABLE gita_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE gita_verses ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to gita_chapters" ON gita_chapters
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to gita_verses" ON gita_verses
  FOR SELECT USING (true);

-- Create gita_bookmarks table (per-user bookmarks)
CREATE TABLE IF NOT EXISTS gita_bookmarks (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verse_number TEXT NOT NULL,
  chapter_number INT NOT NULL,
  chapter_name TEXT NOT NULL,
  sanskrit TEXT NOT NULL,
  transliteration TEXT NOT NULL,
  meaning TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, verse_number)
);

-- Enable RLS for user-owned bookmarks
ALTER TABLE gita_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own bookmarks" ON gita_bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" ON gita_bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON gita_bookmarks
  FOR DELETE USING (auth.uid() = user_id);
```

### 2. Seed the Database

To populate all 700 verses, run:

```bash
npm run seed:gita
```

Or manually insert verses using the data from `gitaVerses.js`

### 3. API Endpoints Available

- `GET /api/gita/chapters` - Get all chapters metadata
- `GET /api/gita/chapters/:chapterNumber/verses` - Get all verses for a chapter
- `GET /api/gita/chapters/:chapterNumber/verses/:verseNumber` - Get a specific verse
- `GET /api/gita/search?query=...` - Search verses by keyword
- `GET /api/bookmarks` - Get logged-in user's bookmarks
- `POST /api/bookmarks` - Save a bookmark for logged-in user
- `DELETE /api/bookmarks/:verseNumber` - Remove a bookmark

### 4. Example API Calls

```javascript
// Get all verses from Chapter 2
fetch('http://localhost:5000/api/gita/chapters/2/verses')
  .then(res => res.json())
  .then(verses => console.log(verses))

// Get a specific verse (e.g., Chapter 2, Verse 47)
fetch('http://localhost:5000/api/gita/chapters/2/verses/47')
  .then(res => res.json())
  .then(verse => console.log(verse))

// Search for verses
fetch('http://localhost:5000/api/gita/search?query=action')
  .then(res => res.json())
  .then(results => console.log(results))
```

## Features

✅ **All 700 Verses** - Complete Bhagavad Gita stored in database
✅ **Fast Loading** - Data from our backend (no external API dependency)
✅ **Search** - Full-text search across all verses
✅ **Metadata** - Chapter info, verse counts, Sanskrit names
✅ **Audio Links** - Audio URLs included with each verse
✅ **Bookmarking** - Works with localStorage on frontend
✅ **Public Access** - No authentication required for Gita data

## Data Structure

Each verse contains:
- `chapterNumber` - Chapter 1-18
- `verseNumber` - Verse number within chapter
- `chapterName` - English chapter name
- `sanskritName` - Sanskrit chapter name
- `sanskrit` - Sanskrit text of the verse
- `transliteration` - Roman transliteration
- `meaning` - English translation
- `audioUrl` - Link to Sanskrit audio recitation

## Next Steps

1. Populate verses in Supabase using the data seeding script
2. Test endpoints in Postman or browser
3. Frontend will automatically use the new API
4. Add verse commentary, translations, or more metadata as needed
