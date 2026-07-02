import React from 'react';

const ConfirmModal = React.memo(({ isOpen, title = 'Onayla', message = 'Bu işlemi gerçekleştirmek istediğinize emin misiniz?', onConfirm, onCancel, confirmText = 'Evet, Onayla', cancelText = 'İptal' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#17171C] border border-[#2e303a] rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{message}</p>
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-[#0B0B0F] hover:bg-gray-800 text-gray-300 rounded-lg text-sm font-semibold border border-[#2e303a] transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#7A1E2C] hover:bg-[#B83246] text-white rounded-lg text-sm font-semibold transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
});

ConfirmModal.displayName = 'ConfirmModal';

export default ConfirmModal;
