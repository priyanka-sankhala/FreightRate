import { TicketX } from "lucide-react";

export function Error({ errorMessage }) {
  return (
    <>
      <div
        id="toast-danger"
        className="flex float-right items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm"
        role="alert"
      >
        <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg">
          <TicketX />
        </div>
        <div className="ms-3 text-sm font-normal">{errorMessage}</div>
      </div>
    </>
  );
}

export function Success({ message }) {
  return (
    <>
      <div
        id="toast-success"
        className="flex float-right items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm"
        role="alert"
      >
        <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
          <TicketX />
        </div>
        <div className="ms-3 text-sm font-normal">{message}</div>
      </div>
    </>
  );
}
