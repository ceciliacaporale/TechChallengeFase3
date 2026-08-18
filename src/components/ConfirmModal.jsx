export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title || "Confirmar Ação"}</h3>
        <p>{message || "Tem certeza de que deseja realizar esta ação?"}</p>
        <div className="modal-actions">
          <button className="btn-modal-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn-modal-confirm" onClick={onConfirm}>
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  );
}
