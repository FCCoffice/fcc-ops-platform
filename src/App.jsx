import React, { useMemo, useState } from 'react';
import {
  Bell, Building2, CheckCircle2, ChevronRight, ClipboardCheck, Command,
  FileText, Gauge, Grid2X2, Home, Layers3, Menu, Moon, PackageCheck,
  Plus, Search, Settings, ShieldCheck, Sun, Truck, Users, Workflow, X
} from 'lucide-react';

const initialCustomers = [
  { id:'CUS-1048', name:'Saranac Community Schools', tier:'Championship Partner', owner:'Caleb', status:'Active', address:'225 Pleasant St, Saranac, MI', facilities:[
    { name:'Saranac Jr/Sr High School', type:'High School', spaces:['Main Gym','Auxiliary Gym','Weight Room'] },
    { name:'Saranac Elementary', type:'Elementary School', spaces:['Gymnasium','Cafeteria'] },
    { name:'Transportation Center', type:'Operations', spaces:['Bus Garage','Office'] },
  ]},
  { id:'CUS-1032', name:'Morrice Area Schools', tier:'Preferred', owner:'Alex', status:'Active', address:'111 E Mason St, Morrice, MI', facilities:[
    { name:'Morrice High School', type:'High School', spaces:['Main Gym','Stage'] },
    { name:'Morrice Elementary', type:'Elementary School', spaces:['Gymnasium'] },
  ]},
  { id:'CUS-1019', name:'Mt. Morris Consolidated Schools', tier:'Championship Partner', owner:'Caleb', status:'At Risk', address:'12356 Walter St, Mt Morris, MI', facilities:[
    { name:'Mt. Morris High School', type:'High School', spaces:['Main Gym','Auxiliary Gym'] },
  ]},
];

const initialTasks = [
  { id:1, title:'Review Saranac pay application', context:'ContractOps', owner:'Blaine', due:'Today', priority:'High', status:'In Review' },
  { id:2, title:'Schedule Morrice delivery', context:'FinishLine', owner:'Operations', due:'Today', priority:'High', status:'Ready' },
  { id:3, title:'Approve logo mat proof', context:'MatBuilder Pro', owner:'Caleb', due:'Tomorrow', priority:'Normal', status:'Waiting' },
  { id:4, title:'Confirm crew for Mt. Morris', context:'CrewFlow', owner:'Justin', due:'Tomorrow', priority:'Normal', status:'In Progress' },
  { id:5, title:'Upload signed lien waiver', context:'ContractOps', owner:'Accounting', due:'Friday', priority:'Normal', status:'Blocked' },
];

const workflowsSeed = [
  { name:'Quote to Project', stages:['Intake','Build','Rep Review','Customer Approval','Project Created'], current:2, records:14 },
  { name:'Order Fulfillment', stages:['Ordered','Confirmed','Receiving','Staged','Delivered'], current:3, records:22 },
  { name:'AIA Pay Application', stages:['PM Update','Controller Review','Signature','Notary','Submitted'], current:1, records:7 },
  { name:'Logo Mat Approval', stages:['Field Intake','Vendor Estimate','Proof Review','Customer Signoff','Production'], current:2, records:4 },
];

const modules = [
  ['FinishLine','Delivery scheduling, loading and proof of completion',Truck],
  ['CrewFlow','Crew, vehicle, availability and daily scheduling',Users],
  ['ContractOps','AIA billing, waivers and contract administration',ClipboardCheck],
  ['MatBuilder Pro','Mat intake, roll optimization, proof and quoting',Grid2X2],
  ['Design Vault','Gym design versioning, proofing and approvals',FileText],
  ['CourtVision','Invite-only court visualization experience',Layers3],
  ['FCC Connect','Public profiles, lead capture and attribution',Users],
  ['Price Book','Master products, cost, pricing and vendor records',PackageCheck],
];

const rolePages = {
  Executive:['home','tasks','customers','projects','workflows','documents','reports','modules','settings'],
  Operations:['home','tasks','customers','projects','workflows','documents','modules'],
  Sales:['home','tasks','customers','projects','documents','modules'],
  Accounting:['home','tasks','customers','workflows','documents','reports'],
  Warehouse:['home','tasks','projects','documents','modules'],
};

