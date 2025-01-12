const { Pool } = require('pg')


// PostgreSQL Pool Setup
const connectToPostgres = () => {
    const pool = new Pool({
        connectionString: "postgresql://postgres.oezbldnrrpcxvmicmmeq:1234567@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
        // user: process.env.DB_USER || 'postgres',
        // host: process.env.DB_HOST || 'localhost',
        // database: process.env.DB_NAME || 'mentorship',
        // password: process.env.DB_PASSWORD || '123456',
        // port: process.env.DB_PORT || 5432,
    });
    pool.connect().then(() => console.log("database connected"))
}
const pool = new Pool({
    connectionString: "postgresql://postgres.oezbldnrrpcxvmicmmeq:1234567@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true",

    // user: process.env.DB_USER || 'postgres',
    // host: process.env.DB_HOST || 'localhost',
    // database: process.env.DB_NAME || 'mentorship',
    // password: process.env.DB_PASSWORD || '123456',
    // port: process.env.DB_PORT || 5432,
});
module.exports = {connectToPostgres,pool};
