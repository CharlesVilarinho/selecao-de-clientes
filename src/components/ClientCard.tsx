import React from "react";
import styles from "../styles/ClientCard.module.css";

interface ClientCardProps {
  name: string;
  salario: number;
  empresa: number;
  children?: React.ReactNode;
  alignButtons?: "left" | "center" | "right";
}

const ClientCard: React.FC<ClientCardProps> = ({
  name,
  salario,
  empresa,
  children,
  alignButtons = "center",
}) => {
  return (
    <div className={styles.clientCard}>
      <div className={styles.info}>
        <h3>{name}</h3>
        <p>Salário: R$ {salario.toFixed(2)}</p>
        <p>Empresa: {empresa}</p>
      </div>
      {children && (
        <div
          className={styles.clientButtons}
          style={{ justifyContent: alignButtons }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default ClientCard;
