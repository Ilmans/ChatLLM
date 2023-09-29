const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "dist",
    browserslist: 'chrome >= 116'
});
  
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    distDir: 'dist',
    experimental: {
        appDir: true
    }
}

module.exports = withPWA(nextConfig)
