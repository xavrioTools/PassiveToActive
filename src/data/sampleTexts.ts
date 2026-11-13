import { SampleDocument } from '../types/voice';

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: 'tech-article',
    title: 'Cloud Infrastructure Upgrade',
    category: 'Engineering & Tech',
    description: 'A technical blog post detailing an infrastructure migration filled with typical passive voice phrases.',
    text: `Last week, our core cloud architecture was upgraded by the infrastructure team. Over forty microservices were migrated to Kubernetes clusters, and zero downtime was experienced by our customers.

The new distributed caching layer was designed by senior architects to reduce database latency. In initial benchmarks, query response times were improved by 65%. Furthermore, automated rollback triggers were configured by the DevOps squad to prevent regressions.

Several minor configuration anomalies were discovered during the load test. However, every critical vulnerability was resolved by the platform engineers before production deployment. A complete performance retrospective has been published by the technical lead. Continuous deployment pipelines will be maintained by our reliability engineers moving forward.`
  },
  {
    id: 'academic-research',
    title: 'Neuroplasticity & Synaptic Pruning',
    category: 'Scientific Research',
    description: 'An academic abstract with frequent agentless and by-agent passive voice constructions.',
    text: `In this investigation, cortical changes in memory retention were observed by researchers across a cohort of ninety participants. High-resolution fMRI scans were collected by the imaging laboratory over six consecutive weeks.

A statistically significant increase in synaptic plasticity was recorded after daily cognitive training exercises. In contrast, no structural deviations were detected in the control group. The biochemical markers were analyzed by biomedical specialists using mass spectrometry.

It was hypothesized that neurotrophic factors are synthesized during deep non-REM sleep cycles. These initial findings were supported by recent clinical trials conducted at the institute. Further longitudinal evaluations will be conducted by the neuroscience department to validate therapeutic protocols.`
  },
  {
    id: 'business-memo',
    title: 'Quarterly Operations Memo',
    category: 'Executive Strategy',
    description: 'A corporate strategy memo illustrating how passive voice obscures accountability in business.',
    text: `During the third fiscal quarter, unprecedented operational milestones were achieved by our commercial division. A record twenty-four enterprise accounts were closed by the enterprise sales representatives.

The annual capital expenditure forecast was adjusted by the financial committee to accelerate global expansion. At the same time, regional office consolidation was initiated by operations management to streamline operating expenses.

Certain supply chain bottlenecks were encountered in our European logistics hubs. Remedial action plans were introduced by warehouse supervisors to restore standard delivery cadence. The revised quarterly financial guidelines will be presented by the chief executive officer during Thursday's shareholder briefing.`
  },
  {
    id: 'marketing-copy',
    title: 'Product Launch & Brand Pitch',
    category: 'Marketing & Copywriting',
    description: 'Marketing prose that suffers from sluggish passive phrasing instead of punchy active hooks.',
    text: `A revolutionary productivity suite has been launched by our product team today. Every workflow bottleneck is eliminated by intelligent real-time automations, while hours of tedious manual data entry are saved by knowledge workers.

Next-generation editorial standards are guaranteed by our grammar engine. Creative briefs are organized seamlessly by the intuitive dashboard, and team communication is elevated by contextual commenting.

Unmatched reliability is provided by our distributed enterprise cloud. Try the modern platform now, and witness how creative content is transformed by automated intelligence.`
  }
];
