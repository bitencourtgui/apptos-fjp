import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { ComposeView } from '@/components/chat/compose-view';

export const metadata = { title: `Compose | Chat | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <ComposeView />;
}
