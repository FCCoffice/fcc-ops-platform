import React,{useEffect,useMemo,useState} from 'react';
import {Activity,Bell,Building2,CalendarDays,Check,ChevronDown,FileCheck2,FileText,Gauge,HardHat,Home,Layers3,Loader2,LogOut,Menu,Moon,MoreHorizontal,PackageCheck,Plus,Search,Settings,ShieldCheck,ShoppingCart,Sun,Users,Warehouse,X} from 'lucide-react';
import * as api from './data/api';
import {AREAS,EMPTY,SUB} from './data/constants';
import {cx} from './components/ui';
import SectionHomeHero from './components/SectionHomeHero';
import {WorkScreen,CustomerScreen,SalesScreen,ProjectScreen,FulfillmentScreen,FieldScreen,ContractScreen,ReportScreen,AdminScreen} from './screens/index';
import {FormRouter,SearchModal,NotificationModal,CreateMenu} from './screens/modals';
import ApprovalPage from './screens/ApprovalPage';

const TOP_NAV=[
 {id:'home',label:'Home',Icon:Home,area:'work',sub:'Mine'},
 {id:'opportunities',label:'Opportunities',Icon:Users,area:'sales',sub:'Sales Requests',menu:[['All Opportunities','sales','Sales Requests'],['My Opportunities','sales','Estimating Queue'],['Opportunity Pipeline','reports','Pipeline']]},
 {id:'quotes',label:'Quotes',Icon:FileText,area:'sales',sub:'Quote Playbook'},
 {id:'projects',label:'Projects',Icon:Layers3,area:'projects',sub:'Project Portfolio'},
 {id:'orders',label:'Orders',Icon:PackageCheck,area:'fulfillment',sub:'OrderDNA'},
 {id:'schedule',label:'Schedule',Icon:CalendarDays,area:'field',sub:'CrewFlow Planner',menu:[['Crew Calendar','field','CrewFlow Planner'],['Project Schedule','projects','Schedule'],['Time Off & Availability','field','Time Off']]},
 {id:'inventory',label:'Inventory',Icon:Warehouse,area:'fulfillment',sub:'Warehouse'},
 {id:'reports',label:'Reports',Icon:Gauge,area:'reports',sub:'ScoreCenter',menu:[['Dashboards','reports','ScoreCenter'],['Reports Library','reports','Operational Health'],['Analytics','reports','Pipeline']]},
 {id:'more',label:'More',Icon:MoreHorizontal,area:'admin',sub:'Price Book',menu:[['Customers & Facilities','customers','Customer Directory'],['Contracts & Billing','contracts','Contract Portfolio'],['Platform Administration','admin','Price Book']]}
];

const CONTEXT_TITLES={work:'HOME',customers:'CUSTOMERS',sales:'OPPORTUNITIES',projects:'PROJECTS',fulfillment:'ORDERS & FULFILLMENT',field:'SCHEDULE & FIELD',contracts:'CONTRACTS',reports:'REPORTS',admin:'MORE'};
const CONTEXT_LABELS={
 work:{Mine:'My Work','My Team':'My Team','Due Today':'Due Today',Overdue:'Overdue',Approvals:'Approvals',Waiting:'Waiting',Exceptions:'Exceptions',Completed:'Completed'},
 customers:{'Customer Directory':'All Customers','Facility Directory':'Facility Directory','Review Queue':'Needs Review',Contacts:'Contacts',Documents:'Documents'},
 sales:{'Sales Requests':'All Opportunities','Estimating Queue':'My Opportunities','Quote Playbook':'Quote Playbook','Proposal Review':'Proposal Review','MatBuilder Pro':'MatBuilder Pro','FCC Connect':'FCC Connect'},
 projects:{'Project Portfolio':'All Projects','Design & Approval':'Design & Approval',Schedule:'Project Schedule','Crew Requirements':'Crew Requirements',Closeout:'Project Closeout'},
 fulfillment:{OrderDNA:'All Orders',Purchasing:'Purchasing',Receiving:'Receiving',Warehouse:'Inventory','Staging & Loading':'Staging & Loading','FinishLine Delivery':'FinishLine Delivery'},
 field:{Today:'Today','CrewFlow Planner':'Crew Calendar',Availability:'Availability','Time Off':'Time Off & Availability','Proof & Forms':'Proof & Forms','Safety & Incidents':'Safety & Incidents'},
 contracts:{'Contract Portfolio':'All Contracts','SOV & Pay Apps':'Pay Applications',Compliance:'Compliance',Waivers:'Waivers',Payments:'Payments'},
 reports:{ScoreCenter:'Dashboards',Pipeline:'Pipeline','Operational Health':'Operational Health','Contract Health':'Contract Health',Exceptions:'Exceptions'},
 admin:{'Price Book':'Price Book',Vendors:'Vendors','Users & Roles':'Users & Roles','Workflow Builder':'Workflow Builder',Templates:'Templates',Documents:'Documents',Audit:'Audit'}
};

