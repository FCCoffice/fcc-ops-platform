import React from 'react';
import {
  Activity, BarChart3, Building2, CalendarDays, CheckCircle2, ClipboardCheck,
  ClipboardList, DollarSign, FileCheck2, FileText, FolderOpen, Gauge, HardHat,
  Image, ListChecks, MapPin, PackageCheck, Plus, RefreshCw, ShieldCheck,
  ShoppingCart, Truck, UserPlus, Users, Warehouse, Wrench
} from 'lucide-react';
import './section-home-hero.css';

const HOME={
 work:{title:['READY','FOR THE','DAY.'],accent:0,tagline:'ONE TEAM. ONE SOURCE OF TRUTH.',button:'THE SPORTS FLOOR PROS',links:[
  ['Create Work','Start a task or company request',Plus,'Mine',true],['My Work','Open your exact action queue',ClipboardList,'Mine'],['Approvals','Review items waiting on you',ClipboardCheck,'Approvals'],
  ['Due Today','See today’s commitments',CalendarDays,'Due Today'],['Company Activity','Follow recent operational changes',Activity,'My Team'],['Exceptions','Resolve blocked work',ShieldCheck,'Exceptions'],
  ['Customers','Open customer intelligence',Building2,'Customer Directory',false,'customers'],['Projects','Open project command',FileCheck2,'Project Portfolio',false,'projects'],['Reports','Open ScoreCenter',Gauge,'ScoreCenter',false,'reports']]},
 customers:{title:['KNOW THE','CUSTOMER.','KNOW THE FLOOR.'],accent:1,tagline:'RELATIONSHIPS POWER EVERY WORKFLOW.',button:'FACILITYDNA',links:[
  ['Create Customer','Start a relationship record',Plus,'Customer Directory',true],['All Customers','Search the complete directory',Building2,'Customer Directory'],['Facility Directory','Open buildings and spaces',MapPin,'Facility Directory'],
  ['Add Contact','Connect decision makers',UserPlus,'Contacts',true],['Needs Review','Resolve incomplete records',ClipboardCheck,'Review Queue'],['Customer Documents','Open controlled files',FolderOpen,'Documents'],
  ['Start Opportunity','Create work from customer context',ShoppingCart,'Sales Requests',false,'sales'],['Active Projects','See customer project work',FileCheck2,'Project Portfolio',false,'projects'],['Open Orders','See customer fulfillment',PackageCheck,'OrderDNA',false,'fulfillment']]},
 sales:{title:['SELL WITH','CHAMPIONSHIP','CONFIDENCE.'],accent:1,tagline:'FROM CUSTOMER NEED TO APPROVED WORK.',button:'REVENUE COMMAND',links:[
  ['New Opportunity','Start from the customer need',Plus,'Sales Requests',true],['All Opportunities','Open the opportunity queue',Users,'Sales Requests'],['My Opportunities','Focus on assigned work',UserPlus,'Estimating Queue'],
  ['Quote Playbook','Build scope and pricing',FileText,'Quote Playbook'],['Proposal Review','Review customer release',ClipboardCheck,'Proposal Review'],['MatBuilder Pro','Design and optimize mat systems',Wrench,'MatBuilder Pro'],
  ['FCC Connect','Open relationship attribution',Activity,'FCC Connect'],['Pipeline','See revenue movement',BarChart3,'Pipeline',false,'reports'],['Customers','Open FacilityDNA context',Building2,'Customer Directory',false,'customers']]},
 projects:{art:'/assets/fcc-reference-hero.jpg',links:[
  ['Create New Project','Start a new project from scratch',Plus,'Project Portfolio',true],['Daily Logs','View and manage daily reports',ClipboardList,'Project Portfolio'],['Change Orders','Manage change orders and approvals',RefreshCw,'Design & Approval'],
  ['Project Request','Submit a new project request',UserPlus,'Project Portfolio',true],['Files & Documents','Project documents and drawings',FolderOpen,'Design & Approval'],['Pay Applications','View and submit pay applications',DollarSign,'SOV & Pay Apps',false,'contracts'],
  ['Project Calendar','View all project schedules',CalendarDays,'Schedule'],['Photos','Project photos and gallery',Image,'Closeout'],['Punch Lists','Track and close out punch items',ListChecks,'Closeout']]},
 fulfillment:{title:['READY MATERIAL.','READY TEAM.','READY DELIVERY.'],accent:1,tagline:'ONE ORDER RECORD FROM RELEASE TO PROOF.',button:'FULFILLMENT COMMAND',links:[
  ['Create Order','Start an OrderDNA record',Plus,'OrderDNA',true],['All Orders','Open fulfillment records',PackageCheck,'OrderDNA'],['Purchasing','Manage vendor commitments',ShoppingCart,'Purchasing'],
  ['Receiving','Record receipts and shortages',ClipboardCheck,'Receiving'],['Inventory','See warehouse availability',Warehouse,'Warehouse'],['Staging & Loading','Prepare orders for the road',Truck,'Staging & Loading'],
  ['FinishLine Delivery','Schedule and prove delivery',CheckCircle2,'FinishLine Delivery'],['Exceptions','Resolve damaged or late items',ShieldCheck,'Purchasing'],['Vendors','Open approved vendor records',Building2,'Vendors',false,'admin']]},
 field:{title:['READY CREWS.','READY FLOOR.','READY DAY.'],accent:0,tagline:'FIELD INTELLIGENCE BEFORE THE FIRST MILE.',button:'CREWFLOW',links:[
  ['Today','Open today’s crew picture',CalendarDays,'Today'],['Crew Calendar','Plan assignments and capacity',Users,'CrewFlow Planner'],['Availability','See employee availability',CheckCircle2,'Availability'],
  ['Time Off','Review requests and conflicts',UserPlus,'Time Off'],['Proof & Forms','Capture installation evidence',ClipboardCheck,'Proof & Forms'],['Safety & Incidents','Protect the team and record',HardHat,'Safety & Incidents'],
  ['Project Schedule','Open project milestones',FileCheck2,'Schedule',false,'projects'],['Vehicles & Equipment','Review field readiness',Truck,'Today'],['Create Field Task','Assign an action to the field',Plus,'Today',true]]},
 contracts:{title:['CONTROL THE','CONTRACT.','PROTECT CASH FLOW.'],accent:2,tagline:'COMMERCIAL CONTROL FROM AWARD TO PAYMENT.',button:'CONTRACTOPS',links:[
  ['Create Contract Task','Start a commercial action',Plus,'Contract Portfolio',true],['All Contracts','Open active contract records',FileCheck2,'Contract Portfolio'],['Pay Applications','Prepare and review billing',DollarSign,'SOV & Pay Apps'],
  ['Compliance','Track required documents',ShieldCheck,'Compliance'],['Waivers','Manage lien waiver records',FileText,'Waivers'],['Payments','See payment status',CheckCircle2,'Payments'],
  ['Projects','Open connected project work',FileCheck2,'Project Portfolio',false,'projects'],['Documents','Open contract files',FolderOpen,'Compliance'],['Contract Reports','See commercial health',BarChart3,'Contract Health',false,'reports']]},
 reports:{title:['KNOW THE','SCORE.','ACT EARLY.'],accent:1,tagline:'LEADERSHIP INTELLIGENCE FROM LIVE RECORDS.',button:'SCORECENTER',links:[
  ['Dashboards','Open the executive picture',Gauge,'ScoreCenter'],['Pipeline','Review revenue movement',BarChart3,'Pipeline'],['Operational Health','See project and fulfillment health',Activity,'Operational Health'],
  ['Contract Health','Review billing and compliance',DollarSign,'Contract Health'],['Exceptions','See work requiring intervention',ShieldCheck,'Exceptions'],['Create Follow-up','Turn insight into accountable work',Plus,'ScoreCenter',true],
  ['Projects','Open active project records',FileCheck2,'Project Portfolio',false,'projects'],['Orders','Open active fulfillment records',PackageCheck,'OrderDNA',false,'fulfillment'],['Opportunities','Open the sales pipeline',ShoppingCart,'Sales Requests',false,'sales']]},
 admin:{title:['BUILT TO','SCALE.','CONTROLLED TO LAST.'],accent:0,tagline:'GOVERN THE SYSTEM WITHOUT SLOWING THE TEAM.',button:'PLATFORM CONTROL',links:[
  ['Price Book','Manage products and services',DollarSign,'Price Book'],['Vendors','Manage approved partners',Building2,'Vendors'],['Users & Roles','Control team access',Users,'Users & Roles'],
  ['Workflow Builder','Configure process standards',RefreshCw,'Workflow Builder'],['Templates','Manage reusable records',FileText,'Templates'],['Documents','Control company files',FolderOpen,'Documents'],
  ['Audit','Review system activity',ShieldCheck,'Audit'],['Create Admin Task','Assign platform work',Plus,'Price Book',true],['Customers','Return to customer intelligence',Building2,'Customer Directory',false,'customers']]}
};

export default function SectionHomeHero({area,onCreate,onNavigate}){
 const config=HOME[area]||HOME.work;
 return <section className={`reference-section-home section-home-${area}`}>
  <div className="reference-quick-links">
   <span className="quick-links-kicker">QUICK LINKS</span>
   <div className="quick-links-grid">{config.links.map(([label,detail,Icon,sub,create,nextArea])=><button key={label} onClick={()=>create?onCreate():onNavigate(nextArea||area,sub)}>
    <span className="quick-link-icon"><Icon/></span><span><strong>{label}</strong><small>{detail}</small></span>
   </button>)}</div>
  </div>
  <div className={config.art?'reference-championship-hero exact-project-art':'reference-championship-hero'}>
   {config.art?<><img src={config.art} alt="Building championship floors — The Sports Floor Pros"/><button className="hero-art-action" aria-label="Open The Sports Floor Pros home" onClick={()=>onNavigate('work','Mine')}/></>:<div className="reference-hero-copy"><h1>{config.title.map((line,index)=><span className={index===config.accent?'accent':''} key={line}>{line}</span>)}</h1><p>{config.tagline}</p><div className="signature-mark">FCC</div><small>EST. 1996</small><button>{config.button}</button></div>}
  </div>
 </section>;
}
