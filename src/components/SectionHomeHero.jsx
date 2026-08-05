import React from 'react';
import {
  Activity, BarChart3, Building2, CalendarDays, CheckCircle2, ClipboardCheck,
  ClipboardList, DollarSign, FileCheck2, FileText, FolderOpen, Gauge, HardHat,
  Image, Layers3, ListChecks, MapPin, PackageCheck, Plus, RefreshCw, Settings,
  ShieldCheck, ShoppingCart, Truck, UserPlus, Users, Warehouse, Wrench
} from 'lucide-react';
import './section-home-hero.css';

const HOME={
 work:{eyebrow:'QUICK LINKS',title:['READY','FOR THE','DAY.'],accent:0,tagline:'ONE TEAM. ONE SOURCE OF TRUTH.',button:'THE SPORTS FLOOR PROS',links:[
  ['Create Work','Start a task or company request',Plus,'Mine',true],['My Work','Open your exact action queue',ClipboardList,'Mine'],['Approvals','Review items waiting on you',ClipboardCheck,'Approvals'],
  ['Due Today','See today’s commitments',CalendarDays,'Due Today'],['Company Activity','Follow recent operational changes',Activity,'My Team'],['Exceptions','Resolve blocked work',ShieldCheck,'Exceptions'],
  ['Customers','Open customer intelligence',Building2,'Customer Directory',false,'customers'],['Projects','Open project command',Layers3,'Project Portfolio',false,'projects'],['Reports','Open ScoreCenter',Gauge,'ScoreCenter',false,'reports']]},
 customers:{eyebrow:'QUICK LINKS',title:['KNOW THE','CUSTOMER.','KNOW THE FLOOR.'],accent:1,tagline:'RELATIONSHIPS POWER EVERY WORKFLOW.',button:'FACILITYDNA',links:[
  ['Create Customer','Start a relationship record',Plus,'Customer Directory',true],['All Customers','Search the complete directory',Building2,'Customer Directory'],['Facility Directory','Open buildings and spaces',MapPin,'Facility Directory'],
  ['Add Contact','Connect decision makers',UserPlus,'Contacts',true],['Needs Review','Resolve incomplete records',ClipboardCheck,'Review Queue'],['Customer Documents','Open controlled files',FolderOpen,'Documents'],
  ['Start Opportunity','Create work from customer context',ShoppingCart,'Sales Requests',false,'sales'],['Active Projects','See customer project work',Layers3,'Project Portfolio',false,'projects'],['Open Orders','See customer fulfillment',PackageCheck,'OrderDNA',false,'fulfillment']]},
 sales:{eyebrow:'QUICK LINKS',title:['SELL WITH','CHAMPIONSHIP','CONFIDENCE.'],accent:1,tagline:'FROM CUSTOMER NEED TO APPROVED WORK.',button:'REVENUE COMMAND',links:[
  ['New Opportunity','Start from the customer need',Plus,'Sales Requests',true],['All Opportunities','Open the opportunity queue',Users,'Sales Requests'],['My Opportunities','Focus on assigned work',UserPlus,'Estimating Queue'],
  ['Quote Playbook','Build scope and pricing',FileText,'Quote Playbook'],['Proposal Review','Review customer release',ClipboardCheck,'Proposal Review'],['MatBuilder Pro','Design and optimize mat systems',Wrench,'MatBuilder Pro'],
  ['FCC Connect','Open relationship attribution',Activity,'FCC Connect'],['Pipeline','See revenue movement',BarChart3,'Pipeline',false,'reports'],['Customers','Open FacilityDNA context',Building2,'Customer Directory',false,'customers']]},
 projects:{eyebrow:'QUICK LINKS',title:['BUILDING','CHAMPIONSHIP','FLOORS.'],accent:1,tagline:'BUILDING UNBEATABLE EXPERIENCES.',button:'THE SPORTS FLOOR PROS',links:[
  ['Create New Project','Start a new project from scratch',Plus,'Project Portfolio',true],['Daily Logs','View and manage daily reports',ClipboardList,'Project Portfolio'],['Change Orders','Manage change orders and approvals',RefreshCw,'Design & Approval'],
  ['Project Request','Submit a new project request',UserPlus,'Project Portfolio',true],['Files & Documents','Project documents and drawings',FolderOpen,'Design & Approval'],['Pay Applications','View and submit pay applications',DollarSign,'SOV & Pay Apps',false,'contracts'],
  ['Project Calendar','View all project schedules',CalendarDays,'Schedule'],['Photos','Project photos and gallery',Image,'Closeout'],['Punch Lists','Track and close out punch items',ListChecks,'Closeout']]},
 fulfillment:{eyebrow:'QUICK LINKS',title:['READY MATERIAL.','READY TEAM.','READY DELIVERY.'],accent:1,tagline:'ONE ORDER RECORD FROM RELEASE TO PROOF.',button:'FULFILLMENT COMMAND',links:[
  ['Create Order','Start an OrderDNA record',Plus,'OrderDNA',true],['All Orders','Open fulfillment records',PackageCheck,'OrderDNA'],['Purchasing','Manage vendor commitments',ShoppingCart,'Purchasing'],
  ['Receiving','Record receipts and shortages',ClipboardCheck,'Receiving'],['Inventory','See warehouse availability',Warehouse,'Warehouse'],['Staging & Loading','Prepare orders for the road',Truck,'Staging & Loading'],
  ['FinishLine Delivery','Schedule and prove delivery',CheckCircle2,'FinishLine Delivery'],['Exceptions','Resolve damaged or late items',ShieldCheck,'Purchasing'],['Vendors','Open approved vendor records',Building2,'Vendors',false,'admin']]},
 field:{eyebrow:'QUICK LINKS',title:['READY CREWS.','READY FLOOR.','READY DAY.'],accent:0,tagline:'FIELD INTELLIGENCE BEFORE THE FIRST MILE.',button:'CREWFLOW',links:[
  ['Today','Open today’s crew picture',CalendarDays,'Today'],['Crew Calendar','Plan assignments and capacity',Users,'CrewFlow Planner'],['Availability','See employee availability',CheckCircle2,'Availability'],
  ['Time Off','Review requests and conflicts',UserPlus,'Time Off'],['Proof & Forms','Capture installation evidence',ClipboardCheck,'Proof & Forms'],['Safety & Incidents','Protect the team and record',HardHat,'Safety & Incidents'],
  ['Project Schedule','Open project milestones',Layers3,'Schedule',false,'projects'],['Vehicles & Equipment','Review field readiness',Truck,'Today'],['Create Field Task','Assign an action to the field',Plus,'Today',true]]},
 contracts:{eyebrow:'QUICK LINKS',title:['CONTROL THE','CONTRACT.','PROTECT CASH FLOW.'],accent:2,tagline:'COMMERCIAL CONTROL FROM AWARD TO PAYMENT.',button:'CONTRACTOPS',links:[
  ['Create Contract Task','Start a commercial action',Plus,'Contract Portfolio',true],['All Contracts','Open active contract records',FileCheck2,'Contract Portfolio'],['Pay Applications','Prepare and review billing',DollarSign,'SOV & Pay Apps'],
  ['Compliance','Track required documents',ShieldCheck,'Compliance'],['Waivers','Manage lien waiver records',FileText,'Waivers'],['Payments','See payment status',CheckCircle2,'Payments'],
  ['Projects','Open connected project work',Layers3,'Project Portfolio',false,'projects'],['Documents','Open contract files',FolderOpen,'Compliance'],['Contract Reports','See commercial health',BarChart3,'Contract Health',false,'reports']]},
 reports:{eyebrow:'QUICK LINKS',title:['KNOW THE','SCORE.','ACT EARLY.'],accent:1,tagline:'LEADERSHIP INTELLIGENCE FROM LIVE RECORDS.',button:'SCORECENTER',links:[
  ['Dashboards','Open the executive picture',Gauge,'ScoreCenter'],['Pipeline','Review revenue movement',BarChart3,'Pipeline'],['Operational Health','See project and fulfillment health',Activity,'Operational Health'],
  ['Contract Health','Review billing and compliance',DollarSign,'Contract Health'],['Exceptions','See work requiring intervention',ShieldCheck,'Exceptions'],['Create Follow-up','Turn insight into accountable work',Plus,'ScoreCenter',true],
  ['Projects','Open active project records',Layers3,'Project Portfolio',false,'projects'],['Orders','Open active fulfillment records',PackageCheck,'OrderDNA',false,'fulfillment'],['Opportunities','Open the sales pipeline',ShoppingCart,'Sales Requests',false,'sales']]},
 admin:{eyebrow:'QUICK LINKS',title:['BUILT TO','SCALE.','CONTROLLED TO LAST.'],accent:0,tagline:'GOVERN THE SYSTEM WITHOUT SLOWING THE TEAM.',button:'PLATFORM CONTROL',links:[
  ['Price Book','Manage products and services',DollarSign,'Price Book'],['Vendors','Manage approved partners',Building2,'Vendors'],['Users & Roles','Control team access',Users,'Users & Roles'],
  ['Workflow Builder','Configure process standards',RefreshCw,'Workflow Builder'],['Templates','Manage reusable records',FileText,'Templates'],['Documents','Control company files',FolderOpen,'Documents'],
  ['Audit','Review system activity',ShieldCheck,'Audit'],['Create Admin Task','Assign platform work',Plus,'Price Book',true],['Customers','Return to customer intelligence',Building2,'Customer Directory',false,'customers']]}
};

