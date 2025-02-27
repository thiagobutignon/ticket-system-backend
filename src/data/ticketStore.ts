import { Ticket } from '../models/ticket';
import * as fs from 'fs';
import * as path from 'path';
import os from 'os';

const TICKETS_FILE_PATH = path.join(os.tmpdir(), 'tickets.json');

let ticketStoreInstance: ReturnType<typeof createTicketStore> | null = null;

function createTicketStore() {
  let tickets: Ticket[] = [];
  let nextId = 1; // Initialize nextId

  // Load tickets from file on initialization
  try {
    const fileContent = fs.readFileSync(TICKETS_FILE_PATH, 'utf-8');
    tickets = JSON.parse(fileContent);
    if (tickets.length > 0) {
      nextId = tickets[tickets.length - 1].id + 1;
    }
  } catch (error: any) {
    if (error.code !== 'ENOENT') { // Ignore 'File Not Found' error
      console.error('Error loading tickets from file:', error);
    }
    tickets = []; // Initialize with empty array if file not found or error
  }


  return {
    getTickets: () => {
      // Read tickets from file every time to ensure up-to-date data
      try {
        const fileContent = fs.readFileSync(TICKETS_FILE_PATH, 'utf-8');
        tickets = JSON.parse(fileContent);
      } catch (error: any) {
        if (error.code !== 'ENOENT') { // Ignore 'File Not Found' error
          console.error('Error loading tickets from file:', error);
        }
        tickets = [];
      }
      console.log('getTickets called', tickets);
      return tickets;
    },
    addTicket: (ticket: Ticket) => {
      ticket.id = nextId++; // Assign current nextId to ticket and then increment
      tickets.push(ticket);
      // Write tickets to file after adding
      fs.writeFileSync(TICKETS_FILE_PATH, JSON.stringify(tickets, null, 2));
      console.log('Ticket added and written to tickets.json:', tickets); // Added console log
    },
    clearTickets: () => {
      tickets = [];
      nextId = 1; // Reset nextId when clearing tickets
      // Clear the tickets file
      fs.writeFileSync(TICKETS_FILE_PATH, JSON.stringify([]));
    },
  };
}

export const ticketStore = (() => {
  if (!ticketStoreInstance) {
    ticketStoreInstance = createTicketStore();
  }
  return ticketStoreInstance;
})();
