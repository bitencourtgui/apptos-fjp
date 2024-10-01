import type { NavItemConfig } from "@/types/nav";

// NOTE: We did not use React Components for Icons, because
//  you may one to get the config from the server.

// NOTE: First level elements are groups.

export interface LayoutConfig {
  navItems: NavItemConfig[];
}

export const layoutConfig = {
  navItems: [
    {
      key: "dashboards",
      title: "",
      items: [
        {
          key: "overview",
          title: "Visão Geral",
          href: "/visao-geral",
          icon: "house",
        },
      ],
    },
    {
      key: "general",
      title: "",
      items: [
        {
          key: "clientes",
          title: "Clientes",
          href: "/clientes",
          icon: "users",
          matcher: { type: "startsWith", href: "/clientes" },
        },

        {
          key: "lawyer",
          title: "Juridico",
          href: "/juridico",
          icon: "scales",
          matcher: { type: "startsWith", href: "/juridico" },
        },

        {
          key: "website",
          title: "Sites",
          icon: "arrow-square-out",
          items: [
            {
              key: "esaj",
              title: "ESAJ",
              href: "https://esaj.tjsp.jus.br/sajcas/login?service=https%3A%2F%2Fesaj.tjsp.jus.br%2Fesaj%2Fj_spring_cas_security_check",
            },
          ],
        },
        {
          key: "usuarios",
          title: "Usuários",
          href: "/usuarios",
          icon: "user-focus",
          matcher: { type: "startsWith", href: "/usuarios" },
        },
      ],
    },
  ],
} satisfies LayoutConfig;
