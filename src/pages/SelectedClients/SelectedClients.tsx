import React, { useEffect, useState } from "react";
import stylesClient from "./SelectedClients.module.css";
import Header from "../../components/Header";
import Pagination from "../../components/Pagination";
import axios from "axios";
import ClientCard from "../../components/ClientCard";

interface SelectedClientsProps {
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

const SelectedClients: React.FC<SelectedClientsProps> = ({
  userName,
  setUserName,
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage, setClientsPerPage] = useState(16);
  const totalPages = Math.ceil(clients.length / clientsPerPage);

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
        `${import.meta.env.VITE_API_URL}/clients?selecionado=true`
      );
      const updatedClients = response.data.map((client) => ({
        ...client,
        salario: Number(client.salario),
        empresa: Number(client.empresa),
      }));
      setClients(updatedClients);
      return updatedClients;
    } catch (error) {
      console.error("Error fetching clients:", error);
      throw error;
    }
  }

  const handleClearSelectedClients = async () => {
    const currentPageClientIds = currentClients.map((client) => client.id);

    try {
      await axios.post<Client[]>(
        `${import.meta.env.VITE_API_URL}/clients/limpar-selecionados`,
        {
          ids: currentPageClientIds,
        }
      );

      setClients((prevClients) =>
        prevClients.filter(
          (client) => !currentPageClientIds.includes(client.id)
        )
      );

      setCurrentPage((prevPage) => {
        const totalPages = Math.ceil(
          (clients.length - currentPageClientIds.length) / clientsPerPage
        );
        return prevPage > totalPages ? totalPages : prevPage;
      });

      alert("Clientes selecionados foram limpos com sucesso!");
    } catch (error) {
      console.error("Erro ao limpar clientes selecionados:", error);
    }
  };

  useEffect(() => {
    fetchClients().then(setClients).catch(console.error);
  }, []);

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
              alignButtons="right"
            >
              <button
                className={stylesClient.button}
                onClick={() => handleSelectClient(client.id, false)}
              >
                <img
                  src="../../../public/icons/remover_selecao.png"
                  alt="Remover Seleção"
                />
              </button>
            </ClientCard>
          ))}
        </div>

        <div className={stylesClient.createButtonContainer}>
          <button
            className={stylesClient.createButton}
            onClick={handleClearSelectedClients}
          >
            Limpar Clientes Selecionados
          </button>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default SelectedClients;
