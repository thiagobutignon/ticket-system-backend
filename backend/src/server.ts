import express from 'express';
import cors from 'cors';

type Ticket = {
  id: number;
  title: string;
  description: string;
  deadline: string;
  assignedTo?: string;
};

const app = express();
app.use(cors());
app.use(express.json());

const tickets: Ticket[] = [];

app.post('/tickets', (req, res) => {
  const { title, description, deadline } = req.body;
  const ticket: Ticket = {
    id: tickets.length + 1,
    title,
    description,
    deadline
  };
  tickets.push(ticket);
  res.status(201).json(ticket);
});

app.get('/tickets', (_, res) => {
  res.json(tickets);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));