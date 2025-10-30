/**
 * TimeZest Query Language (TQL) Filter Builder
 * 
 * Provides a user-friendly, fluent API for constructing valid TQL filters.
 * Based on the TimeZest TQL documentation: https://developer.timezest.com/tql/
 * 
 * @example
 * ```typescript
 * // Type-safe filtering with autocomplete (recommended)
 * const filter = TQL.forSchedulingRequests()
 *   .filter('status').eq('scheduled');
 * 
 * // Type-safe chaining with AND/OR
 * const filter = TQL.forSchedulingRequests()
 *   .filter('end_user_email').like('@example.com')
 *   .and('status').eq('scheduled');
 * 
 * // Using with API - no toString() needed!
 * const requests = await timeZest.getSchedulingRequests(
 *   TQL.forSchedulingRequests().filter('status').eq('scheduled')
 * );
 * 
 * // Flexible filtering (no type checking, still works)
 * const filter = TQL.filter('scheduling_request.status').eq('scheduled');
 * 
 * // Call toString() explicitly if you need the string
 * const filterString = TQL.forAgents().filter('name').like('John').toString();
 * ```
 */

import type { 
  Agent, 
  Resource, 
  Team, 
  AppointmentType, 
  SchedulingRequest 
} from '../entities/entities';

/**
 * Union of all valid TQL attribute paths.
 * This is automatically inferred from entity types when using the type-safe helpers.
 */
export type TQLAttribute = 
  | `agent.${keyof Agent & string}`
  | `resource.${keyof Resource & string}`
  | `team.${keyof Team & string}`
  | `appointment_type.${keyof AppointmentType & string}`
  | `scheduling_request.${keyof SchedulingRequest & string}`;

type TQLOperator = 
  | 'EQ' 
  | 'NOT_EQ' 
  | 'LIKE' 
  | 'NOT_LIKE' 
  | 'IN' 
  | 'NOT_IN' 
  | 'GT' 
  | 'GTE' 
  | 'LT' 
  | 'LTE';

type LogicalOperator = 'AND' | 'OR';

interface TQLPredicate {
  attribute: string;
  operator: TQLOperator;
  value: string | number | string[] | number[];
}

/**
 * Represents a TQL filter being constructed.
 */
export class TQLFilter<TAttribute extends string = string> {
  private predicates: TQLPredicate[] = [];
  private logicalOperators: LogicalOperator[] = [];
  private entityPrefix: string | null = null;
  private currentAttribute: TAttribute | '';
  private currentOperator: TQLOperator | null = null;
  private currentValue: string | number | string[] | number[] | null = null;

  /**
   * Creates a new TQL filter starting with the given attribute.
   * @param attribute - The attribute to filter on (e.g., 'scheduling_request.status')
   * @param entityPrefix - Optional prefix for this entity type (e.g., 'scheduling_request')
   */
  constructor(attribute: TAttribute, entityPrefix?: string) {
    this.currentAttribute = attribute;
    this.entityPrefix = entityPrefix || null;
  }

  /**
   * Adds a completed predicate and starts a new one.
   */
  private finalizePredicate(): void {
    if (this.currentAttribute && this.currentOperator !== null && this.currentValue !== null) {
      this.predicates.push({
        attribute: this.currentAttribute,
        operator: this.currentOperator,
        value: this.currentValue,
      });
    }
    this.currentAttribute = '';
    this.currentOperator = null;
    this.currentValue = null;
  }

  /**
   * Sets the operator and value for comparison operations.
   */
  private setComparison(operator: TQLOperator, value: string | number | string[] | number[]): this {
    if (!this.currentAttribute) {
      throw new Error('Must call filter() or and() or or() before using comparison operators');
    }
    this.currentOperator = operator;
    this.currentValue = value;
    this.finalizePredicate();
    return this;
  }

  // String comparison operators
  /**
   * Equals operator (EQ)
   * @param value - The value to compare against
   */
  eq(value: string | number): this {
    return this.setComparison('EQ', value);
  }

