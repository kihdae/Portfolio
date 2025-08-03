import { useState, useCallback, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  MapPin,
  Building2,
  ChevronRight,
  Award,
  Code,
} from 'lucide-react';
import { DeploymentEffect } from './ProjectsWindow';
import { ClientSideAnimations } from './ClientSideAnimations';

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  responsibilities?: string[];
  achievements?: string[];
  technologies?: string[];
  type: 'full-time' | 'part-time' | 'internship';
  logoUrl?: string; 
}

const experiences: Experience[] = [
  {
    id: 'Vail Systems',
    title: 'Full Stack Developer',
    company: 'Vail Systems',
    location: 'Chicago, IL',
    startDate: '2024-05',
    endDate: 'Present',
    description:
      'Leading backend development & aiding in frontend development for internal applications, Mentoring Entry Level Developers, and driving technical decisions for scalable web solutions.',
    responsibilities: [
      'Developed and maintained scalable web applications & services using Next.js and TypeScript including an abundance of other libraries and frameworks',
      'Led migration from React to Next.js, improving performance by 40%',
      'Along side a team of 3, developed an internal spam automation tool utilizing a AI-powered ruby on rails endpoint, reducing spam by 70%',
      'Mentored 2 entry level developers, improving team productivity by 25%, engaging in effective communication and technical skills, concluding that learning efficiency increases by 20%',
      'Collaborated with UX/UI teams to implement designs, providing technical guidance and support',
      'Applied and conformed to Agile methodologies in a fast-paced software development environment.',
    ],
    achievements: [
      'Developed and deployed internal tools to improve team productivity',
      'Mentored team members resulting in learning boosts with efficiency increasing by 20%',
    ],
    technologies: [
      'React',
      'TypeScript',
      'Next.js',
      'Tailwind CSS',
      'GraphQL',
      'Jest',
    ],
    type: 'part-time',
  },
  {
    id: 'Software Engineering Intern',
    title: 'Software Engineering Intern',
    company: 'Grubhub-sponsored by CodeNation',
    location: 'Chicago, IL',
    startDate: '2021-06',
    endDate: '2021-08',
    description:
      'Served as a Software Engineering Intern for Grubhub, a food delivery company, where I worked on a team of 3-4 other interns to develop functional websites and games using JavaScript. in a cohort of 20',
    responsibilities: [
      'Led a team of 3-4 other interns to develop functional websites and games using JavaScript.',
      'Participated in the Code Nation Hackathon @ Google and strategized to exceed performance metrics and create innovative projects.',
      'Led entire projects to completion with hours to spare on deadlines, optimizing workflow by maintaining a focused and organized workspace.',
    ],
    achievements: [
      'Improved website performance scores by 40% on average',
      'Implemented accessibility features for all projects',
    ],
    technologies: ['JavaScript', 'HTML', 'CSS', 'Git', 'Replit'],
    type: 'internship',
  },
  {
    id: 'Research Fellow Science Intern',
    title: 'Computer Science Intern',
    company: 'Discovery Partners Institute',
    location: 'Chicago, IL',
    startDate: '2022-12',
    endDate: '2023-06',
    description:
      'Served as a Computer Science intern for Discovery Partners Institute, a research institute focused on developing and implementing innovative solutions to complex problems. I worked on solo projects while collaborating with other research fellows to develop a web application that resonated with my intrinsic values.',
    type: 'internship',
  },
  {
    id: 'Research Fellow',
    title: 'Research Fellow',
    company: 'BravenX',
    location: 'Remote',
    startDate: '2025-01',
    endDate: '2025-5',
    description:
      'Served as a Research Fellow for BravenX where I developed a crucial network of mentors and peers to help me navigate the challenges of the tech industry. Curating a Capstone challenge solution that resonated with our values and our clients needs.',
    responsibilities: [
      'Directed a 7-person team as Project Manager, delivering creative and intuitive solutions for our capstone challenge. ',
      'Collaborated on research and design to boost project performance and maintain a high efficiency workflow.',
      'Navigated a highly competitive environment with over 600 participants, ensuring a successful and timely project completion.',
    ],
    type: 'internship',
  },
];

