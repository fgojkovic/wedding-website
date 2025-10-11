require('dotenv').config();
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const readline = require('readline');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function generateInvites() {
  console.log('\n=== Wedding Invite Generator ===\n');
  
  const guestListStr = await prompt('Enter guest names separated by commas (e.g., "John Doe, Jane Smith"): ');
  const baseUrl = await prompt('Enter your website URL (e.g., https://yourwedding.com): ');
  
  const guests = guestListStr.split(',').map(name => name.trim()).filter(name => name);
  
  if (guests.length === 0) {
    console.log('No guests entered.');
    rl.close();
    return;
  }

  const connection = await pool.getConnection();
  
  try {
    console.log('\n📧 Generated Invitation Links:\n');
    
    for (const guest of guests) {
      const code = uuidv4();
      const inviteUrl = `${baseUrl}?invite=${code}`;
      
      await connection.query(
        'INSERT INTO invites (code, guest_name) VALUES (?, ?)',
        [code, guest]
      );
      
      console.log(`${guest}`);
      console.log(`${inviteUrl}\n`);
    }
    
    console.log(`✅ Successfully created ${guests.length} invitations!`);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    connection.release();
    await pool.end();
    rl.close();
  }
}

generateInvites();