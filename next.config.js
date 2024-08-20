/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  staticPageGenerationTimeout: 1000,
};

// // Configuração do next-transpile-modules para transpilar pacotes do Fullcalendar
// const withTM = require("next-transpile-modules")([
//   "@fullcalendar/common",
//   "@fullcalendar/react",
//   "@fullcalendar/daygrid",
//   "@fullcalendar/list",
//   "@fullcalendar/timegrid",
//   "@fullcalendar/timeline",
// ]);

// Exportando a configuração final com next-transpile-modules
module.exports = nextConfig
