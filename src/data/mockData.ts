import { User, ScrapRequest, PurchaseOrder, ScrapType } from '../types';

// NOTE: Product catalog mock data (mockProducts / mockCategories) was removed.
// Products now live in the Supabase database (see supabase/schema.sql).

export const mockScrapTypes: ScrapType[] = [
  { id: '1', name: 'بلاستيك' },
  { id: '2', name: 'حديد' },
  { id: '3', name: 'نحاس' },
  { id: '4', name: 'ألومنيوم' },
  { id: '5', name: 'ورق وكرتون' },
  { id: '6', name: 'أجهزة إلكترونية' },
];

export const mockUsers: User[] = [
  {
    id: 'admin-1',
    name: 'مدير النظام',
    email: 'admin@renova.demo',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-1',
    name: 'عبدالرحمن محمد',
    email: 'user@renova.demo',
    phone: '0123456789',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-2',
    name: 'سارة أحمد',
    email: 'sara@example.com',
    phone: '0111222333',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-3',
    name: 'محمد خالد',
    email: 'mohamed@example.com',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-4',
    name: 'ليلى يوسف',
    email: 'layla@example.com',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-5',
    name: 'عمر علي',
    email: 'omar@example.com',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
];

export const mockScrapRequests: ScrapRequest[] = [
  {
    id: 'RN-SCRAP-1001',
    userId: 'user-1',
    userName: 'عبدالرحمن محمد',
    userPhone: '0123456789',
    scrapType: 'حديد',
    askingPrice: 5000,
    description: 'كمية كبيرة من خردة الحديد ناتجة عن أعمال بناء قديمة.',
    address: 'القاهرة، مدينة نصر',
    status: 'جديد',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'RN-SCRAP-1002',
    userId: 'user-2',
    userName: 'سارة أحمد',
    userPhone: '0111222333',
    scrapType: 'بلاستيك',
    askingPrice: 800,
    description: 'زجاجات بلاستيكية متنوعة مغسولة ومضغوطة.',
    address: 'الجيزة، الدقي',
    status: 'تم التواصل',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'RN-SCRAP-1003',
    userId: 'user-3',
    userName: 'محمد خالد',
    userPhone: '0100200300',
    scrapType: 'أجهزة إلكترونية',
    askingPrice: 1500,
    description: 'مجموعة من أجهزة الكمبيوتر القديمة والشاشات المعطلة.',
    address: 'الإسكندرية، سموحة',
    status: 'جاري التفاوض',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'RN-SCRAP-1004',
    userId: 'user-4',
    userName: 'ليلى يوسف',
    userPhone: '0155667788',
    scrapType: 'ورق وكرتون',
    askingPrice: 300,
    description: 'كميات كبيرة من المجلات والجرائد القديمة والكرتون.',
    address: 'طنطا، وسط البلد',
    status: 'مقبول',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'RN-SCRAP-1005',
    userId: 'user-5',
    userName: 'عمر علي',
    userPhone: '0122334455',
    scrapType: 'ألومنيوم',
    askingPrice: 2000,
    description: 'أبواب ونوافذ ألومنيوم قديمة.',
    address: 'أسيوط، الحي الرابع',
    status: 'مكتمل',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'RN-SCRAP-1006',
    userId: 'user-1',
    userName: 'عبدالرحمن محمد',
    userPhone: '0123456789',
    scrapType: 'نحاس',
    askingPrice: 3500,
    description: 'أسلاك نحاسية من تجديد كهرباء المنزل.',
    address: 'القاهرة، المعادي',
    status: 'مرفوض',
    createdAt: new Date().toISOString(),
  },
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'RN-1001',
    userId: 'user-1',
    userName: 'عبدالرحمن محمد',
    userPhone: '0123456789',
    address: 'القاهرة، التجمع الخامس',
    total: 1650,
    status: 'جديد',
    createdAt: new Date().toISOString(),
    paymentMethod: 'الدفع عند الاستلام',
    items: [
      { productId: '1', name: 'كرسي خشبي معاد تدويره', price: 450, quantity: 1, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop' },
      { productId: '2', name: 'مكتب خشبي مستعمل', price: 1200, quantity: 1, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1000&auto=format&fit=crop' },
    ]
  },
  {
    id: 'RN-1002',
    userId: 'user-2',
    userName: 'سارة أحمد',
    userPhone: '0111222333',
    address: 'الجيزة، الشيخ زايد',
    total: 370,
    status: 'تم الشحن',
    createdAt: new Date().toISOString(),
    paymentMethod: 'الدفع عند الاستلام',
    items: [
      { productId: '3', name: 'مصباح مكتبي معاد تدويره', price: 250, quantity: 1, image: 'https://images.unsplash.com/photo-1507473884658-66a3f6973aa6?q=80&w=1000&auto=format&fit=crop' },
      { productId: '4', name: 'حقيبة قماشية مستدامة', price: 120, quantity: 1, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop' },
    ]
  },
];
