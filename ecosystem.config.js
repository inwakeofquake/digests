module.exports = {
  apps: [{
    name: "digests-app",
    script: "server.js",
    cwd: "/home/digests",
    watch: false,
    instances: 1,
    exec_mode: "fork",
    max_memory_restart: "200M",
    env: {
      NODE_ENV: "production",
      TRUST_PROXY: true
    },
    // Automatic restart configuration
    autorestart: true,
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: "10s",
    
    // Health check configuration
    exp_backoff_restart_delay: 100,
    listen_timeout: 8000,
    kill_timeout: 2000,
    
    // Log configuration
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    error_file: "/home/digests/logs/error.log",
    out_file: "/home/digests/logs/output.log",
    
    // Monitoring
    merge_logs: true,
    log_type: "json",
    
    // Health check endpoint
    env_production: {
      NODE_ENV: "production",
      PORT: 3001,
      TRUST_PROXY: true
    }
  }]
}; 