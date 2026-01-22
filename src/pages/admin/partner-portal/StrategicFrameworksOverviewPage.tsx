import React from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  TrendingUp,
  Compass,
  Layout,
  PieChart,
  RefreshCw,
  Zap,
  Network,
  FlaskConical,
  Lightbulb
} from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { ADMIN_ROUTES } from '../../../lib/admin-routes';
import { useLanguage } from '../../../contexts/LanguageContext';

interface Framework {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  category: string;
  benefits: string[];
}

export default function StrategicFrameworksOverviewPage() {
  const { t } = useLanguage();
  const frameworks: Framework[] = [
    {
      id: 'okr',
      name: 'OKR - Objectives & Key Results',
      description: 'Set measurable goals and track progress with key results. Align efforts, ensure transparency, and drive accountability.',
      icon: <Target className="w-8 h-8 text-blue-600" />,
      path: ADMIN_ROUTES.OKR,
      category: 'Goal Setting',
      benefits: ['Goal Alignment', 'Progress Tracking', 'Transparency']
    },
    {
      id: 'swot',
      name: 'SWOT Analysis',
      description: 'Assess internal strengths and weaknesses, external opportunities and threats to inform strategic decisions.',
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      path: ADMIN_ROUTES.SWOT,
      category: 'Strategic Planning',
      benefits: ['Strategic Clarity', 'Risk Mitigation', 'Opportunity Discovery']
    },
    {
      id: 'porter',
      name: "Porter's Five Forces",
      description: 'Analyze competitive forces in your industry to develop strategies that protect and enhance market position.',
      icon: <Compass className="w-8 h-8 text-purple-600" />,
      path: ADMIN_ROUTES.PORTER,
      category: 'Market Analysis',
      benefits: ['Competitive Intelligence', 'Market Positioning', 'Strategic Advantage']
    },
    {
      id: 'bmc',
      name: 'Business Model Canvas',
      description: 'Design and iterate your business model across nine building blocks to ensure a robust and adaptable strategy.',
      icon: <Layout className="w-8 h-8 text-orange-600" />,
      path: ADMIN_ROUTES.BMC,
      category: 'Business Strategy',
      benefits: ['Business Model Design', 'Innovation', 'Strategic Alignment']
    },
    {
      id: 'bsc',
      name: 'Balanced Scorecard',
      description: 'Measure organizational performance across financial, customer, internal processes, and learning perspectives.',
      icon: <PieChart className="w-8 h-8 text-teal-600" />,
      path: ADMIN_ROUTES.BSC,
      category: 'Performance Management',
      benefits: ['Balanced Performance', 'Strategic Execution', 'KPI Tracking']
    },
    {
      id: 'adkar',
      name: 'Change Management (ADKAR)',
      description: 'Build awareness, desire, knowledge, ability, and reinforcement to drive successful organizational change.',
      icon: <RefreshCw className="w-8 h-8 text-indigo-600" />,
      path: ADMIN_ROUTES.ADKAR,
      category: 'Change Management',
      benefits: ['Change Success', 'Adoption', 'Sustainability']
    },
    {
      id: 'agile',
      name: 'Agile Transformation',
      description: 'Implement agile practices to increase adaptability, innovation, and team collaboration.',
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      path: ADMIN_ROUTES.AGILE,
      category: 'Operational Excellence',
      benefits: ['Agility', 'Faster Delivery', 'Team Empowerment']
    },
    {
      id: 'mckinsey',
      name: 'McKinsey 7S Framework',
      description: 'Align seven organizational elements - Strategy, Structure, Systems, Shared Values, Skills, Style, and Staff.',
      icon: <Network className="w-8 h-8 text-pink-600" />,
      path: ADMIN_ROUTES.MCKINSEY_7S,
      category: 'Organizational Alignment',
      benefits: ['Organizational Alignment', 'Change Readiness', 'Performance Optimization']
    },
    {
      id: 'lean',
      name: 'Lean Startup Methodology',
      description: 'Create MVPs and test hypotheses quickly through iterative learning and customer feedback.',
      icon: <FlaskConical className="w-8 h-8 text-cyan-600" />,
      path: ADMIN_ROUTES.LEAN_STARTUP,
      category: 'Innovation',
      benefits: ['Rapid Testing', 'Customer Validation', 'Risk Reduction']
    },
    {
      id: 'design_thinking',
      name: 'Design Thinking',
      description: 'Use empathy, ideation, and prototyping to create user-centered, innovative solutions.',
      icon: <Lightbulb className="w-8 h-8 text-amber-600" />,
      path: ADMIN_ROUTES.DESIGN_THINKING,
      category: 'Innovation',
      benefits: ['User-Centered Design', 'Innovation', 'Problem Solving']
    }
  ];

  const categories = Array.from(new Set(frameworks.map(f => f.category)));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Strategic Frameworks"
        description="Enterprise-grade strategic and operational models to drive organizational growth, leadership development, and sustainable transformation."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available Frameworks</p>
              <p className="text-2xl font-bold text-gray-900">{frameworks.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Layout className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Lightbulb className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Enterprise Ready</p>
              <p className="text-2xl font-bold text-gray-900">100%</p>
            </div>
          </div>
        </Card>
      </div>

      {categories.map(category => (
        <div key={category} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">{category}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {frameworks
              .filter(f => f.category === category)
              .map(framework => (
                <Link key={framework.id} to={framework.path}>
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        {framework.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {framework.name}
                        </h3>
                        <p className="text-sm text-gray-500">{framework.category}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {framework.description}
                    </p>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 uppercase">Key Benefits</p>
                      <div className="flex flex-wrap gap-2">
                        {framework.benefits.map((benefit, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      ))}

      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-lg">
            <Lightbulb className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Enterprise-Grade Strategic Tools</h3>
            <p className="text-sm text-gray-600 mb-4">
              All frameworks are designed to enterprise standards, combining proven methodologies with real-time insights,
              AI-powered recommendations, and seamless integration with your projects and customer data.
            </p>
            <p className="text-xs text-gray-500">
              Inspired by world-class consulting firms including McKinsey, BCG, Bain, Accenture, and leading technology companies.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
