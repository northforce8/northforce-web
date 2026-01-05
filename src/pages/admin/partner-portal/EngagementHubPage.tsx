import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, FolderKanban, Target, AlertTriangle, TrendingUp, Clock, CheckCircle2, ArrowRight, Lightbulb } from 'lucide-react';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import { PageHeader } from '../../../components/admin/PageHeader';
import { supabase } from '../../../lib/supabase';

interface CustomerEngagement {
  customer: any;
  projects: any[];
  frameworks: {
    okrs: any[];
    swots: any[];
    bscs: any[];
    adkars: any[];
    porters: any[];
    agile: any[];
    lean: any[];
    design_thinking: any[];
    mckinsey: any[];
  };
  recentActivities: any[];
  risks: any[];
  recommendations: string[];
  healthScore: number;
  nextActions: string[];
}

const EngagementHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [engagement, setEngagement] = useState<CustomerEngagement | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingEngagement, setLoadingEngagement] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomerId) {
      loadEngagement(selectedCustomerId);
    }
  }, [selectedCustomerId]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await partnerPortalApi.customers.getAll();
      const activeCustomers = data.filter(c => c.status === 'active');
      setCustomers(activeCustomers);
      if (activeCustomers.length > 0 && !selectedCustomerId) {
        setSelectedCustomerId(activeCustomers[0].id);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEngagement = async (customerId: string) => {
    if (!supabase) return;

    try {
      setLoadingEngagement(true);

      const customer = customers.find(c => c.id === customerId);

      const [projects, okrs, swots, bscs, adkars, porters, agile, lean, designThinking, mckinsey, activities] = await Promise.all([
        partnerPortalApi.projects.getAll().then(p => p.filter(pr => pr.customer_id === customerId)),
        supabase.from('okrs').select('*').eq('customer_id', customerId).then(r => r.data || []),
        supabase.from('swot_analyses').select('*').eq('customer_id', customerId).then(r => r.data || []),
        supabase.from('balanced_scorecards').select('*').eq('customer_id', customerId).then(r => r.data || []),
        supabase.from('adkar_assessments').select('*').eq('customer_id', customerId).then(r => r.data || []),
        supabase.from('porter_analyses').select('*').eq('customer_id', customerId).then(r => r.data || []),
        supabase.from('agile_implementations').select('*').eq('customer_id', customerId).then(r => r.data || []),
        supabase.from('lean_implementations').select('*').eq('customer_id', customerId).then(r => r.data || []),
        supabase.from('design_thinking_projects').select('*').eq('customer_id', customerId).then(r => r.data || []),
        supabase.from('mckinsey_7s_assessments').select('*').eq('customer_id', customerId).then(r => r.data || []),
        supabase.from('activity_log').select('*').eq('entity_type', 'customers').order('created_at', { ascending: false }).limit(10).then(r => r.data || [])
      ]);

      const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'planning');
      const risks = calculateRisks(customer, projects, okrs);
      const recommendations = generateRecommendations(customer, projects, okrs, swots, bscs);
      const healthScore = calculateHealthScore(customer, projects);
      const nextActions = generateNextActions(projects, okrs, risks);

      setEngagement({
        customer,
        projects: activeProjects,
        frameworks: {
          okrs,
          swots,
          bscs,
          adkars,
          porters,
          agile,
          lean,
          design_thinking: designThinking,
          mckinsey
        },
        recentActivities: activities.slice(0, 5),
        risks,
        recommendations,
        healthScore,
        nextActions
      });
    } catch (error) {
      console.error('Error loading engagement:', error);
    } finally {
      setLoadingEngagement(false);
    }
  };

  const calculateRisks = (customer: any, projects: any[], okrs: any[]) => {
    const risks = [];

    if (customer.overdelivery_risk_level && customer.overdelivery_risk_level !== 'low') {
      risks.push({
        type: 'overdelivery',
        severity: customer.overdelivery_risk_level,
        message: `Overdelivery risk: ${customer.overdelivery_risk_level}`,
        action: 'Review scope and capacity allocation'
      });
    }

    if (customer.credits_balance < 10) {
      risks.push({
        type: 'credits',
        severity: 'high',
        message: 'Low credit balance',
        action: 'Initiate credit top-up discussion'
      });
    }

    const onHoldProjects = projects.filter(p => p.status === 'on_hold');
    if (onHoldProjects.length > 0) {
      risks.push({
        type: 'stalled',
        severity: 'medium',
        message: `${onHoldProjects.length} project(s) on hold`,
        action: 'Review project blockers and resume plans'
      });
    }

    return risks;
  };

  const generateRecommendations = (customer: any, projects: any[], okrs: any[], swots: any[], bscs: any[]) => {
    const recs = [];

    if (okrs.length === 0) {
      recs.push('Create OKRs to align strategic goals with execution');
    }

    if (swots.length === 0) {
      recs.push('Conduct SWOT analysis to identify opportunities and threats');
    }

    if (projects.filter(p => p.status === 'active').length > 3) {
      recs.push('Consider capacity review - multiple active projects detected');
    }

    if (customer.credits_balance / customer.credits_monthly_allocation < 0.3) {
      recs.push('Credits running low - discuss renewal or top-up');
    }

    return recs;
  };

  const calculateHealthScore = (customer: any, projects: any[]) => {
    let score = 70;

    if (customer.overdelivery_risk_level === 'critical') score -= 20;
    else if (customer.overdelivery_risk_level === 'high') score -= 10;

    if (customer.credits_balance < 10) score -= 15;

    const activeProjects = projects.filter(p => p.status === 'active').length;
    if (activeProjects === 0) score -= 20;
    if (activeProjects > 5) score -= 10;

    return Math.max(0, Math.min(100, score));
  };

  const generateNextActions = (projects: any[], okrs: any[], risks: any[]) => {
    const actions = [];

    if (risks.length > 0) {
      actions.push(risks[0].action);
    }

    const planningProjects = projects.filter(p => p.status === 'planning');
    if (planningProjects.length > 0) {
      actions.push(`Kick off planning project: ${planningProjects[0].name}`);
    }

    const activeProjects = projects.filter(p => p.status === 'active');
    if (activeProjects.length > 0) {
      actions.push(`Review progress on: ${activeProjects[0].name}`);
    }

    if (okrs.length > 0) {
      actions.push('Update OKR progress metrics');
    }

    return actions.slice(0, 3);
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading engagement hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Engagement Hub"
        description="Unified view of customer engagements, projects, and strategic initiatives"
      />

      <div className="bg-white rounded-lg shadow p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Customer</label>
        <select
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
        >
          {customers.map(c => (
            <option key={c.id} value={c.id}>
              {c.company_name}
            </option>
          ))}
        </select>
      </div>

      {loadingEngagement ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : engagement && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Health Score</span>
                <TrendingUp className={`h-5 w-5 ${getHealthColor(engagement.healthScore)}`} />
              </div>
              <div className={`text-3xl font-bold ${getHealthColor(engagement.healthScore)}`}>
                {engagement.healthScore}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Active Projects</span>
                <FolderKanban className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {engagement.projects.length}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Strategic Frameworks</span>
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {Object.values(engagement.frameworks).reduce((sum, arr) => sum + arr.length, 0)}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Active Risks</span>
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {engagement.risks.length}
              </div>
            </div>
          </div>

          {engagement.nextActions.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Next Recommended Actions</h3>
              </div>
              <div className="space-y-2">
                {engagement.nextActions.map((action, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-gray-700">
                    <ArrowRight className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {engagement.risks.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Active Risks & Blockers
                </h3>
              </div>
              <div className="p-6 space-y-3">
                {engagement.risks.map((risk, idx) => (
                  <div key={idx} className={`border rounded-lg p-4 ${getSeverityColor(risk.severity)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold">{risk.message}</span>
                      <span className="text-xs uppercase px-2 py-1 rounded bg-white bg-opacity-50">
                        {risk.severity}
                      </span>
                    </div>
                    <div className="text-sm mt-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      <span>{risk.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FolderKanban className="h-5 w-5 text-blue-600" />
                  Active Projects
                </h3>
                <button
                  onClick={() => navigate('/admin/partner-portal/projects')}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  View All
                </button>
              </div>
              <div className="p-6">
                {engagement.projects.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No active projects</p>
                ) : (
                  <div className="space-y-3">
                    {engagement.projects.map(project => (
                      <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{project.name}</p>
                            <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Strategic Frameworks
                </h3>
                <button
                  onClick={() => navigate('/admin/partner-portal/strategic-frameworks')}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  View All
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3">
                  {engagement.frameworks.okrs.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-3 cursor-pointer hover:bg-blue-100" onClick={() => navigate('/admin/partner-portal/okr')}>
                      <div className="text-2xl font-bold text-blue-900">{engagement.frameworks.okrs.length}</div>
                      <div className="text-sm text-blue-700">OKRs</div>
                    </div>
                  )}
                  {engagement.frameworks.swots.length > 0 && (
                    <div className="bg-green-50 rounded-lg p-3 cursor-pointer hover:bg-green-100" onClick={() => navigate('/admin/partner-portal/swot')}>
                      <div className="text-2xl font-bold text-green-900">{engagement.frameworks.swots.length}</div>
                      <div className="text-sm text-green-700">SWOT</div>
                    </div>
                  )}
                  {engagement.frameworks.bscs.length > 0 && (
                    <div className="bg-purple-50 rounded-lg p-3 cursor-pointer hover:bg-purple-100" onClick={() => navigate('/admin/partner-portal/bsc')}>
                      <div className="text-2xl font-bold text-purple-900">{engagement.frameworks.bscs.length}</div>
                      <div className="text-sm text-purple-700">BSC</div>
                    </div>
                  )}
                  {engagement.frameworks.adkars.length > 0 && (
                    <div className="bg-orange-50 rounded-lg p-3 cursor-pointer hover:bg-orange-100" onClick={() => navigate('/admin/partner-portal/adkar')}>
                      <div className="text-2xl font-bold text-orange-900">{engagement.frameworks.adkars.length}</div>
                      <div className="text-sm text-orange-700">ADKAR</div>
                    </div>
                  )}
                  {engagement.frameworks.porters.length > 0 && (
                    <div className="bg-red-50 rounded-lg p-3 cursor-pointer hover:bg-red-100" onClick={() => navigate('/admin/partner-portal/porter')}>
                      <div className="text-2xl font-bold text-red-900">{engagement.frameworks.porters.length}</div>
                      <div className="text-sm text-red-700">Porter</div>
                    </div>
                  )}
                  {engagement.frameworks.agile.length > 0 && (
                    <div className="bg-teal-50 rounded-lg p-3 cursor-pointer hover:bg-teal-100" onClick={() => navigate('/admin/partner-portal/agile')}>
                      <div className="text-2xl font-bold text-teal-900">{engagement.frameworks.agile.length}</div>
                      <div className="text-sm text-teal-700">Agile</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {engagement.recommendations.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Strategic Recommendations
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  {engagement.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <Lightbulb className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EngagementHubPage;
