import React from "react";
import ReactDOM from "react-dom/client";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react"
import store from "./store";
import "./index.css";
import App from "./App";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";
import PrivateRoute from "./Context/PrivateRoute";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<App />}>
			<Route index={true} path="/" element={<Homepage />} />
			<Route path="" element={<PrivateRoute />}>
				<Route index={true} path="/chats" element={<Chatpage />} />
				<Route path="/search/:keyword" element={<Chatpage />} />
			</Route>
		</Route>
	)
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<ChakraProvider>
			<Provider store={store}>
				<RouterProvider router={router} />
			</Provider>
		</ChakraProvider>
	</React.StrictMode>
);
