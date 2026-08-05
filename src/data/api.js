import { supabase } from '../lib/supabase';

const TABLES = [
  'profiles','teams','customers','contacts','facilities','buildings','entrances','spaces','floor_assets',
  'tasks','task_dependencies','notifications','documents','document_versions','comments','activity_log',
  'sales_requests','quotes','quote_versions','quote_line_items','approval_tokens','projects','project_milestones',
  'orders','order_requirements','vendors','price_book_items','purchase_orders','purchase_order_lines',
  'warehouse_locations','receipts','receipt_lines','inventory_movements','delivery_tickets','delivery_items',
  'field_proofs','crew_assignments','employee_availability','time_off_requests','contracts','sov_items',
  'pay_applications','compliance_items','payments','mat_records','mat_designs','mat_proofs'
];

export function configured() { return Boolean(supabase); }

export async function loadSession() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function subscribeAuth(callback) {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}

export async function signIn(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin, data: { full_name: email.split('@')[0] } }
  });
  if (error) throw error;
}

export async function signOut() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

function orderFor(table) {
  const map = {
    customers: ['name', true], facilities: ['name', true], contacts: ['last_name', true],
    spaces: ['name', true], profiles: ['full_name', true], vendors: ['name', true],
    price_book_items: ['name', true], warehouse_locations: ['code', true],
    activity_log: ['created_at', false], notifications: ['created_at', false], tasks: ['created_at', false],
    sales_requests: ['created_at', false], quotes: ['created_at', false], projects: ['created_at', false],
    orders: ['created_at', false], purchase_orders: ['created_at', false], receipts: ['created_at', false],
    delivery_tickets: ['created_at', false], contracts: ['created_at', false], documents: ['created_at', false]
  };
  return map[table] || null;
}

export async function loadWorkspace({ limit = 500 } = {}) {
  if (!supabase) return {};
  const results = await Promise.all(TABLES.map(async table => {
    const ordering = orderFor(table);
    let query = supabase.from(table).select('*').limit(limit);
    if (ordering) query = query.order(ordering[0], { ascending: ordering[1] });
    const { data, error } = await query;
    if (error) {
      console.warn(`FCC Ops: unable to load ${table}`, error.message);
      return [table, []];
    }
    return [table, data || []];
  }));
  return Object.fromEntries(results);
}

export async function createRecord(table, values) {
  const { data, error } = await supabase.from(table).insert(values).select().single();
  if (error) throw error;
  return data;
}

export async function updateRecord(table, id, values) {
  const { data, error } = await supabase.from(table).update(values).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deactivateRecord(table, id) {
  const values = table === 'customers' ? { status: 'inactive', deleted_at: new Date().toISOString() } : { status: 'inactive' };
  return updateRecord(table, id, values);
}

export async function deleteRecord(table, id) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}

export async function rpc(name, args = {}) {
  const { data, error } = await supabase.rpc(name, args);
  if (error) throw error;
  return data;
}

