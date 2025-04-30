import { z } from "zod";

export const AgentSchema = z.object({
  id: z.string(),
  object: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  schedulable: z.boolean(),
  two_factor_enabled: z.boolean(),
  url_slug: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
});

export const AppointmentTypeSchema = z.object({
  id: z.string(),
  object: z.string(),
  internal_name: z.string(),
  external_name: z.string(),
  duration_mins: z.number(),
  url_slug: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
});

export const ResourceSchema = z.object({
  id: z.string(),
  object: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  schedulable: z.boolean(),
  two_factor_enabled: z.boolean(),
  url_slug: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
});

export const SchedulingRequestSchema = z.object({
  id: z.string(),
  object: z.string(),
  appointment_type_id: z.string(),
  end_user_email: z.string(),
  end_user_name: z.string(),
  associated_entities: z.array(
    z.object({
      type: z.string(),
      id: z.number(),
      number: z.string().optional(),
    }),
  ),
  resources: z.array(
    z.object({
      type: z.string(),
      id: z.string(),
      name: z.string(),
    }),
  ),
  scheduled_agents: z.array(z.unknown()),
  scheduled_at: z.number(),
  scheduling_url: z.string(),
  selected_start_time: z.number(),
  selected_time_zone: z.string(),
  status: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
});

export const SchedulingRequestPostSchema = z.object({
  appointment_type_id: z.string(),
  trigger_mode: z.string(),
  associated_entities: z.array(
    z.object({
      type: z.string(),
      number: z.string(),
    }),
  ),
  resource_ids: z.array(z.string()),
});

export const TeamSchema = z.object({
  id: z.string(),
  object: z.string(),
  internal_name: z.string(),
  external_name: z.string(),
  team_type: z.string(),
  url_slug: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
});
