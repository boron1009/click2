import { useNavigate } from "react-router-dom";

function Button({ children }) {
    const navigate = useNavigate();

    return (
        <div>
            <button onClick={() => navigate("/count")}>{children}</button>
        </div>
    );
}

export default Button;