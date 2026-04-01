"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  LineChart, 
  Activity, 
  Box, 
  Settings, 
  LifeBuoy,
  LogOut
} from "lucide-react";

const mainNav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Order Flow", href: "/dashboard/flow", icon: Activity },
  { name: "ML Sentiment", href: "/dashboard/sentiment", icon: LineChart },
  { name: "Portfolios", href: "/dashboard/portfolios", icon: Box },
];

const helpNav = [
  { name: "Support", href: "/support", icon: LifeBuoy },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // 1. Destroy the cookie by setting its expiration to 0
    document.cookie = "alpha_session=; path=/; max-age=0";
    
    // 2. Clear the local storage backup
    localStorage.removeItem("alpha_token");
    
    // 3. Kick the user back to the login gate
    router.push("/login");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-[#0a0a0a] border-r border-white/5">
      {/* Brand Header */}
      <div className="flex items-center h-16 px-6 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white animate-pulse" />
          <span className="text-sm font-semibold tracking-widest text-white uppercase">AlphaStream</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col flex-1 py-6 overflow-y-auto">
        
        {/* Main Section */}
        <div className="px-4 mb-8">
          <p className="px-2 mb-2 text-xs font-medium tracking-wider text-neutral-500 uppercase">Main</p>
          <div className="space-y-1">
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive 
                      ? "bg-white/10 text-white" 
                      : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Help Center Section */}
        <div className="px-4 mt-auto mb-4">
          <p className="px-2 mb-2 text-xs font-medium tracking-wider text-neutral-500 uppercase">Help Center</p>
          <div className="space-y-1">
            {helpNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors rounded-lg text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
            
            {/* NEW SIGN OUT BUTTON */}
            <button 
              onClick={handleLogout}
              className="flex items-center w-full gap-3 px-3 py-2 text-sm font-medium text-red-400 transition-colors rounded-lg hover:bg-red-400/10 hover:text-red-300"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
            
          </div>
        </div>
      </div>
    </aside>
  );
}