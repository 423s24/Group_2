import { signOut } from "firebase/auth";
import { auth } from "../Backend/Firebase";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();
    const user = auth.currentUser;

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
            <h1>Loading...</h1>
            <p>{user.email}</p>
            <button onClick={signUserOut}>Sign Out</button>
        </div>
    );
}

export default HomePage;