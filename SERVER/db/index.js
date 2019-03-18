const { Pool } = require('pg')

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  client.release(err);
  client.end();
  process.exit(-1)
});

module.exports = {
  query: async (text, params) => {
    return pool.connect() 
      .then( async (client) => {
        const start = Date.now()
        return client.query(text, params)
          .then( res => {
              const duration = Date.now() - start
              console.log('executed query', { text, params, duration, rows: res.rowCount })
              client.end();
              return res;
          })
          .catch( error => {
            console.log(error.stack)
            client.end();
            throw error.stack;
          })
      })
      .catch( error => {
          throw error;
      })
  },
}