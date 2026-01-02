import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronRight, LayoutDashboard, TrendingUp, FileText } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface HelpSection {
  id: string;
  title: { en: string; sv: string };
  icon: React.ElementType;
  content: { en: string; sv: string };
  subsections?: Array<{
    title: { en: string; sv: string };
    content: { en: string; sv: string };
  }>;
}

const CUSTOMER_HELP_CONTENT: HelpSection[] = [
  {
    id: 'getting-started',
    title: {
      en: 'Getting Started',
      sv: 'Komma igång'
    },
    icon: HelpCircle,
    content: {
      en: 'Welcome to your Customer Portal. This is your central hub for monitoring engagement progress, reviewing delivered work, and tracking capacity consumption. The portal provides complete transparency into your active projects and their status.',
      sv: 'Välkommen till din Kundportal. Detta är din centrala plattform för att övervaka engagemangsframsteg, granska levererat arbete och spåra kapacitetsförbrukning. Portalen ger fullständig transparens i dina aktiva projekt och deras status.'
    },
    subsections: [
      {
        title: { en: 'What is the Customer Portal?', sv: 'Vad är Kundportalen?' },
        content: {
          en: 'The Customer Portal is a dedicated interface that provides visibility into your ongoing work with NorthForce. You can view project progress, monitor capacity usage, review completed deliveries, and access documentation—all in one secure location.',
          sv: 'Kundportalen är ett dedikerat gränssnitt som ger synlighet i ditt pågående arbete med NorthForce. Du kan se projektframsteg, övervaka kapacitetsanvändning, granska slutförda leveranser och få tillgång till dokumentation—allt på en säker plats.'
        }
      },
      {
        title: { en: 'How to use this portal', sv: 'Hur du använder portalen' },
        content: {
          en: 'Navigate using the menu on the left. The Overview provides a summary of your engagement. Activity shows detailed work logs. Documents contain deliverables and reports. Use the language toggle to switch between English and Swedish at any time.',
          sv: 'Navigera med menyn till vänster. Översikten ger en sammanfattning av ditt engagemang. Aktivitet visar detaljerade arbetsloggar. Dokument innehåller leveranser och rapporter. Använd språkväxlaren för att byta mellan engelska och svenska när som helst.'
        }
      }
    ]
  },
  {
    id: 'overview',
    title: {
      en: 'Overview',
      sv: 'Översikt'
    },
    icon: LayoutDashboard,
    content: {
      en: 'The Overview page is your engagement dashboard. It displays current project status, capacity consumption, and recent activity at a glance.',
      sv: 'Översiktssidan är din engagemangsöversikt. Den visar aktuell projektstatus, kapacitetsförbrukning och senaste aktivitet i ett ögonkast.'
    },
    subsections: [
      {
        title: { en: 'Active Projects', sv: 'Aktiva projekt' },
        content: {
          en: 'Shows the number of projects currently in progress. Active projects are those where work is being performed and deliverables are being produced.',
          sv: 'Visar antalet projekt som för närvarande pågår. Aktiva projekt är de där arbete utförs och leveranser produceras.'
        }
      },
      {
        title: { en: 'Completed Deliveries', sv: 'Slutförda leveranser' },
        content: {
          en: 'Tracks the total number of completed projects and deliverables. This metric reflects the cumulative value delivered to your organization.',
          sv: 'Spårar det totala antalet slutförda projekt och leveranser. Detta mått återspeglar det ackumulerade värdet som levererats till din organisation.'
        }
      },
      {
        title: { en: 'Capacity Remaining', sv: 'Återstående kapacitet' },
        content: {
          en: 'Displays your available capacity allocation. Capacity is measured in credits, which represent consultant time and effort. Monitor this to understand how much work can still be delivered under your current agreement.',
          sv: 'Visar din tillgängliga kapacitetsallokering. Kapacitet mäts i krediter, som representerar konsulttid och insats. Övervaka detta för att förstå hur mycket arbete som fortfarande kan levereras under ditt nuvarande avtal.'
        }
      },
      {
        title: { en: 'Capacity Utilization', sv: 'Kapacitetsutnyttjande' },
        content: {
          en: 'Shows the percentage of your allocated capacity that has been consumed. This helps you plan for future work and understand your current engagement pace.',
          sv: 'Visar procentandelen av din allokerade kapacitet som har förbrukats. Detta hjälper dig att planera för framtida arbete och förstå din nuvarande engagemangstakt.'
        }
      },
      {
        title: { en: 'Recent Activity', sv: 'Senaste aktivitet' },
        content: {
          en: 'Lists the most recent deliveries, milestones, and updates. This provides a quick view of what has been accomplished recently.',
          sv: 'Listar de senaste leveranserna, milstolparna och uppdateringarna. Detta ger en snabb överblick av vad som nyligen har åstadkommits.'
        }
      }
    ]
  },
  {
    id: 'activity',
    title: {
      en: 'Activity',
      sv: 'Aktivitet'
    },
    icon: TrendingUp,
    content: {
      en: 'The Activity page provides detailed logs of all work performed on your projects. Each entry shows what was done, when it was completed, and how much capacity was consumed.',
      sv: 'Aktivitetssidan tillhandahåller detaljerade loggar av allt arbete som utförts på dina projekt. Varje post visar vad som gjordes, när det slutfördes och hur mycket kapacitet som förbrukades.'
    },
    subsections: [
      {
        title: { en: 'Activity entries', sv: 'Aktivitetsposter' },
        content: {
          en: 'Each entry includes the project name, type of work performed, a description of what was accomplished, the date, hours worked, and credits consumed. This provides complete transparency into how your capacity is being utilized.',
          sv: 'Varje post inkluderar projektnamn, typ av utfört arbete, en beskrivning av vad som åstadkommits, datum, arbetade timmar och förbrukade krediter. Detta ger fullständig transparens i hur din kapacitet används.'
        }
      },
      {
        title: { en: 'Filtering activity', sv: 'Filtrera aktivitet' },
        content: {
          en: 'Use the filter options to view activity for specific time periods: last week, last month, or all time. This helps you focus on recent work or review historical progress.',
          sv: 'Använd filteralternativen för att se aktivitet för specifika tidsperioder: senaste veckan, senaste månaden eller all tid. Detta hjälper dig att fokusera på nyligt arbete eller granska historisk framsteg.'
        }
      },
      {
        title: { en: 'Understanding work types', sv: 'Förstå arbetstyper' },
        content: {
          en: 'Different types of work consume capacity at different rates. Strategic work typically requires more credits per hour than operational support. The work type shown in each entry helps you understand the nature and complexity of the work performed.',
          sv: 'Olika typer av arbete förbrukar kapacitet i olika takt. Strategiskt arbete kräver vanligtvis fler krediter per timme än operativ support. Arbetstypen som visas i varje post hjälper dig att förstå arten och komplexiteten av det utförda arbetet.'
        }
      }
    ]
  },
  {
    id: 'documents',
    title: {
      en: 'Documents',
      sv: 'Dokument'
    },
    icon: FileText,
    content: {
      en: 'The Documents section provides access to deliverables, reports, and other materials produced during your engagement. This area is currently being prepared and will be available soon.',
      sv: 'Dokumentsektionen ger tillgång till leveranser, rapporter och annat material som produceras under ditt engagemang. Detta område förbereds för närvarande och kommer att vara tillgängligt snart.'
    }
  },
  {
    id: 'key-concepts',
    title: {
      en: 'Key Concepts',
      sv: 'Nyckelbegrepp'
    },
    icon: HelpCircle,
    content: {
      en: 'Understanding these concepts will help you make the most of your Customer Portal.',
      sv: 'Att förstå dessa begrepp hjälper dig att få ut det mesta av din Kundportal.'
    },
    subsections: [
      {
        title: { en: 'Credits', sv: 'Krediter' },
        content: {
          en: 'Credits are the unit of measurement for capacity. They represent consultant time and effort, adjusted for work complexity. Your agreement specifies a credit allocation, and work consumes credits based on hours and work type. Monitor your credit balance to understand remaining capacity.',
          sv: 'Krediter är måttenheten för kapacitet. De representerar konsulttid och insats, justerad för arbetskomplexitet. Ditt avtal specificerar en kredittilldelning, och arbete förbrukar krediter baserat på timmar och arbetstyp. Övervaka ditt kreditsaldo för att förstå återstående kapacitet.'
        }
      },
      {
        title: { en: 'Capacity', sv: 'Kapacitet' },
        content: {
          en: 'Capacity is the total amount of work that can be delivered under your agreement. It is measured in credits and represents the time and expertise available for your projects. Capacity is allocated upfront and consumed as work is performed.',
          sv: 'Kapacitet är den totala mängden arbete som kan levereras under ditt avtal. Det mäts i krediter och representerar tiden och expertisen som är tillgänglig för dina projekt. Kapacitet allokeras i förväg och förbrukas när arbete utförs.'
        }
      },
      {
        title: { en: 'Projects', sv: 'Projekt' },
        content: {
          en: 'Projects are distinct initiatives with defined objectives and timelines. Each project organizes work toward specific deliverables. Your engagement may include one or multiple concurrent projects, all visible in this portal.',
          sv: 'Projekt är distinkta initiativ med definierade mål och tidslinjer. Varje projekt organiserar arbete mot specifika leveranser. Ditt engagemang kan inkludera ett eller flera samtidiga projekt, alla synliga i denna portal.'
        }
      },
      {
        title: { en: 'Utilization', sv: 'Utnyttjande' },
        content: {
          en: 'Utilization shows what percentage of your allocated capacity has been consumed. High utilization indicates active engagement and value delivery. Low utilization suggests available capacity for additional work. Monitor utilization to plan future initiatives.',
          sv: 'Utnyttjande visar vilken procentandel av din allokerade kapacitet som har förbrukats. Högt utnyttjande indikerar aktivt engagemang och värdeleverans. Lågt utnyttjande tyder på tillgänglig kapacitet för ytterligare arbete. Övervaka utnyttjande för att planera framtida initiativ.'
        }
      }
    ]
  }
];

const CustomerHelpPage: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['getting-started']));
  const { language } = useLanguage();
  const { t } = useLanguage();
  const lang = language as 'en' | 'sv';

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('customer.help.title')}</h1>
        <p className="text-gray-500 mt-2">{t('customer.help.subtitle')}</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {t('customer.help.welcome_title')}
        </h2>
        <p className="text-sm text-gray-700">
          {t('customer.help.welcome_text')}
        </p>
      </div>

      <div className="space-y-4">
        {CUSTOMER_HELP_CONTENT.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSections.has(section.id);

          return (
            <div key={section.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">{section.title[lang]}</h3>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 border-t border-gray-200">
                  <div className="pt-6 space-y-6">
                    <p className="text-sm text-gray-700 leading-relaxed">{section.content[lang]}</p>

                    {section.subsections && section.subsections.length > 0 && (
                      <div className="space-y-4">
                        {section.subsections.map((subsection, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">
                              {subsection.title[lang]}
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {subsection.content[lang]}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          {t('customer.help.need_support')}
        </h3>
        <p className="text-sm text-gray-600">
          {t('customer.help.support_text')}
        </p>
      </div>
    </div>
  );
};

export default CustomerHelpPage;
