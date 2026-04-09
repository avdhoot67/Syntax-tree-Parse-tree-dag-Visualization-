import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Compiler Expression Analyzer & Optimizer',
  description:
    'Interactive compiler visualization platform — tokenize, parse, build ASTs, generate DAGs, three-address code, and optimize arithmetic expressions with stunning animated visualizations.',
  keywords: ['compiler', 'expression analyzer', 'parse tree', 'AST', 'DAG', 'three address code', 'optimization'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0a0f] antialiased">
        {children}
      </body>
    </html>
  );
}
