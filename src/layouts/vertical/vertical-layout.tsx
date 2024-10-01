'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import GlobalStyles from '@mui/material/GlobalStyles';

import { useSettings } from '@/hooks/use-settings';

import { MainNav } from './main-nav';
import { SideNav } from './side-nav';
import { layoutConfig } from '../config';
import { useUser } from '@/hooks/use-user';

export interface VerticalLayoutProps {
  children?: React.ReactNode;
}

export function VerticalLayout({ children }: VerticalLayoutProps): React.JSX.Element {
  const { settings } = useSettings(); // Acessar o usuário do contexto
  const { user } = useUser();

  // Lógica para verificar o e-mail e filtrar os itens de navegação
  const filteredNavItems = user?.email?.includes('@cliente.fjp.br')
    ? [
        {
          key: 'area-cliente',
          title: '',
          items: [
            {
              key: 'area-cliente',
              title: 'Área do Cliente',
              href: '/area-cliente',
              icon: 'house',
            },
          ],
        },
      ]
    : layoutConfig.navItems; // Manter os itens originais caso não seja um cliente FJP

  return (
    <React.Fragment>
      <GlobalStyles
        styles={{
          body: {
            '--MainNav-height': '56px',
            '--MainNav-zIndex': 1000,
            '--SideNav-width': '280px',
            '--SideNav-zIndex': 1100,
            '--MobileNav-width': '320px',
            '--MobileNav-zIndex': 1100,
          },
        }}
      />
      <Box
        sx={{
          bgcolor: 'var(--mui-palette-background-default)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: '100%',
        }}
      >
        <SideNav color={settings.navColor} items={filteredNavItems} />
        <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', pl: { lg: 'var(--SideNav-width)' } }}>
          <MainNav items={filteredNavItems} />
          <Box
            component="main"
            sx={{
              '--Content-margin': '0 auto',
              '--Content-maxWidth': 'var(--maxWidth-xl)',
              '--Content-paddingX': '24px',
              '--Content-paddingY': { xs: '24px', lg: '64px' },
              '--Content-padding': 'var(--Content-paddingY) var(--Content-paddingX)',
              '--Content-width': '100%',
              display: 'flex',
              flex: '1 1 auto',
              flexDirection: 'column',
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
}
