import { useNavigate } from "react-router-dom";
import { paths } from "../routes/paths";

function Lobby (){
    const navigate = useNavigate();
    return (
        <div>
            <h1>Lobby Page</h1>
            <button onClick={() => navigate(paths.game)}>Start Game</button>
        </div>
    )
}
export default Lobby