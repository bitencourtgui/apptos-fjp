"use client";

import { useRouter } from "next/navigation";
import { Link, Typography, Breadcrumbs as MUIBreadcrumbs } from "@mui/material";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";

export const Breadcrumbs = () => {
  const router = useRouter();
  const [asPath, setAsPath] = useState("");

  useEffect(() => {
    setAsPath(window.location.pathname);
  }, []);

  if (!asPath) {
    return null;
  }

  const pathnames = asPath.split("/").filter((x) => x);

  return (
    <MUIBreadcrumbs aria-label="breadcrumb">
      {/* Item fixo "Início" */}
      <Link
        color="text.primary"
        component={NextLink}
        href="/visao-geral"
        underline="hover"
      >
        <Typography variant="subtitle2" color="neutral.700">
          Início
        </Typography>
      </Link>

      {/* Demais breadcrumbs dinâmicos */}
      {pathnames.map((value, index) => {
        const isLast = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        return isLast ? (
          <Typography key={to} color="neutral.400" variant="subtitle2">
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Typography>
        ) : (
          <Link
            key={to}
            color="text.primary"
            component={NextLink}
            href={to}
            underline="hover"
          >
            <Typography variant="subtitle2" color="neutral.700">
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Typography>
          </Link>
        );
      })}
    </MUIBreadcrumbs>
  );
};
