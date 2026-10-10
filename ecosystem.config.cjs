module.exports = {
  apps: [
    {
      name: 'zetaheal',
      script: 'node_modules/next/dist/bin/next',
      args: 'start apps/web -p 3010',
      cwd: '/var/www/zetaheal',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '800M',
      env: {
        NODE_ENV: 'production',
        PORT: 3010,
      },
    },
  ],
};
