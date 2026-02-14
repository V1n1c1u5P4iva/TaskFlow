import "./globals.css";
import { Inter } from "next/font/google";
import ClientProviders from "@/components/providers/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TaskFlow AI",
  description: "Gerencie tarefas com inteligência artificial",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={inter.className}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var theme = savedTheme || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })()
            `,
          }}
        />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
