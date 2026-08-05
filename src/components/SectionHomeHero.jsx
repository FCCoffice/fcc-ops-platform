import React from 'react';
import {
  Activity, Building2, CheckCircle2, ClipboardList, DollarSign, FileCheck2,
  Gauge, HardHat, Layers3, PackageCheck, Plus, ShieldCheck, ShoppingCart,
  Sparkles, Users, Warehouse
} from 'lucide-react';
import './section-home-hero.css';

const COPY={
  work:{eyebrow:'FCC OPS · MISSION CONTROL',title:'Run the day. Move the work. Protect the promise.',copy:'Your team’s priorities, approvals, exceptions and next actions assembled into one operating picture.',statement:'ONE TEAM. ONE QUEUE.',Icon:Gauge,action:'Create work'},
  customers:{eyebrow:'CUSTOMER INTELLIGENCE',title:'Know every relationship from district office to gym floor.',copy:'Customer, contact, facility and space intelligence connected to every request, project, order and service history.',statement:'KNOW THE FACILITY.',Icon:Building2,action:'Create customer'},
  sales:{eyebrow:'REVENUE COMMAND',title:'Turn customer needs into championship-ready solutions.',copy:'Field intake, estimating, pricing, approvals and proposals move together without losing operational context.',statement:'SELL WITH CONFIDENCE.',Icon:ShoppingCart,action:'Start request'},
  projects:{eyebrow:'PROJECT COMMAND',title:'Plan the work. Control the details. Finish strong.',copy:'Schedules, designs, crews, milestones, field records and closeout readiness stay connected from kickoff through completion.',statement:'BUILD IT RIGHT.',Icon:Layers3,action:'Create project'},
  fulfillment:{eyebrow:'FULFILLMENT COMMAND',title:'Ready material. Ready warehouse. Ready delivery.',copy:'Purchasing, receiving, inventory, staging and delivery proof work from the same order record and exception queue.',statement:'READY MEANS READY.',Icon:PackageCheck,action:'Create order'},
  field:{eyebrow:'CREWFLOW · FIELD COMMAND',title:'Put the right crew and equipment on the right floor.',copy:'Assignments, availability, time off, safety, daily proof and field exceptions are visible before they become delays.',statement:'GAME-DAY READY.',Icon:HardHat,action:'Create field task'},
  contracts:{eyebrow:'CONTRACTOPS',title:'Protect cash flow from contract award through final payment.',copy:'Schedule of values, pay applications, compliance, waivers and payment status remain controlled and reviewable.',statement:'CONTROL THE CASH.',Icon:FileCheck2,action:'Create contract task'},
  reports:{eyebrow:'SCORECENTER',title:'See the business clearly—and act before the scoreboard changes.',copy:'Revenue, operations, fulfillment, contracts and exceptions roll into one leadership operating picture.',statement:'KNOW THE SCORE.',Icon:Activity,action:'Create follow-up'},
  admin:{eyebrow:'PLATFORM CONTROL',title:'Keep the system governed, current and ready to scale.',copy:'Users, roles, vendors, pricing, templates, documents and audit history are managed from one controlled workspace.',statement:'BUILT TO SCALE.',Icon:ShieldCheck,action:'Create admin task'}
};

const money=value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(value||0));
const count=(data,key)=>data?.[key]?.length||0;
const open=(items=[])=>items.filter(x=>!['complete','completed','closed','cancelled','paid'].includes(String(x.status||'').toLowerCase())).length;
const sum=(items=[],key)=>items.reduce((total,item)=>total+Number(item?.[key]||0),0);

