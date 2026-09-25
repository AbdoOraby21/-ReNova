import { ScrapType } from '../types';

// NOTE: Product catalog mock data (mockProducts / mockCategories) was removed.
// Products now live in the Supabase database (see supabase/schema.sql).
//
// NOTE: Demo customers, scrap requests and purchase orders were removed from
// the production UI. The dashboard and admin lists now render only real
// user-submitted records (persisted locally) with honest empty states.
// mockScrapTypes below is static reference configuration for the
// sell-scrap form — not fake records presented as real activity.

export const mockScrapTypes: ScrapType[] = [
  { id: '1', name: 'بلاستيك' },
  { id: '2', name: 'حديد' },
  { id: '3', name: 'نحاس' },
  { id: '4', name: 'ألومنيوم' },
  { id: '5', name: 'ورق وكرتون' },
  { id: '6', name: 'أجهزة إلكترونية' },
];
