import { defineNuxtRouteMiddleware, navigateTo, useAuth } from "#imports";
import type { RouteLocationNormalized } from "vue-router";

type Role = string;

export default defineNuxtRouteMiddleware((to: RouteLocationNormalized) => {
  const required = to.meta.role as Role | Role[] | undefined;
  if (!required) return;

  const { profile, role } = useAuth();
  if (!profile.value) return navigateTo("/login");

  const allowed = Array.isArray(required) ? required.includes(role.value as Role) : role.value === required;
  if (!allowed) {
    return navigateTo(role.value ? `/${role.value}` : "/login");
  }
});

