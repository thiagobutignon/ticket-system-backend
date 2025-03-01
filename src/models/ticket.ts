export type Ticket = {
  id: number;
  title: string;
  description: string;
  deadline: Date;
  assignedTo?: string;
  skills?: string;
  status?: 'To do' | 'Doing' | 'Done';
};
