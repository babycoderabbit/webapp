const { Client } = require('pg');

async function testConnection(password) {
  const url = `postgresql://postgres:${encodeURIComponent(password)}@db.swzscmtsgwidzmknqrgj.supabase.co:5432/postgres`;
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    console.log(`Success on direct db with password: ${password}`);
    await client.end();
    return true;
  } catch (err) {
    console.error(`Failed on direct db with password ${password}:`, err.message);
    return false;
  }
}

async function run() {
  await testConnection("BIGfishcc221");
}

run();
