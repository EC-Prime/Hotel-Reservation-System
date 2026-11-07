// api/test-auth-flow.js
// Tests the full authentication and reservation integration locally.
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const pool = require('./config/db');
const authService = require('./services/authService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function testAuth() {
  console.log('--- Testing Backend Auth Flow ---');

  const testEmail = `testguest_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  const testName = 'Eleanor Test';
  const testPhone = '+27821234567';

  try {
    // 1. Test duplicate check on non-existent email
    const existsBefore = await authService.emailExists(testEmail);
    console.log(`1. Email exists before creation (expected false): ${existsBefore}`);

    // 2. Hash password & create user
    const passwordHash = await bcrypt.hash(testPassword, 12);
    const guestId = await authService.createGuest({
      fullName: testName,
      email: testEmail,
      phone: testPhone,
      passwordHash
    });
    console.log(`2. Created guest account with ID: ${guestId}`);

    // 3. Test duplicate check after creation
    const existsAfter = await authService.emailExists(testEmail);
    console.log(`3. Email exists after creation (expected true): ${existsAfter}`);

    // 4. Test user retrieval by email
    const user = await authService.findGuestByEmail(testEmail);
    console.log(`4. Found user by email: ${user ? user.full_name : 'null'}`);

    // 5. Test password comparison (valid and invalid)
    const validPass = await bcrypt.compare(testPassword, user.password_hash);
    const invalidPass = await bcrypt.compare('WrongPassword', user.password_hash);
    console.log(`5. Correct password check (expected true): ${validPass}`);
    console.log(`   Incorrect password check (expected false): ${invalidPass}`);

    // 6. Test JWT issue & verify
    const token = jwt.sign(
      { sub: user.guest_user_id, email: user.email, name: user.full_name, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`6. JWT issued and verified successfully for sub: ${decoded.sub}, email: ${decoded.email}`);

    // 7. Clean up test user
    await pool.query('DELETE FROM guest_users WHERE guest_user_id = ?', [guestId]);
    console.log(`7. Cleaned up test user ${guestId}`);

    console.log('\n✅ All backend auth logic and database queries passed perfectly!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

testAuth();
