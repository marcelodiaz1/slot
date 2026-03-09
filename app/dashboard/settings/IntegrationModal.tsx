'use client'
import { X, Calendar, CreditCard, Video, Zap, ShieldCheck, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface IntegrationModalProps {
  type: string | null;
  onClose: () => void;
  onConfirm: (type: string) => void;
  brandColor: string;
  apiKey?: string | null; // Added this
}

export function IntegrationModal({ type, onClose, onConfirm, brandColor, apiKey }: IntegrationModalProps) {
  const [copied, setCopied] = useState(false);

  if (!type) return null;

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const contentMap: Record<string, any> = {
    google_calendar: {
      title: "Google Calendar",
      icon: <Calendar size={32} />,
      iconBg: "bg-blue-50 text-blue-600",
      description: "Sync your appointments and prevent double-booking across all your devices.",
      note: "Slot. only reads your busy/free slots to ensure you aren't overbooked.",
      buttonText: "Authorize Google Account",
    },
    outlook: {
      title: "Microsoft Outlook",
      icon: <Calendar size={32} />,
      iconBg: "bg-blue-100 text-blue-700",
      description: "Connect your Outlook or Office 365 calendar for enterprise-level syncing.",
      note: "This works with both personal Outlook.com and corporate Exchange accounts.",
      buttonText: "Connect Outlook",
    },
    stripe: {
      title: "Stripe Payments",
      icon: <CreditCard size={32} />,
      iconBg: "bg-purple-50 text-purple-600",
      description: "Securely collect payments or deposits when clients book an appointment.",
      note: "You will be redirected to Stripe Connect to link your bank account.",
      buttonText: "Setup Stripe Connect",
    },
    zoom: {
      title: "Zoom Video",
      icon: <Video size={32} />,
      iconBg: "bg-blue-50 text-blue-400",
      description: "Automatically generate a unique Zoom link for every new booking.",
      note: "The meeting link will be included in the confirmation email sent to your client.",
      buttonText: "Connect Zoom",
    },
    google_meet: {
      title: "Google Meet",
      icon: <Video size={32} />,
      iconBg: "bg-green-50 text-green-600",
      description: "Use Google Meet for your virtual sessions automatically.",
      note: "Requires Google Calendar integration to be active as well.",
      buttonText: "Enable Google Meet",
    },
    zapier: {
      title: "Zapier Automation",
      icon: <Zap size={32} />,
      iconBg: "bg-orange-50 text-orange-600",
      description: "Connect Slot. to 5,000+ apps like Mailchimp, Slack, or your CRM.",
      note: "We will provide an API Key to paste into your Zapier dashboard.",
      buttonText: "Generate API Key",
    },
  };

  const content = contentMap[type] || contentMap['google_calendar'];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
          <X size={20} />
        </button>

        <div className="space-y-6">
          <div className={`w-16 h-16 ${content.iconBg} rounded-2xl flex items-center justify-center`}>
            {content.icon}
          </div>
          
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {apiKey ? "Key Generated!" : content.title}
            </h2>
            <p className="text-slate-500 mt-2 font-medium leading-relaxed">
              {apiKey ? "Copy this key and paste it into the Zapier connection window." : content.description}
            </p>
          </div>

          {/* Action Area */}
          <div className="space-y-4 pt-4">
            {apiKey ? (
              <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                <div className="relative group">
                  <input 
                    readOnly 
                    value={apiKey}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-mono text-sm text-slate-600 pr-12 focus:outline-none"
                  />
                  <button 
                    onClick={handleCopy}
                    className="absolute right-3 top-3 p-2 bg-white shadow-sm border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} style={{ color: brandColor }} />}
                  </button>
                </div>
                
                <button
                  onClick={onClose}
                  className="w-full py-4 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg"
                  style={{ backgroundColor: brandColor }}
                >
                  Close & Finish
                </button>
              </div>
            ) : (
              <>
                <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 flex gap-4">
                  <div className="mt-1"><ShieldCheck size={20} className="text-slate-400" /></div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {content.note}
                  </p>
                </div>
                <button
                  onClick={() => onConfirm(type)}
                  className="w-full py-4 text-white rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-200"
                  style={{ backgroundColor: brandColor }}
                >
                  {content.buttonText}
                </button>
                <button onClick={onClose} className="w-full text-center text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                  Nevermind, go back
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}