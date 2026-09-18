export type Role = "admin" | "reviewer" | "viewer";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "currency"
  | "date"
  | "select"
  | "boolean";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: string[]; // for "select"
  showInList?: boolean; // render as a column in the queue/list view
  required?: boolean;
}

export interface ActionDef {
  key: string;
  label: string;
  roles: Role[]; // who is allowed to run this action
  set: Record<string, unknown>; // fields merged into the record on run
  requiresNote?: boolean;
  destructive?: boolean;
}

export interface FilterDef {
  key: string; // must match a field key
  label: string;
}

export interface ToolConfig {
  slug: string;
  name: string;
  description: string;
  titleField: string; // field used as the record's display title
  statusField?: string; // field rendered as a status badge
  fields: FieldDef[];
  filters: FilterDef[];
  actions: ActionDef[];
}

export interface RecordRow {
  id: string;
  tool: string;
  data: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
}

export interface AuditEvent {
  id: string;
  tool: string;
  recordId: string;
  actor: string;
  action: string;
  note: string | null;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  createdAt: number;
}
