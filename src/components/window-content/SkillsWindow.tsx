import { useState, useCallback, useEffect } from 'react';
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
    const isSmall = windowSize.width < 600;
    const isMedium = windowSize.width >= 600 && windowSize.width < 1000;

    return {
      showTechPreview: windowSize.width > 600,
      maxTechTags: isSmall ? 2 : isMedium ? 3 : 4,
      fontSize: isSmall ? 'sm' : isMedium ? 'base' : 'lg',
      padding: isSmall ? 'p-1' : isMedium ? 'p-2' : 'p-3',
      gridCols: 'grid-cols-1',
    };
  };

  const config = getResponsiveConfig();

  return (
      <div className={`h-full flex flex-col ${config.padding} overflow-hidden`} style={{ maxHeight: '100%', maxWidth: '100%', width: '100%', boxSizing: 'border-box' }}>
        <div className='mb-4 flex-shrink-0'>
          <h2 className='text-2xl font-bold text-[var(--color-text-primary)] mb-2 tracking-wide'>
            SKILLS
          </h2>
          <p className='text-[var(--color-text-secondary)] text-sm'>
            Technical skills and professional competencies
          </p>
          <DeploymentEffect
            text="I update these every quarter of the year!"
            className='text-xl font-bold text-[var(--color-text-secondary)] mt-2 mb-2 text-center'
          />
        </div>

        <div className='mb-4 flex-shrink-0'>
          <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[var(--color-accent-primary)]/30 scrollbar-thumb-rounded-full'>
            {skillCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategorySelect(category)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-shrink-0
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

        <div className='flex-1 overflow-hidden min-h-0 w-full'>
          <div className='h-full flex flex-col min-h-0 w-full'>
            <div className='mb-4 flex-shrink-0'>
              <h3 className='text-lg font-semibold text-[var(--color-text-primary)] mb-2'>
                {selectedCategory.name}
              </h3>
              <p className='text-sm text-[var(--color-text-secondary)]'>
                {selectedCategory.description}
              </p>
            </div>

            <div className='flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[var(--color-accent-primary)]/30 scrollbar-thumb-rounded-full'>
              <div className={`grid ${config.gridCols} gap-2 pb-2 w-full`}>
                {selectedCategory.skills.map((skill, index) => (
                  <div
                    key={skill.name}
                    className='
                      p-3 rounded-lg border border-[var(--color-border)]
                      bg-[var(--color-surface-primary)]/50 backdrop-blur-sm
                      hover:border-[var(--color-accent-primary)]/30
                      transition-all duration-300 hover:scale-[1.01]
                      animate-in slide-in-from-bottom-2 duration-300
                      transform-gpu
                      overflow-hidden
                      w-full
                      max-w-full
                    '
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      transform: 'translateZ(0)' // Force hardware acceleration
                    }}
                  >
                    <div className='flex items-center justify-between mb-3 min-w-0'>
                      <h4 className='font-medium text-[var(--color-text-primary)] truncate flex-1 pr-2'>
                        {skill.name}
                      </h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${getLevelColor(skill.level)} flex-shrink-0 ml-2`}
                      >
                        {skill.level}
                      </span>
                    </div>

                    {skill.description && (
                      <p className='text-xs text-[var(--color-text-secondary)] mb-3 line-clamp-2 break-words overflow-hidden'>
                        {skill.description}
                      </p>
                    )}

                    <div className='space-y-2'>
                      <div className='flex items-center justify-between text-xs text-[var(--color-text-secondary)] min-w-0'>
                        <span className='truncate pr-2'>Proficiency</span>
                        <span className='capitalize flex-shrink-0'>{skill.level}</span>
                      </div>
                      <div className='w-full bg-[var(--color-surface-primary)] rounded-full h-2 overflow-hidden'>
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

            <div className='mt-2 flex-shrink-0'>
              <div className='
                p-2 rounded-lg
                bg-[var(--color-surface-primary)]/30 backdrop-blur-sm
                border border-[var(--color-border)]
                overflow-hidden
                w-full
              '>
                <h4 className='font-semibold text-[var(--color-text-primary)] mb-3'>
                  Skills Overview
                </h4>
                <div className='grid grid-cols-2 gap-2 text-center'>
                  {[
                    {
                      label: 'Total Skills',
                      value: skillCategories.reduce(
                        (acc, cat) => acc + cat.skills.length,
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
                      <div className='text-lg font-bold text-[var(--color-accent-primary)] mb-1'>
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

export default function SkillsWindow() {
  return <SkillsWindowClient />;
}
