import "./App.css";
import { Outlet } from "react-router-dom";

function App() {
	return (
		<div className="App">
			<main className="py-6" style={{ width: "100%" }}>
				<Outlet />
			</main>
		</div>
	);
}

export default App;
