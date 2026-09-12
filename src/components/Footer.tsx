import React from 'react';
import { ReLifeLogo } from './ReLifeLogo';
import { ModalType } from './InteractiveModals';
import { ArrowUpRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenModal: (type: ModalType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenModal }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    if (target.startsWith('#')) {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    
    if (target === 'passport') {
      onOpenModal('passport');
    } else if (target === 'marketplace') {
      onOpenModal('marketplace');
    } else if (target === 'about' || target === 'contact') {
      onOpenModal('get-started');
    }
  };

  return (
    <footer className="bg-[#070B16] border-t border-slate-800/80 text-slate-400 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-10 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="space-y-3 max-w-sm">
            <ReLifeLogo size="md" />
            <p className="text-slate-300 text-sm font-medium">
              "Give Every Battery a Second Life."
            </p>
            <p className="text-slate-500 text-xs leading-relaxed">
              AI-powered battery lifecycle intelligence platform that helps determine the most suitable next-life pathway for used batteries.
            </p>
          </div>

          {/* Prompt-Specified Links */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            <a
              href="#product"
              onClick={(e) => handleLinkClick(e, '#product')}
              className="text-slate-300 hover:text-emerald-400 font-medium transition-colors"
            >
              Product
            </a>
            <a
              href="#marketplace"
              onClick={(e) => handleLinkClick(e, '#marketplace')}
              className="text-slate-300 hover:text-emerald-400 font-medium transition-colors"
            >
              Marketplace
            </a>
            <a
              href="#passport"
              onClick={(e) => handleLinkClick(e, 'passport')}
              className="text-slate-300 hover:text-emerald-400 font-medium transition-colors"
            >
              Passport
            </a>
            <a
              href="#about"
              onClick={(e) => handleLinkClick(e, 'about')}
              className="text-slate-300 hover:text-emerald-400 font-medium transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, 'contact')}
              className="text-slate-300 hover:text-emerald-400 font-medium transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Quick Action */}
          <div>
            <button
              onClick={() => onOpenModal('analyze')}
              className="px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Launch Battery Diagnostic
            </button>
          </div>

        </div>

        {/* Bottom Legal & Prototype Status */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} ReLife AI Technologies Inc.</span>
            <span>•</span>
            <span className="text-emerald-400/80">Stage 1 Foundation & Landing Page</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Circular Battery Compliance
            </span>
            <span>•</span>
            <span>Zero Waste Initiative</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
