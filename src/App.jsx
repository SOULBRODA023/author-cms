import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import CreatePost from "./Createpost";
import ProtectedRoute from "./ProtectedRoute";
import PostDetail from "./PostDetail";

function App() {
	return (
		<Routes>
			{/* Public */}
			<Route path="/" element={<Login />} />

			{/* Protected Routes */}
			<Route
				path="/dashboard"
				element={
					<ProtectedRoute>
						<Dashboard />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/create-post"
				element={
					<ProtectedRoute>
						<CreatePost mode="create" />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/edit-post/:id"
				element={
					<ProtectedRoute>
						<CreatePost mode="edit" />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/posts/:id"
				element={
					<ProtectedRoute>
						<PostDetail />
					</ProtectedRoute>
				}
			/>
		</Routes>
	);
}

export default App;
