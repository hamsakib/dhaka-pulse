import { ManageEvents } from "@/components/ManageEvents";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata = { title: "Manage events" };

export default function ManagePage() {
  return (
    <ProtectedRoute>
      <ManageEvents />
    </ProtectedRoute>
  );
}
