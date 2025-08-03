import { useState, useCallback, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  skillCategories,
  Skill as SkillType,
  SkillCategory as SkillCategoryType,
} from '@/lib/SKILLS_DATA';
import { DeploymentEffect } from './ProjectsWindow';

function SkillsWindowClient() {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategoryType>(
    skillCategories[0]!
  );
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

  const handleCategorySelect = useCallback((category: SkillCategoryType) => {
    setSelectedCategory(category);
  }, []);

  const getLevelColor = (level: SkillType['level']) => {
    switch (level) {
      case 'expert':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'advanced':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'intermediate':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'beginner':
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getLevelWidth = (level: SkillType['level']) => {
    switch (level) {
      case 'expert':
        return 'w-full';
      case 'advanced':
        return 'w-4/5';
      case 'intermediate':
        return 'w-3/5';
      case 'beginner':
        return 'w-2/5';
      default:
        return 'w-1/2';
    }
  };

  const getResponsiveConfig = () => {
    const isSmall = windowSize.width < 800;
    const isMedium = windowSize.width >= 800 && windowSize.width < 1200;

    return {
      showTechPreview: windowSize.width > 600,
      maxTechTags: isSmall ? 3 : isMedium ? 4 : 5,
      fontSize: isSmall ? 'sm' : isMedium ? 'base' : 'lg',
      padding: isSmall ? 'p-4' : isMedium ? 'p-5' : 'p-6',
    };
  };

  const config = getResponsiveConfig();

  return (
    <ScrollArea className='h-full'>
      <div className={`h-full flex flex-col ${config.padding} overflow-hidden`}>
        <div className='mb-6 flex-shrink-0'>
          <h2 className='text-2xl font-bold text-[var(--color-text-primary)] mb-2 tracking-wide'>
            SKILLS
          </h2>
          <p className='text-[var(--color-text-secondary)] text-sm'>
            Technical skills and professional competencies
          </p>
          <DeploymentEffect
            text="I update these every quarter of the year! (Click to apply & swipe to view more)"
            className='text-xl font-bold text-[var(--color-text-secondary)] mt-2 mb-2 text-center'
          />
        </div>

        <div className='mb-6 flex-shrink-0'>
          <div className='flex flex-wrap gap-2'>
            {skillCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategorySelect(category)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    selectedCategory.name === category.name
                      ? 'bg-[var(--color-accent-primary)] text-[var(--color-background-primary)] shadow-lg'
                      : 'bg-[var(--color-surface-primary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)]'
                  }
                `}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className='flex-1 overflow-hidden'>
          <div className='h-full flex flex-col'>
            <div className='mb-4 flex-shrink-0'>
              <h3 className='text-lg font-semibold text-[var(--color-text-primary)] mb-2'>
                {selectedCategory.name}
              </h3>
              <p className='text-sm text-[var(--color-text-secondary)]'>
                {selectedCategory.description}
              </p>
            </div>

            <div className='flex-1 overflow-y-auto'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {selectedCategory.skills.map((skill, index) => (
                  <div
                    key={skill.name}
                    className='
                      p-4 rounded-lg border border-[var(--color-border)]
                      bg-[var(--color-surface-primary)]/50 backdrop-blur-sm
                      hover:border-[var(--color-accent-primary)]/30
                      transition-all duration-300 hover:scale-105
                      animate-in slide-in-from-bottom-2 duration-300
                    '
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className='flex items-center justify-between mb-3'>
                      <h4 className='font-medium text-[var(--color-text-primary)]'>
                        {skill.name}
                      </h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${getLevelColor(skill.level)}`}
                      >
                        {skill.level}
                      </span>
                    </div>

                    {skill.description && (
                      <p className='text-xs text-[var(--color-text-secondary)] mb-3 line-clamp-2'>
                        {skill.description}
                      </p>
                    )}

                    <div className='space-y-2'>
                      <div className='flex items-center justify-between text-xs text-[var(--color-text-secondary)]'>
                        <span>Proficiency</span>
                        <span className='capitalize'>{skill.level}</span>
                      </div>
                      <div className='w-full bg-[var(--color-surface-primary)] rounded-full h-2'>
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${getLevelColor(skill.level).split(' ')[0]}`}
                          style={{
                            width: getLevelWidth(skill.level)
                              .replace('w-', '')
                              .replace('full', '100%')
                              .replace('4/5', '80%')
                              .replace('3/5', '60%')
                              .replace('2/5', '40%')
                              .replace('1/2', '50%'),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='mt-6 flex-shrink-0'>
              <div className='
                p-4 rounded-lg
                bg-[var(--color-surface-primary)]/30 backdrop-blur-sm
                border border-[var(--color-border)]
              '>
                <h4 className='font-semibold text-[var(--color-text-primary)] mb-3'>
                  Skills Overview
                </h4>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
                  {[
                    {
                      label: 'Total Skills',
                      value: skillCategories.reduce(
                        (acc, cat) => acc + cat.skills.length,
                        0
                      ),
                    },
                    {
                      label: 'Expert Level',
                      value: skillCategories.reduce(
                        (acc, cat) =>
                          acc +
                          cat.skills.filter(s => s.level === 'expert').length,
                        0
                      ),
                    },
                    {
                      label: 'Advanced Level',
                      value: skillCategories.reduce(
                        (acc, cat) =>
                          acc +
                          cat.skills.filter(s => s.level === 'advanced').length,
                        0
                      ),
                    },
                    { label: 'Categories', value: skillCategories.length },
                  ].map((stat, index) => (
                    <div
                      key={stat.label}
                      className='animate-in slide-in-from-bottom-2 duration-300'
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className='text-xl font-bold text-[var(--color-accent-primary)] mb-1'>
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
    </ScrollArea>
  );
}

export default function SkillsWindow() {
  return <SkillsWindowClient />;
}
