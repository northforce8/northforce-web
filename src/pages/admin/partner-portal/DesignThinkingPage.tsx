import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lightbulb, Users, Target, Boxes, TestTube, Plus, TrendingUp,
  Brain, Heart, MessageSquare, Map, ArrowRight, CheckCircle2,
  AlertCircle, Sparkles, RefreshCw, Eye, ThumbsUp, AlertTriangle
} from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { PAGE_HELP_CONTENT } from '../../../lib/page-help-content';
import { supabase } from '../../../lib/supabase';
import { Card } from '../../../components/admin/ui/Card';
import { Badge } from '../../../components/admin/ui/Badge';
import { AIInsightsPanel } from '../../../components/admin/strategic/AIInsightsPanel';
import { ProgressIndicator } from '../../../components/admin/strategic/ProgressIndicator';
import { designThinkingAIService } from '../../../lib/design-thinking-ai-service';
import type {
  DesignThinkingProject,
  DTPhaseData,
  DTInsight,
  DTPersona,
  DTEmpathyMap,
  DTJourneyMap,
  DTIdea,
  DTPrototype,
  DTUserTest,
  DesignThinkingAIInsights,
  DTPhase,
} from '../../../lib/design-thinking-types';
import { DT_PHASE_LABELS, DT_PHASE_DESCRIPTIONS } from '../../../lib/design-thinking-types';
import { useLanguage } from '../../../contexts/LanguageContext';

const PHASE_ICONS: Record<DTPhase, typeof Heart> = {
  empathize: Heart,
  define: Target,
  ideate: Lightbulb,
  prototype: Boxes,
  test: TestTube,
};