const nav = [
  ['home','My Work',Home],['tasks','Tasks',CheckCircle2],['customers','Customers',Building2],
  ['projects','Projects',Truck],['workflows','Workflow Center',Workflow],['documents','Documents',FileText],
  ['reports','ScoreCenter',Gauge],['modules','All Tools',Grid2X2],['settings','Settings',Settings],
];

function App(){
  const [page,setPage] = useState('home');
  const [role,setRole] = useState(localStorage.getItem('fcc-role') || 'Executive');
  const [theme,setTheme] = useState(localStorage.getItem('fcc-theme') || 'light');
  const [menu,setMenu] = useState(true);
  const [searchOpen,setSearchOpen] = useState(false);
  const [search,setSearch] = useState('');
  const [launcher,setLauncher] = useState(false);
  const [createOpen,setCreateOpen] = useState(false);
  const [customers,setCustomers] = useState(initialCustomers);
  const [selectedCustomer,setSelectedCustomer] = useState(0);
  const [tasks,setTasks] = useState(()=>JSON.parse(localStorage.getItem('fcc-tasks') || 'null') || initialTasks);
  const [workflows,setWorkflows] = useState(workflowsSeed);
  const [notices,setNotices] = useState(true);

  const persistTasks = (next)=>{ setTasks(next); localStorage.setItem('fcc-tasks',JSON.stringify(next)); };
  const changeRole = (value)=>{ setRole(value); localStorage.setItem('fcc-role',value); if(!rolePages[value].includes(page)) setPage('home'); };
  const changeTheme = ()=>{ const next=theme==='light'?'dark':'light'; setTheme(next); localStorage.setItem('fcc-theme',next); };
  const searchResults = useMemo(()=>{
    if(!search.trim()) return [];
    const q=search.toLowerCase();
    const rows=[];
    customers.forEach((c,i)=>{ if(c.name.toLowerCase().includes(q)||c.facilities.some(f=>f.name.toLowerCase().includes(q)||f.spaces.some(s=>s.toLowerCase().includes(q)))) rows.push({type:'Customer',title:c.name,meta:c.id,action:()=>{setSelectedCustomer(i);setPage('customers')}}); });
    tasks.forEach(t=>{if(`${t.title} ${t.context} ${t.owner}`.toLowerCase().includes(q)) rows.push({type:'Task',title:t.title,meta:t.context,action:()=>setPage('tasks')});});
    modules.forEach(m=>{if(`${m[0]} ${m[1]}`.toLowerCase().includes(q)) rows.push({type:'Module',title:m[0],meta:m[1],action:()=>setPage('modules')});});
    return rows.slice(0,12);
  },[search,customers,tasks]);

  const visibleNav=nav.filter(([id])=>rolePages[role].includes(id));
  const content={
    home:<HomePage role={role} tasks={tasks} workflows={workflows} go={setPage}/>,
    tasks:<TasksPage tasks={tasks} setTasks={persistTasks} openCreate={()=>setCreateOpen(true)}/>,
    customers:<CustomersPage customers={customers} setCustomers={setCustomers} selected={selectedCustomer} setSelected={setSelectedCustomer} openCreate={()=>setCreateOpen(true)}/>,
    projects:<ProjectsPage/>, workflows:<WorkflowsPage workflows={workflows} setWorkflows={setWorkflows}/>,
    documents:<DocumentsPage/>, reports:<ReportsPage/>, modules:<ModulesPage/>, settings:<SettingsPage role={role}/>
  }[page];

  return <div className={theme==='dark'?'app dark':'app'}>
    <header className="topbar">
      <div className="brand"><button className="icon" onClick={()=>setMenu(!menu)}><Menu size={20}/></button><span className="fcc-mark">FCC</span><div><strong>FCC Ops</strong><small>The Sports Floor Pros</small></div></div>
      <button className="searchbar" onClick={()=>setSearchOpen(true)}><Search size={18}/><span>Search customers, facilities, projects, documents…</span><kbd>Ctrl K</kbd></button>
      <div className="top-actions"><button className="icon" onClick={changeTheme}>{theme==='light'?<Moon size={19}/>:<Sun size={19}/>}</button><button className="icon" onClick={()=>setLauncher(true)}><Grid2X2 size={19}/></button><button className="icon notice" onClick={()=>setNotices(!notices)}><Bell size={19}/><i>4</i></button><div className="role"><ShieldCheck size={16}/><select value={role} onChange={e=>changeRole(e.target.value)}>{Object.keys(rolePages).map(r=><option key={r}>{r}</option>)}</select></div><span className="avatar">BN</span></div>
    </header>
    <aside className={menu?'sidebar':'sidebar hidden'}><div className="workspace"><i></i><div><small>WORKSPACE</small><strong>Floor Care Concepts</strong></div></div><nav>{visibleNav.map(([id,label,Icon])=><button key={id} className={page===id?'active':''} onClick={()=>setPage(id)}><Icon size={18}/><span>{label}</span>{id==='tasks'&&<b>{tasks.filter(t=>t.status!=='Complete').length}</b>}</button>)}</nav><div className="sidebar-user"><span className="avatar small">BN</span><div><strong>Blaine Naessens</strong><small>{role}</small></div></div></aside>
    <main className={menu?'content shifted':'content'}>{content}</main>
    {notices&&<NotificationPanel close={()=>setNotices(false)}/>} 
    {launcher&&<Launcher close={()=>setLauncher(false)} go={setPage}/>} 
    {searchOpen&&<SearchPalette value={search} setValue={setSearch} results={searchResults} close={()=>{setSearchOpen(false);setSearch('')}}/>}
    {createOpen&&<CreateModal close={()=>setCreateOpen(false)} tasks={tasks} setTasks={persistTasks} customers={customers} setCustomers={setCustomers}/>} 
  </div>
}

