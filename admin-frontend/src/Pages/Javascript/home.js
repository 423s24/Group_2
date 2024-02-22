import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../Backend/Firebase";
import { getDoc, doc } from "firebase/firestore"; 
import { useEffect } from "react";
import { useState } from "react";

function HomePage() {
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
    }, []);

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
        <div>
            <h2>User Profile</h2>
            {userData && (
                <div>
                    <p>Name: {userData.name}</p>
                    <p>Phone: {userData.phone}</p>
                    <p>Email: {userData.email}</p>
                </div>
            )}
            <button onClick={signUserOut}>Sign Out</button>

        </div>
    );
}

export default HomePage;