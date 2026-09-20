import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CheckCircle } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { useRequestStore } from '../stores/requestStore';
import { useToast } from '../components/common/Toast';

const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { addPurchaseOrder } = useRequestStore();
  const { showToast, ToastContainer } = useToast();
  const navigate = useNavigate();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [address, setAddress] = useState('');

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }
    setCheckoutStep('checkout');
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const order = {
      userId: user.id,
      userName: user.name,
      userPhone: user.phone || '0000000000',
      address: address,
      items: items,
      total: getTotal(),
      paymentMethod: 'الدفع عند الاستلام' as const,
    };

    addPurchaseOrder(order);
    clearCart();
    setCheckoutStep('success');
    showToast('تم تأكيد طلبك بنجاح');
  };

  if (checkoutStep === 'success') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-[var(--primary)] bg-opacity-10 text-[var(--primary)] rounded-full flex items-center justify-center">
            <CheckCircle size={48} strokeWidth={1.5} />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black">تم تأكيد طلبك بنجاح</h2>
          <p className="text-[var(--text-muted)] text-lg">طلبك الآن قيد المعالجة، سيتواصل معك فريق التوصيل قريباً.</p>
        </div>
        <div className="bg-[var(--bg-item)] p-6 rounded-2xl inline-block">
          <span className="text-[var(--text-muted)] text-sm block mb-1">رقم الطلب</span>
          <span className="text-2xl font-black text-[var(--primary-light)] tracking-wider">#RN-100{Math.floor(Math.random() * 9)}</span>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/my-orders')}
            className="px-8 py-4 bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white rounded-2xl font-bold transition-all shadow-xl shadow-green-900/20"
          >
            تتبع الطلب
          </button>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-[var(--bg-item)] hover:bg-[var(--border)] text-[var(--text-main)] rounded-2xl font-bold transition-all"
          >
            العودة للتسوق
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0 && (checkoutStep as string) !== 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="w-32 h-32 bg-[var(--bg-item)] rounded-full flex items-center justify-center text-[var(--text-muted)] opacity-50">
          <ShoppingBag size={64} strokeWidth={1} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black">سلة المشتريات فارغة</h2>
          <p className="text-[var(--text-muted)] max-w-md mx-auto">
            ابدأ بإضافة بعض المنتجات المعاد تدويرها إلى سلتك وساهم في حماية البيئة.
          </p>
        </div>
        <Link 
          to="/"
          className="bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-green-900/20"
        >
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <ToastContainer />
      <h1 className="text-3xl font-black">{checkoutStep === 'checkout' ? 'تأكيد الطلب' : 'سلة المشتريات'}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {checkoutStep === 'cart' ? (
            items.map((item) => (
              <div 
                key={item.productId}
                className="bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-3xl flex items-center gap-6"
              >
                <div className="w-24 h-24 bg-[var(--bg-item)] rounded-2xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow space-y-1">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-[var(--primary-light)] font-bold">{item.price} ج.م</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-[var(--bg-item)] rounded-xl border border-[var(--border)] overflow-hidden">
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-2 hover:bg-[var(--border)] transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-2 hover:bg-[var(--border)] transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.productId)}
                    className="p-2 text-[var(--danger)] hover:bg-[var(--danger)] hover:bg-opacity-10 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <form onSubmit={handleConfirmOrder} className="bg-[var(--bg-card)] border border-[var(--border)] p-8 rounded-[2.5rem] space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold border-b border-[var(--border)] pb-2">بيانات التوصيل</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">الاسم الكامل</label>
                    <input type="text" value={user?.name} disabled className="w-full opacity-70" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">رقم الهاتف</label>
                    <input type="text" value={user?.phone || '0123456789'} disabled className="w-full opacity-70" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--primary)]">عنوان التوصيل بالتفصيل</label>
                    <input 
                      type="text" 
                      required
                      placeholder="شارع، رقم العمارة، الشقة، المنطقة..."
                      className="w-full"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-bold border-b border-[var(--border)] pb-2">طريقة الدفع</h3>
                <div className="p-4 rounded-2xl border-2 border-[var(--primary)] bg-[var(--primary)] bg-opacity-5 flex items-center justify-between">
                  <span className="font-bold">الدفع عند الاستلام</span>
                  <CheckCircle className="text-[var(--primary)]" size={20} />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit"
                  className="flex-grow bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white font-black py-4 rounded-2xl shadow-xl shadow-green-900/20"
                >
                  تأكيد وإتمام الطلب
                </button>
                <button 
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="px-8 py-4 bg-[var(--bg-item)] hover:bg-[var(--border)] font-bold rounded-2xl"
                >
                  رجوع
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 rounded-[2.5rem] shadow-xl space-y-6 sticky top-24">
            <h3 className="text-xl font-bold border-b border-[var(--border)] pb-4">ملخص الطلب</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>المجموع الفرعي</span>
                <span>{getTotal()} ج.م</span>
              </div>
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>مصاريف الشحن</span>
                <span className="text-[var(--primary-light)]">مجاناً</span>
              </div>
              <div className="border-t border-[var(--border)] pt-4 flex justify-between items-center">
                <span className="font-bold text-lg">الإجمالي</span>
                <span className="font-black text-2xl text-[var(--primary)]">{getTotal()} ج.م</span>
              </div>
            </div>

            {checkoutStep === 'cart' && (
              <button 
                onClick={handleCheckout}
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 shadow-xl shadow-green-900/20"
              >
                المتابعة للدفع
                <ArrowLeft size={20} />
              </button>
            )}

            <div className="pt-4 flex items-center gap-2 text-[var(--text-muted)] text-xs justify-center">
              <ShoppingBag size={14} />
              تسوق آمن بنسبة 100% مع رينوفا
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