function ExperienceWindowClient() {
  const [selectedExperience, setSelectedExperience] = useState<Experience>(
    experiences[0]
  );
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 900 });

  useEffect(() => {
    const updateWindowSize = () => {
      const container = document.querySelector(
        '[data-window-id]'
      ) as HTMLElement;
      if (container) {
        setWindowSize({
          width: container.offsetWidth,
          height: container.offsetHeight,
        });
      }
    };

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);

    const resizeObserver = new ResizeObserver(updateWindowSize);
    const container = document.querySelector('[data-window-id]');
    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      window.removeEventListener('resize', updateWindowSize);
      resizeObserver.disconnect();
    };
  }, []);

  const handleExperienceSelect = useCallback((experience: Experience) => {
    setSelectedExperience(experience);
  }, []);

  const handleCarouselSelect = useCallback((index: number) => {
    if (experiences[index]) {
      setSelectedExperience(experiences[index]);
    }
  }, []);

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'bg-[var(--color-accent-primary)]/8 text-[var(--color-accent-primary)] border-[var(--color-accent-primary)]/15';
      case 'part-time':
        return 'bg-purple-500/8 text-purple-400 border-purple-500/15';
      case 'internship':
        return 'bg-blue-500/8 text-blue-400 border-blue-500/15';
      default:
        return 'bg-[var(--color-accent-primary)]/8 text-[var(--color-accent-primary)] border-[var(--color-accent-primary)]/15';
    }
  };

  const formatDate = (date: string) => {
    if (date === 'Present') return 'Present';
    const [year, month] = date.split('-');
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const getResponsiveConfig = () => {
    const isSmall = windowSize.width < 800;
    const isMedium = windowSize.width >= 800 && windowSize.width < 1200;
    const isLarge = windowSize.width >= 1200;

    return {
      carouselItems: isSmall ? 1 : isMedium ? 2 : 3,
      showTechPreview: windowSize.width > 600,
      maxTechTags: isSmall ? 2 : isMedium ? 3 : 4,
      cardHeight: isSmall ? '140px' : isMedium ? '160px' : '180px',
      fontSize: isSmall ? 'sm' : isMedium ? 'base' : 'lg',
      padding: isSmall ? 'p-4' : isMedium ? 'p-5' : 'p-6',
    };
  };

  const config = getResponsiveConfig();

  return (
    <div className={`h-full flex flex-col ${config.padding} overflow-hidden`}>
      <div className='mb-6 flex-shrink-0'>
        <h2 className='text-2xl font-bold text-[var(--color-text-primary)] mb-2 tracking-wide'>
          PROFESSIONAL EXPERIENCE
        </h2>
        <p className='text-[var(--color-text-secondary)] text-sm'></p>
        <DeploymentEffect
          text='I update these every quarter of the year! (Click to apply & swipe to view more)'
          className='text-xl font-bold text-[var(--color-text-secondary)] mt-2 mb-2 text-center'
        />
      </div>

      <div className='mb-6 flex-shrink-0'>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
            skipSnaps: false,
            slidesToScroll: 1,
          }}
          className='w-full'
          setApi={setCarouselApi}
          onSelect={() => {
            if (carouselApi) {
              handleCarouselSelect(carouselApi.selectedScrollSnap());
            }
          }}
        >
          <CarouselContent className='-ml-2 md:-ml-4'>
            {experiences.map((experience, index) => (
              <CarouselItem
                key={experience.id}
                className={`pl-2 md:pl-4 basis-full md:basis-1/${config.carouselItems}`}
              >
                <div className='p-1'>
                  <div
                    className={`
                      group relative overflow-hidden rounded-xl
                      bg-[var(--color-surface-primary)] 
                      border transition-all duration-500 ease-out
                      cursor-pointer ${config.cardHeight} p-4
                      hover:shadow-lg hover:shadow-[var(--color-accent-primary)]/5
                      hover:scale-[1.02] hover:-translate-y-1
                      ${
                        selectedExperience.id === experience.id
                          ? 'border-[var(--color-accent-primary)] shadow-[var(--color-accent-primary)]/10 scale-[1.02] -translate-y-1'
                          : 'border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/30'
                      }
                    `}
                    onClick={() => handleExperienceSelect(experience)}
                  >
                    {selectedExperience.id === experience.id && (
                      <div
                        className='
                        absolute top-0 left-0 w-1 h-full
                        bg-gradient-to-b from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)]
                        animate-pulse
                      '
                      />
                    )}

                    {selectedExperience.id === experience.id && (
                      <div
                        className='
                        absolute inset-0 bg-gradient-to-br from-[var(--color-accent-primary)]/5 to-transparent
                        animate-pulse
                      '
                      />
                    )}

                    <div className='relative z-10 h-full flex flex-col'>
                      <div className='flex items-start justify-between mb-3'>
                        <div className='flex-1 min-w-0'>
                          <h3
                            className={`
                            font-semibold text-lg transition-all duration-300 mb-1 truncate
                            ${
                              selectedExperience.id === experience.id
                                ? 'text-[var(--color-accent-primary)]'
                                : 'text-[var(--color-text-primary)]'
                            }
                          `}
                          >
                            {experience.title}
                          </h3>
                          <p className='text-[var(--color-text-secondary)] text-md font-medium truncate'>
                            {experience.company}
                          </p>
                        </div>
                        <Badge
                          variant='outline'
                          className={`text-xs transition-all duration-300 flex-shrink-0 ${getBadgeVariant(experience.type)}`}
                        >
                          {experience.type}
                        </Badge>
                      </div>

                      <div className='space-y-1 text-xs text-[var(--color-text-secondary)] mb-3'>
                        <div className='flex items-center gap-2'>
                          <Calendar className='w-3 h-3 flex-shrink-0' />
                          <span className='truncate'>
                            {formatDate(experience.startDate)} -{' '}
                            {formatDate(experience.endDate)}
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <MapPin className='w-3 h-3 flex-shrink-0' />
                          <span className='truncate'>
                            {experience.location}
                          </span>
                        </div>
                      </div>

                      {config.showTechPreview && (
                        <div className='mt-auto'>
                          <div className='flex flex-wrap gap-1'>
                            {experience.technologies
                              ?.slice(0, config.maxTechTags)
                              .map(tech => (
                                <span
                                  key={tech}
                                  className='text-xs px-2 py-1 rounded-md bg-[var(--color-surface-primary)]/50 text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-accent-primary)]/10 hover:text-[var(--color-accent-primary)]'
                                >
                                  {tech}
                                </span>
                              ))}
                            {experience.technologies?.length &&
                              experience.technologies?.length >
                                config.maxTechTags && (
                                <span className='text-xs px-2 py-1 rounded-md bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]'>
                                  +
                                  {experience.technologies?.length -
                                    config.maxTechTags}
                                </span>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
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
      </div>

      <div className='flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-track-transparent hover:scrollbar-thumb-[var(--color-accent-primary)]/30'>
        <div className='pr-2'>
          <div className='space-y-6 pb-8'>
            <div
              className='
              p-6 rounded-xl
              bg-[var(--color-surface-primary)]/50 backdrop-blur-sm
              border border-[var(--color-border)]
              animate-in slide-in-from-bottom-4 duration-500
            '
            >
              <div className='flex items-start justify-between mb-6'>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-3 mb-2'>
                    <Building2 className='w-5 h-5 text-[var(--color-accent-primary)] flex-shrink-0' />
                    <h3 className='text-xl font-semibold text-[var(--color-text-primary)] truncate'>
                      {selectedExperience.title}
                    </h3>
                  </div>
                  <p className='text-lg text-[var(--color-text-secondary)] font-medium truncate'>
                    {selectedExperience.company}
                  </p>
                </div>
                <Badge
                  variant='outline'
                  className={`flex-shrink-0 ${getBadgeVariant(selectedExperience.type)}`}
                >
                  {selectedExperience.type}
                </Badge>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                <div className='flex items-center gap-2 text-[var(--color-text-secondary)]'>
                  <Calendar className='w-4 h-4 flex-shrink-0' />
                  <span className='text-sm truncate'>
                    {formatDate(selectedExperience.startDate)} -{' '}
                    {formatDate(selectedExperience.endDate)}
                  </span>
                </div>
                <div className='flex items-center gap-2 text-[var(--color-text-secondary)]'>
                  <MapPin className='w-4 h-4 flex-shrink-0' />
                  <span className='text-sm truncate'>
                    {selectedExperience.location}
                  </span>
                </div>
              </div>

              <Separator className='mb-6' />

              <div className='mb-6'>
                <h4 className='font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2'>
                  <Building2 className='w-4 h-4 flex-shrink-0' />
                  Overview
                </h4>
                <p className='text-[var(--color-text-secondary)] text-sm leading-relaxed'>
                  {selectedExperience.description}
                </p>
              </div>

              <div className='mb-6'>
                <h4 className='font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2'>
                  <Code className='w-4 h-4 flex-shrink-0' />
                  Key Responsibilities
                </h4>
                <ul className='space-y-2'>
                  {selectedExperience.responsibilities?.map(
                    (responsibility, index) => (
                      <li
                        key={index}
                        className='flex items-start gap-3 text-sm text-[var(--color-text-secondary)] animate-in slide-in-from-left-4 duration-300'
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <ChevronRight className='w-4 h-4 text-[var(--color-accent-primary)] mt-0.5 flex-shrink-0' />
                        <span>{responsibility}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className='mb-6'>
                <h4 className='font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2'>
                  <Award className='w-4 h-4 flex-shrink-0' />
                  Key Achievements
                </h4>
                <ul className='space-y-2'>
                  {selectedExperience.achievements?.map(
                    (achievement, index) => (
                      <li
                        key={index}
                        className='flex items-start gap-3 text-sm text-[var(--color-text-secondary)] animate-in slide-in-from-left-4 duration-300'
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <ChevronRight className='w-4 h-4 text-[var(--color-accent-primary)] mt-0.5 flex-shrink-0' />
                        <span>{achievement}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h4 className='font-semibold text-[var(--color-text-primary)] mb-3'>
                  Technologies & Tools
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {selectedExperience.technologies?.map((tech, index) => (
                    <Badge
                      key={tech}
                      variant='secondary'
                      className='bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] border-[var(--color-accent-primary)]/20 transition-all duration-200 hover:scale-105 animate-in slide-in-from-bottom-2 duration-300'
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div
              className='
              p-4 rounded-xl
              bg-[var(--color-surface-primary)]/30 backdrop-blur-sm
              border border-[var(--color-border)]
              animate-in slide-in-from-bottom-4 duration-500
            '
            >
              <h4 className='font-semibold text-[var(--color-text-primary)] mb-3'>
                Career Summary
              </h4>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
                {[
                  { label: 'Years Experience', value: '3+' },
                  { label: 'Companies', value: '3' },
                  { label: 'Projects Delivered', value: '10+' },
                  { label: 'Technologies', value: '25+' },
                ].map((stat, index) => (
                  <div
                    key={stat.label}
                    className='animate-in slide-in-from-bottom-2 duration-300'
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className='text-2xl font-bold text-[var(--color-accent-primary)] mb-1'>
                      {stat.value}
                    </div>
                    <div className='text-xs text-[var(--color-text-secondary)] uppercase tracking-wide'>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExperienceWindow() {
  return <ExperienceWindowClient />;
}