export default function DesignThinkingPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<DesignThinkingProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<DesignThinkingProject | null>(null);
  const [phases, setPhases] = useState<DTPhaseData[]>([]);
  const [insights, setInsights] = useState<DTInsight[]>([]);
  const [personas, setPersonas] = useState<DTPersona[]>([]);
  const [empathyMaps, setEmpathyMaps] = useState<DTEmpathyMap[]>([]);
  const [journeyMaps, setJourneyMaps] = useState<DTJourneyMap[]>([]);
  const [ideas, setIdeas] = useState<DTIdea[]>([]);
  const [prototypes, setPrototypes] = useState<DTPrototype[]>([]);
  const [userTests, setUserTests] = useState<DTUserTest[]>([]);
  const [aiInsights, setAiInsights] = useState<DesignThinkingAIInsights | null>(null);
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadProjectData();
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: dbError } = await supabase
        .from('design_thinking_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      setProjects(data || []);
      if (data && data.length > 0) {
        setSelectedProject(data[0]);
      }
    } catch (err) {
      console.error('Error loading projects:', err);
      setError(err instanceof Error ? err.message : 'Kunde inte ladda Design Thinking-projekt. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const loadProjectData = async () => {
    if (!selectedProject) return;

    try {
      const [phasesData, insightsData, personasData, empathyMapsData, journeyMapsData, ideasData, prototypesData, userTestsData] = await Promise.all([
        supabase.from('dt_phases').select('*').eq('project_id', selectedProject.id),
        supabase.from('dt_insights').select('*').eq('project_id', selectedProject.id),
        supabase.from('dt_personas').select('*').eq('project_id', selectedProject.id),
        supabase.from('dt_empathy_maps').select('*').eq('project_id', selectedProject.id),
        supabase.from('dt_journey_maps').select('*').eq('project_id', selectedProject.id),
        supabase.from('dt_ideas').select('*').eq('project_id', selectedProject.id),
        supabase.from('dt_prototypes').select('*').eq('project_id', selectedProject.id),
        supabase.from('dt_user_tests').select('*').eq('project_id', selectedProject.id),
      ]);

      setPhases(phasesData.data || []);
      setInsights(insightsData.data || []);
      setPersonas(personasData.data || []);
      setEmpathyMaps(empathyMapsData.data || []);
      setJourneyMaps(journeyMapsData.data || []);
      setIdeas(ideasData.data || []);
      setPrototypes(prototypesData.data || []);
      setUserTests(userTestsData.data || []);
    } catch (error) {
      console.error('Error loading project data:', error);
    }
  };

  const generateAIInsights = async () => {
    if (!selectedProject) return;

    setGeneratingAI(true);
    try {
      const insights = await designThinkingAIService.generateInsights(
        selectedProject,
        phases,
        insights,
        personas,
        empathyMaps,
        journeyMaps,
        ideas,
        prototypes,
        userTests
      );

      setAiInsights(insights);

      await supabase
        .from('design_thinking_projects')
        .update({
          ai_insights: insights.overall_assessment,
          ai_recommendations: JSON.stringify(insights.phase_recommendations),
          ai_risk_assessment: JSON.stringify(insights.risk_areas),
          ai_last_analyzed: new Date().toISOString(),
        })
        .eq('id', selectedProject.id);
    } catch (error) {
      console.error('Error generating AI insights:', error);
    } finally {
      setGeneratingAI(false);
    }
  };

  const createNewProject = async () => {
    const projectName = prompt('Enter project name:');
    if (!projectName) return;

    const challenge = prompt('Enter challenge statement:');
    if (!challenge) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('customer_id')
        .eq('id', userData.user.id)
        .single();

      if (!profile?.customer_id) {
        alert('No customer associated with user');
        return;
      }

      const { data, error } = await supabase
        .from('design_thinking_projects')
        .insert({
          customer_id: profile.customer_id,
          project_name: projectName,
          challenge_statement: challenge,
          created_by: userData.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const phaseNames: DTPhase[] = ['empathize', 'define', 'ideate', 'prototype', 'test'];
      await Promise.all(
        phaseNames.map(phaseName =>
          supabase.from('dt_phases').insert({
            project_id: data.id,
            phase_name: phaseName,
          })
        )
      );

      await loadProjects();
      setSelectedProject(data);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  const getPhaseCompletion = (phaseName: DTPhase): number => {
    const phase = phases.find(p => p.phase_name === phaseName);
    if (!phase) return 0;

    let score = 0;
    switch (phaseName) {
      case 'empathize':
        if (personas.length > 0) score += 33;
        if (empathyMaps.length > 0) score += 33;
        if (insights.filter(i => i.phase_name === 'empathize').length >= 3) score += 34;
        break;
      case 'define':
        if (selectedProject?.challenge_statement.length! > 50) score += 50;
        if (insights.filter(i => i.phase_name === 'define').length >= 2) score += 50;
        break;
      case 'ideate':
        if (ideas.length >= 5) score += 50;
        if (ideas.filter(i => i.status === 'selected').length > 0) score += 50;
        break;
      case 'prototype':
        if (prototypes.length > 0) score += 50;
        if (prototypes.filter(p => p.status === 'ready_for_testing').length > 0) score += 50;
        break;
      case 'test':
        if (userTests.length > 0) score += 50;
        if (userTests.filter(t => t.status === 'completed').length > 0) score += 50;
        break;
    }

    return Math.min(100, score);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar Design Thinking-projekt...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <PageHeader
        title="Design Thinking Canvas"
        description="Människocentrerad innovation genom empati, idéskapande och experiment"
        icon={Lightbulb}
        help={PAGE_HELP_CONTENT.frameworks}
      />

      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <button
            onClick={generateAIInsights}
            disabled={!selectedProject || generatingAI}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
          >
            {generatingAI ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
            AI Insights
          </button>
          <button
            onClick={createNewProject}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <Card className="p-12 text-center">
          <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Design Thinking Projects</h3>
          <p className="text-gray-600 mb-6">
            Create your first project to start the human-centered innovation process
          </p>
          <button
            onClick={createNewProject}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create First Project
          </button>
        </Card>
      ) : (
        <>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {projects.map(project => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedProject?.id === project.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {project.project_name}
              </button>
            ))}
          </div>

          {selectedProject && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 lg:col-span-2">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {selectedProject.project_name}
                  </h2>
                  <p className="text-gray-600 mb-4">{selectedProject.challenge_statement}</p>

                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant={
                      selectedProject.status === 'completed' ? 'success' :
                      selectedProject.status === 'active' ? 'default' : 'secondary'
                    }>
                      {selectedProject.status}
                    </Badge>
                    <Badge variant="default">
                      Phase: {selectedProject.current_phase}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Overall Progress</span>
                        <span className="font-medium">{selectedProject.overall_progress}%</span>
                      </div>
                      <ProgressIndicator progress={selectedProject.overall_progress} />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Personas
                      </span>
                      <span className="font-semibold">{personas.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Ideas
                      </span>
                      <span className="font-semibold">{ideas.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Boxes className="w-4 h-4" />
                        Prototypes
                      </span>
                      <span className="font-semibold">{prototypes.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center gap-2">
                        <TestTube className="w-4 h-4" />
                        User Tests
                      </span>
                      <span className="font-semibold">{userTests.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Insights
                      </span>
                      <span className="font-semibold">{insights.length}</span>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Map className="w-5 h-5 text-blue-600" />
                  Design Thinking Phases
                </h3>

                {(['empathize', 'define', 'ideate', 'prototype', 'test'] as DTPhase[]).map((phaseName, index) => {
                  const Icon = PHASE_ICONS[phaseName];
                  const completion = getPhaseCompletion(phaseName);
                  const phase = phases.find(p => p.phase_name === phaseName);
                  const isActive = selectedProject.current_phase === phaseName;

                  return (
                    <Card key={phaseName} className={`p-6 ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-3 rounded-lg ${
                            completion === 100 ? 'bg-green-100' :
                            completion > 0 ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            <Icon className={`w-6 h-6 ${
                              completion === 100 ? 'text-green-600' :
                              completion > 0 ? 'text-blue-600' : 'text-gray-400'
                            }`} />
                          </div>

                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {DT_PHASE_LABELS[phaseName]}
                            </h4>
                            <p className="text-sm text-gray-600 mb-3">
                              {DT_PHASE_DESCRIPTIONS[phaseName]}
                            </p>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Completion</span>
                                <span className="font-medium">{completion}%</span>
                              </div>
                              <ProgressIndicator progress={completion} />
                            </div>

                            {phase && phase.key_findings && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">{phase.key_findings}</p>
                              </div>
                            )}

                            {aiInsights && aiInsights.phase_recommendations[phaseName] && (
                              <div className="mt-3 p-3 bg-purple-50 rounded-lg flex gap-2">
                                <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-purple-900">
                                  {aiInsights.phase_recommendations[phaseName]}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {completion === 100 && (
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        )}
                        {isActive && completion < 100 && (
                          <Badge variant="default">Active</Badge>
                        )}
                      </div>

                      {phaseName === 'empathize' && (
                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{personas.length}</div>
                            <div className="text-xs text-gray-600">Personas</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{empathyMaps.length}</div>
                            <div className="text-xs text-gray-600">Empathy Maps</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {insights.filter(i => i.phase_name === 'empathize').length}
                            </div>
                            <div className="text-xs text-gray-600">Insights</div>
                          </div>
                        </div>
                      )}

                      {phaseName === 'ideate' && (
                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-amber-600">{ideas.length}</div>
                            <div className="text-xs text-gray-600">Total Ideas</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-amber-600">
                              {ideas.filter(i => i.status === 'selected').length}
                            </div>
                            <div className="text-xs text-gray-600">Selected</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-amber-600">
                              {ideas.reduce((sum, i) => sum + i.votes, 0)}
                            </div>
                            <div className="text-xs text-gray-600">Total Votes</div>
                          </div>
                        </div>
                      )}

                      {phaseName === 'prototype' && (
                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{prototypes.length}</div>
                            <div className="text-xs text-gray-600">Prototypes</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {prototypes.filter(p => p.fidelity === 'high').length}
                            </div>
                            <div className="text-xs text-gray-600">High Fidelity</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {prototypes.filter(p => p.status === 'ready_for_testing').length}
                            </div>
                            <div className="text-xs text-gray-600">Ready to Test</div>
                          </div>
                        </div>
                      )}

                      {phaseName === 'test' && (
                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{userTests.length}</div>
                            <div className="text-xs text-gray-600">Tests</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {userTests.reduce((sum, t) => sum + t.participants_count, 0)}
                            </div>
                            <div className="text-xs text-gray-600">Participants</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {userTests.filter(t => t.status === 'completed').length}
                            </div>
                            <div className="text-xs text-gray-600">Completed</div>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>

              {aiInsights && (
                <AIInsightsPanel
                  insights={aiInsights.overall_assessment}
                  recommendations={aiInsights.next_actions}
                  metrics={{
                    'Innovation Potential': aiInsights.innovation_potential,
                    'Problem Clarity': aiInsights.problem_definition_clarity,
                    'Ideation Diversity': aiInsights.ideation_diversity_score,
                  }}
                  risks={aiInsights.risk_areas}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
