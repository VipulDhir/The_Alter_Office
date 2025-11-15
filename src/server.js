const app = require('./app');
const cfg = require('./config/config');

app.listen(cfg.port, () => console.log(`Server running on port ${cfg.port}`));
