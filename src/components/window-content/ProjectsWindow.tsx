import { FolderGit2, TrendingUp, Brain, Gamepad2, Code2, Sparkles, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { ClientSideAnimations } from './ClientSideAnimations';

export const DeploymentEffect = ({
  text = '🫣 Nothing to show here just yet! Deployed apps coming…',
  speed = 50,
  className = '',
}: {
  text?: string;
  speed?: number;
  className?: string;
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = text;
      const updatedText = isDeleting
        ? fullText.substring(0, displayedText.length - 1)
        : fullText.substring(0, displayedText.length + 1);

      setDisplayedText(updatedText);

      if (!isDeleting && updatedText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const ticker = setTimeout(handleTyping, speed);
    return () => clearTimeout(ticker);
  }, [displayedText, isDeleting, text, loopNum, speed]);

  return (
    <span
      className={`text-[var(--color-text-secondary)] text-center mt-2 ${className}`}
    >
      {displayedText}
      <span className='animate-ping'>|</span>
    </span>
  );
};

interface Project {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'in-progress' | 'planning' | 'completed';
  techStack: string[];
  progress: number;
  color: string;
}

const projects: Project[] = [
  {
    id: 'gold-tracker',
    title: 'Gold Analysis Tracker',
    description: 'Advanced financial analysis tool for gold market tracking with real-time data visualization and predictive analytics.',
    icon: <TrendingUp className="w-6 h-6" />,
    status: 'in-progress',
    techStack: ['TypeScript', 'Next.js', 'Python', 'PyTorch', 'Pandas', 'Chart.js'],
    progress: 65,
    color: '#FFD700'
  },
  {
    id: 'ai-jira',
    title: 'AI-Powered Jira Tracker',
    description: 'Intelligent project management tool with AI-generated summaries and automated ticket analysis, inspired by Botovi\'s MCPs.',
    icon: <Brain className="w-6 h-6" />,
    status: 'in-progress',
    techStack: ['TypeScript', 'Next.js', 'OpenAI API', 'Jira API', 'React Query'],
    progress: 48,
    color: '#7C3AED'
  },
  {
    id: '3d-chess',
    title: '3D Chess Game',
    description: 'Immersive 3D chess experience with custom piece models, realistic physics, and multiplayer capabilities.',
    icon: <Gamepad2 className="w-6 h-6" />,
    status: 'in-progress',
    techStack: ['TypeScript', 'Next.js', 'Three.js', 'React Three Fiber', 'WebGL'],
    progress: 35,
    color: '#10B981'
  }
];

const getStatusIcon = (status: Project['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case 'in-progress':
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case 'planning':
      return <AlertCircle className="w-4 h-4 text-blue-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-500" />;
  }
};

const getStatusText = (status: Project['status']) => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'in-progress':
      return 'In Progress';
    case 'planning':
      return 'Planning';
    default:
      return 'Unknown';
  }
};

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="bg-[var(--color-surface-primary)] border-[var(--color-border)] hover:border-[var(--color-accent-primary)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-accent-primary)]/20 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${project.color}20`, border: `1px solid ${project.color}40` }}
            >
              <div style={{ color: project.color }}>
                {project.icon}
              </div>
            </div>
            <div>
              <CardTitle className="text-[var(--color-text-primary)] text-lg font-bold">
                {project.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(project.status)}
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {getStatusText(project.status)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-[var(--color-text-secondary)]">
              {project.progress}%
            </div>
            <div className="w-16 h-2 bg-[var(--color-surface-primary)] rounded-full overflow-hidden border border-[var(--color-border)]">
              <div 
                className="h-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${project.progress}%`,
                  backgroundColor: project.color
                }}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <CardDescription className="text-[var(--color-text-secondary)] mb-4 leading-relaxed">
          {project.description}
        </CardDescription>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="text-xs border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] transition-colors"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              variant="outline"
              className="text-xs border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/10"
            >
              View Details
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="text-xs border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/10"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Demo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectsWindowClient() {
  return (
    <ScrollArea className='h-full'>
      <div className='p-6 md:p-8 lg:p-10'>
        <ClientSideAnimations>
          <div className='text-center mb-8'>
            <h1 className='text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]'>
              Projects
            </h1>
            <p className='text-lg md:text-xl text-[var(--color-accent-primary)] font-medium'>
              Current work in progress
            </p>
          </div>
        </ClientSideAnimations>

        <ClientSideAnimations delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {projects.map((project, index) => (
              <div key={project.id} style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </ClientSideAnimations>

        <ClientSideAnimations delay={0.6}>
          <div className='flex flex-col items-center justify-center p-6 bg-[var(--color-surface-secondary)] rounded-lg shadow-lg border border-[var(--color-border)]'>
            <FolderGit2 className='w-12 h-12 text-[var(--color-accent-primary)] mb-4' />
            <h2 className='text-xl font-semibold text-[var(--color-text-primary)] mb-2'>
              More Coming Soon
            </h2>
            <DeploymentEffect
              text='🫣 Deployed MVPs and live demos coming soon…'
              className='text-sm font-medium text-[var(--color-text-secondary)] text-center'
            />
          </div>
        </ClientSideAnimations>
      </div>
    </ScrollArea>
  );
}

export default function ProjectsWindow() {
  return <ProjectsWindowClient />;
}
