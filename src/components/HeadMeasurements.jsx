import { useEffect } from 'react';

const HeadMeasurements = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-[#111111] border border-[#2a2a2a] rounded-2xl p-5 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-[#1d1d1d] hover:bg-[#2a2a2a] w-9 h-9 rounded-full flex items-center justify-center transition-colors text-lg"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Заголовок */}
        <div className="mb-6 border-l-4 border-[#8b0000] pl-4">
          <h3 className="text-xl md:text-2xl font-bold tracking-wider uppercase text-white">
            How to <span className="text-[#ff4d4d]">Measure Your Head</span>
          </h3>
          <p className="text-zinc-400 text-xs mt-1 uppercase tracking-widest">
            Gorilla Armor Helmet Sizing Guide
          </p>
        </div>

        {/* Схема замеров */}
        <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl overflow-hidden mb-6 flex justify-center p-2">
          <img
            src="/images/head-measurements.jpg"
            alt="Head Measurements Guide"
            className="w-full max-h-[400px] object-contain rounded-lg"
            onError={(e) => {
              e.target.src = 'https://placehold.co/600x400/151515/555555?text=Image+head-measurements.jpg+not+found';
            }}
          />
        </div>

        {/* Текстовая инструкция под схемой */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-4 p-4 bg-[#181818] rounded-xl border border-[#2a2a2a]">
  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-900/30 border border-blue-600 text-blue-400 font-bold flex items-center justify-center text-sm">
    1
  </div>
  <div>
    <h4 className="font-bold uppercase tracking-wider text-white text-xs mb-1">
      Head Circumference
    </h4>
    <p className="text-zinc-400 text-xs leading-relaxed">
      Measure the full circumference of the head, passing around the widest part of the skull, just above the eyebrows and around the back of the head.
    </p>
  </div>
</div>

          <div className="flex gap-4 p-4 bg-[#181818] rounded-xl border border-[#2a2a2a]">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#8b0000]/30 border border-[#8b0000] text-[#ff4d4d] font-bold flex items-center justify-center text-sm">
              2
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-wider text-white text-xs mb-1">
                Head Width
              </h4>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Measure the maximum width of the head, from temple to temple. If possible, take this measurement using calipers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadMeasurements;