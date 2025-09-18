import { AlertPageTableHeaderSection } from "./component";

function AlarmsRealtimeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex-1 rounded-lg border border-gray-700 p-[7px] flex flex-col" style={{
      position: 'relative',
      isolation: 'isolate'
    }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url('/bgdisco.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.05,
          zIndex: -1,
          content: '""'
        }}
      />
      <div className="flex-1 w-full max-w-[1770px] mx-auto flex flex-col">
        <AlertPageTableHeaderSection />
        {children}
      </div>
    </div>
  );
}

export default AlarmsRealtimeLayout;

