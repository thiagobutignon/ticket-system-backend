import express, { Request, Response } from 'express';
import cors from 'cors';
import { Ticket } from './models/ticket';
import { isValidDate } from './validation/date';
import { isRequired } from './validation/required';
import { minLength } from './validation/min-length';

const app = express();
app.use(cors());
app.use(express.json());

const tickets: Ticket[] = [];

app.get('/', (req, res) => {
  res.send('Express JS on Vercel')
})

app.post('/tickets', (req: Request, res: Response): any => {
  const { title, description, deadline, assignedTo } = req.body;

  if (isRequired(title) || minLength(title, 3)) {
    return res
      .status(400)
      .json({ error: 'Title is required and must be at least 3 characters long' });
  }

  if (isRequired(description) || minLength(description, 3)) {
    return res
      .status(400)
      .json({ error: 'Description is required and must be at least 3 characters long' });
  }

  if (isRequired(deadline)) {
    return res.status(400).json({ error: 'Deadline is required' });
  }

  if (typeof deadline !== 'string' || !isValidDate(deadline)) {
    return res.status(400).json({ error: 'Invalid deadline format' });
  }

  const deadlineDate = new Date(deadline);
  if (isNaN(deadlineDate.getTime()) || deadlineDate <= new Date()) {
    return res.status(400).json({ error: 'Deadline must be a future date' });
  }

  if (assignedTo && typeof assignedTo !== 'string') {
    return res.status(400).json({ error: 'AssignedTo must be a string' });
  }

  const ticket: Ticket = {
    id: tickets.length + 1,
    title,
    description,
    deadline: deadlineDate,
    assignedTo,
  };

  tickets.push(ticket);
  return res.status(201).json(ticket);
});

app.get('/tickets', (_, res: Response) => {
  res.json(tickets);
});

const port = process.env.PORT || 8080

app.listen(port, (err?: Error) => {
  if (err) {
      console.error(err);
      process.exit(1);
  } else {
      console.log('[INFO] Server Running on port:', port);
  }
});
export default app;

