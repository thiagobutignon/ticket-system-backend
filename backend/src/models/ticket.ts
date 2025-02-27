export type Ticket = {
  id: number;
  title: string;
  description: string;
  deadline: string;
  assignedTo?: string;
};