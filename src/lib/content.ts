import { supabase } from './supabase'
import Database from 'better-sqlite3'
import path from 'node:path'
import { marked } from 'marked'

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string
}

export async function getAllPublications(type: 'meditation' | 'actualite') {
  const { data, error } = await supabase.from('publications').select('*').eq('type', type).eq('is_published', true).order('published_at', { ascending: false })
  if (error) console.error(`❌ Erreur publications (${type}) :`, error.message)
  return (data ?? []) as Publication[]
}

export async function getPublicationBySlug(slug: string) {
  const { data, error } = await supabase.from('publications').select('*').eq('slug', slug).eq('is_published', true).maybeSingle()
  if (error) console.error('❌ Erreur publication :', error.message)
  return data as Publication | null
}

export async function getAllResources() {
  const { data, error } = await supabase.from('site_resources').select('*').eq('is_published', true).order('published_at', { ascending: false })
  if (error) console.error('❌ Erreur site_resources :', error.message)
  return (data ?? []) as Resource[]
}

export async function getResourceBySlug(slug: string) {
  const { data, error } = await supabase.from('site_resources').select('*').eq('slug', slug).eq('is_published', true).maybeSingle()
  if (error) console.error('❌ Erreur ressource :', error.message)
  return data as Resource | null
}


const READING_LABELS: Record<string, string> = {
  lecture1: 'Première lecture', lecture2: 'Deuxième lecture', lecture3: 'Troisième lecture',
  psaume: 'Psaume', evangile: 'Évangile',
}

export interface LiturgicalDay {
  date: string
  color: string | null
  rank: string
  title: string | null
  season: string | null
  psalter_week: number | null
}
export interface LiturgicalReading {
  reading_type: string
  citation: string
  resolved_text: string | null
}

export function getLiturgicalToday() {
  const dbPath = path.resolve('./src/data/liturgical.db')
  const db = new Database(dbPath, { readonly: true })
  const todayStr = new Date().toISOString().split('T')[0]

  const day = db.prepare('SELECT * FROM liturgical_days WHERE date = ?').get(todayStr) as LiturgicalDay | undefined
  const rawReadings = db.prepare(
    `SELECT reading_type, citation, resolved_text FROM liturgical_readings WHERE date = ?
     ORDER BY CASE reading_type WHEN 'lecture1' THEN 1 WHEN 'psaume' THEN 2 WHEN 'lecture2' THEN 3 WHEN 'lecture3' THEN 4 WHEN 'evangile' THEN 5 ELSE 6 END`
  ).all(todayStr) as LiturgicalReading[]

  db.close()

  const readings = rawReadings.map((r) => ({ ...r, label: READING_LABELS[r.reading_type] ?? r.reading_type }))
  const evangile = readings.find((r) => r.reading_type === 'evangile')

  return { day, evangile, readings }
}

export interface Resource {
  slug: string
  title: string
  description: string
  category: string
  file_type: string
  file_url: string
  file_size_label: string | null
}

export interface Testimonial {
  author_name: string
  author_role: string | null
  content: string
  avatar_url: string | null
}

export async function getResources(limit = 3) {
  const { data, error } = await supabase.from('site_resources').select('*').eq('is_published', true).order('published_at', { ascending: false }).limit(limit)
  if (error) console.error('❌ Erreur site_resources :', error.message)
  return (data ?? []) as Resource[]
}

export async function getFeatured() {
  const { data, error } = await supabase.from('publications').select('*').eq('type', 'une').eq('is_published', true).order('published_at', { ascending: false }).limit(1).maybeSingle()
  if (error) console.error('❌ Erreur publications (une) :', error.message)
  return data as Publication | null
}

export async function getTestimonials(limit = 3) {
  const { data, error } = await supabase.from('testimonials').select('*').eq('is_published', true).order('display_order').limit(limit)
  if (error) console.error('❌ Erreur testimonials :', error.message)
  return (data ?? []) as Testimonial[]
}

export interface Slide {
  title: string
  description: string
  cta_label: string
  cta_link: string
  image_url: string
}

export interface Publication {
  slug: string
  type: 'meditation' | 'actualite' | 'une'
  title: string
  excerpt: string
  content: string
  category: string
  image_url: string | null
  author: string | null
  published_at: string
  attachment_url: string
  attachment_label: string
}

// Point d'entrée unique pour la page d'accueil — remplace exactement
// votre ancien getHomeData(), même esprit, vraies données cette fois
export async function getHomeData() {
  const [slidesRes, meditationsRes, actualitesRes] = await Promise.all([
    supabase.from('site_slides').select('*').order('display_order'),
    supabase.from('publications').select('*').eq('type', 'meditation').eq('is_published', true).order('published_at', { ascending: false }).limit(3),
    supabase.from('publications').select('*').eq('type', 'actualite').eq('is_published', true).order('published_at', { ascending: false }).limit(3),
  ])

  // Ces erreurs s'affichent dans le TERMINAL (npm run dev), jamais dans la
  // Console du navigateur — ce code tourne côté serveur, pas côté client
  if (slidesRes.error) console.error('❌ Erreur site_slides :', slidesRes.error.message)
  if (meditationsRes.error) console.error('❌ Erreur publications (méditations) :', meditationsRes.error.message)
  if (actualitesRes.error) console.error('❌ Erreur publications (actualités) :', actualitesRes.error.message)

  console.log(`✅ Chargé : ${slidesRes.data?.length ?? 0} slide(s), ${meditationsRes.data?.length ?? 0} méditation(s), ${actualitesRes.data?.length ?? 0} actualité(s)`)

  return {
    slides: (slidesRes.data ?? []) as Slide[],
    publications: (meditationsRes.data ?? []) as Publication[],
    news: (actualitesRes.data ?? []) as Publication[],
  }
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
}

import { verseOfTheDayRefs, getVerseOfTheDayIndex } from './verseOfTheDay'
import { getTodayMysterySet } from './rosaryMysteries'

export function getMockupData() {
  const today = new Date()
  const { day: liturgicalDay } = getLiturgicalToday()
  const mystery = getTodayMysterySet(today)

  const bibleDbPath = path.resolve('./src/data/bible.db')
  const bibleDb = new Database(bibleDbPath, { readonly: true })
  const ref = verseOfTheDayRefs[getVerseOfTheDayIndex(today)]
  const verse = bibleDb.prepare(
    `SELECT bible_verses.text, bible_books.name as book_name, bible_verses.chapter, bible_verses.verse
     FROM bible_verses JOIN bible_books ON bible_books.id = bible_verses.book_id
     WHERE bible_verses.book_id = ? AND bible_verses.chapter = ? AND bible_verses.verse = ?`
  ).get(ref.book_id, ref.chapter, ref.verse) as { text: string; book_name: string; chapter: number; verse: number } | undefined
  bibleDb.close()

  return { liturgicalDay, mystery, verse }
}