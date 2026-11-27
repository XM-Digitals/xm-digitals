import { GetProjects } from '../model/project.model';

export const MOCK_PROJECTS: GetProjects = {
  status: {
    code: 0,
    message: 'SUCCESS',
  },
  data: [
    {
      slug: 'paramount-enterprise-international',
      banner: 'client/client-paramount.png',
      bannerAlt: 'PT Paramount Enterprise International',
      bannerDetail: 'client/project-paramount-legal-permit.webp',
      company: 'PT Paramount Enterprise International',
      category: 'Bespoke Enterprise Solutions',
      challengeTitle: 'Key Business Challenge',
      challengeIntro:
        'Managing hundreds of complex operational permits, spatial planning documents (PKKPR), and legal renewals across multiple business units manually created critical operational hurdles:',
      challenges: [
        'Administrative bottlenecks and tracking blind spots across multiple property and enterprise business units',
        'High risk of missed expiration deadlines for critical corporate licenses and legal renewals',
        'Fragmented spreadsheet tracking lacking version control and instant document search',
        'Absence of transparent, multi-stage approval workflows and auditable governance trails',
        'Needed a unified, secure, and auditable web-based Enterprise Legal & Permit Management System to centralize regulatory compliance',
      ],
      solutionTitle: 'Solution & Architecture',
      solutionIntro:
        'XM Digitals architected and delivered a centralized, modular web-based Enterprise Legal & Permit Management System tailored to Paramount Enterprise’s multi-unit governance structure:',
      solutions: [
        'Unified Digital Repository: Centralized management for Corporate Permits, Spatial Planning (PKKPR), Contracts, and BPKB asset records with instant metadata search',
        'Seamless ERP & Cross-Division Integration: Automated synchronization of employee/user profiles, organizational structures, and cross-departmental master data transactions directly from the existing ERP ecosystem',
        'Automated Expiry & Renewal Alerts: Proactive multi-tier notification engine to prevent compliance lapses before critical permit deadlines',
        'Role-Based Multi-Stage Approval Workflow: Configurable sign-off hierarchies with complete audit logs for every document revision and approval action',
        'Modular Micro-Frontend Architecture: Built for scalability and cross-unit maintainability without disrupting ongoing enterprise operations',
      ],
      impactTitle: 'Business Impact',
      impacts: [
        'Eliminated manual spreadsheet fragmentation and duplicate data entry across ERP and corporate legal divisions',
        'Accelerated permit tracking, document retrieval, and internal approval turnaround times',
        'Strengthened regulatory compliance visibility and audit readiness across all business units',
      ],
      link: '/project/paramount-enterprise-international',
      metaTitle: 'PT Paramount Enterprise International | XM Digitals',
      metaDescription:
        'Bespoke Enterprise Solutions case study for PT Paramount Enterprise International — web-based Enterprise Legal & Permit Management System built by XM Digitals.',
      ctaTitle: 'Discuss Similar Project',
      ctaUrl: 'https://wa.me/6281806603068?text=Project%20Inquiry%20-%20Enterprise%20Legal%20%26%20Permit%20System',
    },
    {
      slug: 'basf-indonesia',
      banner: 'client/client-basf.png',
      bannerAlt: 'PT BASF Indonesia',
      bannerDetail: 'client/project-truckgateway-and-hoc-basf.webp',
      company: 'PT BASF Indonesia',
      category: 'Enterprise Mobile Solutions',
      challengeTitle: 'Key Business Challenge',
      challengeIntro:
        'High-frequency logistics and strict HSE (Health, Safety & Environment) standards across PT BASF Indonesia manufacturing sites required tighter gate access control and proactive workplace hazard reporting:',
      challenges: [
        'Manual truck check-in and check-out verification at plant gateways causing entry queues and operational delays',
        'Lack of real-time synchronization between gate security checkpoints, delivery schedules, and warehouse operations',
        'Paper-based driver compliance and workplace safety reporting (Hazard Observation Cards / HOC) slowing down preventive HSE actions',
        'Need for reliable mobile performance across industrial site environments with fluctuating network connectivity',
        'Required dedicated enterprise Android applications (Truck Gateway & HOC) to streamline fleet gate validation and real-time safety reporting',
      ],
      solutionTitle: 'Solution & Architecture',
      solutionIntro:
        'XM Digitals engineered and delivered two purpose-built enterprise Android applications tailored for PT BASF Indonesia’s plant logistics and HSE workflows:',
      solutions: [
        'Android Truck Gateway App: Digitalized gate check-in/check-out verification, driver & vehicle credential checks, and real-time fleet queue visibility',
        'Hazard Observation Card (HOC) Mobile App: Enabled employees and site personnel to capture, categorize, and submit safety hazard reports with photo evidence directly from the field',
        'Offline-Resilient Synchronization: Local data caching and automatic background sync to ensure uninterrupted operation across low-connectivity industrial zones',
        'Centralized Operational & HSE Audit Trail: Structured digital logs connecting gate security checkpoints, warehouse teams, and safety officers',
      ],
      impactTitle: 'Business Impact',
      impacts: [
        'Accelerated truck turnaround and gate clearance times at manufacturing plant checkpoints',
        'Eliminated paper-based safety reporting bottlenecks and improved preventive HSE response visibility',
        'Established reliable, traceable digital audit records across site logistics and safety operations',
      ],
      link: '/project/basf-indonesia',
      metaTitle: 'PT BASF Indonesia | XM Digitals',
      metaDescription:
        'Enterprise Mobile Solutions case study for PT BASF Indonesia — Android Truck Gateway and Hazard Observation Card (HOC) applications built by XM Digitals.',
      ctaTitle: 'Discuss Similar Project',
      ctaUrl: 'https://wa.me/6281806603068?text=Project%20Inquiry%20-%20Enterprise%20Mobile%20Apps',
    },
  ],
};