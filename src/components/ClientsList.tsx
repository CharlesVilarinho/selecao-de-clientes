import React from "react";
import ClientCard from "./ClientCard";
import styles from "../styles/ClientsList.module.css";

interface Client {
  id: number;
  name: string;
  salario: number;
  empresa: number;
}

interface ClientsListProps {
  clients: Client[];
  cardActions: (client: Client) => React.ReactNode;
}

const ClientsList: React.FC<ClientsListProps> = ({ clients, cardActions }) => {
  return (
    <div className={styles.clientsContainer}>
      {clients.map((client) => (
        <ClientCard
          key={client.id}
          name={client.name}
          salario={client.salario}
          empresa={client.empresa}
        >
          {cardActions(client)}
        </ClientCard>
      ))}
    </div>
  );
};

export default ClientsList;
