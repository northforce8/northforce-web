import React, { useState } from 'react';
import { Book, Users, DollarSign, Calendar, BarChart3, Settings, ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';
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

const HELP_CONTENT: HelpSection[] = [
  {
    id: 'getting-started',
    title: {
      en: 'Getting Started',
      sv: 'Komma igång'
    },
    icon: Book,
    content: {
      en: 'The NorthForce Partner Portal is an enterprise capacity management system designed for consultants and delivery partners. It enables structured project delivery, resource allocation, time tracking, and financial oversight across customer engagements.',
      sv: 'NorthForce Partnerportal är ett företagssystem för kapacitetshantering designat för konsulter och leveranspartners. Det möjliggör strukturerad projektleverans, resursallokering, tidsrapportering och finansiell övervakning över kundengagemang.'
    },
    subsections: [
      {
        title: { en: 'Who is this system for?', sv: 'Vem är systemet för?' },
        content: {
          en: 'This portal is designed for delivery partners, consultants, and project managers who execute client work. It supports daily operations including capacity planning, time reporting, project tracking, and performance monitoring. Users are expected to have operational responsibility for customer deliveries.',
          sv: 'Denna portal är designad för leveranspartners, konsulter och projektledare som utför kundarbete. Den stödjer daglig verksamhet inklusive kapacitetsplanering, tidsrapportering, projektspårning och prestationsövervakning. Användare förväntas ha operativt ansvar för kundleveranser.'
        }
      },
      {
        title: { en: 'Core working principles', sv: 'Kärnprinciper för arbete' },
        content: {
          en: 'Work is organized around customers, projects, and credits. Partners allocate capacity to projects, report time against work types, and track progress through billing periods. The system maintains a single source of truth for all delivery activity, ensuring transparency and accountability across all stakeholders.',
          sv: 'Arbetet är organiserat kring kunder, projekt och krediter. Partners allokerar kapacitet till projekt, rapporterar tid mot arbetstyper och spårar framsteg genom faktureringsperioder. Systemet upprätthåller en enda sanningskälla för all leveransaktivitet, vilket säkerställer transparens och ansvarighet över alla intressenter.'
        }
      },
      {
        title: { en: 'Mental model', sv: 'Mental modell' },
        content: {
          en: 'Think of the system in layers: Customers engage for outcomes. Projects structure that work. Credits measure capacity consumption. Partners deliver execution. The portal connects these layers, providing visibility from strategic planning through operational delivery to financial reconciliation.',
          sv: 'Tänk på systemet i lager: Kunder engagerar för resultat. Projekt strukturerar det arbetet. Krediter mäter kapacitetsförbrukning. Partners levererar genomförande. Portalen kopplar samman dessa lager och ger synlighet från strategisk planering genom operativ leverans till finansiell avstämning.'
        }
      }
    ]
  },
  {
    id: 'sales-customers',
    title: {
      en: 'Sales & Customers',
      sv: 'Försäljning & Kunder'
    },
    icon: Users,
    content: {
      en: 'This area manages the complete customer lifecycle from initial lead through active engagement. It provides tools for lead qualification, customer relationship management, and engagement oversight.',
      sv: 'Detta område hanterar den kompletta kundlivscykeln från initial lead till aktivt engagemang. Det tillhandahåller verktyg för leadkvalificering, kundrelationshantering och engagemangsövervakning.'
    },
    subsections: [
      {
        title: { en: 'Lead Management', sv: 'Leadhantering' },
        content: {
          en: 'Incoming leads from all sources are centralized here. Consultants qualify leads by assessing fit, recording interactions, and moving prospects through defined stages. Key actions include updating lead status, logging notes from discovery calls, and assigning leads to appropriate team members. Do not delete leads—inactive leads should be marked as lost with clear reasoning documented.',
          sv: 'Inkommande leads från alla källor centraliseras här. Konsulter kvalificerar leads genom att bedöma passform, registrera interaktioner och flytta prospekt genom definierade stadier. Nyckelåtgärder inkluderar uppdatering av leadstatus, loggning av anteckningar från upptäcktssamtal och tilldelning av leads till lämpliga teammedlemmar. Radera inte leads—inaktiva leads ska markeras som förlorade med tydlig motivering dokumenterad.'
        }
      },
      {
        title: { en: 'Customer Management', sv: 'Kundhantering' },
        content: {
          en: 'Active customers are managed through customer records containing contact information, engagement history, and associated projects. Use this area to view customer health metrics, review ongoing projects, monitor credit consumption, and access customer-specific documentation. Customer records serve as the authoritative source for all engagement activity.',
          sv: 'Aktiva kunder hanteras genom kundregister som innehåller kontaktinformation, engagemangshistorik och associerade projekt. Använd detta område för att se kundhälsomått, granska pågående projekt, övervaka kreditförbrukning och få tillgång till kundspecifik dokumentation. Kundregister fungerar som den auktoritativa källan för all engagemangsaktivitet.'
        }
      },
      {
        title: { en: 'Daily usage', sv: 'Daglig användning' },
        content: {
          en: 'Check Lead Management daily for new inquiries. Review customer dashboards weekly to assess engagement health. Update customer notes after significant interactions. Use customer views to prepare for client meetings and track deliverable progress.',
          sv: 'Kontrollera Leadhantering dagligen för nya förfrågningar. Granska kundinstrumentpaneler veckovis för att bedöma engagemangshälsa. Uppdatera kundanteckningar efter betydande interaktioner. Använd kundvyer för att förbereda för kundmöten och spåra leveransframsteg.'
        }
      }
    ]
  },
  {
    id: 'delivery',
    title: {
      en: 'Delivery',
      sv: 'Leverans'
    },
    icon: Calendar,
    content: {
      en: 'Delivery encompasses all operational execution—from project setup through time tracking to completion. This area ensures work is properly structured, resources are allocated efficiently, and progress is documented accurately.',
      sv: 'Leverans omfattar all operativ genomförande—från projektuppsättning genom tidsrapportering till slutförande. Detta område säkerställer att arbete är korrekt strukturerat, resurser är effektivt allokerade och framsteg dokumenteras noggrant.'
    },
    subsections: [
      {
        title: { en: 'Projects', sv: 'Projekt' },
        content: {
          en: 'Projects structure customer work into manageable scopes. Each project defines objectives, timeline, budget, and assigned resources. Create projects for distinct customer initiatives. Link projects to customers and contracts. Track project status from initiation through completion. Projects serve as the container for all time entries and deliverables.',
          sv: 'Projekt strukturerar kundarbete i hanterbara omfattningar. Varje projekt definierar mål, tidslinje, budget och tilldelade resurser. Skapa projekt för distinkta kundinitiativ. Länka projekt till kunder och kontrakt. Spåra projektstatus från initiering till slutförande. Projekt fungerar som behållare för alla tidsposter och leveranser.'
        }
      },
      {
        title: { en: 'Time Reporting', sv: 'Tidsrapportering' },
        content: {
          en: 'All consultant work must be logged through time entries. Record hours daily against specific projects and work types. Specify whether time is billable. Include descriptions that clearly communicate what was accomplished. Time entries feed into billing, forecasting, and capacity analytics. Late or missing time entries compromise financial accuracy and should be avoided.',
          sv: 'Allt konsultarbete måste loggas genom tidsposter. Registrera timmar dagligen mot specifika projekt och arbetstyper. Ange om tiden är fakturerbar. Inkludera beskrivningar som tydligt kommunicerar vad som åstadkommits. Tidsposter matar in i fakturering, prognoser och kapacitetsanalys. Sena eller saknade tidsposter kompromissar finansiell noggrannhet och bör undvikas.'
        }
      },
      {
        title: { en: 'Calendar & Planning', sv: 'Kalender & Planering' },
        content: {
          en: 'Capacity planning allocates partner availability to customer work. Use this area to schedule resources, identify capacity conflicts, and balance workload across engagements. Plan capacity at the weekly or monthly level. The system flags overallocation and underutilization automatically. Effective planning prevents burnout and ensures commitments are met.',
          sv: 'Kapacitetsplanering allokerar partnertillgänglighet till kundarbete. Använd detta område för att schemalägga resurser, identifiera kapacitetskonflikter och balansera arbetsbelastning över engagemang. Planera kapacitet på vecko- eller månadsnivå. Systemet flaggar överallokering och underutnyttjande automatiskt. Effektiv planering förhindrar utbrändhet och säkerställer att åtaganden uppfylls.'
        }
      },
      {
        title: { en: 'Notes', sv: 'Anteckningar' },
        content: {
          en: 'Use notes for collaboration and documentation. Link notes to customers, projects, or internal topics. Notes support meeting summaries, decision records, and knowledge transfer. Well-maintained notes reduce dependency on tribal knowledge and improve team coordination.',
          sv: 'Använd anteckningar för samarbete och dokumentation. Länka anteckningar till kunder, projekt eller interna ämnen. Anteckningar stödjer mötessammanfattningar, beslutsregister och kunskapsöverföring. Välskötta anteckningar minskar beroende av stamkunskap och förbättrar teamkoordinering.'
        }
      }
    ]
  },
  {
    id: 'finance',
    title: {
      en: 'Finance',
      sv: 'Ekonomi'
    },
    icon: DollarSign,
    content: {
      en: 'Finance provides complete visibility into revenue, costs, profitability, and billing across all customer engagements. This area ensures financial accuracy and supports business decision-making.',
      sv: 'Ekonomi ger fullständig synlighet i intäkter, kostnader, lönsamhet och fakturering över alla kundengagemang. Detta område säkerställer finansiell noggrannhet och stödjer affärsbeslut.'
    },
    subsections: [
      {
        title: { en: 'Contracts', sv: 'Kontrakt' },
        content: {
          en: 'Contracts formalize customer agreements including scope, pricing, payment terms, and duration. Each contract specifies credit allocation, billing frequency, and commercial terms. Review contract status regularly to track utilization and identify renewal opportunities. Contracts must be linked to customers and projects for proper financial tracking.',
          sv: 'Kontrakt formaliserar kundavtal inklusive omfattning, prissättning, betalningsvillkor och varaktighet. Varje kontrakt specificerar kredittilldelning, faktureringsfrekvens och kommersiella villkor. Granska kontraktsstatus regelbundet för att spåra utnyttjande och identifiera förnyelsmöjligheter. Kontrakt måste länkas till kunder och projekt för korrekt finansiell spårning.'
        }
      },
      {
        title: { en: 'Invoices', sv: 'Fakturor' },
        content: {
          en: 'Invoices are generated based on time entries, contract terms, and billing periods. Review invoices for accuracy before sending to customers. Track payment status and follow up on overdue invoices. The system generates invoice PDFs and maintains a complete audit trail of all billing activity.',
          sv: 'Fakturor genereras baserat på tidsposter, kontraktsvillkor och faktureringsperioder. Granska fakturor för noggrannhet innan de skickas till kunder. Spåra betalningsstatus och följ upp förfallna fakturor. Systemet genererar faktura-PDF:er och upprätthåller en fullständig revisionsspår av all faktureringsaktivitet.'
        }
      },
      {
        title: { en: 'Billing Periods', sv: 'Faktureringsperioder' },
        content: {
          en: 'Billing periods structure revenue recognition and invoicing cycles. Close periods monthly or per contract terms. Closed periods lock time entries to preserve financial integrity. Use billing periods to generate monthly reporting and reconcile delivered work against contractual commitments.',
          sv: 'Faktureringsperioder strukturerar intäktsredovisning och faktureringscykler. Stäng perioder månadsvis eller enligt kontraktsvillkor. Stängda perioder låser tidsposter för att bevara finansiell integritet. Använd faktureringsperioder för att generera månadsrapportering och stämma av levererat arbete mot avtalsenliga åtaganden.'
        }
      },
      {
        title: { en: 'Margin Analysis', sv: 'Marginalanalys' },
        content: {
          en: 'Margin analysis compares revenue against costs to assess engagement profitability. Monitor margins at the customer, project, and partner level. Low margins indicate pricing issues or delivery inefficiency. Use margin data to inform pricing decisions, resource allocation, and strategic planning.',
          sv: 'Marginalanalys jämför intäkter mot kostnader för att bedöma engagemangslönsamhet. Övervaka marginaler på kund-, projekt- och partnernivå. Låga marginaler indikerar prissättningsproblem eller leveransineffektivitet. Använd marginaldata för att informera prissättningsbeslut, resursallokering och strategisk planering.'
        }
      }
    ]
  },
  {
    id: 'resources',
    title: {
      en: 'Resources',
      sv: 'Resurser'
    },
    icon: Users,
    content: {
      en: 'Resources manages the partner network, capacity allocation, and pricing models that enable service delivery. This area ensures the right resources are available at the right cost.',
      sv: 'Resurser hanterar partnernätverket, kapacitetsallokering och prissättningsmodeller som möjliggör tjänsteleverans. Detta område säkerställer att rätt resurser är tillgängliga till rätt kostnad.'
    },
    subsections: [
      {
        title: { en: 'Partner Management', sv: 'Partnerhantering' },
        content: {
          en: 'Partners are delivery resources who execute customer work. Each partner has defined skills, capacity, and cost structure. Assign partners to customers and projects based on expertise and availability. Track partner performance, utilization, and quality metrics. Partner data feeds capacity planning and cost calculations.',
          sv: 'Partners är leveransresurser som genomför kundarbete. Varje partner har definierade färdigheter, kapacitet och kostnadsstruktur. Tilldela partners till kunder och projekt baserat på expertis och tillgänglighet. Spåra partnerprestanda, utnyttjande och kvalitetsmått. Partnerdata matar kapacitetsplanering och kostnadsberäkningar.'
        }
      },
      {
        title: { en: 'Capacity Plans', sv: 'Kapacitetsplaner' },
        content: {
          en: 'Capacity plans define subscription tiers that bundle system access with credit allocation. Plans specify monthly pricing, included credits, and service levels. Use this area to manage product offerings and understand how customers consume capacity. Plans form the commercial foundation of the business model.',
          sv: 'Kapacitetsplaner definierar prenumerationsnivåer som paketerar systemåtkomst med kredittilldelning. Planer specificerar månadsprissättning, inkluderade krediter och servicenivåer. Använd detta område för att hantera produkterbjudanden och förstå hur kunder konsumerar kapacitet. Planer utgör den kommersiella grunden för affärsmodellen.'
        }
      },
      {
        title: { en: 'Capacity Overview', sv: 'Kapacitetsöversikt' },
        content: {
          en: 'Capacity overview provides real-time visibility into available, allocated, and consumed capacity across the partner network. Use this to identify resource constraints, plan hiring needs, and balance workload. The overview aggregates data from time entries, planning allocations, and partner availability.',
          sv: 'Kapacitetsöversikt ger realtidssynlighet i tillgänglig, allokerad och förbrukad kapacitet över partnernätverket. Använd detta för att identifiera resursbegränsningar, planera rekryteringsbehov och balansera arbetsbelastning. Översikten aggregerar data från tidsposter, planeringsallokeringar och partnertillgänglighet.'
        }
      }
    ]
  },
  {
    id: 'analytics',
    title: {
      en: 'Analytics',
      sv: 'Analys'
    },
    icon: BarChart3,
    content: {
      en: 'Analytics transforms operational data into strategic insight. This area provides performance dashboards, forecasting tools, and AI-powered recommendations to drive informed decision-making.',
      sv: 'Analys omvandlar operativ data till strategisk insikt. Detta område tillhandahåller prestationsinstrumentpaneler, prognosverktyg och AI-drivna rekommendationer för att driva informerat beslutsfattande.'
    },
    subsections: [
      {
        title: { en: 'Credits & Forecasts', sv: 'Krediter & Prognoser' },
        content: {
          en: 'This dashboard tracks credit consumption, forecasts future usage, and identifies burn rate trends. Monitor credit balances against contractual allocations. Review forecasts to anticipate capacity needs and prevent overruns. Alerts notify when credits approach depletion, enabling proactive customer conversations.',
          sv: 'Denna instrumentpanel spårar kreditförbrukning, prognostiserar framtida användning och identifierar förbrukningstrender. Övervaka kreditsaldon mot avtalsenliga allokeringar. Granska prognoser för att förutse kapacitetsbehov och förhindra överförbrukning. Varningar meddelar när krediter närmar sig uttömning, vilket möjliggör proaktiva kundsamtal.'
        }
      },
      {
        title: { en: 'Enterprise Dashboard', sv: 'Företagsinstrumentpanel' },
        content: {
          en: 'The enterprise dashboard aggregates key metrics across sales, delivery, and finance. Use this for executive reporting and high-level performance tracking. Metrics include revenue, active customers, project count, partner utilization, and margin performance. This view provides the single-page business health check.',
          sv: 'Företagsinstrumentpanelen aggregerar nyckelmått över försäljning, leverans och ekonomi. Använd detta för ledningsrapportering och högnivåprestationsspårning. Mått inkluderar intäkter, aktiva kunder, projektantal, partnerutnyttjande och marginalprestanda. Denna vy tillhandahåller en-sidans affärshälsokontroll.'
        }
      },
      {
        title: { en: 'Reports', sv: 'Rapporter' },
        content: {
          en: 'Reports provide detailed analysis across all system areas. Generate custom reports for time tracking, billing reconciliation, capacity analysis, and customer health. Export data for external analysis or audit purposes. Use AI-generated insights to identify trends, risks, and opportunities automatically.',
          sv: 'Rapporter tillhandahåller detaljerad analys över alla systemområden. Generera anpassade rapporter för tidsuppföljning, faktureringsavstämning, kapacitetsanalys och kundhälsa. Exportera data för extern analys eller revisionsändamål. Använd AI-genererade insikter för att automatiskt identifiera trender, risker och möjligheter.'
        }
      }
    ]
  },
  {
    id: 'system',
    title: {
      en: 'System',
      sv: 'System'
    },
    icon: Settings,
    content: {
      en: 'System settings control portal configuration, user management, and operational parameters. This area is typically managed by administrators.',
      sv: 'Systeminställningar styr portalkonfiguration, användarhantering och operativa parametrar. Detta område hanteras vanligtvis av administratörer.'
    },
    subsections: [
      {
        title: { en: 'Settings', sv: 'Inställningar' },
        content: {
          en: 'Configure system-wide parameters including currency, work type definitions, credit multipliers, and notification preferences. Settings changes affect all users and should be made carefully with understanding of downstream impacts.',
          sv: 'Konfigurera systemövergripande parametrar inklusive valuta, arbetstypsdefinitioner, kreditmultiplikatorer och notifieringsinställningar. Inställningsändringar påverkar alla användare och bör göras noggrant med förståelse för nedströmspåverkan.'
        }
      },
      {
        title: { en: 'Support', sv: 'Support' },
        content: {
          en: 'Access system documentation, submit support requests, and track issue resolution. Use the support area for technical problems, feature requests, or usage questions that are not covered in this help documentation.',
          sv: 'Få tillgång till systemdokumentation, skicka supportförfrågningar och spåra problemlösning. Använd supportområdet för tekniska problem, funktionsförfrågningar eller användningsfrågor som inte täcks i denna hjälpdokumentation.'
        }
      },
      {
        title: { en: 'Health Monitoring', sv: 'Hälsoövervakning' },
        content: {
          en: 'The health page monitors system performance, data integrity, and operational metrics. Review regularly to ensure the portal operates correctly and data remains consistent. Address any warnings or errors promptly to maintain system reliability.',
          sv: 'Hälsosidan övervakar systemprestanda, dataintegritet och operativa mått. Granska regelbundet för att säkerställa att portalen fungerar korrekt och data förblir konsekvent. Åtgärda eventuella varningar eller fel omedelbart för att upprätthålla systemtillförlitlighet.'
        }
      }
    ]
  },
  {
    id: 'key-concepts',
    title: {
      en: 'Key Concepts',
      sv: 'Nyckelbegrepp'
    },
    icon: HelpCircle,
    content: {
      en: 'Understanding these core concepts is essential for effective system use.',
      sv: 'Att förstå dessa kärnbegrepp är avgörande för effektiv systemanvändning.'
    },
    subsections: [
      {
        title: { en: 'Capacity', sv: 'Kapacitet' },
        content: {
          en: 'Capacity represents the available working time that partners can allocate to customer work. Measured in credits, capacity is the fundamental resource that customers purchase and consultants consume through delivery. Capacity management ensures supply meets demand without overcommitment or underutilization.',
          sv: 'Kapacitet representerar den tillgängliga arbetstiden som partners kan allokera till kundarbete. Mätt i krediter är kapacitet den fundamentala resursen som kunder köper och konsulter förbrukar genom leverans. Kapacitetshantering säkerställer att tillgång möter efterfrågan utan överengagemang eller underutnyttjande.'
        }
      },
      {
        title: { en: 'Credits', sv: 'Krediter' },
        content: {
          en: 'Credits are the standard unit of work measurement. One credit represents a defined amount of consultant effort, adjusted by work type complexity. Credits normalize diverse work types into a common capacity currency. Customers purchase credit allocations; partners consume credits through time entries; the system tracks credit flow for billing and forecasting.',
          sv: 'Krediter är standardenheten för arbetsmätning. En kredit representerar en definierad mängd konsultinsats, justerad efter arbetstypskomplexitet. Krediter normaliserar olika arbetstyper till en gemensam kapacitetsvaluta. Kunder köper kreditallokeringar; partners förbrukar krediter genom tidsposter; systemet spårar kreditflöde för fakturering och prognoser.'
        }
      },
      {
        title: { en: 'Work Types', sv: 'Arbetstyper' },
        content: {
          en: 'Work types categorize delivery activities by skill level and complexity. Examples include strategy, implementation, support, and management. Each work type has a credit multiplier that reflects its resource intensity. Higher-complexity work consumes more credits per hour. Work types enable accurate cost tracking and capacity planning.',
          sv: 'Arbetstyper kategoriserar leveransaktiviteter efter färdighetsnivå och komplexitet. Exempel inkluderar strategi, implementering, support och ledning. Varje arbetstyp har en kreditmultiplikator som reflekterar dess resursintensitet. Arbete med högre komplexitet förbrukar fler krediter per timme. Arbetstyper möjliggör noggrann kostnadsspårning och kapacitetsplanering.'
        }
      },
      {
        title: { en: 'Forecasting', sv: 'Prognostisering' },
        content: {
          en: 'Forecasting projects future credit consumption based on historical usage patterns, active project scopes, and planned capacity allocations. Forecasts help identify when customers will exhaust credit balances, enabling proactive engagement management and contract renewals. Accurate forecasting requires consistent time reporting and capacity planning.',
          sv: 'Prognostisering projekterar framtida kreditförbrukning baserat på historiska användningsmönster, aktiva projektomfattningar och planerade kapacitetsallokeringar. Prognoser hjälper till att identifiera när kunder kommer att uttömma kreditsaldon, vilket möjliggör proaktiv engagemangshantering och kontraktsförnyelser. Noggrann prognostisering kräver konsekvent tidsrapportering och kapacitetsplanering.'
        }
      },
      {
        title: { en: 'Partners vs. Customers', sv: 'Partners vs. Kunder' },
        content: {
          en: 'Partners are internal delivery resources who execute work. Customers are external clients who purchase capacity and receive deliverables. Partners report time, consume capacity, and generate costs. Customers purchase credits, define projects, and receive value. The portal manages the relationship between these two entities, ensuring delivery aligns with commercial agreements.',
          sv: 'Partners är interna leveransresurser som genomför arbete. Kunder är externa klienter som köper kapacitet och tar emot leveranser. Partners rapporterar tid, förbrukar kapacitet och genererar kostnader. Kunder köper krediter, definierar projekt och tar emot värde. Portalen hanterar relationen mellan dessa två enheter och säkerställer att leverans överensstämmer med kommersiella avtal.'
        }
      },
      {
        title: { en: 'Projects vs. Contracts', sv: 'Projekt vs. Kontrakt' },
        content: {
          en: 'Contracts are commercial agreements that define pricing, payment terms, and credit allocation. Projects are operational containers for actual work execution. One contract may span multiple projects. Projects organize delivery; contracts govern commercial terms. Both must be properly linked for accurate financial tracking.',
          sv: 'Kontrakt är kommersiella avtal som definierar prissättning, betalningsvillkor och kredittilldelning. Projekt är operativa behållare för faktiskt arbetsgenomförande. Ett kontrakt kan sträcka sig över flera projekt. Projekt organiserar leverans; kontrakt styr kommersiella villkor. Båda måste vara korrekt länkade för noggrann finansiell spårning.'
        }
      },
      {
        title: { en: 'Billable vs. Non-Billable', sv: 'Fakturerbart vs. Icke-fakturerbart' },
        content: {
          en: 'Billable time is work that can be invoiced to customers under contract terms. Non-billable time includes internal activities, training, or work outside contract scope. While all time consumes partner capacity, only billable time generates customer revenue. Track both to understand true delivery costs and margin.',
          sv: 'Fakturerbar tid är arbete som kan faktureras till kunder enligt kontraktsvillkor. Icke-fakturerbar tid inkluderar interna aktiviteter, utbildning eller arbete utanför kontraktsomfattning. Även om all tid förbrukar partnerkapacitet genererar endast fakturerbar tid kundintäkter. Spåra båda för att förstå verkliga leveranskostnader och marginal.'
        }
      },
      {
        title: { en: 'Health Metrics', sv: 'Hälsomått' },
        content: {
          en: 'Health metrics assess engagement quality and risk. Customer health considers credit burn rate, project progress, satisfaction indicators, and payment status. Partner health tracks utilization, quality scores, and capacity availability. System health monitors data integrity and operational performance. Regular health review enables early intervention before issues escalate.',
          sv: 'Hälsomått bedömer engagemangskvalitet och risk. Kundhälsa beaktar kreditförbrukningshastighet, projektframsteg, tillfredsställelseindikatorer och betalningsstatus. Partnerhälsa spårar utnyttjande, kvalitetspoäng och kapacitetstillgänglighet. Systemhälsa övervakar dataintegritet och operativ prestanda. Regelbunden hälsogranskning möjliggör tidigt ingripande innan problem eskalerar.'
        }
      }
    ]
  }
];

const HelpCenterPage: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['getting-started']));
  const { language } = useLanguage();
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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {lang === 'en' ? 'Help & Learning Center' : 'Hjälp & Lärandecentrum'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {lang === 'en'
            ? 'Complete guide to using the NorthForce Partner Portal effectively'
            : 'Komplett guide för att använda NorthForce Partnerportal effektivt'}
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {lang === 'en' ? 'Welcome to the Partner Portal' : 'Välkommen till Partnerportalen'}
        </h2>
        <p className="text-sm text-gray-700">
          {lang === 'en'
            ? 'This documentation provides comprehensive guidance for consultants and partners. Each section below covers a core system area with detailed explanations of purpose, usage, and best practices. Click any section to expand.'
            : 'Denna dokumentation tillhandahåller omfattande vägledning för konsulter och partners. Varje avsnitt nedan täcker ett kärnsystemområde med detaljerade förklaringar av syfte, användning och bästa praxis. Klicka på valfritt avsnitt för att expandera.'}
        </p>
      </div>

      <div className="space-y-4">
        {HELP_CONTENT.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSections.has(section.id);

          return (
            <div key={section.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
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

      <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          {lang === 'en' ? 'Need Additional Support?' : 'Behöver du ytterligare support?'}
        </h3>
        <p className="text-sm text-gray-600">
          {lang === 'en'
            ? 'If you cannot find the information you need in this help center, contact your system administrator or use the Support section to submit a detailed inquiry.'
            : 'Om du inte kan hitta informationen du behöver i detta hjälpcenter, kontakta din systemadministratör eller använd Support-sektionen för att skicka en detaljerad förfrågan.'}
        </p>
      </div>
    </div>
  );
};

export default HelpCenterPage;
