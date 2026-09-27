import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useStore from "../store/useStore";
import { signOut } from "../utils/api";

export default function Header() {
    const { user, setUser } = useStore();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    // Vérification du statut Admin basée sur le pseudo stocké dans useStore
    useEffect(() => {
        if (user && user.role === "admin") {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            // Le serveur efface le cookie de session ; on ne bloque pas l'utilisateur si ça échoue.
            await signOut();
        } catch (e) {
            console.warn("Déconnexion serveur impossible, on nettoie quand même côté client.");
        } finally {
            setUser(null);
            navigate('/');
        }
    };

    return (
        <header style={headerStyle}>
            <div style={logoStyle}>
                <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                    <h2>IdeaStorm</h2>
                </Link>
            </div>

            <nav style={navStyle}>
                <Link to="/" style={linkStyle}>Accueil</Link>
                <Link to="/pages" style={linkStyle}>Boutique</Link>
                <Link to="/leaderboard" style={linkStyle}>Leaderboard</Link>

                {/* Bouton Admin visible uniquement pour l'utilisateur Letotoo06 */}
                {isAdmin && (
                    <Link to="/admin" style={adminLinkStyle}>
                        🛠️ ADMIN
                    </Link>
                )}
            </nav>

            <div style={userStyle}>
                {user ? (
                    <>
                        <div style={userInfoStyle}>
                            <div style={avatarStyle}>
                                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                            </div>
                            <span style={usernameDisplayStyle}>{user.username}</span>
                        </div>
                        <button onClick={handleLogout} style={logoutBtn}>Déconnexion</button>
                    </>
                ) : (
                    <div style={authButtonsStyle}>
                        <Link to="/login" style={btnStyle}>Connexion</Link>
                        <Link to="/signup" style={btnStyle}>Inscription</Link>
                    </div>
                )}
            </div>
        </header>
    );
}

/* ----------------- STYLES AMÉLIORÉS ----------------- */
const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px",
    backgroundColor: "#1a1a2e",
    color: "white",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "70px",
    zIndex: 1000,
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    borderBottom: "1px solid rgba(255,255,255,0.1)"
};

const logoStyle = {
    fontSize: "24px",
    fontWeight: "bold",
};

const navStyle = {
    display: "flex",
    gap: "25px",
    alignItems: "center",
};

const linkStyle = {
    color: "#e0e0e0",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "16px",
    transition: "color 0.2s",
};

const adminLinkStyle = {
    color: "#ff4757",
    textDecoration: "none",
    fontWeight: "bold",
    border: "2px solid #ff4757",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    backgroundColor: "rgba(255, 71, 87, 0.1)",
    transition: "all 0.3s ease",
};

const userStyle = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
};

const userInfoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
};

const usernameDisplayStyle = {
    fontWeight: "600",
    fontSize: "14px",
    color: "#ff6f61"
};

const avatarStyle = {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "#e94560",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    color: "white",
    fontSize: "16px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
};

const authButtonsStyle = {
    display: "flex",
    gap: "10px",
};

const btnStyle = {
    backgroundColor: "#0f3460",
    color: "white",
    padding: "8px 16px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
    transition: "background-color 0.2s",
};

const logoutBtn = {
    ...btnStyle,
    backgroundColor: "#e94560",
    border: "none",
    cursor: "pointer",
};