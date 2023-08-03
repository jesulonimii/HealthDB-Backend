module.exports = {
  apps: [{
    script: "server.js",
    watch: ["server", "client"],
    // Delay between restart
    watch_delay: 500,
    ignore_watch : ["node_modules", "client/img"],
  }]
}