function metrics(area,data){
  const taskOpen=open(data.tasks);
  const exceptionCount=[...(data.purchase_orders||[]),...(data.orders||[]),...(data.projects||[])].filter(x=>x.exception_status||['blocked','at_risk','exception'].includes(String(x.status||x.fulfillment_status||'').toLowerCase())).length;
  const sets={
    work:[['Open work',taskOpen,'Shared tasks requiring action'],['Approvals',count(data,'approval_tokens'),'Commercial and operational decisions'],['Exceptions',exceptionCount,'Records needing intervention'],['Active lifecycle',count(data,'sales_requests')+count(data,'projects')+count(data,'orders'),'Sales through accounting']],
    customers:[['Customers',count(data,'customers'),'Active relationship records'],['Facilities',count(data,'facilities'),'Connected FacilityDNA sites'],['Spaces',count(data,'spaces'),'Tracked operational spaces'],['Needs review',(data.customers||[]).filter(x=>['at_risk','needs_review'].includes(String(x.health||x.status||'').toLowerCase())).length,'Records requiring cleanup']],
    sales:[['Open requests',open(data.sales_requests),'Needs moving through intake'],['Quotes',count(data,'quotes'),'Current commercial records'],['In review',(data.quotes||[]).filter(x=>String(x.status||'').includes('review')).length,'Internal or sales approval'],['Quoted pipeline',money(sum(data.quotes,'total')),'Current proposal value']],
    projects:[['Active projects',open(data.projects),'Planning through closeout'],['Milestones',count(data,'project_milestones'),'Tracked delivery commitments'],['Crew requirements',count(data,'crew_assignments'),'Assignments and capacity'],['Closeout ready',(data.projects||[]).filter(x=>x.accounting_ready||x.status==='closeout').length,'Ready for final handoff']],
    fulfillment:[['Open orders',open(data.orders),'Orders moving through fulfillment'],['Purchase orders',open(data.purchase_orders),'Vendor commitments open'],['Receipts',count(data,'receipts'),'Receiving records'],['Deliveries',open(data.delivery_tickets),'Tickets awaiting completion']],
    field:[['Crew assignments',count(data,'crew_assignments'),'Scheduled field work'],['Availability',count(data,'employee_availability'),'Employee availability records'],['Time off',open(data.time_off_requests),'Requests awaiting resolution'],['Proof records',count(data,'field_proofs'),'Installation and completion evidence']],
    contracts:[['Active contracts',open(data.contracts),'Commercial records in progress'],['Contract value',money(sum(data.contracts,'contract_value')),'Managed award value'],['Pay applications',open(data.pay_applications),'Billing records in process'],['Compliance open',open(data.compliance_items),'Items requiring action']],
    reports:[['Pipeline',money(sum(data.quotes,'total')),'Quoted opportunity value'],['Active work',count(data,'projects')+count(data,'orders'),'Projects and orders'],['Contract value',money(sum(data.contracts,'contract_value')),'Current managed contracts'],['Exceptions',exceptionCount+open(data.compliance_items),'Operational and compliance risk']],
    admin:[['Team profiles',count(data,'profiles'),'Authorized employee records'],['Vendors',count(data,'vendors'),'Approved vendor records'],['Price book',count(data,'price_book_items'),'Products and services'],['Documents',count(data,'documents'),'Controlled company files']]
  };
  return sets[area]||sets.work;
}

export default function SectionHomeHero({area,data,onCreate}){
  const config=COPY[area]||COPY.work;
  const Icon=config.Icon;
  return <section className={`section-home-hero section-home-${area}`}>
    <div className="section-hero-visual" aria-hidden="true">
      <div className="hero-scoreboard"><span>FCC</span><small>THE SPORTS FLOOR PROS</small></div>
      <div className="hero-court-line hero-court-one"/><div className="hero-court-line hero-court-two"/>
      <div className="hero-watermark"><Icon/></div>
      <div className="hero-statement">{config.statement}</div>
    </div>
    <div className="section-hero-copy">
      <span className="section-hero-eyebrow"><Sparkles/>{config.eyebrow}</span>
      <h1>{config.title}</h1>
      <p>{config.copy}</p>
      <button className="section-hero-action" onClick={onCreate}><Plus/>{config.action}</button>
    </div>
    <div className="section-hero-summary" aria-label={`${config.eyebrow} summary`}>
      {metrics(area,data).map(([label,value,detail],index)=><article key={label}>
        <span>{index===0?<ClipboardList/>:index===1?<Users/>:index===2?<CheckCircle2/>:<Warehouse/>}</span>
        <div><small>{label}</small><strong>{value}</strong><p>{detail}</p></div>
      </article>)}
    </div>
  </section>;
}
