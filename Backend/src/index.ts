import express, { type Express, type Request, type Response } from 'express';
import prisma from './config/config.ts';

interface resultRow {
  result: [];
}

const app: Express = express();
const PORT = Number(process.env.PORT ?? 3000);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.get('/health-db', async (req: Request, res: Response) => {
  try {
    const result: resultRow[] = await prisma.$queryRaw`SELECT 1 AS result`;

    console.log('Database connection successful:', result);

    // 1. Ubah BigInt ke Number dulu untuk pengecekan
    const isHealthy = result && result.length > 0 && Number(result[0].result) === 1;

    console.log('Database health check result:', isHealthy);

    if (isHealthy) {
      res.status(200).json({
        status: 'ok',
        message: 'Database connection is healthy.',
        result: { result: Number(result[0].result) },
      });
      return;
    }

    res.status(500).json({ status: 'error', message: 'Database query returned no rows.' });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});