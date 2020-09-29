
module.exports = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
      {
        source: '/static/:path*',
        destination: 'https://77.autoretail.ru/static/:path*', // Matched parameters can be used in the destination
      },
    ]
  },
}