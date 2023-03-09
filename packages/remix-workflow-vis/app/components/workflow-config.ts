export interface WorkflowConfig {
  events: Event[];
  steps: Step[];
  transitions: Transition[];
}

export interface Event {
  canExecute: string[];
  id: string;
  name: string;
}

export interface Step {
  canExecute: string[];
  dueDate?: string;
  escalations: Escalation[];
  id: string;
  name: string;
  params?: Params;
  type: string;
}

export interface Escalation {
  targets: string[];
  trigger: string;
}

export interface Params {
  template: string;
}

export interface Transition {
  dataMappings?: DataMapping[];
  fromId: string;
  toId: string;
}

export interface DataMapping {
  constantValue?: string;
  toField: string;
  fromField?: string;
}