export const workflows = {
  createSalesRequest: values => rpc('rpc_create_sales_request', {
    p_customer_id: values.customer_id,
    p_facility_id: values.facility_id,
    p_space_id: values.space_id || null,
    p_request_type: values.request_type,
    p_title: values.title,
    p_need_summary: values.need_summary,
    p_priority: values.priority || 'normal',
    p_due_at: values.due_at || null,
    p_owner_id: values.owner_id || null
  }),
  createQuote: salesRequestId => rpc('rpc_create_quote_from_request', { p_sales_request_id: salesRequestId }),
  addQuoteLine: values => rpc('rpc_add_quote_line', {
    p_quote_id: values.quote_id,
    p_description: values.description,
    p_quantity: Number(values.quantity),
    p_unit: values.unit,
    p_unit_cost: Number(values.unit_cost || 0),
    p_unit_price: Number(values.unit_price || 0),
    p_price_book_item_id: values.price_book_item_id || null,
    p_customer_visible: values.customer_visible !== false,
    p_alternate_group: values.alternate_group || null
  }),
  cloneQuoteVersion: quoteId => rpc('rpc_clone_quote_version', { p_quote_id: quoteId }),
  releaseQuote: (quoteId, recipients) => rpc('rpc_release_quote', { p_quote_id: quoteId, p_recipients: recipients }),
  decideQuote: values => rpc('rpc_record_quote_decision', {
    p_token: values.token,
    p_decision: values.decision,
    p_signer_name: values.signer_name,
    p_signer_email: values.signer_email,
    p_comments: values.comments || null
  }),
  convertQuote: (quoteId, createProject = true, createOrder = true) => rpc('rpc_convert_approved_quote', {
    p_quote_id: quoteId, p_create_project: createProject, p_create_order_id: createOrder
  }),
  createPurchaseOrder: values => rpc('rpc_create_purchase_order', {
    p_order_id: values.order_id,
    p_vendor_id: values.vendor_id,
    p_line_ids: values.line_ids || null
  }),
  receivePurchaseOrder: values => rpc('rpc_receive_purchase_order', {
    p_purchase_order_id: values.purchase_order_id,
    p_location_id: values.location_id,
    p_lines: values.lines,
    p_notes: values.notes || null
  }),
  createDelivery: values => rpc('rpc_create_delivery_ticket', {
    p_order_id: values.order_id,
    p_scheduled_for: values.scheduled_for || null,
    p_driver_id: values.driver_id || null
  }),
  completeDelivery: values => rpc('rpc_complete_delivery', {
    p_ticket_id: values.ticket_id,
    p_received_by: values.received_by,
    p_notes: values.notes || null
  }),
  createContract: values => rpc('rpc_create_contract_from_project', {
    p_project_id: values.project_id,
    p_general_contractor: values.general_contractor,
    p_contract_value: Number(values.contract_value),
    p_retainage_percent: Number(values.retainage_percent || 0)
  }),
  createPayApplication: values => rpc('rpc_create_pay_application', {
    p_contract_id: values.contract_id,
    p_period_ending: values.period_ending,
    p_percent_complete: Number(values.percent_complete)
  }),
  globalSearch: query => rpc('global_search', { p_query: query, p_limit: 40 })
};

export async function uploadDocument({ file, relatedType, relatedId, customerId, facilityId, documentType = 'general', visibility = 'internal' }, userId) {
  if (!file) throw new Error('Choose a file first.');
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `${relatedType || 'general'}/${relatedId || 'unlinked'}/${Date.now()}-${safe}`;
  const { error: uploadError } = await supabase.storage.from('fcc-ops-documents').upload(path, file, { upsert: false });
  if (uploadError) throw uploadError;
  const document = await createRecord('documents', {
    name: file.name,
    file_path: path,
    mime_type: file.type || null,
    file_size: file.size,
    customer_id: customerId || null,
    facility_id: facilityId || null,
    related_type: relatedType || null,
    related_id: relatedId || null,
    uploaded_by: userId || null,
    document_type: documentType,
    version_number: 1,
    visibility
  });
  await createRecord('document_versions', {
    document_id: document.id,
    version_number: 1,
    file_path: path,
    mime_type: file.type || null,
    file_size: file.size,
    uploaded_by: userId || null
  });
  return document;
}

export async function createDocumentVersion(document, file, userId) {
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const nextVersion = Number(document.version_number || 1) + 1;
  const path = `${document.related_type || 'general'}/${document.related_id || 'unlinked'}/${Date.now()}-v${nextVersion}-${safe}`;
  const { error: uploadError } = await supabase.storage.from('fcc-ops-documents').upload(path, file, { upsert: false });
  if (uploadError) throw uploadError;
  await createRecord('document_versions', {
    document_id: document.id,
    version_number: nextVersion,
    file_path: path,
    mime_type: file.type || null,
    file_size: file.size,
    uploaded_by: userId || null
  });
  return updateRecord('documents', document.id, {
    file_path: path,
    mime_type: file.type || null,
    file_size: file.size,
    version_number: nextVersion
  });
}

export async function signedDocumentUrl(path) {
  const { data, error } = await supabase.storage.from('fcc-ops-documents').createSignedUrl(path, 300);
  if (error) throw error;
  return data.signedUrl;
}

export function realtimeRefresh(callback) {
  if (!supabase) return () => {};
  const channel = supabase.channel('fcc-ops-live')
    .on('postgres_changes', { event: '*', schema: 'public' }, callback)
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export async function getApprovalPackage(token) {
  return rpc('rpc_get_quote_approval_package', { p_token: token });
}
