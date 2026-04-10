import { ReactNode } from "react";
import StarryBackground from "./StarryBackground";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-background relative">
    <StarryBackground />
    <Navbar />
    <main className="relative z-10 pt-20">{children}</main>
    <Footer />
  </div>
);

export default Layout;