const money=value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(value||0));
const count=(data,key)=>data?.[key]?.length||0;
const open=(items=[])=>items.filter(x=>!['complete','completed','closed','cancelled','paid'].includes(String(x.status||'').toLowerCase())).length;
const sum=(items=[],key)=>items.reduce((total,item)=>total+Number(item?.[key]||0),0);
function metrics(area,data){
 const exceptionCount=[...(data.purchase_orders||[]),...(data.orders||[]),...(data.projects||[])].filter(x=>x.exception_status||['blocked','at_risk','exception'].includes(String(x.status||x.fulfillment_status||'').toLowerCase())).length;
 const sets={
  work:[['Open work',open(data.tasks)],['Approvals',count(data,'approval_tokens')],['Exceptions',exceptionCount],['Active lifecycle',count(data,'sales_requests')+count(data,'projects')+count(data,'orders')]],
  customers:[['Customers',count(data,'customers')],['Facilities',count(data,'facilities')],['Spaces',count(data,'spaces')],['Needs review',(data.customers||[]).filter(x=>['at_risk','needs_review'].includes(String(x.health||x.status||'').toLowerCase())).length]],
  sales:[['Open opportunities',open(data.sales_requests)],['Quotes',count(data,'quotes')],['In review',(data.quotes||[]).filter(x=>String(x.status||'').includes('review')).length],['Quoted pipeline',money(sum(data.quotes,'total'))]],
  projects:[['Active projects',open(data.projects)],['Milestones',count(data,'project_milestones')],['Crew requirements',count(data,'crew_assignments')],['Closeout ready',(data.projects||[]).filter(x=>x.accounting_ready||x.status==='closeout').length]],
  fulfillment:[['Open orders',open(data.orders)],['Purchase orders',open(data.purchase_orders)],['Receipts',count(data,'receipts')],['Deliveries',open(data.delivery_tickets)]],
  field:[['Crew assignments',count(data,'crew_assignments')],['Availability',count(data,'employee_availability')],['Time off',open(data.time_off_requests)],['Proof records',count(data,'field_proofs')]],
  contracts:[['Active contracts',open(data.contracts)],['Contract value',money(sum(data.contracts,'contract_value'))],['Pay applications',open(data.pay_applications)],['Compliance open',open(data.compliance_items)]],
  reports:[['Pipeline',money(sum(data.quotes,'total'))],['Active work',count(data,'projects')+count(data,'orders')],['Contract value',money(sum(data.contracts,'contract_value'))],['Exceptions',exceptionCount+open(data.compliance_items)]],
  admin:[['Team profiles',count(data,'profiles')],['Vendors',count(data,'vendors')],['Price book',count(data,'price_book_items')],['Documents',count(data,'documents')]]
 };
 return sets[area]||sets.work;
}

