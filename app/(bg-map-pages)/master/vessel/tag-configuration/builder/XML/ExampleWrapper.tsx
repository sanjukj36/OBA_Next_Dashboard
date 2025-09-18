import { AnimatePresence, motion } from "framer-motion";
import { AlertCircleIcon } from "lucide-react";
import XMLTableDataShow from "./XMLTableDataShow";

interface ExampleWrapperProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedVesselId: string;
}

interface SpringModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedVesselId: string;
}

const ExampleWrapper = ({
  isOpen,
  setIsOpen,
  selectedVesselId
}: ExampleWrapperProps) => {
  return (
    <div className="grid place-content-center bg-white px-4 py-64">
      <SpringModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectedVesselId={selectedVesselId}
      />
    </div>
  );
};

const SpringModal = ({
  isOpen,
  setIsOpen,
  selectedVesselId
}: SpringModalProps) => {
  const handleSubmit = () => {
    // removeValue(); // Commented out as it's not defined in the original code
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-white/20 p-8 backdrop-blur"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-7xl cursor-default rounded-2xl rounded-lg border-2 border-dashed border-black bg-slate-200 px-6 py-3 font-semibold uppercase text-black shadow-xl transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
          >
            <AlertCircleIcon className="absolute -left-24 -top-24 z-0 rotate-12 text-[250px] text-white/10" />
            <div className="relative z-10">
              <h3 className="m-2 text-center text-3xl font-bold">
                Update Excel Sheet
              </h3>

              <div className="mb-6 max-w-full overflow-x-auto overflow-y-auto rounded-lg bg-white p-4">
                <div className="min-w-[1000px]">
                  <XMLTableDataShow
                    selectedVesselId={selectedVesselId}
                    handleCancel={handleSubmit}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleSubmit}
                  className="rounded-2xl border-2 border-dashed border-black bg-red-700 px-6 py-3 font-semibold uppercase text-sky-50 transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExampleWrapper;
