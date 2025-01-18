import { motion } from 'framer-motion';

export const GamerLoader = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <motion.div
        className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute text-blue-500 text-2xl font-bold"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        Loading...
      </motion.div>
    </div>
  );
};

