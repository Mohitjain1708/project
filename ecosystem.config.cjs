module.exports = {
  apps: [{
    name: 'american-dream',
    script: 'node',
    args: 'server.js',
    cwd: '/home/user/webapp',
    env: { NODE_ENV: 'development', PORT: 3000 },
    watch: false,
    instances: 1,
    exec_mode: 'fork'
  }]
}
