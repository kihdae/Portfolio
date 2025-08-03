import { aboutMeData } from '@/lib/ABOUT_ME_DATA';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Briefcase,
  Code,
  Heart,
  MessageSquare,
  Zap,
  GraduationCap,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClientSideAnimations } from './ClientSideAnimations';

export default function AboutMeWindow() {
  return (
    <ScrollArea className='h-full'>
      <div className='p-6 md:p-8 lg:p-10 space-y-8'>
        <ClientSideAnimations>
          <div className='flex flex-col md:flex-row items-center gap-8'>
            <Avatar className='w-32 h-32 md:w-40 md:h-40 border-subtle-accent shadow-lg relative'> 
              <div className='absolute inset-0 z rounded-full bg-gradient-to-br from-[var(--color-accent-primary)]/8 to-transparent pointer-events-none' />
              <AvatarImage
                src='../assets/avatar.jpg'
                alt={aboutMeData.name}
                draggable={false}
                onDragStart={e => e.preventDefault()}
              />
              <AvatarFallback>{aboutMeData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className='text-center md:text-left space-y-3'>
              <h1 className='text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]'>
                {aboutMeData.name}
              </h1>
              <p className='text-lg md:text-xl text-[var(--color-accent-primary)] font-medium'>
                {aboutMeData.title}
              </p>
              <p className='text-lg md:text-xl text-[var(--color-text-secondary)] max-w-prose'>
                {aboutMeData.bio}
              </p>
            </div>
          </div>
        </ClientSideAnimations>

        <div className='separator-subtle' />

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-8'>
            <ClientSideAnimations delay={0.2}>
              <Card className='border-subtle bg-subtle-gradient'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-[var(--color-text-primary)]'>
                    <Briefcase className='w-5 h-5 text-[var(--color-accent-primary)]' />
                    Professional Philosophy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-lg md:text-xl text-[var(--color-text-secondary)] italic'>
                    "{aboutMeData.professionalPhilosophy}"
                  </p>
                </CardContent>
              </Card>
            </ClientSideAnimations>

            <ClientSideAnimations delay={0.4}>
              <Card className='border-subtle bg-subtle-gradient'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-[var(--color-text-primary)]'>
                    <Zap className='w-5 h-5 text-[var(--color-accent-primary)]' />
                    Key Metrics & Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-center'>
                  {aboutMeData.keyMetrics.map((metric, index) => (
                    <div
                      key={index}
                      className='p-4 bg-subtle-card rounded-lg border-subtle-ultra'
                    >
                      <p className='text-2xl font-bold text-[var(--color-accent-primary)]'>
                        {metric.value}
                      </p>
                      <p className='text-xs text-[var(--color-text-secondary)] uppercase tracking-wider'>
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </ClientSideAnimations>

            <ClientSideAnimations delay={0.6}>
              <Card className='border-subtle bg-subtle-gradient'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-[var(--color-text-primary)]'>
                    <MessageSquare className='w-5 h-5 text-[var(--color-accent-primary)]' />
                    Testimonials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Carousel
                    opts={{
                      align: 'start',
                      loop: true,
                    }}
                    className='w-full'
                  >
                    <CarouselContent>
                      {aboutMeData.testimonials.map((testimonial, index) => (
                        <CarouselItem key={index}>
                          <div className='p-1'>
                            <p className='text-lg md:text-xl text-[var(--color-text-secondary)] italic'>
                              "{testimonial.quote}"
                            </p>
                            <p className='text-right text-lg md:text-xl font-medium text-[var(--color-text-primary)] mt-2'>
                              - {testimonial.author}
                            </p>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious
                      className='
                    left-2 top-full mt-2 h-8 w-8 rounded-full
                    bg-[var(--color-surface-primary)]/90 backdrop-blur-sm
                    border border-[var(--color-border)]
                    hover:bg-[var(--color-surface-primary)]
                    hover:border-[var(--color-accent-primary)]/30
                    text-[var(--color-text-primary)]
                    transition-all duration-300 hover:scale-110
                    shadow-lg shadow-black/20
                    z-10
                  '
                    />
                    <CarouselNext
                      className='
                    right-2 top-full mt-2 h-8 w-8 rounded-full
                    bg-[var(--color-surface-primary)]/90 backdrop-blur-sm
                    border border-[var(--color-border)]
                    hover:bg-[var(--color-surface-primary)]
                    hover:border-[var(--color-accent-primary)]/30
                    text-[var(--color-text-primary)]
                    transition-all duration-300 hover:scale-110
                    shadow-lg shadow-black/20
                    z-10
                  '
                    />
                  </Carousel>
                </CardContent>
              </Card>
            </ClientSideAnimations>
          </div>

          <div className='space-y-8'>
            <ClientSideAnimations delay={0.3}>
              <Card className='border-subtle bg-subtle-gradient'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-[var(--color-text-primary)]'>
                    <Heart className='w-5 h-5 text-[var(--color-accent-primary)]' />
                    Interests
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-wrap gap-2'>
                  {aboutMeData.interests.map((interest, index) => (
                    <Badge
                      key={index}
                      variant='secondary'
                      className='border-subtle-ultra bg-subtle-card text-sm md:text-base'
                    >
                      {interest}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </ClientSideAnimations>

            <ClientSideAnimations delay={0.4}>
              <Card className='border-subtle bg-subtle-gradient'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-[var(--color-text-primary)]'>
                    <GraduationCap className='w-5 h-5 text-[var(--color-accent-primary)]' />
                    Academics
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <span className='text-lg md:text-xl font-medium text-[var(--color-text-primary)]'>
                        {aboutMeData.academics.currentStatus} at{' '}
                        {aboutMeData.academics.institution}
                      </span>
                    </div>
                    <p className='text-lg md:text-xl text-[var(--color-text-secondary)]'>
                      {aboutMeData.academics.location}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <p className='text-lg md:text-xl text-[var(--color-text-secondary)]'>
                      Double Majoring in:
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {aboutMeData.academics.majors.map((major, index) => (
                        <Badge
                          key={index}
                          className='border-subtle-ultra bg-subtle-card text-sm md:text-base'
                        >
                          {major}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className='pt-2 border-t border-[var(--color-accent-primary)]/10'>
                    <p className='text-lg md:text-xl text-[var(--color-text-secondary)]'>
                      Future Plans:
                    </p>
                    <p className='text-lg md:text-xl text-[var(--color-accent-primary)] font-medium'>
                      {aboutMeData.academics.futurePlans}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ClientSideAnimations>

            <ClientSideAnimations delay={0.6}>
              <Card className='border-subtle bg-subtle-gradient'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-[var(--color-text-primary)]'>
                    <Code className='w-5 h-5 text-[var(--color-accent-primary)]' />
                    Skills Snapshot
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <p className='text-lg md:text-xl text-[var(--color-text-secondary)]'>
                    A few of my favorite technologies:
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    <Badge className='border-subtle-ultra bg-subtle-card'>
                      Typescript
                    </Badge>
                    <Badge className='border-subtle-ultra bg-subtle-card'>
                      Next.js
                    </Badge>
                    <Badge className='border-subtle-ultra bg-subtle-card'>
                      Python
                    </Badge>
                    <Badge className='border-subtle-ultra bg-subtle-card'>
                      Node.js
                    </Badge>
                    <Badge className='border-subtle-ultra bg-subtle-card'>
                      Ruby on Rails
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </ClientSideAnimations>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
