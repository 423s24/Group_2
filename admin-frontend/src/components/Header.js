import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../Backend/Firebase";
import { signOut } from "firebase/auth";
import logo from "../Assets/hrdc-logo-1.png";

const Header = () => {

    const navigate = useNavigate();
    const user = auth.currentUser;
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    console.log("No such document");
                }
            } catch (error) {
                console.error("Error getting document: ", error);
            }
        };

        fetchUserData();
    }, [user.uid]);

    const signUserOut = () => {
        signOut(auth)
            .then(() => {
                navigate("../login");
            })
            .catch((error) => {
                // An error happened
                // TODO: Add error handling
            })
    }

    return (
        <div className="header">
            <Link to="/">
                <img src={logo} alt="HRDC Logo" className="logo" />
            </Link>
            <div>
                { userData && <h1>Welcome, {userData.name}</h1>}
                <button onClick={signUserOut}>Sign Out</button>
            </div>
        </div>
    )
}

export default Header;



