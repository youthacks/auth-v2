import { ORPCError } from "@orpc/client";
import type { SessionContext } from "#/api/middleware/requireSession";

// biome-ignore lint/suspicious/noExplicitAny: typescript expects any for Parameters<>
type AnyFunction = (...args: any[]) => any;

type AutocompleteActions =
  "list" | "create" | "read" | "update" | "delete" | (string & {});

type BouncerAction = (context: SessionContext, ...args: any[]) => boolean;

interface BouncerRules {
  [resource: string]: {
    [action in AutocompleteActions]?: BouncerAction;
  };
}

export class Bouncer<const Rules extends BouncerRules> {
  #rules: Rules;

  constructor(rules: Rules) {
    this.#rules = rules;
  }

  can<Resource extends keyof Rules, Action extends keyof Rules[Resource]>(
    action: `${Resource & string}.${Action & string}`,
    ...args: Rules[Resource][Action] extends AnyFunction
      ? Parameters<Rules[Resource][Action]>
      : never
  ): boolean {
    const [resource, actionName] = action.split(".");
    const resourceRules = this.#rules[resource];
    if (!resourceRules) {
      throw new Error(`No rules defined for resource: ${resource}`);
    }
    const actionRule = resourceRules[actionName];
    if (!actionRule) {
      throw new Error(
        `No rule defined for action: ${actionName} on resource: ${resource}`,
      );
    }

    const [context, ...rest] = args;
    return actionRule(context, ...rest);
  }

  allow<Resource extends keyof Rules, Action extends keyof Rules[Resource]>(
    action: `${Resource & string}.${Action & string}`,
    ...args: Rules[Resource][Action] extends AnyFunction
      ? Parameters<Rules[Resource][Action]>
      : never
  ): void {
    const isAllowed = this.can(action, ...args);
    if (!isAllowed) {
      throw new ORPCError("FORBIDDEN");
    }
  }
}
