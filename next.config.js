


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   output: 'standalone',
//   poweredByHeader: false,
//   experimental: {
//     appDir: true,
//   }
// }

// module.exports = nextConfig


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   experimental: {
//     serverActions: true,
//   },
//   output: 'standalone'
// }

// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable eslint during build
    ignoreDuringBuilds: true,
  },
  output: 'standalone'
}

module.exports = nextConfig