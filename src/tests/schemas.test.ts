import { describe, expect, it } from "vitest";
import {
  AssociatedEntityPostSchema,
  SchedulingRequestPostSchema,
} from "../entities/schemas";

describe("AssociatedEntityPostSchema", () => {
  it("accepts a ticket-style entity identified by number", () => {
    const result = AssociatedEntityPostSchema.safeParse({
      type: "connectwise_psa/service_ticket",
      number: "#1234",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a ticket-style entity with an optional id", () => {
    const result = AssociatedEntityPostSchema.safeParse({
      type: "connectwise_psa/service_ticket",
      number: "#1234",
      id: 42,
    });
    expect(result.success).toBe(true);
  });

  it("accepts a contact-style entity identified by id", () => {
    const result = AssociatedEntityPostSchema.safeParse({
      type: "connectwise_psa/contact",
      id: 9065,
    });
    expect(result.success).toBe(true);
  });

  it("rejects a contact-style entity whose id is a string", () => {
    const result = AssociatedEntityPostSchema.safeParse({
      type: "connectwise_psa/contact",
      id: "9065",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an entity with neither number nor id", () => {
    const result = AssociatedEntityPostSchema.safeParse({
      type: "connectwise_psa/contact",
    });
    expect(result.success).toBe(false);
  });
});

describe("SchedulingRequestPostSchema", () => {
  it("validates a request mixing ticket and contact entities", () => {
    const result = SchedulingRequestPostSchema.safeParse({
      appointment_type_id: "12345",
      trigger_mode: "automatic",
      associated_entities: [
        { type: "connectwise_psa/service_ticket", number: "#1234" },
        { type: "connectwise_psa/contact", id: 9065 },
      ],
      resource_ids: ["67890"],
    });
    expect(result.success).toBe(true);
  });

  it("still validates a ticket-only request", () => {
    const result = SchedulingRequestPostSchema.safeParse({
      appointment_type_id: "12345",
      trigger_mode: "automatic",
      associated_entities: [
        { type: "connectwise_psa/service_ticket", number: "#1234" },
      ],
      resource_ids: ["67890"],
    });
    expect(result.success).toBe(true);
  });
});
