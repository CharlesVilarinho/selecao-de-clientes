import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

interface HomeProps {
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
}

const Home: React.FC<HomeProps> = ({ setUserName }) => {
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value, `handleInputChange`);
    setName(event.target.value);
  };

  const handleSubmit = () => {
    if (name.trim() !== "") {
      setUserName(name);
      navigate("/clients");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.text}>Olá, seja bem-vindo!</h1>
      <input
        type="text"
        placeholder="Digite o seu nome:"
        className={styles.input}
        value={name}
        onChange={handleInputChange}
        maxLength={30}
      />
      {name.length === 30 && (
        <span className={styles.charCount}>Máximo de 30 caracteres</span>
      )}
      <button className={styles.button} disabled={!name} onClick={handleSubmit}>
        Entrar
      </button>
    </div>
  );
};

export default Home;
