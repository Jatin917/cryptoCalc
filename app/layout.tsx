
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Crypto Profit Calculator</h1>
        {children}
        </div>
      </body>
    </html>
  );
}
