import React from "react";
import styles from "../styles/Header.module.css";
import { useNavigate, Link, NavLink, useLocation } from "react-router-dom";

interface HeaderProps {
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
}

const Header: React.FC<HeaderProps> = ({ userName, setUserName }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    console.log(`f`);
    setUserName(null);
    console.log(`g`);
    navigate("/");
    console.log(`h`);
  };
  return (
    <header className={styles.header}>
      <img
        src="https://s3-alpha-sig.figma.com/img/4275/10ac/9ece7d6223d4590e314f0de127d95ff9?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NBje4oNmaU6tA-ubSMKZaYOsPkWA9f4LzggbnHLQDtYfwkXNMnZoBLRI424nzuW1oPsFLLkJpwx0qmLP7-8Dw93fTuX4OIAVb4LWdnS6MMVxXq7l-59SefqeHJ~oqi~lfm8Te5t0iHTO0O061kDsVuxV2GuzHHB4EB99P7A0R9-KMa95EmWCoRgkQJmcFfj6k3EQPn0Ineou5p18fijLCnzxkBSmdFenPGnAoWxzPSqUKc2dAqlsCvHOUHVpWtIkvHygv4GnbwcKuUJBnbn01Tjyi41YjzQz6kZEHTRBdQRMVDdK2pGaYIamHJY3-A5H1bWwJZ3FSVVuuGkivop3FQ__"
        alt="Logo"
        className={styles.logo}
      />
      <nav className={styles.nav}>
        <NavLink
          to="/clients"
          className={`${styles.navItem} ${
            location.pathname === "/clients" ? styles.activeNavItem : ""
          }`}
        >
          Clientes
        </NavLink>
        <NavLink
          to="/clients-selected"
          className={`${styles.navItem} ${
            location.pathname === "/clients-selected"
              ? styles.activeNavItem
              : ""
          }`}
        >
          Clientes Selecionados
        </NavLink>
        <NavLink
          to="/logout"
          className={styles.navItem}
          onClick={(e) => handleLogout(e)}
        >
          Sair
        </NavLink>
      </nav>
      <div className={styles.userGreeting}>
        Olá, <span className={styles.userName}>{userName || "Usuário"}</span>!
      </div>
    </header>
  );
};

export default Header;
