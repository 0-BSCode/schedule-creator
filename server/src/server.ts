import express, { Request, Response } from 'express';

const app = express();
const port = 3000; // Or get port from environment variable

const test = 3;

app.get('/', (req: Request, res: Response) => {
  res.send('Hi from Express + TypeScript!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});