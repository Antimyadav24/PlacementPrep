import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

const aptitudeImages = [
  "AgeBase.jpeg", "ApptFormula1.jpeg", "ApptFormula2.jpeg", "ApptFormula3.jpeg",
  "Bod & Pop1.jpeg", "Bodmas 1.jpeg", "Bodmas.jpeg", "Divisibility Rule.jpeg",
  "Formulas.jpeg", "Image2.jpeg", "LCM & HCF 1.jpeg", "LCM & HCF 2.jpeg",
  "LCM & HCF 3.jpeg", "Men1.jpg", "Men2.jpg", "Poplulation 2.jpeg",
  "Population 3.jpeg", "Probability 1.jpeg", "Probability 2.jpeg",
  "Probability 3.jpeg", "Probability 4.PNG", "Remainder 1.jpeg",
  "Remainder 2.jpeg", "Remainder 3.jpeg", "Unit Digit & Tens 1.jpeg",
  "Unit Digit & Tens 2.jpeg", "Unit Digit & Tens 3.jpeg", "a1.jpg", "a2.jpg",
  "ap1.jpg", "ap2.png", "clock & cal.jpeg", "image1.jpeg", "image3.jpeg",
  "jagran.jpg", "log1.jpeg", "log2.jpeg", "probability.PNG", "s1.jpeg",
  "s2.jpeg", "s3.jpeg", "squre.jpeg", "train 1.jpeg", "train 2.jpeg",
  "train 3.jpeg"
];

const AptitudePractice = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="mt-8 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Aptitude Formulas & Study Materials</h2>
        <p className="text-gray-400">Review these formulas and questions to prepare for your aptitude rounds.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {aptitudeImages.map((img, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            className="relative group bg-white/5 rounded-2xl border border-white/10 overflow-hidden cursor-pointer"
            onClick={() => setSelectedImage(img)}
          >
            <div className="aspect-[4/3] bg-black/50 p-2 flex items-center justify-center">
              <img 
                src={`/aptitude/${img}`} 
                alt={img} 
                className="max-w-full max-h-full object-contain rounded-lg"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ZoomIn className="text-white w-10 h-10" />
            </div>
            <div className="p-3 border-t border-white/10 bg-white/5">
              <p className="text-gray-300 text-sm truncate">{img.replace(/\.[^/.]+$/, "").replace(/_/g, " ")}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-gray-300 bg-white/10 p-2 rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={`/aptitude/${selectedImage}`}
              alt="Fullscreen Aptitude Material"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AptitudePractice;
