/** @type {import('next').NextConfig} */
const config = {
  swcMinify: true,
  reactStrictMode: false,
  webpack(config, { isServer }) {
    // Adiciona o loader para arquivos SVG
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    // Adiciona o loader para arquivos de fontes
    config.module.rules.push({
      test: /\.(ttf|eot|woff|woff2)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'static/fonts/', // Caminho onde as fontes serão copiadas
          publicPath: '/static/fonts/', // Caminho para acessar as fontes
        },
      },
    });
    

    return config;
  },
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/welcome',
        permanent: true
      }
    ];
  }
};

const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/react',
  '@fullcalendar/daygrid',
  '@fullcalendar/list',
  '@fullcalendar/timegrid',
  '@fullcalendar/timeline'
]);

module.exports = withTM(config);
