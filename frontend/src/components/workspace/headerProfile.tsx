export function HeaderProfile({ workspaceName }: { workspaceName?: string }) {
    return (
        <header className="relative w-full flex flex-col items-center justify-center py-16 overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-to-linear-to from-amber-700/10 via-amber-600/5 to-transparent" />
            <div className="absolute -top-10 w-[400px] h-[400px] bg-amber-500/20 blur-3xl rounded-full animate-pulse" />

            <div className="relative text-center z-10">
                <h1 className="text-3xl md:text-4xl font-bold text-amber-200 tracking-wide drop-shadow-md">
                    {workspaceName}
                </h1>
                <p className="mt-3 text-sm md:text-base text-amber-100/80">
                    Bienvenido a tu nuevo universo de aventuras.
                </p>
            </div>
        </header>
    );
}
