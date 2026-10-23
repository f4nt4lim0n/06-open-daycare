const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:NSVcsWOb9jQFhFUh@db.apsrvxhqycyfpsxqgxmgo.supabase.co:5432/postgres'
});
pool.query(
  "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
  (err, res) => {
    if (err) {
      console.error("Error:", err);
    } else {
      console.log("Tables:", res.rows.length);
      res.rows.forEach(row => console.log("- " + row.table_name));
    }
    pool.end();
  }
);