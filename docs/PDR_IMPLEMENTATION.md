# FCC Ops PDR implementation map

## Canonical records

Customer → Facility → Building → Entrance → Space → Floor Asset is implemented through persistent Supabase tables and forms. Sales requests, quote versions, projects, orders, purchase orders, receipts, inventory movements, delivery tickets, field proofs, contracts, pay applications, compliance items and payments use those same records.

## Shared services

Authentication, role profiles, tasks, notifications, global search, documents and versions, realtime refresh, activity/audit history and row-level security are shared across all work areas.

## Lifecycle functions

The frontend calls database transactions for:

- `rpc_create_sales_request`
- `rpc_create_quote_from_request`
- `rpc_add_quote_line`
- `rpc_clone_quote_version`
- `rpc_release_quote`
- `rpc_get_quote_approval_package`
- `rpc_record_quote_decision`
- `rpc_convert_approved_quote`
- `rpc_create_purchase_order`
- `rpc_receive_purchase_order`
- `rpc_create_delivery_ticket`
- `rpc_complete_delivery`
- `rpc_create_contract_from_project`
- `rpc_create_pay_application`
- `global_search`

These transactions create downstream tasks, preserve versions and update authoritative workflow statuses rather than simulating saves in the browser.
