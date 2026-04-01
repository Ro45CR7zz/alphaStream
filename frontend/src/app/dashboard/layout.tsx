import { Sidebar } from "@/src/components/sidebar";
import { ChatCopilot } from "@/src/components/chat-copilot";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Sidebar />
      {/* Main Content Canvas - Offset by the 64 (16rem) sidebar width */}
      <main className="pl-64">
        <div className="h-screen overflow-y-auto">
          {children}
        </div>
      </main>
      <ChatCopilot />
    </div>
  );
}