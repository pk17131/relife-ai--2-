import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  User, 
  Mail, 
  Zap, 
  FileText,
  ShieldCheck
} from 'lucide-react';
import { MarketplaceListing, QuoteRequest } from '../types';

interface RequestQuoteModalProps {
  listing: MarketplaceListing;
  isOpen: boolean;
  onClose: () => void;
  onSubmitQuote: (quote: Omit<QuoteRequest, 'id' | 'submittedAt' | 'status'>) => void;
}

export const RequestQuoteModal: React.FC<RequestQuoteModalProps> = ({
  listing,
  isOpen,
  onClose,
  onSubmitQuote,
}) => {
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [intendedApplication, setIntendedApplication] = useState(
    listing.recommendedApplication || 'Stationary Solar Storage'
  );
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<{
    fullName?: string;
    company?: string;
    email?: string;
    intendedApplication?: string;
  }>({});

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState('');

  if (!isOpen) return null;

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    if (!company.trim()) {
      newErrors.company = 'Company name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!validateEmail(email.trim())) {
      newErrors.email = 'Please provide a valid business email address.';
    }

    if (!intendedApplication.trim()) {
      newErrors.intendedApplication = 'Intended application is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const refId = `QR-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedRefId(refId);

    onSubmitQuote({
      listingId: listing.id,
      batteryId: listing.batteryId,
      fullName: fullName.trim(),
      company: company.trim(),
      email: email.trim(),
      intendedApplication: intendedApplication.trim(),
      message: message.trim(),
    });

    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setFullName('');
    setCompany('');
    setEmail('');
    setMessage('');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div 
        className="bg-[#0C1427] border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        id="request-quote-modal"
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Request B2B Quotation
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                Listing {listing.id} • {listing.batteryId}
              </span>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            id="close-quote-modal-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success State */}
        {isSubmitted ? (
          <div className="p-7 text-center space-y-5">
            
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                Reference ID: {submittedRefId}
              </span>
              <h2 className="text-xl font-extrabold text-white tracking-tight" id="quote-success-title">
                Quote Request Sent
              </h2>
              <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed" id="quote-success-message">
                The battery owner/buyer can now review your request.
              </p>
            </div>

            {/* Summary card */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Battery:</span>
                <span className="text-white font-bold">{listing.batteryId} ({listing.chemistry} • {listing.soh}% SOH)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recipient Vendor:</span>
                <span className="text-slate-200">{listing.vendor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Contact Email:</span>
                <span className="text-emerald-400">{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Intended Application:</span>
                <span className="text-slate-200 truncate max-w-[200px]">{intendedApplication}</span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-md"
              id="close-success-quote-btn"
            >
              Done
            </button>

          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Battery Brief Card */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-400 text-[10px] block">TARGET PACK</span>
                <strong className="text-white text-sm">{listing.batteryId}</strong>
                <span className="text-slate-400 ml-1.5 font-sans">({listing.chemistry} • {listing.nominalVoltage}V • {listing.currentCapacity}Ah)</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px] block">EST. VALUE</span>
                <span className="text-amber-400 font-extrabold text-sm">₹{listing.estimatedValueInr.toLocaleString()}</span>
              </div>
            </div>

            {/* Field: Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }));
                }}
                placeholder="e.g. Ramesh Chandra"
                className={`w-full px-3.5 py-2 bg-slate-900 border rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 ${
                  errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-emerald-500'
                }`}
                id="quote-fullname-input"
              />
              {errors.fullName && (
                <span className="text-[11px] text-red-400 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.fullName}
                </span>
              )}
            </div>

            {/* Field: Company */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Company / Organization <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value);
                  if (errors.company) setErrors(prev => ({ ...prev, company: undefined }));
                }}
                placeholder="e.g. Surya Shakti Solar EPC"
                className={`w-full px-3.5 py-2 bg-slate-900 border rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 ${
                  errors.company ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-emerald-500'
                }`}
                id="quote-company-input"
              />
              {errors.company && (
                <span className="text-[11px] text-red-400 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.company}
                </span>
              )}
            </div>

            {/* Field: Email */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Business Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                }}
                placeholder="ramesh@company.com"
                className={`w-full px-3.5 py-2 bg-slate-900 border rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-emerald-500'
                }`}
                id="quote-email-input"
              />
              {errors.email && (
                <span className="text-[11px] text-red-400 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </span>
              )}
            </div>

            {/* Field: Intended Application */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-slate-400" />
                Intended Application <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={intendedApplication}
                onChange={(e) => {
                  setIntendedApplication(e.target.value);
                  if (errors.intendedApplication) setErrors(prev => ({ ...prev, intendedApplication: undefined }));
                }}
                placeholder="e.g. Stationary Solar Storage, Telecom Backup, Agricultural Pump"
                className={`w-full px-3.5 py-2 bg-slate-900 border rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 ${
                  errors.intendedApplication ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-emerald-500'
                }`}
                id="quote-application-input"
              />
              {errors.intendedApplication && (
                <span className="text-[11px] text-red-400 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.intendedApplication}
                </span>
              )}
            </div>

            {/* Field: Message */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Message / Quantity / Logistics Requirements (Optional)
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Specify target volume, testing requirements, or logistics address..."
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                id="quote-message-input"
              />
            </div>

            {/* Trust Footer & Submit */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Protected by ReLife AI Escrow Protocol</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                  id="submit-quote-request-btn"
                >
                  <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Submit Quote Request</span>
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
