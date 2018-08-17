
export const getConfig = () => {
  const env = process.env.NODE_ENV;
  switch (env) {
    case 'staging':
      return {
        baseUrl: 'https://backend-staging-65189006.canner.io'
      };

    case 'production':
      return {
        baseUrl: 'https://backend.canner.io'
      };

    case 'development':
    default:
      return {
        baseUrl: 'https://local.host:1234'
      };
  }
};