  /**
   * Not equals operator (NOT_EQ)
   * @param value - The value to compare against
   */
  notEq(value: string | number): this {
    return this.setComparison('NOT_EQ', value);
  }

  /**
   * Like operator (contains pattern matching)
   * @param value - The pattern to match against
   */
  like(value: string): this {
    return this.setComparison('LIKE', value);
  }

  /**
   * Not like operator (does not contain pattern)
   * @param value - The pattern to exclude
   */
  notLike(value: string): this {
    return this.setComparison('NOT_LIKE', value);
  }

  /**
   * In operator (value is in the provided array)
   * @param values - Array of values to match against
   */
  in(values: string[] | number[]): this {
    if (!Array.isArray(values) || values.length === 0) {
      throw new Error('IN operator requires a non-empty array');
    }
    return this.setComparison('IN', values);
  }

  /**
   * Not in operator (value is not in the provided array)
   * @param values - Array of values to exclude
   */
  notIn(values: string[] | number[]): this {
    if (!Array.isArray(values) || values.length === 0) {
      throw new Error('NOT_IN operator requires a non-empty array');
    }
    return this.setComparison('NOT_IN', values);
  }

  // Numeric/timestamp comparison operators
  /**
   * Greater than operator (GT)
   * @param value - The value to compare against
   */
  gt(value: number): this {
    return this.setComparison('GT', value);
  }

  /**
   * Greater than or equal operator (GTE)
   * @param value - The value to compare against
   */
  gte(value: number): this {
    return this.setComparison('GTE', value);
  }

  /**
   * Less than operator (LT)
   * @param value - The value to compare against
   */
  lt(value: number): this {
    return this.setComparison('LT', value);
  }

  /**
   * Less than or equal operator (LTE)
   * @param value - The value to compare against
   */
  lte(value: number): this {
    return this.setComparison('LTE', value);
  }

  /**
   * Adds an AND logical operator and starts a new predicate with the given attribute.
   * If this filter was created with an entity prefix and you pass just a property name,
   * it will automatically prepend the entity prefix.
   * @param attribute - The attribute for the next predicate (full path or property name if using entity prefix)
   */
  and(attribute: TAttribute | string): this {
    if (this.predicates.length === 0) {
      throw new Error('Must have at least one predicate before using AND');
    }
    this.logicalOperators.push('AND');
    // If we have an entity prefix and the attribute doesn't contain a dot, prepend the prefix
    if (this.entityPrefix && !attribute.includes('.')) {
      this.currentAttribute = `${this.entityPrefix}.${attribute}` as TAttribute;
    } else {
      this.currentAttribute = attribute as TAttribute;
    }
    return this;
  }

  /**
   * Adds an OR logical operator and starts a new predicate with the given attribute.
   * If this filter was created with an entity prefix and you pass just a property name,
   * it will automatically prepend the entity prefix.
   * @param attribute - The attribute for the next predicate (full path or property name if using entity prefix)
   */
  or(attribute: TAttribute | string): this {
    if (this.predicates.length === 0) {
      throw new Error('Must have at least one predicate before using OR');
    }
    this.logicalOperators.push('OR');
    // If we have an entity prefix and the attribute doesn't contain a dot, prepend the prefix
    if (this.entityPrefix && !attribute.includes('.')) {
      this.currentAttribute = `${this.entityPrefix}.${attribute}` as TAttribute;
    } else {
      this.currentAttribute = attribute as TAttribute;
    }
    return this;
  }

  /**
   * Formats a value for TQL output.
   * Handles arrays, strings with special characters, and numbers.
   */
  private formatValue(value: string | number | string[] | number[]): string {
    if (Array.isArray(value)) {
      // Arrays are comma-separated (no spaces) according to TQL spec
      return value.map(v => this.formatSingleValue(v)).join(',');
    }
    return this.formatSingleValue(value);
  }

