import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import CreatePost from "./Createpost";
import ProtectedRoute from "./ProtectedRoute";
import PostDetail from "./PostDetail";

function App() {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Simulate a backend/auth check
		const checkBackend = async () => {
			try {
				const res = await fetch("https://your-app.onrender.com/health");  
				if (!res.ok) throw new Error("Backend not ready");
			} catch (err) {
				console.log("Backend still starting:", err.message);
			} finally {
				setTimeout(() => setLoading(false), 1500); 
			}
		};
		checkBackend();
	}, []);

	if (loading) {
		// 👇 Replace this with your custom spinner/animation if you like
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
				<div className="animate-pulse text-xl font-bold">
					Loading OtakuCMS...
				</div>
			</div>
		);
	}

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
