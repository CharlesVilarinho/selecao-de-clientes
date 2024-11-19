import React from "react";
import styles from "../styles/ConfirmModalDelete.module.css";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  clientName?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  clientName,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Excluir Cliente:</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>
        <p>
          Você está prestes a excluir o cliente: <span>{clientName}</span>
        </p>
        <button className={styles.confirmButton} onClick={onConfirm}>
          Excluir Cliente
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
