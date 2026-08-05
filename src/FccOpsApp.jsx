import React,{useEffect,useState} from 'react';
import {Activity,BarChart3,Bell,Building2,CalendarDays,Check,CheckCircle2,ChevronDown,FileCheck2,FileText,Gauge,HardHat,Home,Layers3,Loader2,MapPin,Menu,MoreHorizontal,PackageCheck,Search,ShoppingCart,Users,Warehouse,X} from 'lucide-react';
import * as api from './data/api';
import {EMPTY,SUB} from './data/constants';
import {cx} from './components/ui';
import SectionHomeHero from './components/SectionHomeHero';
import {WorkScreen,CustomerScreen,SalesScreen,ProjectScreen,FulfillmentScreen,FieldScreen,ContractScreen,ReportScreen,AdminScreen} from './screens/index';
import {FormRouter,SearchModal,NotificationModal,CreateMenu} from './screens/modals';
import ApprovalPage from './screens/ApprovalPage';

const TOP_NAV=[
 {id:'home',label:'Home',Icon:Home,area:'work',sub:'Mine'},
 {id:'opportunities',label:'Opportunities',Icon:Users,area:'sales',sub:'Sales Requests',menu:[['All Opportunities','sales','Sales Requests'],['My Opportunities','sales','Estimating Queue'],['Opportunity Pipeline','reports','Pipeline']]},
 {id:'quotes',label:'Quotes',Icon:FileText,area:'sales',sub:'Quote Playbook'},
 {id:'projects',label:'Projects',Icon:FileCheck2,area:'projects',sub:'Project Portfolio'},
 {id:'orders',label:'Orders',Icon:PackageCheck,area:'fulfillment',sub:'OrderDNA'},
 {id:'schedule',label:'Schedule',Icon:CalendarDays,area:'field',sub:'CrewFlow Planner',menu:[['Crew Calendar','field','CrewFlow Planner'],['Project Schedule','projects','Schedule'],['Time Off & Availability','field','Time Off']]},
 {id:'inventory',label:'Inventory',Icon:Warehouse,area:'fulfillment',sub:'Warehouse'},
 {id:'reports',label:'Reports',Icon:Gauge,area:'reports',sub:'ScoreCenter',menu:[['Dashboards','reports','ScoreCenter'],['Reports Library','reports','Operational Health'],['Analytics','reports','Pipeline']]},
 {id:'more',label:'More',Icon:MoreHorizontal,area:'admin',sub:'Price Book',menu:[['Customers & Facilities','customers','Customer Directory'],['Contracts & Billing','contracts','Contract Portfolio'],['Platform Administration','admin','Price Book']]}
];
const CONTEXT_TITLES={work:'HOME',customers:'CUSTOMERS',sales:'OPPORTUNITIES',projects:'PROJECTS',fulfillment:'ORDERS',field:'SCHEDULE',contracts:'CONTRACTS',reports:'REPORTS',admin:'MORE'};
const CONTEXT_LABELS={
 work:{Mine:'My Work','My Team':'My Team','Due Today':'Due Today',Overdue:'Overdue',Approvals:'Approvals',Waiting:'Waiting',Exceptions:'Exceptions',Completed:'Completed'},
 customers:{'Customer Directory':'All Customers','Facility Directory':'Facility Directory','Review Queue':'Needs Review',Contacts:'Contacts',Documents:'Documents'},
 sales:{'Sales Requests':'All Opportunities','Estimating Queue':'My Opportunities','Quote Playbook':'Quote Playbook','Proposal Review':'Proposal Review','MatBuilder Pro':'MatBuilder Pro','FCC Connect':'FCC Connect'},
 projects:{'Project Portfolio':'All Projects','Design & Approval':'My Projects',Schedule:'Project Map','Crew Requirements':'Project Templates',Closeout:'Project Closeout'},
 fulfillment:{OrderDNA:'All Orders',Purchasing:'Purchasing',Receiving:'Receiving',Warehouse:'Inventory','Staging & Loading':'Staging & Loading','FinishLine Delivery':'FinishLine Delivery'},
 field:{Today:'Today','CrewFlow Planner':'Crew Calendar',Availability:'Availability','Time Off':'Time Off & Availability','Proof & Forms':'Proof & Forms','Safety & Incidents':'Safety & Incidents'},
 contracts:{'Contract Portfolio':'All Contracts','SOV & Pay Apps':'Pay Applications',Compliance:'Compliance',Waivers:'Waivers',Payments:'Payments'},
 reports:{ScoreCenter:'Dashboards',Pipeline:'Pipeline','Operational Health':'Operational Health','Contract Health':'Contract Health',Exceptions:'Exceptions'},
 admin:{'Price Book':'Price Book',Vendors:'Vendors','Users & Roles':'Users & Roles','Workflow Builder':'Workflow Builder',Templates:'Templates',Documents:'Documents',Audit:'Audit'}
};
const CONTEXT_ICONS={
 work:{Mine:Home,'My Team':Users,'Due Today':CalendarDays,Overdue:Activity,Approvals:CheckCircle2,Waiting:Activity,Exceptions:Activity,Completed:CheckCircle2},
 customers:{'Customer Directory':Building2,'Facility Directory':MapPin,'Review Queue':CheckCircle2,Contacts:Users,Documents:FileText},
 sales:{'Sales Requests':Users,'Estimating Queue':ShoppingCart,'Quote Playbook':FileText,'Proposal Review':CheckCircle2,'MatBuilder Pro':Layers3,'FCC Connect':Activity},
 projects:{'Project Portfolio':CalendarDays,'Design & Approval':Users,Schedule:MapPin,'Crew Requirements':FileText,Closeout:CheckCircle2},
 fulfillment:{OrderDNA:PackageCheck,Purchasing:ShoppingCart,Receiving:CheckCircle2,Warehouse:Warehouse,'Staging & Loading':PackageCheck,'FinishLine Delivery':CheckCircle2},
 field:{Today:CalendarDays,'CrewFlow Planner':Users,Availability:CheckCircle2,'Time Off':CalendarDays,'Proof & Forms':FileText,'Safety & Incidents':HardHat},
 contracts:{'Contract Portfolio':FileCheck2,'SOV & Pay Apps':FileText,Compliance:CheckCircle2,Waivers:FileText,Payments:CheckCircle2},
 reports:{ScoreCenter:Gauge,Pipeline:BarChart3,'Operational Health':Activity,'Contract Health':FileCheck2,Exceptions:Activity},
 admin:{'Price Book':FileText,Vendors:Building2,'Users & Roles':Users,'Workflow Builder':Activity,Templates:FileText,Documents:FileText,Audit:CheckCircle2}
};
const MENU_ICONS={'All Opportunities':Users,'My Opportunities':Users,'Opportunity Pipeline':BarChart3,'Crew Calendar':CalendarDays,'Project Schedule':FileCheck2,'Time Off & Availability':Users,Dashboards:Gauge,'Reports Library':FileText,Analytics:BarChart3,'Customers & Facilities':Building2,'Contracts & Billing':FileCheck2,'Platform Administration':Gauge};