export default function FccOpsApp(){
 const [session,setSession]=useState(null),[boot,setBoot]=useState(api.configured()),[loading,setLoading]=useState(false);
 const [data,setData]=useState(EMPTY),[area,setArea]=useState('work'),[sub,setSub]=useState('Mine'),[rail,setRail]=useState(true);
 const [theme,setTheme]=useState(localStorage.getItem('fcc-theme')||'light'),[modal,setModal]=useState(null),[toast,setToast]=useState(''),[error,setError]=useState('');
 const [navMenu,setNavMenu]=useState(null);
 const [selected,setSelected]=useState({customer:null,facility:null,request:null,quote:null,project:null,order:null,po:null,delivery:null,contract:null});
 useEffect(()=>{api.loadSession().then(setSession).catch(e=>setError(e.message)).finally(()=>setBoot(false));return api.subscribeAuth(setSession)},[]);
 useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('fcc-theme',theme)},[theme]);
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
 const screens={work:WorkScreen,customers:CustomerScreen,sales:SalesScreen,projects:ProjectScreen,fulfillment:FulfillmentScreen,field:FieldScreen,contracts:ContractScreen,reports:ReportScreen,admin:AdminScreen};const Screen=screens[area];
 const isSectionHome=sub===SUB[area][0];
 const activeTop=useMemo(()=>{
   const exact=TOP_NAV.find(item=>item.area===area&&item.sub===sub);
   if(exact)return exact.id;
   if(area==='sales')return sub==='Quote Playbook'||sub==='Proposal Review'?'quotes':'opportunities';
   if(area==='fulfillment')return sub==='Warehouse'?'inventory':'orders';
   if(area==='field'||(area==='projects'&&sub==='Schedule'))return 'schedule';
   if(area==='reports')return 'reports';
   if(area==='projects')return 'projects';
   if(area==='work')return 'home';
   return 'more';
 },[area,sub]);
 return <div className={cx('fcc-shell',theme==='dark'&&'dark')}>
  <header className="top-command reference-header">
   <button className="mobile-menu icon-btn" onClick={()=>setRail(!rail)}><Menu/></button>
   <button className="brand reference-brand" onClick={()=>navigate('work','Mine')}>
    <span className="fcc-wordmark">FCC</span><span className="ops-wordmark">OPS</span><small>POWERED BY FACILITYDNA™</small>
   </button>
   <nav className="major-nav reference-nav">{TOP_NAV.map(item=>{const I=item.Icon;return <button key={item.id} className={activeTop===item.id?'active':''} onClick={()=>item.menu?setNavMenu(navMenu===item.id?null:item.id):navigate(item.area,item.sub)}><I/><span>{item.label}</span>{item.menu&&<ChevronDown className="nav-caret"/>}</button>})}</nav>
   <div className="utilities reference-utilities"><button className="icon-btn header-search" onClick={()=>setModal({type:'search'})}><Search/></button><button className="icon-btn" onClick={()=>setTheme(theme==='light'?'dark':'light')}>{theme==='light'?<Moon/>:<Sun/>}</button><button className="icon-btn badge-btn" onClick={()=>setModal({type:'notifications'})}><Bell/><i>{data.notifications.filter(n=>!n.read_at).length}</i></button><button className="primary compact" onClick={()=>setModal({type:'create-menu'})}><Plus/>Create</button><button className="profile reference-profile"><span className="profile-photo">BN</span><span className="profile-copy"><strong>Blaine Naessens</strong><small>Operations Manager</small></span><ChevronDown/></button></div>
  </header>
  {navMenu&&<div className="nav-dropdown-shell" onClick={()=>setNavMenu(null)}><div className={cx('nav-dropdown',`nav-dropdown-${navMenu}`)} onClick={e=>e.stopPropagation()}>{TOP_NAV.find(x=>x.id===navMenu)?.menu?.map(([label,nextArea,nextSub])=><button key={label} onClick={()=>navigate(nextArea,nextSub)}><span>{label}</span></button>)}</div></div>}
  <aside className={cx('context-nav reference-context',!rail&&'hidden')}><div className="context-title"><small>{CONTEXT_TITLES[area]}</small><strong>{CONTEXT_LABELS[area]?.[sub]||sub}</strong></div><nav>{SUB[area].map(x=><button key={x} className={sub===x?'active':''} onClick={()=>setSub(x)}><span>{CONTEXT_LABELS[area]?.[x]||x}</span></button>)}</nav><footer><Activity/><div><small>FCC Ops status</small><strong>{loading?'Synchronizing':'Connected'}</strong></div></footer></aside>
  <main className={cx('workspace reference-workspace',!rail&&'wide')}>{error&&<div className="error-banner"><span>{error}</span><button onClick={()=>setError('')}><X/></button></div>}{loading&&<div className="loading-line"><Loader2 className="spin"/>Synchronizing FCC Ops</div>}{isSectionHome?<SectionHomeHero area={area} data={data} onCreate={()=>setModal({type:'create-menu'})} onNavigate={(nextArea,nextSub)=>navigate(nextArea||area,nextSub)}/>:<Screen view={sub} {...props}/>}</main>
  {modal?.type==='search'&&<SearchModal close={()=>setModal(null)} go={go}/>} {modal?.type==='notifications'&&<NotificationModal close={()=>setModal(null)} {...props}/>} {modal?.type==='create-menu'&&<CreateMenu close={()=>setModal(null)} open={type=>setModal({type})}/>} {modal&&!['search','notifications','create-menu'].includes(modal.type)&&<FormRouter modal={modal} close={()=>setModal(null)} {...props}/>} {toast&&<div className="toast"><Check/>{toast}</div>}
 </div>
}
function Auth(){const [email,setEmail]=useState(''),[sent,setSent]=useState(false),[busy,setBusy]=useState(false),[err,setErr]=useState('');async function submit(e){e.preventDefault();setBusy(true);try{await api.signIn(email);setSent(true)}catch(x){setErr(x.message)}finally{setBusy(false)}}return <div className="auth"><section><header><b>FCC</b><div><strong>FCC Ops</strong><small>One operating system. One source of truth.</small></div></header>{sent?<div className="auth-result"><Check/><h1>Secure link sent.</h1><p>Open the email sent to <b>{email}</b>.</p></div>:<form onSubmit={submit}><small>AUTHORIZED TEAM ACCESS</small><h1>Enter the championship workspace.</h1><p>Use your Floor Care Concepts email. Your role and record permissions determine access.</p><label>Email address<input required type="email" value={email} onChange={e=>setEmail(e.target.value)}/></label>{err&&<div className="form-error">{err}</div>}<button className="primary" disabled={busy}>{busy?<Loader2 className="spin"/>:<ShieldCheck/>}Send secure sign-in link</button></form>}</section></div>}
