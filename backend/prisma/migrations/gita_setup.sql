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

-- Create indexes for faster queries
CREATE INDEX idx_gita_verses_chapter ON gita_verses(chapterNumber);
CREATE INDEX idx_gita_verses_verse ON gita_verses(verseNumber);
CREATE INDEX idx_gita_verses_meaning ON gita_verses USING GIN (to_tsvector('english', meaning));

-- Insert chapter metadata
INSERT INTO gita_chapters (chapterNumber, chapterName, sanskritName, summary, verseCount) VALUES
(1, 'Arjuna''s Dilemma', 'Arjuna Vishada Yoga', 'On the battlefield of Kurukshetra, Arjuna is overwhelmed by sorrow and moral confusion.', 47),
(2, 'Transcendental Knowledge', 'Sankhya Yoga', 'Krishna reveals the immortality of the soul and the path of selfless action.', 72),
(3, 'The Yoga of Action', 'Karma Yoga', 'Krishna explains performing one''s duty without attachment to results.', 43),
(4, 'Transcendental Knowledge', 'Jnana Karma Sanyasa Yoga', 'The science of self-realization and divine incarnations.', 42),
(5, 'Karma Sanyasa Yoga', 'Karma Sanyasa Yoga', 'The paths of renunciation and selfless service leading to the same goal.', 29),
(6, 'The Yoga of Meditation', 'Dhyana Yoga', 'The eightfold path of yoga and meditation for self-realization.', 47),
(7, 'Knowledge of the Absolute', 'Jnana Vijnana Yoga', 'Krishna reveals His divine nature and manifestations.', 30),
(8, 'Attaining the Supreme', 'Aksara Brahma Yoga', 'The nature of the Supreme and the path after death.', 28),
(9, 'The Most Confidential Knowledge', 'Raja Vidya Raja Guhya Yoga', 'The most confidential knowledge about devotional service.', 34),
(10, 'The Opulence of the Absolute', 'Vibhuti Yoga', 'Krishna describes His divine glories throughout creation.', 42),
(11, 'The Universal Form', 'Vishvarupa Darshana Yoga', 'Arjuna beholds the awe-inspiring universal form of Krishna.', 55),
(12, 'The Yoga of Devotion', 'Bhakti Yoga', 'The path of devotion and qualities of a true devotee.', 20),
(13, 'Nature, the Enjoyer, and Consciousness', 'Kshetra Kshetrajna Vibhaga Yoga', 'The distinction between body (field) and soul (knower).', 35),
(14, 'The Three Modes of Material Nature', 'Gunatraya Vibhaga Yoga', 'The three modes: goodness, passion, and ignorance.', 27),
(15, 'The Yoga of the Supreme Person', 'Purushottama Yoga', 'The eternal tree of life and the Supreme Personality.', 20),
(16, 'The Divine and Demoniac Natures', 'Daivasura Sampad Vibhaga Yoga', 'Divine and demoniac natures and their destinies.', 24),
(17, 'The Divisions of Faith', 'Shraddhatraya Vibhaga Yoga', 'How the three modes influence faith, worship, and austerities.', 28),
(18, 'Conclusion - The Perfection of Renunciation', 'Moksha Sanyasa Yoga', 'Complete surrender to the Divine - the ultimate teaching.', 78)
ON CONFLICT (chapterNumber) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE gita_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE gita_verses ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to gita_chapters" ON gita_chapters
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to gita_verses" ON gita_verses
  FOR SELECT USING (true);

-- Create per-user bookmarks table
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

ALTER TABLE gita_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own bookmarks" ON gita_bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" ON gita_bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON gita_bookmarks
  FOR DELETE USING (auth.uid() = user_id);
