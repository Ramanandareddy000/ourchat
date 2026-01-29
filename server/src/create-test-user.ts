import { NestFactory } from '@nestjs/core';
import { User } from './models';
import { AppModule } from './app.module';
import * as bcrypt from 'bcrypt';

async function createTestUser() {
  const app = await NestFactory.create(AppModule);
  try {
    // Create a test user with username 'test' and password 'test123'
    const password = 'test123';
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: 'test',
      password_hash: hashedPassword,
      display_name: 'Test User',
      about: 'Test user for development',
      online: true,
      last_seen: 'online',
    });
    console.log('Test user created successfully:');
    console.log(`Username: test`);
    console.log(`Password: test123`);
    console.log(`User ID: ${user.id}`);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await app.close();
  }
}

void createTestUser();