  /**
   * Formats a single value for TQL output.
   */
  private formatSingleValue(value: string | number): string {
    if (typeof value === 'number') {
      return String(value);
    }
    
    // Strings containing spaces, commas, tildes, backslashes, or quotes should be enclosed in quotes
    if (/[\s,~"\\]/.test(value) || value === '') {
      // Escape backslashes and quotes in the value to prevent injection issues
      const escaped = value.replace(/[\\"]/g, '\\$&');
      return `"${escaped}"`;
    }
    
    return value;
  }

  /**
   * Replaces spaces with tildes outside of quoted strings.
   * This is needed for URL encoding while preserving spaces inside quoted values.
   * Handles escaped quotes properly (e.g., "value with \"quotes\"").
   * @param str - The string to process
   * @returns The string with spaces outside quotes replaced by tildes
   */
  private replaceSpacesOutsideQuotes(str: string): string {
    let result = '';
    let insideQuotes = false;
    let i = 0;
    
    while (i < str.length) {
      const char = str[i];
      
      if (char === '\\' && insideQuotes && i + 1 < str.length) {
        // Handle escaped characters (like \")
        result += char + str[i + 1];
        i += 2;
        continue;
      }
      
      if (char === '"') {
        // Toggle quote state
        insideQuotes = !insideQuotes;
        result += char;
      } else if (/\s/.test(char)) {
        // Only replace whitespace if we're NOT inside quotes
        result += insideQuotes ? char : '~';
      } else {
        result += char;
      }
      
      i++;
    }
    
    return result;
  }

  /**
   * Converts the filter to a TQL string suitable for API requests.
   * In URLs, spaces are replaced with tildes (~).
   * @param urlEncode - If true, replaces spaces with ~ for URL encoding (default: true)
   * @returns The TQL filter string
   */
  toString(urlEncode: boolean = true): string {
    // Finalize any pending predicate
    if (this.currentAttribute && this.currentOperator !== null && this.currentValue !== null) {
      this.finalizePredicate();
    }

    if (this.predicates.length === 0) {
      throw new Error('Filter must have at least one predicate');
    }

    // Build the filter string
    // Format: predicate1 [operator] predicate2 [operator] predicate3 ...
    const parts: string[] = [];
    
    for (let i = 0; i < this.predicates.length; i++) {
      const predicate = this.predicates[i];
      const predicateStr = `${predicate.attribute} ${predicate.operator} ${this.formatValue(predicate.value)}`;
      parts.push(predicateStr);
      
      // Add logical operator AFTER this predicate if it's not the last one
      // logicalOperators[i] contains the operator between predicates[i] and predicates[i+1]
      if (i < this.predicates.length - 1 && this.logicalOperators[i]) {
        parts.push(this.logicalOperators[i]);
      }
    }

    let result = parts.join(' ');
    
    // Replace spaces with ~ for URL encoding if requested
    // Only replace spaces outside of quoted strings to preserve spaces in values
    if (urlEncode) {
      result = this.replaceSpacesOutsideQuotes(result);
    }
    
    return result;
  }

  /**
   * Returns the filter as a plain string with spaces (not URL encoded).
   * Useful for debugging or when you need the human-readable format.
   */
  toHumanReadableString(): string {
    return this.toString(false);
  }

  /**
   * Returns the string representation when converted to a primitive.
   * This allows TQLFilter to be used directly without calling toString().
   */
  valueOf(): string {
    return this.toString();
  }

  /**
   * Custom primitive conversion for string contexts.
   * Allows TQLFilter to be used directly in places expecting strings.
   */
  [Symbol.toPrimitive](hint: 'string' | 'number' | 'default'): string {
    return this.toString();
  }
}

/**
 * Normalizes a filter value to a string.
 * Converts TQLFilter instances to strings, leaves strings as-is, and returns null for null.
 * @param filter - The filter value (TQLFilter, string, or null)
 * @returns The normalized filter string or null
 */
export function normalizeFilter(filter: TQLFilter | string | null): string | null {
  if (filter === null) {
    return null;
  }
  if (typeof filter === 'string') {
    return filter;
  }
  // filter is a TQLFilter instance
  return filter.toString();
}


/**
 * Helper class for building type-safe filters for specific entity types.
 * Provides autocomplete and type checking for entity properties.
 */
class TypedTQLFilterBuilder<T extends Record<string, any>> {
  constructor(private prefix: string) {}

  /**
   * Starts a filter with a type-safe attribute from the entity.
   * @param attribute - A valid property key from the entity type
   * @returns A TQLFilter instance for method chaining (with entity prefix stored)
   */
  filter<K extends keyof T>(attribute: K): TQLFilter<`${string}.${string & K}`> {
    const fullPath = `${this.prefix}.${String(attribute)}` as `${string}.${string & K}`;
    return new TQLFilter<`${string}.${string & K}`>(fullPath, this.prefix);
  }
}

/**
 * TQL Filter Builder
 * Provides a user-friendly, fluent API for constructing TimeZest Query Language filters.
 */
export class TQL {
  /**
   * Starts building a TQL filter with the given attribute.
   * Use this for flexibility - no type checking on the attribute.
   * For type-safe filtering, use the endpoint-specific helpers like `TQL.forAgents()`.
   * 
   * @param attribute - The attribute to filter on (e.g., 'scheduling_request.status')
   * @returns A TQLFilter instance for method chaining
   * 
   * @example
   * ```typescript
   * TQL.filter('scheduling_request.status').eq('scheduled')
   * ```
   */
  static filter(attribute: string): TQLFilter<string> {
    return new TQLFilter<string>(attribute);
  }

  /**
   * Creates a type-safe filter builder for Agent entities.
   * Provides autocomplete and type checking for Agent attributes.
   * 
   * @example
   * ```typescript
   * TQL.forAgents().filter('name').like('John')
   * TQL.forAgents().filter('email').eq('user@example.com')
   * ```
   */
  static forAgents(): TypedTQLFilterBuilder<Agent> {
    return new TypedTQLFilterBuilder<Agent>('agent');
  }

  /**
   * Creates a type-safe filter builder for Resource entities.
   * Provides autocomplete and type checking for Resource attributes.
   * 
   * @example
   * ```typescript
   * TQL.forResources().filter('name').like('Room')
   * TQL.forResources().filter('schedulable').eq(true)
   * ```
   */
  static forResources(): TypedTQLFilterBuilder<Resource> {
    return new TypedTQLFilterBuilder<Resource>('resource');
  }

  /**
   * Creates a type-safe filter builder for Team entities.
   * Provides autocomplete and type checking for Team attributes.
   * 
   * @example
   * ```typescript
   * TQL.forTeams().filter('internal_name').eq('Tier1')
   * TQL.forTeams().filter('team_type').eq('support')
   * ```
   */
  static forTeams(): TypedTQLFilterBuilder<Team> {
    return new TypedTQLFilterBuilder<Team>('team');
  }

  /**
   * Creates a type-safe filter builder for AppointmentType entities.
   * Provides autocomplete and type checking for AppointmentType attributes.
   * 
   * @example
   * ```typescript
   * TQL.forAppointmentTypes().filter('internal_name').eq('consultation')
   * TQL.forAppointmentTypes().filter('duration_mins').gte(30)
   * ```
   */
  static forAppointmentTypes(): TypedTQLFilterBuilder<AppointmentType> {
    return new TypedTQLFilterBuilder<AppointmentType>('appointment_type');
  }

  /**
   * Creates a type-safe filter builder for SchedulingRequest entities.
   * Provides autocomplete and type checking for SchedulingRequest attributes.
   * 
   * @example
   * ```typescript
   * TQL.forSchedulingRequests().filter('status').eq('scheduled')
   * TQL.forSchedulingRequests().filter('end_user_email').like('@example.com')
   * ```
   */
  static forSchedulingRequests(): TypedTQLFilterBuilder<SchedulingRequest> {
    return new TypedTQLFilterBuilder<SchedulingRequest>('scheduling_request');
  }
}

export default TQL;
