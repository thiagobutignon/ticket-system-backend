import { TeamMember } from '../models/teamMember';

export const getTeamMembers = (): TeamMember[] => {
  return [
    { id: '1', name: 'Alice', role: 'Developer' },
    { id: '2', name: 'Bob', role: 'Product Manager' },
    { id: '3', name: 'Charlie', role: 'Designer' },
  ];
};
