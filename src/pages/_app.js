import { useEffect } from "react";
import Head from "next/head";
import { Provider as ReduxProvider } from "react-redux";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { RTL } from "../components/rtl";
import { SplashScreen } from "../components/splash-screen";
import { Toaster } from "../components/toaster";
import {
  SettingsConsumer,
  SettingsProvider,
} from "../contexts/settings-context";
import { AuthConsumer, AuthProvider } from "../contexts/auth/firebase-context";
import { gtmConfig } from "../config";
import { gtm } from "../libs/gtm";
import { store } from "../store";
import { createTheme } from "../theme";
import { createEmotionCache } from "../utils/create-emotion-cache";
import "../libs/nprogress";
import "../libs/mapbox";
import "../locales/i18n";
import { SettingsDrawer } from "../components/settings-drawer";
import "./printPage.scss";

const clientSideEmotionCache = createEmotionCache();

const useAnalytics = () => {
  useEffect(() => {
    gtm.initialize(gtmConfig);
  }, []);
};

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useAnalytics();

  const list = ["FeeContract", "PowerOfAttorney", "Hyposufficiency"];

  const isContractPage = list.includes(Component.name);

  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        {/* <title>
          Devias Kit PRO
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        /> */}
      </Head>
      {isContractPage ? (
        // Se a rota atual é 'page/contract', renderize o componente sem as configurações extras
        <Component {...pageProps} />
      ) : (
        <ReduxProvider store={store}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <AuthProvider>
              <AuthConsumer>
                {(auth) => (
                  <SettingsProvider>
                    <SettingsConsumer>
                      {(settings) => {
                        // Prevent theme flicker when restoring custom settings from browser storage
                        if (!settings.isInitialized) {
                          // return null;
                        }

                        const theme = createTheme({
                          colorPreset: settings.colorPreset,
                          contrast: settings.contrast,
                          direction: settings.direction,
                          paletteMode: settings.paletteMode,
                          responsiveFontSizes: settings.responsiveFontSizes,
                        });

                        // Prevent guards from redirecting
                        const showSlashScreen = !auth.isInitialized;

                        return (
                          <ThemeProvider theme={theme}>
                            <Head>
                              <meta
                                name="color-scheme"
                                content={settings.paletteMode}
                              />
                              <meta
                                name="theme-color"
                                content={theme.palette.neutral[900]}
                              />
                            </Head>
                            <RTL direction={settings.direction}>
                              <CssBaseline />
                              {showSlashScreen ? (
                                <SplashScreen />
                              ) : (
                                <>
                                  {getLayout(<Component {...pageProps} />)}
                                  <SettingsDrawer
                                    canReset={settings.isCustom}
                                    onClose={settings.handleDrawerClose}
                                    onReset={settings.handleReset}
                                    onUpdate={settings.handleUpdate}
                                    open={settings.openDrawer}
                                    values={{
                                      colorPreset: settings.colorPreset,
                                      contrast: settings.contrast,
                                      direction: settings.direction,
                                      paletteMode: settings.paletteMode,
                                      responsiveFontSizes:
                                        settings.responsiveFontSizes,
                                      stretch: settings.stretch,
                                      layout: settings.layout,
                                      navColor: settings.navColor,
                                    }}
                                  />
                                </>
                              )}
                              <Toaster />
                            </RTL>
                          </ThemeProvider>
                        );
                      }}
                    </SettingsConsumer>
                  </SettingsProvider>
                )}
              </AuthConsumer>
            </AuthProvider>
          </LocalizationProvider>
        </ReduxProvider>
      )}
    </CacheProvider>
  );
};

export default App;
