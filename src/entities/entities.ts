export interface Agent {
  id: string;
  object: string;
  name: string;
  email: string;
  role: string;
  schedulable: boolean;
  two_factor_enabled: boolean;
  url_slug: string;
  created_at: number;
  updated_at: number;
}

export interface AppointmentType {
  id: string;
  object: string;
  internal_name: string;
  external_name: string;
  duration_mins: number;
  url_slug: string;
  created_at: number;
  updated_at: number;
}

export interface Resource {
  id: string;
  object: string;
  name: string;
  email: string;
  role: string;
  schedulable: boolean;
  two_factor_enabled: boolean;
  url_slug: string;
  created_at: number;
  updated_at: number;
}

export interface SchedulingRequest {
  id: string;
  object: string;
  appointment_type_id: string;
  end_user_email: string;
  end_user_name: string;
  associated_entities: Array<{
    type: string;
    id: number;
    number?: string;
  }>;
  resources: Array<{
    type: string;
    id: string;
    name: string;
  }>;
  scheduled_agents: Array<unknown>;
  scheduled_at: number;
  scheduling_url: string;
  selected_start_time: number;
  selected_time_zone: string;
  status: string;
  created_at: number;
  updated_at: number;
}

/**
 * An associated entity sent with a scheduling request. The identifier used
 * depends on the entity type:
 * - Ticket-style entities (e.g. `connectwise_psa/service_ticket`) use
 *   `number` and may optionally include `id`.
 * - Contact-style entities (e.g. `connectwise_psa/contact`) use `id`. When a
 *   contact entity is present it takes precedence over the ticket's contact
 *   when TimeZest resolves the end user.
 */
export type AssociatedEntityPost =
  | { type: string; number: string; id?: number }
  | { type: string; id: number };

export interface SchedulingRequestPost {
  appointment_type_id: string;
  trigger_mode: string;
  associated_entities: Array<AssociatedEntityPost>;
  resource_ids: string[];
}

export interface Team {
  id: string;
  object: string;
  internal_name: string;
  external_name: string;
  team_type: string;
  url_slug: string;
  created_at: number;
  updated_at: number;
}
