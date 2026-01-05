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
  const frameworks: Framework[] = [
    {
      id: 'okr',
      name: 'OKR - Mål & Nyckelresultat',
      description: 'Sätt mätbara mål och följ framsteg med nyckelresultat. Samordna insatser, säkerställ transparens och driv ansvarighet.',
      icon: <Target className="w-8 h-8 text-blue-600" />,
      path: ADMIN_ROUTES.OKR,
      category: 'Målsättning',
      benefits: ['Målsamordning', 'Framstegsspårning', 'Transparens']
    },
    {
      id: 'swot',
      name: 'SWOT-analys',
      description: 'Bedöm interna styrkor och svagheter, externa möjligheter och hot för att informera strategiska beslut.',
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      path: ADMIN_ROUTES.SWOT,
      category: 'Strategisk Planering',
      benefits: ['Strategisk Klarhet', 'Riskhantering', 'Möjlighetsupptäckt']
    },
    {
      id: 'porter',
      name: "Porters Five Forces",
      description: 'Analysera konkurrenskrafter i er bransch för att utveckla strategier som skyddar och stärker marknadsposition.',
      icon: <Compass className="w-8 h-8 text-purple-600" />,
      path: ADMIN_ROUTES.PORTER,
      category: 'Marknadsanalys',
      benefits: ['Konkurrensinsikt', 'Marknadspositionering', 'Strategisk Fördel']
    },
    {
      id: 'bmc',
      name: 'Business Model Canvas',
      description: 'Designa och iterera er affärsmodell över nio byggstenar för att säkerställa en robust och anpassningsbar strategi.',
      icon: <Layout className="w-8 h-8 text-orange-600" />,
      path: ADMIN_ROUTES.BMC,
      category: 'Affärsstrategi',
      benefits: ['Affärsmodelldesign', 'Innovation', 'Strategisk Samordning']
    },
    {
      id: 'bsc',
      name: 'Balanced Scorecard',
      description: 'Mät organisatorisk prestation över finansiella, kund-, interna process- och lärandeperspektiv.',
      icon: <PieChart className="w-8 h-8 text-teal-600" />,
      path: ADMIN_ROUTES.BSC,
      category: 'Prestationshantering',
      benefits: ['Balanserad Prestation', 'Strategisk Verkställighet', 'KPI-spårning']
    },
    {
      id: 'adkar',
      name: 'Förändringsledning (ADKAR)',
      description: 'Bygg medvetenhet, vilja, kunskap, förmåga och förstärkning för att driva framgångsrik organisatorisk förändring.',
      icon: <RefreshCw className="w-8 h-8 text-indigo-600" />,
      path: ADMIN_ROUTES.ADKAR,
      category: 'Förändringsledning',
      benefits: ['Förändringsframgång', 'Adoption', 'Hållbarhet']
    },
    {
      id: 'agile',
      name: 'Agil Transformation',
      description: 'Implementera agila metoder för att öka anpassningsförmåga, innovation och teamsamarbete.',
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      path: ADMIN_ROUTES.AGILE,
      category: 'Operativ Excellens',
      benefits: ['Smidighet', 'Snabbare Leverans', 'Teambemyndigande']
    },
    {
      id: 'mckinsey',
      name: 'McKinsey 7S-ramverk',
      description: 'Samordna sju organisatoriska element - Strategi, Struktur, System, Delade Värderingar, Kompetenser, Stil och Personal.',
      icon: <Network className="w-8 h-8 text-pink-600" />,
      path: ADMIN_ROUTES.MCKINSEY_7S,
      category: 'Organisatorisk Samordning',
      benefits: ['Organisatorisk Samordning', 'Förändringsberedskap', 'Prestationsoptimering']
    },
    {
      id: 'lean',
      name: 'Lean Startup-metodik',
      description: 'Skapa MVP:er och testa hypoteser snabbt genom iterativt lärande och kundfeedback.',
      icon: <FlaskConical className="w-8 h-8 text-cyan-600" />,
      path: ADMIN_ROUTES.LEAN_STARTUP,
      category: 'Innovation',
      benefits: ['Snabb Testning', 'Kundvalidering', 'Riskreduktion']
    },
    {
      id: 'design_thinking',
      name: 'Design Thinking',
      description: 'Använd empati, idégenerering och prototyper för att skapa användarcentrerade, innovativa lösningar.',
      icon: <Lightbulb className="w-8 h-8 text-amber-600" />,
      path: ADMIN_ROUTES.DESIGN_THINKING,
      category: 'Innovation',
      benefits: ['Användarcentrerad Design', 'Innovation', 'Problemlösning']
    }
  ];

  const categories = Array.from(new Set(frameworks.map(f => f.category)));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Strategiska Ramverk"
        description="Strategiska och operativa modeller i företagsklass för att driva organisatorisk tillväxt, ledarutveckling och hållbar transformation."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tillgängliga Ramverk</p>
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
              <p className="text-sm text-gray-600">Kategorier</p>
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
              <p className="text-sm text-gray-600">Företagsklara</p>
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
                      <p className="text-xs font-medium text-gray-500 uppercase">Viktiga Fördelar</p>
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
            <h3 className="font-semibold text-gray-900 mb-2">Strategiska Verktyg i Företagsklass</h3>
            <p className="text-sm text-gray-600 mb-4">
              Alla ramverk är utformade enligt företagsstandarder och kombinerar beprövade metoder med realtidsinsikter,
              AI-drivna rekommendationer och sömlös integration med era projekt och kunddata.
            </p>
            <p className="text-xs text-gray-500">
              Inspirerade av världsledande konsultfirmor inklusive McKinsey, BCG, Bain, Accenture och ledande teknikföretag.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