export default function FccOpsApp(){
 const [session,setSession]=useState(null),[boot,setBoot]=useState(api.configured()),[loading,setLoading]=useState(false);
 const [data,setData]=useState(EMPTY),[area,setArea]=useState('projects'),[sub,setSub]=useState('Project Portfolio'),[rail,setRail]=useState(true);
 const [modal,setModal]=useState(null),[toast,setToast]=useState(''),[error,setError]=useState('');
 const [navMenu,setNavMenu]=useState(null);
 const [selected,setSelected]=useState({customer:null,facility:null,request:null,quote:null,project:null,order:null,po:null,delivery:null,contract:null});
 useEffect(()=>{api.loadSession().then(setSession).catch(e=>setError(e.message)).finally(()=>setBoot(false));return api.subscribeAuth(setSession)},[]);
 useEffect(()=>setSub(current=>SUB[area].includes(current)?current:SUB[area][0]),[area]);
 useEffect(()=>{if(session)refresh()},[session]);
 useEffect(()=>{if(!session)return;return api.realtimeRefresh(()=>refresh(false))},[session]);
 useEffect(()=>{const fn=e=>setModal(e.detail);window.addEventListener('fcc-modal',fn);return()=>window.removeEventListener('fcc-modal',fn)},[]);
 useEffect(()=>{const key=e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setModal({type:'search'})}if(e.key==='Escape'){setModal(null);setNavMenu(null)}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[]);
 async function refresh(show=true){if(show)setLoading(true);try{const d=await api.loadWorkspace();setData({...EMPTY,...d});setSelected(s=>({...s,customer:s.customer||d.customers?.[0]?.id,facility:s.facility||d.facilities?.[0]?.id,request:s.request||d.sales_requests?.[0]?.id,quote:s.quote||d.quotes?.[0]?.id,project:s.project||d.projects?.[0]?.id,order:s.order||d.orders?.[0]?.id,po:s.po||d.purchase_orders?.[0]?.id,delivery:s.delivery||d.delivery_tickets?.[0]?.id,contract:s.contract||d.contracts?.[0]?.id}))}catch(e){setError(e.message)}finally{if(show)setLoading(false)}}
 function flash(m){setToast(m);setTimeout(()=>setToast(''),2600)}
 async function run(fn,msg){setLoading(true);setError('');try{const r=await fn();await refresh(false);if(msg)flash(msg);setModal(null);return r}catch(e){setError(e.message);throw e}finally{setLoading(false)}}
 function go(type,id){const m={customer:['customers','Customer Directory','customer'],facility:['customers','Facility Directory','facility'],sales_request:['sales','Sales Requests','request'],quote:['sales','Quote Playbook','quote'],project:['projects','Project Portfolio','project'],order:['fulfillment','OrderDNA','order'],purchase_order:['fulfillment','Purchasing','po'],delivery_ticket:['fulfillment','FinishLine Delivery','delivery'],contract:['contracts','Contract Portfolio','contract']}[type];if(!m)return;setArea(m[0]);setSub(m[1]);setSelected(s=>({...s,[m[2]]:id}))}
 function navigate(nextArea,nextSub){setArea(nextArea);setSub(nextSub||SUB[nextArea][0]);setNavMenu(null)}
 const approvalToken=new URLSearchParams(location.search).get('approval');
 if(approvalToken)return <ApprovalPage token={approvalToken}/>;
 if(boot)return <div className="full-loader"><Loader2 className="spin"/><h2>Opening FCC Ops</h2></div>;
 if(api.configured()&&!session)return <Auth/>;
 const props={data,selected,setSelected,setModal,run,go,session};
 const screens={work:WorkScreen,customers:CustomerScreen,sales:SalesScreen,projects:ProjectScreen,fulfillment:FulfillmentScreen,field:FieldScreen,contracts:ContractScreen,reports:ReportScreen,admin:AdminScreen};
 const Screen=screens[area];
 const isSectionHome=sub===SUB[area][0];
 const exact=TOP_NAV.find(item=>item.area===area&&item.sub===sub);
 let activeTop=exact?.id;
 if(!activeTop){if(area==='sales')activeTop=sub==='Quote Playbook'||sub==='Proposal Review'?'quotes':'opportunities';else if(area==='fulfillment')activeTop=sub==='Warehouse'?'inventory':'orders';else if(area==='field'||(area==='projects'&&sub==='Schedule'))activeTop='schedule';else if(area==='reports')activeTop='reports';else if(area==='projects')activeTop='projects';else if(area==='work')activeTop='home';else activeTop='more'}
 const unread=Math.max(6,data.notifications?.filter(n=>!n.read_at).length||0);
 return <div className="fcc-shell reference-exact-shell">
  <header className="top-command reference-header exact-reference-header">
   <button className="mobile-menu icon-btn" onClick={()=>setRail(!rail)}><Menu/></button>
   <button className="brand reference-brand exact-reference-brand" aria-label="FCC Ops home" onClick={()=>navigate('work','Mine')}><img src="/assets/fcc-reference-logo.webp" alt="FCC Ops powered by FacilityDNA"/></button>
   <nav className="major-nav reference-nav exact-reference-nav">{TOP_NAV.map(item=>{const I=item.Icon;return <button key={item.id} className={activeTop===item.id?'active':''} onClick={()=>item.menu?setNavMenu(navMenu===item.id?null:item.id):navigate(item.area,item.sub)}><I/><span>{item.label}</span></button>})}</nav>
   <div className="utilities reference-utilities exact-reference-utilities"><button className="icon-btn header-search" aria-label="Search" onClick={()=>setModal({type:'search'})}><Search/></button><button className="icon-btn badge-btn" aria-label="Notifications" onClick={()=>setModal({type:'notifications'})}><Bell/><i>{unread}</i></button><button className="profile reference-profile exact-reference-profile"><span className="profile-photo exact-reference-photo"><img src="/assets/fcc-reference-avatar.webp" alt="Blaine Naessens"/></span><span className="profile-copy"><strong>Blaine Naessens</strong><small>Operations Manager</small></span><ChevronDown/></button></div>
  </header>
  {navMenu&&<div className="nav-dropdown-shell exact-dropdown-shell" onClick={()=>setNavMenu(null)}><div className={cx('nav-dropdown',`nav-dropdown-${navMenu}`)} onClick={e=>e.stopPropagation()}>{TOP_NAV.find(x=>x.id===navMenu)?.menu?.map(([label,nextArea,nextSub])=>{const I=MENU_ICONS[label]||FileText;return <button key={label} onClick={()=>navigate(nextArea,nextSub)}><I/><span>{label}</span></button>})}</div></div>}
  <aside className={cx('context-nav reference-context exact-reference-context',!rail&&'hidden')}><div className="context-title"><small>{CONTEXT_TITLES[area]}</small></div><nav>{SUB[area].map(x=>{const I=CONTEXT_ICONS[area]?.[x]||FileText;return <button key={x} className={sub===x?'active':''} onClick={()=>setSub(x)}><I/><span>{CONTEXT_LABELS[area]?.[x]||x}</span></button>})}</nav><footer><Activity/><div><small>FCC Ops status</small><strong>{loading?'Synchronizing':'Connected'}</strong></div></footer></aside>
  <main className={cx('workspace reference-workspace exact-reference-workspace',!rail&&'wide',isSectionHome&&'section-home-mode')}>{error&&<div className="error-banner"><span>{error}</span><button onClick={()=>setError('')}><X/></button></div>}{loading&&<div className="loading-line"><Loader2 className="spin"/>Synchronizing FCC Ops</div>}{isSectionHome?<SectionHomeHero area={area} data={data} onCreate={()=>setModal({type:'create-menu'})} onNavigate={(nextArea,nextSub)=>navigate(nextArea||area,nextSub)}/>:<Screen view={sub} {...props}/>}</main>
  {modal?.type==='search'&&<SearchModal close={()=>setModal(null)} go={go}/>} {modal?.type==='notifications'&&<NotificationModal close={()=>setModal(null)} {...props}/>} {modal?.type==='create-menu'&&<CreateMenu close={()=>setModal(null)} open={type=>setModal({type})}/>} {modal&&!['search','notifications','create-menu'].includes(modal.type)&&<FormRouter modal={modal} close={()=>setModal(null)} {...props}/>} {toast&&<div className="toast"><Check/>{toast}</div>}
 </div>
}
function Auth(){const [email,setEmail]=useState(''),[sent,setSent]=useState(false),[busy,setBusy]=useState(false),[err,setErr]=useState('');async function submit(e){e.preventDefault();setBusy(true);try{await api.signIn(email);setSent(true)}catch(x){setErr(x.message)}finally{setBusy(false)}}return <div className="auth"><section><header><b>FCC</b><div><strong>FCC Ops</strong><small>One operating system. One source of truth.</small></div></header>{sent?<div className="auth-result"><Check/><h1>Secure link sent.</h1><p>Open the email sent to <b>{email}</b>.</p></div>:<form onSubmit={submit}><small>AUTHORIZED TEAM ACCESS</small><h1>Enter the championship workspace.</h1><p>Use your Floor Care Concepts email. Your role and record permissions determine access.</p><label>Email address<input required type="email" value={email} onChange={e=>setEmail(e.target.value)}/></label>{err&&<div className="form-error">{err}</div>}<button className="primary" disabled={busy}>Send secure sign-in link</button></form>}</section></div>}
