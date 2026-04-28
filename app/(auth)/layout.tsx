export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold tracking-widest text-stone-400 uppercase">
            Project Vintage
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
