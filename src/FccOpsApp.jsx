import React,{useEffect,useState} from 'react';
import {Activity,Bell,Building2,Check,FileCheck2,Gauge,HardHat,Home,Layers3,Loader2,LogOut,Menu,Moon,PackageCheck,Plus,Search,Settings,ShieldCheck,ShoppingCart,Sun,X} from 'lucide-react';
import * as api from './data/api';
import {AREAS,EMPTY,SUB} from './data/constants';
import {cx} from './components/ui';
import SectionHomeHero from './components/SectionHomeHero';
import {WorkScreen,CustomerScreen,SalesScreen,ProjectScreen,FulfillmentScreen,FieldScreen,ContractScreen,ReportScreen,AdminScreen} from './screens/index';
import {FormRouter,SearchModal,NotificationModal,CreateMenu} from './screens/modals';
import ApprovalPage from './screens/ApprovalPage';

const ICONS={work:Home,customers:Building2,sales:ShoppingCart,projects:Layers3,fulfillment:PackageCheck,field:HardHat,contracts:FileCheck2,reports:Gauge,admin:Settings};
export default function FccOpsApp(){
 const [session,setSession]=useState(null),[boot,setBoot]=useState(api.configured()),[loading,setLoading]=useState(false);
 const [data,setData]=useState(EMPTY),[area,setArea]=useState('work'),[sub,setSub]=useState('Mine'),[rail,setRail]=useState(true);
 const [theme,setTheme]=useState(localStorage.getItem('fcc-theme')||'light'),[modal,setModal]=useState(null),[toast,setToast]=useState(''),[error,setError]=useState('');
 const [selected,setSelected]=useState({customer:null,facility:null,request:null,quote:null,project:null,order:null,po:null,delivery:null,contract:null});
 useEffect(()=>{api.loadSession().then(setSession).catch(e=>setError(e.message)).finally(()=>setBoot(false));return api.subscribeAuth(setSession)},[]);
 useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('fcc-theme',theme)},[theme]);
 useEffect(()=>setSub(SUB[area][0]),[area]);
 useEffect(()=>{if(session)refresh()},[session]);
 useEffect(()=>{if(!session)return;return api.realtimeRefresh(()=>refresh(false))},[session]);
 useEffect(()=>{const fn=e=>setModal(e.detail);window.addEventListener('fcc-modal',fn);return()=>window.removeEventListener('fcc-modal',fn)},[]);
 useEffect(()=>{const key=e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setModal({type:'search'})}if(e.key==='Escape')setModal(null)};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[]);
 async function refresh(show=true){if(show)setLoading(true);try{const d=await api.loadWorkspace();setData({...EMPTY,...d});setSelected(s=>({...s,customer:s.customer||d.customers?.[0]?.id,facility:s.facility||d.facilities?.[0]?.id,request:s.request||d.sales_requests?.[0]?.id,quote:s.quote||d.quotes?.[0]?.id,project:s.project||d.projects?.[0]?.id,order:s.order||d.orders?.[0]?.id,po:s.po||d.purchase_orders?.[0]?.id,delivery:s.delivery||d.delivery_tickets?.[0]?.id,contract:s.contract||d.contracts?.[0]?.id}))}catch(e){setError(e.message)}finally{if(show)setLoading(false)}}
 function flash(m){setToast(m);setTimeout(()=>setToast(''),2600)}
 async function run(fn,msg){setLoading(true);setError('');try{const r=await fn();await refresh(false);if(msg)flash(msg);setModal(null);return r}catch(e){setError(e.message);throw e}finally{setLoading(false)}}
 function go(type,id){const m={customer:['customers','Customer Directory','customer'],facility:['customers','Facility Directory','facility'],sales_request:['sales','Sales Requests','request'],quote:['sales','Quote Playbook','quote'],project:['projects','Project Portfolio','project'],order:['fulfillment','OrderDNA','order'],purchase_order:['fulfillment','Purchasing','po'],delivery_ticket:['fulfillment','FinishLine Delivery','delivery'],contract:['contracts','Contract Portfolio','contract']}[type];if(!m)return;setArea(m[0]);setSub(m[1]);setSelected(s=>({...s,[m[2]]:id}))}
 const approvalToken=new URLSearchParams(location.search).get('approval');
 if(approvalToken)return <ApprovalPage token={approvalToken}/>;
 if(boot)return <div className="full-loader"><Loader2 className="spin"/><h2>Opening FCC Ops</h2></div>;
 if(api.configured()&&!session)return <Auth/>;
 const props={data,selected,setSelected,setModal,run,go,session};
 const screens={work:WorkScreen,customers:CustomerScreen,sales:SalesScreen,projects:ProjectScreen,fulfillment:FulfillmentScreen,field:FieldScreen,contracts:ContractScreen,reports:ReportScreen,admin:AdminScreen};const Screen=screens[area];
 const isSectionHome=sub===SUB[area][0];
 return <div className={cx('fcc-shell',theme==='dark'&&'dark')}>
  <header className="top-command"><div className="brand"><button className="icon-btn" onClick={()=>setRail(!rail)}><Menu/></button><b>FCC</b><div><strong>FCC Ops</strong><small>The Sports Floor Pros</small></div></div><nav className="major-nav">{AREAS.map(([id,label])=>{const I=ICONS[id];return <button key={id} className={area===id?'active':''} onClick={()=>setArea(id)}><I/><span>{label}</span></button>})}</nav><div className="utilities"><button className="search-trigger" onClick={()=>setModal({type:'search'})}><Search/><span>Search FCC Ops</span><kbd>Ctrl K</kbd></button><button className="icon-btn" onClick={()=>setTheme(theme==='light'?'dark':'light')}>{theme==='light'?<Moon/>:<Sun/>}</button><button className="icon-btn badge-btn" onClick={()=>setModal({type:'notifications'})}><Bell/><i>{data.notifications.filter(n=>!n.read_at).length}</i></button><button className="primary compact" onClick={()=>setModal({type:'create-menu'})}><Plus/>Create</button><div className="profile"><ShieldCheck/><span>{session?.user?.email||'Development'}</span><button className="profile-signout" title="Sign out" onClick={()=>api.signOut()}><LogOut/></button></div></div></header>
  <aside className={cx('context-nav',!rail&&'hidden')}><div className="context-title"><small>{AREAS.find(x=>x[0]===area)?.[1]}</small><strong>{sub}</strong></div><nav>{SUB[area].map(x=><button key={x} className={sub===x?'active':''} onClick={()=>setSub(x)}><span>{x}</span></button>)}</nav><footer><Activity/><div><small>Production data</small><strong>{loading?'Synchronizing':'Connected'}</strong></div></footer></aside>
  <main className={cx('workspace',!rail&&'wide')}>{error&&<div className="error-banner"><span>{error}</span><button onClick={()=>setError('')}><X/></button></div>}{loading&&<div className="loading-line"><Loader2 className="spin"/>Synchronizing FCC Ops</div>}{isSectionHome&&<SectionHomeHero area={area} data={data} onCreate={()=>setModal({type:'create-menu'})}/>}<Screen view={sub} {...props}/></main>
  {modal?.type==='search'&&<SearchModal close={()=>setModal(null)} go={go}/>} {modal?.type==='notifications'&&<NotificationModal close={()=>setModal(null)} {...props}/>} {modal?.type==='create-menu'&&<CreateMenu close={()=>setModal(null)} open={type=>setModal({type})}/>} {modal&&!['search','notifications','create-menu'].includes(modal.type)&&<FormRouter modal={modal} close={()=>setModal(null)} {...props}/>} {toast&&<div className="toast"><Check/>{toast}</div>}
 </div>
}
function Auth(){const [email,setEmail]=useState(''),[sent,setSent]=useState(false),[busy,setBusy]=useState(false),[err,setErr]=useState('');async function submit(e){e.preventDefault();setBusy(true);try{await api.signIn(email);setSent(true)}catch(x){setErr(x.message)}finally{setBusy(false)}}return <div className="auth"><section><header><b>FCC</b><div><strong>FCC Ops</strong><small>One operating system. One source of truth.</small></div></header>{sent?<div className="auth-result"><Check/><h1>Secure link sent.</h1><p>Open the email sent to <b>{email}</b>.</p></div>:<form onSubmit={submit}><small>AUTHORIZED TEAM ACCESS</small><h1>Enter the championship workspace.</h1><p>Use your Floor Care Concepts email. Your role and record permissions determine access.</p><label>Email address<input required type="email" value={email} onChange={e=>setEmail(e.target.value)}/></label>{err&&<div className="form-error">{err}</div>}<button className="primary" disabled={busy}>{busy?<Loader2 className="spin"/>:<ShieldCheck/>}Send secure sign-in link</button></form>}</section></div>}
