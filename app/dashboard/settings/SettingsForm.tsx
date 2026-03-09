'use client'
import { useState, useRef, useEffect } from 'react'
import { Check, Loader2 } from 'lucide-react';
import { 
  User, Palette, ShieldCheck, Lock, X, Image as ImageIcon, 
  Bell, Phone, Mail, Link as LinkIcon, Calendar, 
  CreditCard, Video, Zap 
} from 'lucide-react'
import { UpdatePasswordForm } from '@/components/update-password-form';
import { createClient } from '@/lib/supabase/client';
import { IntegrationModal } from './IntegrationModal'; 
interface SettingsFormProps {
  initialData: any;
  userEmail?: string;
}

interface SettingsFormData {
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
  email: string;
  brand_color: string;
  bio: string;
  logo_file: File | null;
  price_event1_cents: number;
  price_event2_cents: number;
  price_event3_cents: number;
  price_event4_cents: number;
  [key: string]: any;
}

export default function SettingsForm({ initialData, userEmail }: SettingsFormProps) {
   const [zapierKey, setZapierKey] = useState<string | null>(null);
  const [pendingIntegration, setPendingIntegration] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'branding' | 'notifications' | 'payments' | 'security' | 'integrations'>('profile')
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logo_url || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
const [dbEventTypes, setDbEventTypes] = useState<{id: string, title: string, duration: number}[]>([]);

  // Fetch event types from the database
  
  useEffect(() => { 
    const fetchEvents = async () => {
      const supabase = createClient();  
      const { data } = await supabase
        .from('event_types')
        .select('id, title, duration')
        .order('id', { ascending: true }); 
      if (data) setDbEventTypes(data);
    };
    fetchEvents();
  }, []);
  const [integrations, setIntegrations] = useState({
    google_calendar: initialData?.integrations?.google_calendar ?? false,
    outlook: initialData?.integrations?.outlook ?? false,
    stripe: initialData?.integrations?.stripe ?? false,
    zoom: initialData?.integrations?.zoom ?? false,
    google_meet: initialData?.integrations?.google_meet ?? false,
    zapier: initialData?.integrations?.zapier ?? false,
  });useEffect(() => {
  const checkAuthReturn = async () => {
    const supabase = createClient();
    const params = new URLSearchParams(window.location.search);
    const zoomStatus = params.get('status');
    const stripeStatus = params.get('stripe'); // Bonus: handle stripe success too
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // 1. Check Supabase Identities
    const identities = session.user.identities;
    const hasOutlook = identities?.some(id => id.provider === 'azure');
    const hasGoogle = identities?.some(id => id.provider === 'google');

    // 2. Check Custom Redirect Statuses
    const isZoomSuccess = zoomStatus === 'zoom_connected';
    const isStripeSuccess = stripeStatus === 'success';

    // Only update if something actually changed to prevent loops
    if (hasOutlook || hasGoogle || isZoomSuccess || isStripeSuccess) {
      const updated = {
        ...integrations,
        outlook: hasOutlook || integrations.outlook,
        // Google Meet and Google Calendar share the same Google Identity
        google_calendar: hasGoogle || integrations.google_calendar,
        google_meet: hasGoogle || integrations.google_meet, 
        zoom: isZoomSuccess || integrations.zoom,
        stripe: isStripeSuccess || integrations.stripe,
      };

      // Only save and update state if the new 'updated' object is different from current 'integrations'
      if (JSON.stringify(updated) !== JSON.stringify(integrations)) {
        setIntegrations(updated);

        await supabase
          .from('profiles')
          .update({ integrations: updated })
          .eq('id', initialData.id);
      }
      
      // Clean the URL
      if (window.location.search) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  };
  checkAuthReturn();
}, [initialData.id, integrations]); // Added integrations to dependencies safely with the stringify check


  const toggleIntegration = (key: keyof typeof integrations) => {
    if (!integrations[key]) {
      setPendingIntegration(key);
    } else {
      setIntegrations(prev => ({ ...prev, [key]: false }));
    }
  }
   
  const confirmIntegration = async (type: string) => {
    const supabase = createClient(); 
    if (type === 'google_calendar' || type === 'google_meet') {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar',
          queryParams: { access_type: 'offline', prompt: 'consent' },
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/settings`, 
        },
      });
      if (error) alert("Error: " + error.message);
    } 
    else if (type === 'outlook') {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'openid profile email offline_access Calendars.Read',
          queryParams: { prompt: 'consent' },
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/settings`,
        },
      });
      if (error) alert("Outlook Error: " + error.message);
    }
    else if (type === 'zoom') {
      try {
        // Call our custom backend route to get the Zoom Auth URL
        const res = await fetch('/api/zoom/connect');
        const data = await res.json();
        
        if (data.url) {
          // Redirect the user to Zoom's permission page
          window.location.href = data.url;
        } else {
          throw new Error(data.error || "Failed to get Zoom URL");
        }
      } catch (err: any) {
        alert("ZOOM Error: " + err.message);
      }
    }
    else if (type === 'stripe') {
      setLoading(true);
      try { 
        // Inside confirmIntegration for type === 'stripe'
        const response = await fetch('/api/stripe/connect', { 
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({ 
            userId: initialData.id, 
            email: formData.email 
          }),
        });
        // Check if the response is actually JSON before parsing
        const contentType = response.headers.get("content-type");
        if (!response.ok || !contentType?.includes("application/json")) {
          const text = await response.text(); // Read the HTML error message
          console.error("Server returned HTML instead of JSON:", text);
          throw new Error("Server error: Check the console for the HTML response.");
        }

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to connect");

        window.location.href = data.url;
      } catch (err: any) {
        alert("Stripe Error: " + err.message);
      } finally {
        setLoading(false);
        setPendingIntegration(null);
      }
    }
    
   else if (type === 'zapier') {
      setLoading(true);
      try {
        const res = await fetch('/api/zapier/generate-key', { method: 'POST' });
        const data = await res.json();

        if (data.apiKey) {
          setZapierKey(data.apiKey); // Store the key to pass to the modal
          setIntegrations(prev => ({ ...prev, zapier: true }));
        }
      } catch (err: any) {
        alert("Zapier Error: " + err.message);
      } finally {
        setLoading(false);
        // Note: Do NOT set pendingIntegration to null yet, 
        // so the modal stays open to show the key!
      }
    }
    else {
      setIntegrations(prev => ({ ...prev, [type]: true }));
      setPendingIntegration(null);
    }
  };

    const [formData, setFormData] = useState<SettingsFormData>({
      first_name: initialData?.first_name || '',
      last_name: initialData?.last_name || '',
      username: initialData?.username || '',
      phone: initialData?.phone || '',
      email: userEmail || '',
      brand_color: initialData?.brand_color || '#2563eb',
      bio: initialData?.bio || '',
      logo_file: null,
      // Add these new lines:
      price_event1_cents: initialData?.price_event1_cents || 0,
      price_event2_cents: initialData?.price_event2_cents || 0,
      price_event3_cents: initialData?.price_event3_cents || 0,
      price_event4_cents: initialData?.price_event4_cents || 0,
    });

  const [notifications, setNotifications] = useState({
    email_appointments: initialData?.notification_settings?.email_appointments ?? true,
    email_reminders: initialData?.notification_settings?.email_reminders ?? true,
    email_marketing: initialData?.notification_settings?.email_marketing ?? false,
    sms_urgent: initialData?.notification_settings?.sms_urgent ?? true,
    sms_reminders: initialData?.notification_settings?.sms_reminders ?? false,
    push_new_message: initialData?.notification_settings?.push_new_message ?? true,
    push_system_updates: initialData?.notification_settings?.push_system_updates ?? false,
  });

  const role = initialData?.role 
  const isManagement = role === 'pro' || role === 'admin';

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
        setFormData(prev => ({ ...prev, logo_file: file }))
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

 const handleSave = async () => {
  if (!initialData?.id) {
    alert("Error: No User ID found.");
    return;
  }

  setLoading(true);
  setIsSaved(false);
  const supabase = createClient();
  let publicUrl = logoPreview;

  try {
    // 1. Handle Logo Upload
    if (formData.logo_file) {
      const file = formData.logo_file;
      const fileExt = file.name.split('.').pop();
      const filePath = `${initialData.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('logos').getPublicUrl(filePath);
      publicUrl = urlData.publicUrl;
    }

    // 2. Update Database Profile
    const { error: dbError } = await supabase
      .from('profiles')
      .upsert({
        id: initialData.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        phone: formData.phone,
        brand_color: formData.brand_color,
        bio: formData.bio,
        logo_url: publicUrl,
        notification_settings: notifications,
        integrations: integrations,
        
        // --- NEW FIELDS START HERE ---
        price_event1_cents: formData.price_event1_cents,
        price_event2_cents: formData.price_event2_cents,
        price_event3_cents: formData.price_event3_cents,
        price_event4_cents: formData.price_event4_cents,
        currency: formData.currency || 'usd', 

        updated_at: new Date().toISOString(),
      });

    if (dbError) throw dbError;
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);

  } catch (err: any) {
    alert(err.message || "An error occurred");
  } finally {
    setLoading(false);
  }
};

  const tabClass = (tab: string) => `
    w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all
    ${activeTab === tab 
      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' 
      : 'text-slate-500 hover:bg-white hover:text-slate-700'}
  `

  const integrationList = [
    { id: 'google_calendar', name: 'Google Calendar', desc: 'Sync work & personal', cat: 'Calendar', icon: <Calendar size={18} className="text-blue-500" /> },
    { id: 'outlook', name: 'Microsoft Outlook', desc: 'Enterprise ready', cat: 'Calendar', icon: <Calendar size={18} className="text-blue-600" /> },
    { id: 'stripe', name: 'Stripe', desc: 'Collect payments', cat: 'Payments', icon: <CreditCard size={18} className="text-purple-500" /> },
    { id: 'zoom', name: 'Zoom', desc: 'Auto-generate links', cat: 'Video', icon: <Video size={18} className="text-blue-400" /> },
    { id: 'google_meet', name: 'Google Meet', desc: 'One-click meetings', cat: 'Video', icon: <Video size={18} className="text-green-500" /> },
    { id: 'zapier', name: 'Zapier', desc: 'Connect 5000+ apps', cat: 'Automation', icon: <Zap size={18} className="text-orange-500" /> },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[650px]">
      <div className="w-full md:w-64 bg-slate-50/50 border-r border-slate-50 p-6 space-y-2">
        <button onClick={() => setActiveTab('profile')} className={tabClass('profile')}>
          <User size={18} /> Profile
        </button>
        {isManagement && ( 
            <button onClick={() => setActiveTab('branding')} className={tabClass('branding')}>
              <Palette size={18} /> Branding
            </button> 
        )}
        <button onClick={() => setActiveTab('integrations')} className={tabClass('integrations')}>
          <LinkIcon size={18} /> Integrations
        </button>
        <button onClick={() => setActiveTab('notifications')} className={tabClass('notifications')}>
          <Bell size={18} /> Notifications
        </button>
        <button onClick={() => setActiveTab('payments')} className={tabClass('payments')}>
          <CreditCard size={18} /> Payments
        </button>
        <button onClick={() => setActiveTab('security')} className={tabClass('security')}>
          <ShieldCheck size={18} /> Security
        </button>
      </div>

      <div className="flex-1 p-8 lg:p-12">
        <div className="max-w-xl">
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: formData.brand_color }}>Account Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">First Name</label>
                    <input 
                      type="text" 
                      value={formData.first_name} 
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})} 
                      className="w-full p-3 bg-slate-50 rounded-xl outline-none transition-all focus:ring-2"
                      style={{ '--tw-ring-color': `${formData.brand_color}33` } as any}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">Last Name</label>
                    <input 
                      type="text" 
                      value={formData.last_name} 
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})} 
                      className="w-full p-3 bg-slate-50 rounded-xl outline-none transition-all focus:ring-2"
                      style={{ '--tw-ring-color': `${formData.brand_color}33` } as any}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input type="email" value={formData.email} readOnly className="w-full p-3 pl-12 bg-slate-100 rounded-xl outline-none text-slate-500 cursor-not-allowed border border-transparent" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input 
                      type="tel" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                      className="w-full p-3 pl-12 bg-slate-50 rounded-xl outline-none transition-all focus:ring-2"
                      style={{ '--tw-ring-color': `${formData.brand_color}33` } as any}
                    />
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: formData.brand_color }}>Business Branding</h3>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer w-full h-40 rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 overflow-hidden"
              >
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="h-full w-full object-contain p-4" />
                ) : (
                  <ImageIcon size={28} className="text-slate-400" />
                )}
                <input type="file" ref={fileInputRef} onChange={handleLogoChange} accept="image/*" className="hidden" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Brand Color</label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <input type="color" value={formData.brand_color} onChange={(e) => setFormData({...formData, brand_color: e.target.value})} className="w-12 h-12 rounded-lg cursor-pointer" />
                  <span className="text-sm font-mono text-slate-500 uppercase">{formData.brand_color}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <header>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-2" style={{ color: formData.brand_color }}>App Integrations</h3>
                <p className="text-sm text-slate-500">Connect your favorite tools to automate your workflow.</p>
              </header>

              <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Provider</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Category</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {integrationList.map((item) => (
                      <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white shadow-sm transition-colors">
                              {item.icon}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{item.name}</p>
                              <p className="text-[10px] text-slate-400">{item.desc}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full uppercase tracking-tight">
                            {item.cat}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                          onClick={() => toggleIntegration(item.id as keyof typeof integrations)}
                          style={{ 
                            backgroundColor: integrations[item.id as keyof typeof integrations] 
                              ? formData.brand_color 
                              : '#e2e8f0' 
                          }}  
                            className="inline-block w-10 h-5 rounded-full relative transition-all align-middle"
                          >
                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${integrations[item.id as keyof typeof integrations] ? 'left-5.5' : 'left-0.5'}`} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <header>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-2" style={{ color: formData.brand_color }}>Notification Center</h3>
                <p className="text-sm text-slate-500">Choose exactly how and when you want to be reached.</p>
              </header>
              <div className="space-y-6">
                <NotificationGroup title="Email Notifications">
                  <NotificationItem label="Appointment Confirmations" description="Get an email every time a session is booked." active={notifications.email_appointments} brandColor={formData.brand_color} onToggle={() => toggleNotification('email_appointments')} />
                  <NotificationItem label="Daily Schedule Reminder" description="A summary of your day sent every morning." active={notifications.email_reminders} brandColor={formData.brand_color} onToggle={() => toggleNotification('email_reminders')} />
                  <NotificationItem label="Marketing & News" description="Updates about new features and platform tips." active={notifications.email_marketing} brandColor={formData.brand_color} onToggle={() => toggleNotification('email_marketing')} />
                </NotificationGroup>
                <NotificationGroup title="SMS / Text Messages">
                  <NotificationItem label="Urgent Cancellations" description="Immediate text alerts for last-minute changes." active={notifications.sms_urgent} brandColor={formData.brand_color} onToggle={() => toggleNotification('sms_urgent')} />
                  <NotificationItem label="2-Hour Reminder" description="A quick text before your appointment starts." active={notifications.sms_reminders} brandColor={formData.brand_color} onToggle={() => toggleNotification('sms_reminders')} />
                </NotificationGroup>
                <NotificationGroup title="Push Notifications">
                  <NotificationItem label="Direct Messages" description="Alerts when a client or pro sends a message." active={notifications.push_new_message} brandColor={formData.brand_color} onToggle={() => toggleNotification('push_new_message')} />
                  <NotificationItem label="System Updates" description="Important alerts about your account status." active={notifications.push_system_updates} brandColor={formData.brand_color} onToggle={() => toggleNotification('push_system_updates')} />
                </NotificationGroup>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-2" style={{ color: formData.brand_color }}>
                        Event Pricing
                      </h3>
                      <p className="text-sm text-slate-500">Set the prices your clients will pay for each session type.</p>
                    </div>

                    {/* Currency Selector */}
                    <div className="min-w-[140px]">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                        Currency
                      </label>
                      <select
                        value={formData.currency || 'usd'}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 font-bold text-slate-900 focus:outline-none focus:border-slate-200 transition-all appearance-none cursor-pointer"
                      >
                        <option value="usd">USD ($)</option>
                        <option value="aud">AUD ($)</option>
                        <option value="eur">EUR (€)</option>
                        <option value="gbp">GBP (£)</option>
                        <option value="mxn">MXN ($)</option>
                        <option value="clp">CLP ($)</option>
                      </select>
                    </div>
                  </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dbEventTypes.map((event, index) => {
                      const priceKey = `price_event${index + 1}_cents`;
                      // Fallback to 0 if the key hasn't been initialized yet
                      const displayValue = (formData[priceKey] || 0) / 100;

                      return (
                        <div key={event.id} className="relative group">
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                            {event.title} ({event.duration} min)
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold uppercase text-[10px] pointer-events-none select-none">
                              {formData.currency}
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={displayValue === 0 ? '' : displayValue} // Shows placeholder if 0
                              onChange={(e) => {
                                const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                setFormData({
                                  ...formData,
                                  [priceKey]: Math.round(val * 100)
                                });
                              }}
                              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-14 py-4 font-bold text-slate-900 focus:border-slate-200 outline-none transition-all"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
 
                <div className="mt-8 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      {/* Light turns Green only if both the ID exists AND onboarding is complete */}
                      <div className={`w-3 h-3 rounded-full ${
                        formData.stripe_account_id && initialData.stripe_onboarding_complete 
                          ? 'bg-emerald-500' 
                          : 'bg-orange-400 animate-pulse'
                      }`} />
                      
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">
                        Stripe Status: {
                          formData.stripe_account_id && initialData.stripe_onboarding_complete 
                            ? 'Verified & Active' 
                            : formData.stripe_account_id 
                              ? 'Pending Verification' 
                              : 'Not Connected'
                        }
                      </span>
                  </div> 
                    {!formData.stripe_account_id && (
                      <button onClick={() => setActiveTab('integrations')}  className="text-[10px] font-black uppercase tracking-widest text-white px-4 py-2 rounded-lg transition-opacity hover:opacity-90" style={{ backgroundColor: formData.brand_color }}>
                        Connect Stripe
                      </button>
                    )}
                  </div>
                </div>
              )}

          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: formData.brand_color }}>Security</h3>
              <button 
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold text-sm flex items-center justify-center gap-2 hover:border-orange-300 hover:text-orange-600 transition-all"
              >
                <Lock size={16} /> Update Password
              </button>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-slate-100">
            <button 
              onClick={handleSave} 
              disabled={loading}
              className="w-full py-4 text-white rounded-2xl font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all shadow-lg"
              style={{ background: formData.brand_color }}
            >
              {loading ? 'Updating...' : `Save ${activeTab} Changes`}
            </button>
          </div>
        </div>
      </div>

      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative"> 
            <UpdatePasswordForm onClose={() => setIsPasswordModalOpen(false)} />
          </div>
        </div>
      )}
      <IntegrationModal 
         type={pendingIntegration} 
        brandColor={formData.brand_color}
        // When closing, we also clear the key so it's fresh for the next time
        onClose={() => {
          setPendingIntegration(null);
          setZapierKey(null); 
        }}
        onConfirm={confirmIntegration}
        // Pass the state variable here
        apiKey={zapierKey} 
      />
    </div>
  )
}

function NotificationGroup({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{title}</h4>
      <div className="bg-slate-50 rounded-3xl p-2 border border-slate-100">{children}</div>
    </div>
  )
}

function NotificationItem({ label, description, active, onToggle, brandColor }: { label: string, description: string, active: boolean, onToggle: () => void, brandColor: string }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-white rounded-2xl transition-colors">
      <div>
        <p className="text-sm font-bold text-slate-700">{label}</p>
        <p className="text-[10px] text-slate-400 font-medium">{description}</p>
      </div>
      <button 
        onClick={onToggle}
        style={{ backgroundColor: active ? brandColor : '#e2e8f0' }}
        className="w-10 h-5 rounded-full transition-all relative"
      >
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${active ? 'left-5.5' : 'left-0.5'}`} />
      </button>
    </div>
  )
}