'use client';

import { TechnologyContact } from '@/types';
import { X, Phone, Mail, Globe, User, Building2, Info, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';

interface Props {
  contact: TechnologyContact;
  technologyName: string;
  onClose: () => void;
}

export default function ContactModal({ contact, technologyName, onClose }: Props) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <Building2 className="w-3.5 h-3.5 text-[#003F8A]" />
              </div>
              <span className="text-xs font-semibold text-[#003F8A] uppercase tracking-wide">
                Technology Request
              </span>
            </div>
            <h2 className="font-heading font-bold text-gray-900 text-lg leading-snug">
              {technologyName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ml-4"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Institution */}
          <div className="mb-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Institution</div>
            <div className="font-semibold text-gray-900">{contact.institution}</div>
          </div>

          {/* Contact details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-4 h-4 text-[#003F8A] flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-400 leading-none mb-0.5">Contact Person</div>
                <div className="text-sm font-medium text-gray-900">
                  {contact.name}
                  {contact.designation && (
                    <span className="text-gray-400 font-normal">, {contact.designation}</span>
                  )}
                </div>
              </div>
            </div>

            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group"
            >
              <Phone className="w-4 h-4 text-[#003F8A] flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-400 leading-none mb-0.5">Phone</div>
                <div className="text-sm font-medium text-[#003F8A] group-hover:underline">
                  {contact.phone}
                </div>
              </div>
            </a>

            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group"
            >
              <Mail className="w-4 h-4 text-[#003F8A] flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-400 leading-none mb-0.5">Email</div>
                <div className="text-sm font-medium text-[#003F8A] group-hover:underline">
                  {contact.email}
                </div>
              </div>
            </a>

            <a
              href={contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group"
            >
              <Globe className="w-4 h-4 text-[#003F8A] flex-shrink-0" />
              <div className="flex-1">
                <div className="text-xs text-gray-400 leading-none mb-0.5">Website</div>
                <div className="text-sm font-medium text-[#003F8A] group-hover:underline flex items-center gap-1">
                  {contact.website.replace('https://', '')}
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </a>
          </div>

          {/* Info note */}
          <div className="flex gap-3 p-4 bg-[#E8F0FE] rounded-xl border border-blue-100">
            <Info className="w-4 h-4 text-[#003F8A] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#003F8A] leading-relaxed">
              Please contact the institution directly for technology transfer and
              commercialization discussions.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button onClick={onClose} className="btn-primary w-full justify-center">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
