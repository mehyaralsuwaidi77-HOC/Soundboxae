"use client";

import { createContext, useContext } from "react";

export interface PublicSettings {
  whatsappNumber: string;
  whatsappUrl: string;
  phone: string;
  phoneDisplay: string;
}

const DEFAULT_SETTINGS: PublicSettings = {
  whatsappNumber: "971553320051",
  whatsappUrl:    "https://wa.me/971553320051?text=Hi%20Soundbox%20Dubai%21%20I%27d%20like%20to%20enquire%20about%20your%20AV%20rental%20services.",
  phone:          "+971553320051",
  phoneDisplay:   "+971 55 332 0051",
};

const SettingsContext = createContext<PublicSettings>(DEFAULT_SETTINGS);

export function SettingsProvider({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: PublicSettings;
}) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): PublicSettings {
  return useContext(SettingsContext);
}
