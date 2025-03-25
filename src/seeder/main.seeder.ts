import 'dotenv/config';
import { DataSource } from 'typeorm';
import { UserSeeder } from './user.seeder';

export interface Seeder {
  run(): Promise<void>;
}

const dataSource = new DataSource({
  type: 'postgres', // Change if using MySQL
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // Only for development
});

async function runSeeders() {
  await dataSource.initialize();
  console.log('✅ Database connected');

  const seeders: Seeder[] = [
    new UserSeeder(dataSource), // Add multiple seeders here
  ];

  for (const seeder of seeders) {
    await seeder.run();
  }

  await dataSource.destroy();
  console.log('✅ Seeding completed successfully');
}

runSeeders().catch((error) => {
  console.error('❌ Error running seeders:', error);
});