function PageHead({eyebrow,title,copy,action}){return <div className="page-head"><div><span>{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div>{action}</div>}
function HomePage({role,tasks,workflows,go}){const open=tasks.filter(t=>t.status!=='Complete').slice(0,4);return <>
  <PageHead eyebrow={`MY WORK · ${role.toUpperCase()}`} title={{Executive:'Command the business from one place.',Operations:'Keep today’s work moving.',Sales:'Move customers and quotes forward.',Accounting:'Protect cash flow and close the loop.',Warehouse:'Stage, load and deliver with confidence.'}[role]} copy="Your priorities, approvals, activity and operating signals—assembled from every FCC Ops module." action={<button className="primary" onClick={()=>go('tasks')}><Plus size={17}/> New task</button>}/>
  <section className="hero"><div><small>TUESDAY · AUGUST 4</small><h2>Good afternoon, Blaine.</h2><p>There are <b>3 items requiring attention</b> before today’s work is fully on track.</p></div><div className="pulse"><small>OPERATIONS PULSE</small><strong>92</strong><span>Game ready</span></div></section>
  <section className="signals">{[['Approvals waiting','3','2 due today',ClipboardCheck],['Open tasks',String(tasks.filter(t=>t.status!=='Complete').length),'5 assigned to you',CheckCircle2],['Active projects','27','6 moving today',Truck],['Deliveries','4','2 ready to load',PackageCheck]].map(([a,b,c,I])=><button key={a}><I/><div><small>{a}</small><strong>{b}</strong><span>{c}</span></div><ChevronRight/></button>)}</section>
  <div className="two-col"><section className="panel"><PanelHead eyebrow="YOUR QUEUE" title="Priorities" action={<button onClick={()=>go('tasks')}>View all</button>}/>{open.map(t=><div className="task-line" key={t.id}><span className="checkdot"></span><div><strong>{t.title}</strong><small>{t.context} · Due {t.due}</small></div><Status value={t.status}/><ChevronRight size={17}/></div>)}</section><section className="panel"><PanelHead eyebrow="COMPANY FEED" title="Live activity"/><ActivityFeed/></section></div>
  <section className="panel"><PanelHead eyebrow="WORKFLOW WATCH" title="Where work is collecting" action={<button onClick={()=>go('workflows')}>Open Workflow Center</button>}/><div className="workflow-summary">{workflows.slice(0,3).map(w=><div key={w.name}><header><strong>{w.name}</strong><span>{w.records} active</span></header><div className="stage-mini">{w.stages.map((_,i)=><i key={i} className={i<=w.current?'on':''}></i>)}</div><small>{w.stages[w.current]} is the busiest stage</small></div>)}</div></section>
</>}
function PanelHead({eyebrow,title,action}){return <div className="panel-head"><div><span>{eyebrow}</span><h3>{title}</h3></div>{action}</div>}
function ActivityFeed(){return <div>{[['Delivery ticket completed','Morrice Elementary · Received by K. Riley','18 min ago'],['Document added','Saranac · Signed subcontract uploaded','42 min ago'],['Workflow advanced','Mt. Morris quote moved to Customer Review','1 hr ago'],['Crew updated','Thursday sanding crew reassigned','2 hrs ago']].map(x=><div className="activity" key={x[0]}><span><CheckCircle2 size={17}/></span><div><strong>{x[0]}</strong><p>{x[1]}</p><small>{x[2]}</small></div></div>)}</div>}
function TasksPage({tasks,setTasks,openCreate}){return <><PageHead eyebrow="SHARED TASK ENGINE" title="One queue for every module." copy="Assign, prioritize and complete work without losing the customer, project or module context." action={<button className="primary" onClick={openCreate}><Plus size={17}/> Create task</button>}/><section className="panel table"><div className="table-head"><span>Task</span><span>Owner</span><span>Due</span><span>Status</span><span></span></div>{tasks.map(t=><div className="table-row" key={t.id}><div className="task-title"><button onClick={()=>setTasks(tasks.map(x=>x.id===t.id?{...x,status:'Complete'}:x))}>{t.status==='Complete'?<CheckCircle2/>:<span/>}</button><div><strong>{t.title}</strong><small>{t.context} · {t.priority}</small></div></div><span>{t.owner}</span><span>{t.due}</span><Status value={t.status}/><button className="icon"><ChevronRight/></button></div>)}</section></>}
function CustomersPage({customers,setCustomers,selected,setSelected,openCreate}){const c=customers[selected]||customers[0];return <><PageHead eyebrow="FACILITYDNA" title="Customers, facilities and spaces." copy="Every quote, project, design, delivery, document and task begins with the same shared record." action={<button className="primary" onClick={openCreate}><Plus size={17}/> Add record</button>}/><div className="customer-layout"><section className="panel customer-list"><div className="mini-search"><Search size={16}/><input placeholder="Search customers"/></div>{customers.map((x,i)=><button key={x.id} className={i===selected?'selected':''} onClick={()=>setSelected(i)}><span className="monogram">{x.name.split(' ').slice(0,2).map(a=>a[0]).join('')}</span><div><strong>{x.name}</strong><small>{x.id} · {x.owner}</small></div><ChevronRight/></button>)}</section><section className="record"><div className="record-head"><span className="record-badge"><Building2/></span><div><small>{c.id} · {c.tier}</small><h2>{c.name}</h2><p>{c.address}</p></div><Status value={c.status}/></div><div className="record-stats"><div><small>Account owner</small><strong>{c.owner}</strong></div><div><small>Facilities</small><strong>{c.facilities.length}</strong></div><div><small>Spaces</small><strong>{c.facilities.reduce((n,f)=>n+f.spaces.length,0)}</strong></div><div><small>Open work</small><strong>7</strong></div></div><div className="facility-stack">{c.facilities.map((f,i)=><div className="facility" key={f.name}><header><span><Building2/></span><div><small>{f.type}</small><h3>{f.name}</h3></div><button className="icon"><ChevronRight/></button></header><div className="spaces"><small>SPACES</small>{f.spaces.map(s=><button key={s}>{s}</button>)}<button className="add-space" onClick={()=>{const name=prompt('Space name');if(name){const next=[...customers];next[selected].facilities[i].spaces.push(name);setCustomers(next)}}}><Plus size={14}/> Add</button></div></div>)}</div></section></div></>}
function ProjectsPage(){const lanes=[['Ready to Schedule',[['Morrice Elementary Delivery','FinishLine'],['Saranac Main Gym','Installation']]],['Scheduled',[['Mt. Morris Sanding','CrewFlow'],['Saranac Auxiliary Gym','CrewFlow']]],['In Progress',[['Morrice Main Gym','Project'],['Grand Ledge Recoat','Project']]],['Ready for Accounting',[['Saranac Material Delivery','ContractOps']]]];return <><PageHead eyebrow="PROJECT COMMAND" title="Projects and fulfillment." copy="One view from accepted work through scheduling, field completion, delivery and accounting readiness." action={<button className="primary"><Plus size={17}/> New project</button>}/><div className="kanban">{lanes.map(([lane,cards])=><section key={lane}><header><strong>{lane}</strong><b>{cards.length}</b></header>{cards.map(c=><article key={c[0]}><small>{c[1]}</small><h3>{c[0]}</h3><p>Floor Care Concepts</p><footer><span>Owner assigned</span><ChevronRight size={16}/></footer></article>)}</section>)}</div></>}
function WorkflowsPage({workflows,setWorkflows}){return <><PageHead eyebrow="SHARED STATUS ENGINE" title="Workflow Center." copy="See exactly where work is waiting, who owns the next move and how every module hands work forward."/><div className="workflow-list">{workflows.map((w,index)=><section className="panel workflow-detail" key={w.name}><header><div><small>{w.records} ACTIVE RECORDS</small><h3>{w.name}</h3></div><button className="secondary" onClick={()=>setWorkflows(workflows.map((x,i)=>i===index?{...x,current:Math.min(x.current+1,x.stages.length-1)}:x))}>Advance workflow</button></header><div className="stage-track">{w.stages.map((s,i)=><div className={i<w.current?'done':i===w.current?'current':''} key={s}><i>{i<w.current?'✓':i+1}</i><strong>{s}</strong><small>{i===w.current?'Current stage':i<w.current?'Complete':'Waiting'}</small></div>)}</div></section>)}</div></>}
function DocumentsPage(){return <><PageHead eyebrow="SHARED DOCUMENT VAULT" title="Documents in context." copy="Files remain attached to the customer, facility, project, contract or delivery while staying searchable company-wide." action={<button className="primary"><Plus size={17}/> Upload document</button>}/><section className="panel table docs"><div className="table-head"><span>Document</span><span>Record</span><span>Owner</span><span>Updated</span><span></span></div>{[['Signed Subcontract.pdf','Saranac Jr/Sr High','Blaine','42 min'],['Mat Proof v3.pdf','Morrice Elementary','Caleb','1 hr'],['Delivery Photos.zip','Mt. Morris HS','Operations','Yesterday'],['Lien Waiver.pdf','Saranac BP2','Accounting','Yesterday']].map(d=><div className="table-row" key={d[0]}><div className="doc-name"><span><FileText/></span><div><strong>{d[0]}</strong><small>PDF document</small></div></div><span>{d[1]}</span><span>{d[2]}</span><span>{d[3]}</span><button className="icon"><ChevronRight/></button></div>)}</section></>}
function ReportsPage(){return <><PageHead eyebrow="SCORECENTER" title="Performance intelligence." copy="A leadership-ready view of revenue, operational throughput, cash flow and customer health."/><div className="report-grid">{[['Pipeline','$4.2M','+18%'],['Active backlog','$2.7M','27 projects'],['A/R outstanding','$684K','8 pay apps'],['On-time completion','94%','+3 pts']].map(x=><section className="panel metric" key={x[0]}><small>{x[0]}</small><strong>{x[1]}</strong><span>{x[2]}</span></section>)}</div><div className="two-col"><section className="panel"><PanelHead eyebrow="REVENUE" title="Monthly booked work"/><div className="bars">{[48,67,58,82,76,91].map((h,i)=><div key={i}><span style={{height:`${h}%`}}></span><small>{['Mar','Apr','May','Jun','Jul','Aug'][i]}</small></div>)}</div></section><section className="panel"><PanelHead eyebrow="CUSTOMER HEALTH" title="Accounts needing attention"/>{[['Mt. Morris Consolidated Schools','At Risk'],['Northview Public Schools','Watch'],['Lakewood Schools','Renewal']].map(x=><div className="health-row" key={x[0]}><span className="monogram">{x[0].split(' ').slice(0,2).map(a=>a[0]).join('')}</span><strong>{x[0]}</strong><Status value={x[1]}/></div>)}</section></div></>}
function ModulesPage(){return <><PageHead eyebrow="MODULE LAUNCHER" title="Specialty tools, one platform." copy="Open less-frequent workflows without turning the homepage into a grid of disconnected apps."/><div className="module-grid">{modules.map(([name,copy,Icon])=><button className="module" key={name}><span><Icon/></span><div><small>FCC OPS MODULE</small><h3>{name}</h3><p>{copy}</p></div><ChevronRight/></button>)}</div></>}
function SettingsPage({role}){return <><PageHead eyebrow="PLATFORM ADMINISTRATION" title="Settings and access." copy="Manage the shared platform—not each module separately."/><div className="settings-grid"><section className="panel"><PanelHead eyebrow="IDENTITY" title="Single sign-on and roles"/><p>Production authentication is prepared for Supabase Auth. Current preview uses role simulation.</p><div className="setting-row"><div><strong>Your role</strong><small>Determines navigation, records and actions</small></div><Status value={role}/></div></section><section className="panel"><PanelHead eyebrow="PLATFORM" title="Shared services"/>{['Global search','Task engine','Notification center','Document vault','Activity history','Workflow engine'].map(x=><div className="setting-row" key={x}><strong>{x}</strong><span className="enabled">Enabled</span></div>)}</section></div></>}
function Status({value}){return <span className={`status ${value.toLowerCase().replaceAll(' ','-')}`}>{value}</span>}
function NotificationPanel({close}){return <aside className="notifications"><header><strong>Notifications</strong><button className="icon" onClick={close}><X/></button></header>{[['Approval needed','Saranac pay app is ready for controller review','2 min'],['Delivery ready','Morrice order has been staged','24 min'],['Proof received','Facility Armor uploaded a revised mat proof','1 hr'],['Task overdue','Mt. Morris crew assignment needs attention','3 hrs']].map(n=><button key={n[0]}><i></i><div><strong>{n[0]}</strong><p>{n[1]}</p></div><small>{n[2]}</small></button>)}</aside>}
function Launcher({close,go}){return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&close()}><section className="modal launcher"><header><div><small>FCC OPS</small><h2>All tools</h2></div><button className="icon" onClick={close}><X/></button></header><div className="module-grid">{modules.map(([name,copy,Icon])=><button className="module" key={name} onClick={()=>{go('modules');close()}}><span><Icon/></span><div><small>MODULE</small><h3>{name}</h3><p>{copy}</p></div><ChevronRight/></button>)}</div></section></div>}
function SearchPalette({value,setValue,results,close}){return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&close()}><section className="modal command"><header><Command/><input autoFocus value={value} onChange={e=>setValue(e.target.value)} placeholder="Search the entire company…"/><kbd>ESC</kbd></header>{!value?<div className="search-empty"><Search/><h3>Search FCC Ops</h3><p>Find customers, facilities, spaces, tasks, documents, projects or modules.</p></div>:<div className="results">{results.length?results.map((r,i)=><button key={i} onClick={()=>{r.action();close()}}><span>{r.type}</span><div><strong>{r.title}</strong><small>{r.meta}</small></div><ChevronRight/></button>):<p>No matching records.</p>}</div>}</section></div>}
function CreateModal({close,tasks,setTasks,customers,setCustomers}){const [tab,setTab]=useState('task');const submit=e=>{e.preventDefault();const f=new FormData(e.currentTarget);if(tab==='task')setTasks([{id:Date.now(),title:f.get('title'),context:f.get('context')||'FCC Ops',owner:f.get('owner')||'Unassigned',due:f.get('due')||'No date',priority:'Normal',status:'Ready'},...tasks]);if(tab==='customer')setCustomers([{id:`CUS-${1050+customers.length}`,name:f.get('title'),tier:'Standard',owner:f.get('owner')||'Unassigned',status:'Active',address:f.get('context')||'Address not entered',facilities:[]},...customers]);close()};return <div className="overlay"><section className="modal create"><header><div><small>QUICK CREATE</small><h2>Add shared work</h2></div><button className="icon" onClick={close}><X/></button></header><div className="tabs"><button className={tab==='task'?'active':''} onClick={()=>setTab('task')}>Task</button><button className={tab==='customer'?'active':''} onClick={()=>setTab('customer')}>Customer</button></div><form onSubmit={submit}><label>{tab==='task'?'Task title':'Customer name'}<input name="title" required/></label><label>{tab==='task'?'Module or project':'Primary address'}<input name="context"/></label><div className="form-grid"><label>Owner<input name="owner"/></label>{tab==='task'&&<label>Due<input name="due" placeholder="Today, Friday…"/></label>}</div><button className="primary" type="submit">Create {tab}</button></form></section></div>}

export default App;
