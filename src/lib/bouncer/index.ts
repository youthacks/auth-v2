import { Bouncer } from "./class";

export const bouncer = new Bouncer({
  user: {
    list: (context) => {
      if (!context.user) return false;
      return context.user.role === "admin";
    },
    read: (context, input: { id: string }) => {
      if (!context.user) return false;
      return context.user.role === "admin" || context.user.id === input.id;
    },
    update: (context, input: { id: string }) => {
      if (!context.user) return false;
      return context.user.role === "admin" || context.user.id === input.id;
    },
  },

  session: {
    list: (context, input: { userId: string }) => {
      if (!context.user) return false;
      return context.user.role === "admin" || context.user.id === input.userId;
    },
    delete: (context, input: { userId: string }) => {
      if (!context.user) return false;
      return context.user.role === "admin" || context.user.id === input.userId;
    },
  },

  apps: {
    list: (context) => {
      if (!context.user) return false;
      return context.user.role === "admin";
    },
    read: (context) => {
      if (!context.user) return false;
      return context.user.role === "admin";
    },
    create: (context) => {
      if (!context.user) return false;
      return context.user.role === "admin";
    },
    update: (context) => {
      if (!context.user) return false;
      return context.user.role === "admin";
    },
    delete: (context) => {
      if (!context.user) return false;
      return context.user.role === "admin";
    },
  },

  appConsents: {
    list: (context, input: { userId: string }) => {
      if (!context.user) return false;
      return context.user.role === "admin" || context.user.id === input.userId;
    },
    delete: (context, input: { userId: string }) => {
      if (!context.user) return false;
      return context.user.role === "admin" || context.user.id === input.userId;
    },
  },
});
