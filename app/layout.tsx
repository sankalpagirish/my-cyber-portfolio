import "./globals.css";
import "./globals.css";

export const metadata = {
  title: "Sankalpa Girish| Cybersecurity Portfolio",
  description: "Cybersecurity Engineer | SOC Analyst | Blue Team",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0d1117] text-gray-200">
        {children}
      </body>
    </html>
  );
}