export default function SectionHomeHero({area,data,onCreate,onNavigate}){
 const config=HOME[area]||HOME.work;
 return <>
  <section className={`reference-section-home section-home-${area}`}>
   <div className="reference-quick-links">
    <span className="quick-links-kicker">{config.eyebrow}</span>
    <div className="quick-links-grid">{config.links.map(([label,detail,Icon,sub,create,nextArea])=><button key={label} onClick={()=>create?onCreate():onNavigate(nextArea||area,sub)}><span className="quick-link-icon"><Icon/></span><span><strong>{label}</strong><small>{detail}</small></span></button>)}</div>
   </div>
   <div className="reference-championship-hero">
    <div className="arena-light arena-light-one"/><div className="arena-light arena-light-two"/><div className="arena-light arena-light-three"/>
    <div className="arena-court"><i/><i/><i/></div>
    <div className="reference-hero-copy"><h1>{config.title.map((line,index)=><span className={index===config.accent?'accent':''} key={line}>{line}</span>)}</h1><p>{config.tagline}</p><div className="signature-mark">FCC</div><small>EST. 1996</small><button>{config.button}</button></div>
   </div>
  </section>
  <section className="reference-summary-strip">{metrics(area,data).map(([label,value],index)=><article key={label}><span>{index===0?<ClipboardList/>:index===1?<Users/>:index===2?<CheckCircle2/>:<Warehouse/>}</span><div><small>{label}</small><strong>{value}</strong></div></article>)}</section>
 </>;
}
