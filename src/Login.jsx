import { useState } from "react";
import "./App.css";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 

const Login = () => {
    const navigate = useNavigate();
	const [active, setActive] = useState("login");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault(); // Prevent page reload

		// Build payload
		const payload =
			active === "login"
				? { email, password }
				: { username, email, password };

		console.log("Submitting payload:", payload);

		const endpoint = active === "login" ? "/login" : "/registerauthor";

		try {
			const response = await fetch(
				`http://localhost:4000/api${endpoint}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				}
			);

			const data = await response.json();

			if (response.ok) {
				alert(
					active === "login"
						? "Logged in successfully!"
						: "Signup successful!"
				);
				// Clear fields after success
				setEmail("");
				setPassword("");
                setUsername("");
                const { token } = data;
				localStorage.setItem("token", token);
                navigate("/dashboard");
			} else {
				// If backend returned an array of validation errors
				if (Array.isArray(data)) {
					const messages = data.map((err) => err.message).join("\n");
					alert(messages);
				} else {
					alert(data.message || "Something went wrong.");
				}
			}
		} catch (err) {
			console.error("Network error:", err);
			alert("Network error, check server or connection.");
		}
	};

	return (
		<section className="min-h-screen w-screen flex flex-col justify-center items-center bg-purple-800">
			<div className="bg-gray-900 mx-4 p-6 max-w-[30rem] rounded-3xl text-center flex flex-col justify-center shadow-2xl">
				{/* Heading */}
				<h1 className="font-extrabold text-4xl bg-gradient-to-r from-purple-500 via-pink-600 to-red-500 text-transparent bg-clip-text">
					{active === "login" ? "Welcome Back" : "Create Account"}
				</h1>

				{/* Subtext */}
				<p className="mt-3 text-gray-400 text-sm">
					{active === "login"
						? "Discover the latest anime reviews, insights, and cultural deep-dives from passionate writers and fans."
						: "Join our community and start sharing your anime insights, reviews, and fan stories today!"}
				</p>

				{/* Toggle Buttons */}
				<div className="flex bg-neutral-700 rounded-xl justify-between mt-6 w-[80%] mx-auto">
					<button
						className={`text-white font-bold py-2 px-6 rounded-xl transition duration-300 shadow-md hover:shadow-lg hover:cursor-pointer ${
							active === "login"
								? "bg-gradient-to-r from-purple-700 to-pink-500"
								: ""
						}`}
						onClick={() => setActive("login")}
					>
						Login
					</button>

					<button
						className={`text-white font-bold py-2 px-6 rounded-xl transition duration-300 shadow-md hover:shadow-lg hover:cursor-pointer ${
							active === "signup"
								? "bg-gradient-to-r from-purple-700 to-pink-500"
								: ""
						}`}
						onClick={() => setActive("signup")}
					>
						Signup
					</button>
				</div>

				{/* Form Inputs */}
				<form
					className="mt-6 w-[80%] mx-auto flex flex-col gap-4"
					onSubmit={handleSubmit}
				>
					{active === "signup" && (
						<div className="relative">
							<FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
							<input
								type="text"
								placeholder="Username"
								value={username}
								name="username"
								onChange={(e) => setUsername(e.target.value)}
								className="w-full p-2 pl-10 rounded-lg text-gray-400 border-b-2 border-b-purple-500 focus:border-0 focus:ring-pink-500 focus:outline-none focus:ring-2"
								required
								minLength={3}
								maxLength={20}
							/>
						</div>
					)}

					<div className="relative">
						<FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
						<input
							type="email"
							placeholder="Email"
							value={email}
							name="email"
							onChange={(e) => setEmail(e.target.value)}
							className="w-full p-2 pl-10 rounded-lg text-gray-400 border-b-2 border-b-purple-500 focus:border-0 focus:ring-pink-500 focus:outline-none focus:ring-2"
							required
						/>
					</div>

					<div className="relative">
						<FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
						<input
							type="password"
							placeholder="Password"
							value={password}
							name="password"
							onChange={(e) => setPassword(e.target.value)}
							className="w-full p-2 pl-10 rounded-lg text-gray-400 border-b-2 border-b-purple-500 focus:border-0 focus:ring-pink-500 focus:outline-none focus:ring-2"
							required
							minLength={6}
						/>
					</div>

					<button
						type="submit"
						className={`${
							active === "login"
								? "bg-pink-500 hover:bg-pink-400"
								: "bg-purple-600 hover:bg-purple-500"
                            } text-white py-2 rounded-xl mt-2 w-full transition duration-300`}
                        
					>
                        {active === "login" ? "Login" : "Signup"}
                        
					</button>
				</form>
			</div>
		</section>
	);
};

export default Login;
