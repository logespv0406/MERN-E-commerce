import Logo from './Logo';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <Logo size="lg" />
        <div className="w-32 h-px bg-neutral-200 relative overflow-hidden">
          <div className="w-10 h-px bg-neutral-900 absolute animate-loadbar" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;