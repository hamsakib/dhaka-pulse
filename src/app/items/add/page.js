import { AddEventForm } from "@/components/AddEventForm";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata = { title: "Add an event" };

export default function AddEventPage() {
  return (
    <ProtectedRoute>
      <div className="container-x py-12">
        <p className="kicker">Organisers</p>
        <h1 className="h1 mt-2">Add an event</h1>
        <p className="lead mt-2">Fields marked * are required. Your event appears in the list straight away.</p>
        <AddEventForm />
      </div>
    </ProtectedRoute>
  );
}
