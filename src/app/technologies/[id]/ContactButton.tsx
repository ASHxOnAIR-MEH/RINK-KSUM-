'use client';

import { useState } from 'react';
import ContactModal from '@/components/ui/ContactModal';
import { TechnologyContact } from '@/types';
import { Phone } from 'lucide-react';

interface Props {
  contact: TechnologyContact;
  technologyName: string;
}

export default function ContactButton({ contact, technologyName }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary w-full justify-center">
        <Phone className="w-4 h-4" />
        Request Technology
      </button>
      {open && (
        <ContactModal
          contact={contact}
          technologyName={technologyName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
