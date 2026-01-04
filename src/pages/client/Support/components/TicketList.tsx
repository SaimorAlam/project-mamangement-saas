import React from "react";
import { Ticket } from "./types";
import ClientCreateTicket from "../ClientCreateTicket";

interface TicketListProps {
  tickets: Ticket[] | undefined;
  selectedTicket: Ticket | null;
  onSelectTicket: (ticket: Ticket) => void;
}

const TicketList: React.FC<TicketListProps> = ({
  tickets,
  selectedTicket,
  onSelectTicket,
}) => {
  return (
    <div
      className={`flex-1 flex flex-col transition-all ${
        selectedTicket ? "hidden lg:flex" : "flex"
      }`}
    >
      <div className="h-22 flex items-center justify-between px-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold">Support Center</h2>
        <ClientCreateTicket />
      </div>
      <main className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-t-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets?.map((ticket: Ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket)}
                  className={
                    selectedTicket?.id === ticket.id
                      ? "bg-blue-50 cursor-pointer transition-colors"
                      : "hover:bg-blue-50 cursor-pointer transition-colors"
                  }
                >
                  <td className="px-6 py-4 font-medium text-slate-500">
                    {ticket.id}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {ticket?.issueType}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      {ticket.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default TicketList;
