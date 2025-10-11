// File: generate-invites.js
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
  console.log('\n========================================');
  console.log('   Wedding Invite Generator');
  console.log('========================================\n');
  
  const guestListStr = await prompt('Enter guest names separated by commas\n(e.g., "John Doe, Jane Smith, Mark Johnson")\nOr press Enter to skip: ');
  const baseUrl = await prompt('\nEnter your website URL (e.g., https://yourwedding.com): ');
  
  const guests = guestListStr ? guestListStr.split(',').map(name => name.trim()).filter(name => name) : [];

  const connection = await pool.getConnection();
  
  try {
    // Generate general invite link first
    const generalCode = uuidv4();
    await connection.query(
      'INSERT INTO invites (code, guest_name, is_general) VALUES (?, ?, ?)',
      [generalCode, 'General Invitation', true]
    );
    
    const generalUrl = `${baseUrl}?invite=${generalCode}`;
    
    console.log('\n========================================');
    console.log('   📧 INVITATION LINKS');
    console.log('========================================\n');
    
    console.log('🎉 GENERAL INVITE LINK (Share with anyone):\n');
    console.log(generalUrl);
    console.log('\n-----------------------------------\n');
    
    // Generate personalized links if guests provided
    if (guests.length > 0) {
      console.log(`🎟️  PERSONALIZED LINKS (${guests.length} guest${guests.length !== 1 ? 's' : ''}):\n`);
      
      for (const guest of guests) {
        const code = uuidv4();
        
        await connection.query(
          'INSERT INTO invites (code, guest_name, is_general) VALUES (?, ?, ?)',
          [code, guest, false]
        );
        
        const inviteUrl = `${baseUrl}?invite=${code}`;
        
        console.log(`${guest}`);
        console.log(`${inviteUrl}\n`);
      }
      
      console.log('========================================');
      console.log(`✅ Created 1 general + ${guests.length} personalized invitation${guests.length !== 1 ? 's' : ''}`);
      console.log('========================================\n');
    } else {
      console.log('========================================');
      console.log('✅ Created 1 general invitation link');
      console.log('========================================\n');
    }
    
    console.log('💡 TIPS:');
    console.log('   • Share the GENERAL link with everyone');
    console.log('   • Or send PERSONALIZED links individually to guests\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    connection.release();
    await pool.end();
    rl.close();
  }
}

generateInvites();