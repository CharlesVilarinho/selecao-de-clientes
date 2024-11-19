import React, { useEffect, useState } from "react";
import stylesClient from "./Clients.module.css";
import Header from "../../components/Header";
import Pagination from "../../components/Pagination";
import axios from "axios";
import ClientCard from "../../components/ClientCard";
import ConfirmModalDelete from "../../components/ConfirmModalDelete";
import ModalClient from "../../components/ModalClient";

interface ClientsProps {
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
}

interface Client {
  id: number;
  name: string;
  selecionado: boolean;
  salario: number;
  empresa: number;
  created_user: string;
  updated_user: string;
  created_at: Date;
  updated_at: Date;
}

const Clients: React.FC<ClientsProps> = ({ userName, setUserName }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage, setClientsPerPage] = useState(16);
  const totalPages = Math.ceil(clients.length / clientsPerPage);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedClient, setSelectedClientId] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"create" | "edit">("create");
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  const openModalForCreate = () => {
    setActionType("create");
    setClientToEdit(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (client: {
    id: number;
    name: string;
    selecionado: boolean;
    salario: number;
    empresa: number;
    created_user: string;
    updated_user: string;
    created_at: Date;
    updated_at: Date;
  }) => {
    setActionType("edit");
    setClientToEdit(client);
    setIsModalOpen(true);
  };

  const handleSubmit = (clientData: {
    name: string;
    salario: number;
    empresa: number;
  }) => {
    if (actionType === "create") {
      // Implementar atualização dos dados após update
      console.log("Criar cliente:", clientData);
    } else {
      // Implementar atualização dos dados após update
      console.log("Editar cliente:", clientData);
    }
  };

  const handleOpenModalDelete = (clientId: number, clientName: string) => {
    setSelectedClientId({ id: clientId, name: clientName });
    setIsModalDeleteOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalDeleteOpen(false);
    setSelectedClientId(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectClient = async (id: number, selecionado: boolean) => {
    try {
      await axios.patch<Client[]>(
        `${import.meta.env.VITE_API_URL}/clients/${id}/selecionar`,
        { selecionado }
      );
      setClients((prevClients) =>
        prevClients.filter((client) => client.id !== id)
      );
      setCurrentPage((prevPage) => {
        const totalPages = Math.ceil((clients.length - 1) / clientsPerPage);
        return prevPage > totalPages ? totalPages : prevPage;
      });
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
    }
  };

  async function fetchClients() {
    try {
      const response = await axios.get<Client[]>(
        `${import.meta.env.VITE_API_URL}/clients?selecionado=false`
      );
      const updatedClients = response.data.map((client) => ({
        ...client,
        salario: Number(client.salario),
        empresa: Number(client.empresa),
      }));
      setClients(updatedClients);
      console.log("Clients:", response.data);
      return updatedClients;
    } catch (error) {
      console.error("Error fetching clients:", error);
      throw error;
    }
  }

  const handleConfirmDelete = async () => {
    if (selectedClient) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/clients/${selectedClient.id}`,
          { method: "DELETE" }
        );
        if (!response.ok) throw new Error("Erro ao excluir cliente");

        setClients((prev) =>
          prev.filter((client) => client.id !== selectedClient.id)
        );
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
      } finally {
        handleCloseModal();
      }
    }
  };

  useEffect(() => {
    fetchClients().then(setClients).catch(console.error);
  }, []);

  // Lógica para obter os clientes da página atual
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

  return (
    <div>
      <Header userName={userName} setUserName={setUserName} />
      <div className={stylesClient.container}>
        <div className={stylesClient.infoBar}>
          <div>
            <span>{clients.length}</span> resultados encontrados:
          </div>
          <div className={stylesClient.controls}>
            <label htmlFor="clientsPerPage">Clientes por página:</label>
            <select
              id="clientsPerPage"
              value={clientsPerPage}
              onChange={(e) => {
                setClientsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={4}>4</option>
              <option value={8}>8</option>
              <option value={16}>16</option>
              <option value={32}>32</option>
            </select>
          </div>
        </div>

        <div className={stylesClient.clientsContainer}>
          {currentClients.map((client) => (
            <ClientCard
              key={client.id}
              name={client.name}
              salario={client.salario}
              empresa={client.empresa}
            >
              <button
                className={stylesClient.button}
                onClick={() => handleSelectClient(client.id, true)}
              >
                <img
                  src="../../../public/icons/selecionar.png"
                  alt="Selecionar"
                />
              </button>
              <button
                className={stylesClient.button}
                onClick={() => openModalForEdit(client)}
              >
                <img src="../../../public/icons/editar.png" alt="Editar" />
              </button>
              <button
                className={stylesClient.button}
                onClick={() => handleOpenModalDelete(client.id, client.name)}
              >
                <img
                  src="../../../public/icons/excluir.png"
                  alt="Remover Seleção"
                />
              </button>
            </ClientCard>
          ))}
        </div>
        <ConfirmModalDelete
          isOpen={isModalDeleteOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          clientName={selectedClient?.name}
        />

        <div className={stylesClient.createButtonContainer}>
          <button
            className={stylesClient.createButton}
            onClick={openModalForCreate}
          >
            Criar Cliente
          </button>
        </div>
        <ModalClient
          isOpen={isModalOpen}
          action={actionType}
          clientData={clientToEdit}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Clients;
