import 'dotenv/config'
import { supabase } from './src/lib/supabase.js'
import { gitaVerses } from './src/data/gitaVerses.js'
import { scrapeChapterVerses } from './src/lib/gitaScraper.js'

async function seedGitaVerses() {
  console.log('🌿 Starting Gita verses seed...')
  
  try {
    // Check if verses already exist
    const { count, error: countError } = await supabase
      .from('gita_verses')
      .select('*', { count: 'exact' })

    if (countError) {
      console.error('Error checking existing verses:', countError)
      return
    }

    if (count && count > 0) {
      console.log(`✅ Database already has ${count} verses. Skipping seed.`)
      return
    }

    // Fetch complete verses using internal scraper (most reliable source)
    console.log('📚 Fetching verses via internal scraper...')
    
    const allVerses = []
    
    for (let chapter = 1; chapter <= 18; chapter++) {
      try {
        const verses = await scrapeChapterVerses(chapter)
        console.log(`✓ Chapter ${chapter}: ${verses.length} verses`)
        allVerses.push(...verses)
      } catch (err) {
        console.error(`Error fetching chapter ${chapter}:`, err)
      }
    }

    if (allVerses.length === 0) {
      console.log('❌ No verses fetched. Using sample data.')
      // Use gitaVerses from data file as fallback
      allVerses.push(...gitaVerses)
    }

    console.log(`\n📖 Total verses to insert: ${allVerses.length}`)
    
    // Insert in batches to avoid timeout
    const batchSize = 100
    for (let i = 0; i < allVerses.length; i += batchSize) {
      const batch = allVerses.slice(i, i + batchSize)
      
      const { data, error } = await supabase
        .from('gita_verses')
        .insert(batch)
        .select()

      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error)
      } else {
        console.log(`✓ Inserted batch ${i / batchSize + 1} (${batch.length} verses)`)
      }
    }

    console.log(`\n✅ Gita verses seeding completed successfully!`)
    console.log(`Total verses in database: ${allVerses.length}`)
  } catch (error) {
    console.error('❌ Error seeding Gita verses:', error)
    process.exit(1)
  }
}

seedGitaVerses()
