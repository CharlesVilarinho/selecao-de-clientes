import React, { useState, useEffect } from "react";
import styles from "../styles/ModalClient.module.css";
import axios from "axios";

interface ModalClientProps {
  isOpen: boolean;
  action: "create" | "edit";
  clientData?: {
    id: number;
    name: string;
    salario: number;
    empresa: number;
  } | null;
  onClose: () => void;
  onSubmit: (clientData: {
    id: number;
    name: string;
    salario: number;
    empresa: number;
  }) => void;
}

const ModalClient: React.FC<ModalClientProps> = ({
  isOpen,
  action,
  clientData,
  onClose,
}) => {
  // Formata valor para o formato de moeda
  const formatCurrency = (value: number | string): string => {
    let num = value.toString().replace(/\D/g, "");
    if (num.length > 2) {
      num = num.slice(0, num.length - 2) + "." + num.slice(num.length - 2);
    }

    num = parseFloat(num).toFixed(2);
    return `R$ ${num.replace(".", ",")}`;
  };
  const [name, setName] = useState(clientData?.name || "");
  const [salario, setSalario] = useState<string | number>(
    clientData?.salario ? formatCurrency(clientData.salario) : ""
  );
  const [empresa, setEmpresa] = useState<string | number>(
    clientData?.empresa ? formatCurrency(clientData.empresa) : ""
  );

  useEffect(() => {
    if (clientData && action === "edit") {
      setName(clientData.name);
      setSalario(formatCurrency(clientData.salario));
      setEmpresa(formatCurrency(clientData.empresa));
    } else {
      setName("");
      setSalario("");
      setEmpresa("");
    }
  }, [clientData, action]);

  const handleFormSubmit = async () => {
    const currentUser = localStorage.getItem("userName");

    if (!name || !salario || !empresa || !currentUser) {
      alert("Preencha todos os campos antes de salvar.");
      return;
    }

    const payload = {
      name,
      salario:
        parseFloat(
          salario.toString().replace("R$", "").replace(",", ".").trim()
        ) || 0,
      empresa:
        parseFloat(
          empresa.toString().replace("R$", "").replace(",", ".").trim()
        ) || 0,
      selecionado: false,
      updated_user: currentUser,
      ...(action === "create" && { created_user: currentUser }),
    };

    try {
      if (action === "create") {
        await axios.post(`${import.meta.env.VITE_API_URL}/clients`, payload);
      } else if (action === "edit" && clientData?.id) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/clients/${clientData.id}`,
          payload
        );
      }
      alert("Dados salvos com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      alert("Erro ao salvar os dados. Tente novamente.");
    }
  };

  const handleSalarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue.length > 2) {
      rawValue =
        rawValue.slice(0, rawValue.length - 2) +
        "." +
        rawValue.slice(rawValue.length - 2);
    }
    const numericValue = parseFloat(rawValue) || 0;
    setSalario(formatCurrency(numericValue));
  };

  const handleEmpresaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue.length > 2) {
      rawValue =
        rawValue.slice(0, rawValue.length - 2) +
        "." +
        rawValue.slice(rawValue.length - 2);
    }
    const numericValue = parseFloat(rawValue) || 0;
    setEmpresa(formatCurrency(numericValue));
  };

  return (
    isOpen && (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <span className={styles.modalTitle}>
              {action === "create" ? "Criar cliente" : "Editar cliente"}
            </span>
            <button className={styles.closeButton} onClick={onClose}>
              X
            </button>
          </div>
          <div className={styles.modalBody}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              placeholder="Digite o nome:"
            />
            <input
              type="text"
              value={salario}
              onChange={handleSalarioChange}
              className={styles.input}
              placeholder="Digite o salário:"
            />
            <input
              type="text"
              value={empresa}
              onChange={handleEmpresaChange}
              className={styles.input}
              placeholder="Digite o valor da empresa:"
            />
          </div>
          <div className={styles.modalFooter}>
            <button className={styles.submitButton} onClick={handleFormSubmit}>
              {action === "create" ? "Criar cliente" : "Editar cliente"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ModalClient;
function setClients(data: any) {
  throw new Error("Function not implemented.");
}
