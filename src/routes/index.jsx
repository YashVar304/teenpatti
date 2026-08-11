import {createBrowserRouter} from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Lobby from "../pages/Lobby";
import RootLayout from "../components/RootLayout";
import Game from "../pages/Game";
import {paths} from "./paths";

export const router = createBrowserRouter([
    {
        path: paths.landingpage,
        element: <RootLayout />,
        children: [
            {index: true, element: <Game />},
            {path: paths.login, element: <Login />},
            {path: paths.lobby, element: <Lobby />},
            {path: paths.game, element: <Game />}
        ]
    },
    
]);