import React from 'react';

const Loader: React.FC<{ text?: string }> = ({ text = "Carregando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-300 text-lg">{text}</p>
    </div>
  );
};

export default Loader;
