import React, { useState } from 'react';
import { Archive, Check, Loader2, Search, X } from 'lucide-react';

export const pretty=v=>String(v??'').replaceAll('_',' ').replace(/\b\w/g,m=>m.toUpperCase());
export const money=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(v||0));
export const fmtDate=v=>v?new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(new Date(v)):'—';
export const byId=(rows,id)=>(rows||[]).find(x=>x.id===id);
export const cx=(...v)=>v.filter(Boolean).join(' ');

export function Intro({eyebrow,title,copy,children}){return <div className="intro"><div><small>{eyebrow}</small><h1>{title}</h1><p>{copy}</p></div><div className="intro-actions">{children}</div></div>}
export function Status({value}){return <span className={cx('status',String(value||'unknown').replaceAll('_','-'))}>{pretty(value||'unknown')}</span>}
export function Panel({eyebrow,title,actions,children,className=''}){return <section className={cx('panel',className)}><header><div><small>{eyebrow}</small><h2>{title}</h2></div>{actions}</header>{children}</section>}
export function Empty({title,copy,action,icon:Icon=Archive}){return <div className="empty"><Icon/><h3>{title}</h3><p>{copy}</p>{action}</div>}
export function DataTable({columns,rows=[],onRow}){return <div className="table"><div className="thead" style={{gridTemplateColumns:columns.map(c=>c.w||'1fr').join(' ')}}>{columns.map(c=><span key={c.k}>{c.l}</span>)}</div>{rows.map(r=>{const content=columns.map(c=><span key={c.k}>{c.render?c.render(r):r[c.k]??'—'}</span>);return onRow?<button key={r.id} className="trow" style={{gridTemplateColumns:columns.map(c=>c.w||'1fr').join(' ')}} onClick={()=>onRow(r)}>{content}</button>:<div key={r.id} className="trow static" style={{gridTemplateColumns:columns.map(c=>c.w||'1fr').join(' ')}}>{content}</div>})}{!rows.length&&<div className="table-empty">No records match this view.</div>}</div>}
export function SearchBox({value,onChange,placeholder='Search this directory'}){return <div className="search-box"><Search/><input value={value} onChange={onChange} placeholder={placeholder}/></div>}
export function RecordHeader({icon:Icon,kicker,title,subtitle,status,actions}){return <header className="record-header"><div className="record-icon"><Icon/></div><div><small>{kicker}</small><h2>{title}</h2><p>{subtitle}</p></div><Status value={status}/><div className="record-actions">{actions}</div></header>}
export function StageBand({stages,current}){const i=stages.indexOf(current);return <div className="stage-band">{stages.map((s,n)=><div className={n<i?'done':n===i?'current':''} key={s}><b>{n<i?<Check/>:n+1}</b><span>{pretty(s)}</span></div>)}</div>}
export function Details({rows}){return <dl className="details">{rows.map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v??'—'}</dd></div>)}</dl>}
export function Modal({title,kicker,close,children,wide=false}){return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&close()}><section className={cx('modal',wide&&'wide')}><header><div><small>{kicker}</small><h2>{title}</h2></div><button className="icon-btn" onClick={close}><X/></button></header>{children}</section></div>}
export function Form({children,onSubmit,close,submit='Save',busy=false}){return <form onSubmit={onSubmit}>{children}<footer><button type="button" className="secondary" onClick={close}>Cancel</button><button className="primary" disabled={busy}>{busy?<Loader2 className="spin"/>:<Check/>}{submit}</button></footer></form>}
export function Field({label,name,type='text',defaultValue,required=false,children,placeholder}){return <label>{label}{children||<input name={name} type={type} defaultValue={defaultValue??''} required={required} placeholder={placeholder}/>}</label>}
export function Select({name,rows=[],defaultValue,text='name',blank=true}){return <select name={name} defaultValue={defaultValue??''}>{blank&&<option value="">Select</option>}{rows.map(r=><option key={r.id} value={r.id}>{typeof text==='function'?text(r):r[text]}</option>)}</select>}
export function useFormSubmit(action){const [busy,setBusy]=useState(false);const submit=async e=>{e.preventDefault();setBusy(true);try{await action(new FormData(e.currentTarget))}finally{setBusy(false)}};return [busy,submit]}
