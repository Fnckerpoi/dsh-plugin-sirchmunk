import React from 'react';
import { App as SirchmunkSettingSection } from './App';

interface SettingsSectionRegistration {
  name: 'settings.section';
  id: 'sirchmunk';
  order: number;
  label: () => string;
  locale: string;
}

interface ClientPluginContext {
  slots: {
    inject(name: 'settings.section', callback: () => void): void;
    register(
      registration: SettingsSectionRegistration,
      component: React.ComponentType,
    ): unknown;
  };
}

export function apply(ctx: ClientPluginContext): void {
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'sirchmunk',
    order: 35,
    label: () => 'Sirchmunk',
    locale: 'settings.sirchmunk',
  }, SirchmunkSettingSection));
}
