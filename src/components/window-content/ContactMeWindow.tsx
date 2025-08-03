import { contactData } from '@/lib/CONTACT_ME_DATA';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Mail, Linkedin, Github, Music } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClientSideAnimations } from './ClientSideAnimations';

const socials = [
  {
    icon: <Mail className='w-8 h-8' />,
    name: 'Email',
    value: contactData.email,
    href: `mailto:${contactData.email}`,
  },
  {
    icon: <Linkedin className='w-8 h-8' />,
    name: 'LinkedIn',
    value: contactData.linkedin,
    href: contactData.linkedin,
  },
  {
    icon: <Github className='w-8 h-8' />,
    name: 'GitHub',
    value: contactData.github,
    href: contactData.github,
  },
  {
    icon: <Music className='w-8 h-8' />,
    name: 'Spotify',
    value: 'https://open.spotify.com/user/v1f2zdz3051bska7k2zoilanm',
    href: 'https://open.spotify.com/user/v1f2zdz3051bska7k2zoilanm',
  },
];

function ContactMeWindowClient() {
  return (
    <ScrollArea className='h-full'>
      <div className='p-6 md:p-8 lg:p-10 flex flex-col items-center justify-center h-full'>
        <ClientSideAnimations>
          <div className='text-center mb-8'>
            <h1 className='text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]'>
              Get in Touch
            </h1>
            <p className='text-lg md:text-xl text-[var(--color-accent-primary)] font-medium'>
              I'm always open to new opportunities and collaborations.
            </p>
          </div>
        </ClientSideAnimations>

        <ClientSideAnimations delay={0.2}>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {socials.map((social, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={social.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex flex-col items-center justify-center p-6 bg-[var(--color-surface-secondary)] rounded-lg shadow-lg hover:shadow-[var(--color-accent-primary)]/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1'
                    >
                      <div className='text-[var(--color-accent-primary)] mb-2'>
                        {social.icon}
                      </div>
                      <p className='text-sm text-[var(--color-text-secondary)]'>
                        {social.name}
                      </p>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side='bottom'>
                    <p>{social.value}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </ClientSideAnimations>
      </div>
    </ScrollArea>
  );
}

export default function ContactMeWindow() {
  return <ContactMeWindowClient />;
}
