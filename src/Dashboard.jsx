import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaPlus } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);

	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const res = await fetch("https://anime-blog-7oi4.onrender.com/api/posts");
				const data = await res.json();
				setPosts(data);
				console.log(data);
			} catch (err) {
				console.error("Error fetching posts:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, []);

	if (loading) return <p className="text-white">Loading...</p>;

	const handleSubmit = (e) => {
		e.preventDefault();
		navigate("/create-post");
	};

	const handleEdit = (id) => {
		navigate(`/edit-post/${id}`);
	};

	const handleDelete = async (id) => {
		const res = await fetch(`https://anime-blog-7oi4.onrender.com/api/posts/${id}`, {
			method: "DELETE",
		});

		if (res.ok) {
			setPosts(posts.filter((p) => p.id !== id));
		}
	};

	return (
		<div className="min-h-screen bg-gray-800">
			{/* Navbar */}
			<header className="bg-purple-500 text-white px-4 py-3 flex justify-between items-center">
				<div className="flex items-center space-x-2">
					<span className="text-2xl">✨</span>
					<h1 className="font-bold text-lg">OtakuCMS</h1>
				</div>

				{/* Desktop Menu */}
				<nav className="hidden md:flex space-x-6">
					<Link to="/dashboard" className="hover:text-gray-200">
						Dashboard
					</Link>
					<Link to="/create-post" className="hover:text-gray-200">
						Create-post
					</Link>
				</nav>

				{/* Mobile Menu Button */}
				<button
					className="md:hidden text-2xl"
					onClick={() => setMenuOpen(!menuOpen)}
				>
					{menuOpen ? <FaTimes /> : <FaBars />}
				</button>
			</header>

			{/* Mobile Menu Drawer */}
			{menuOpen && (
				<div className="md:hidden bg-purple-500 text-white flex flex-col space-y-4 px-4 py-6">
					<Link to="/dashboard" className="hover:text-gray-200">
						Dashboard
					</Link>
					<Link to="/create-post" className="hover:text-gray-200">
						Create-post
					</Link>
				</div>
			)}

			{/* Main Content */}
			<main className="p-6 grid justify-center">
				<h2 className="text-2xl font-bold text-pink-700">Your Posts</h2>
				<p className="text-gray-400 mb-4">
					Manage your anime blog posts
				</p>

				<button
					className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl shadow-md mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-red-400 "
					onClick={handleSubmit}
				>
					<FaPlus />
					<span>Create New Post</span>
				</button>

				{/* Post Card */}
				<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
					{posts.map((post) => (
						<div
							key={post.id}
							className="bg-white shadow-md rounded-2xl p-4 max-w-md"
						>
							{/* Status + Date */}
							<div className="flex justify-between items-center">
								<span
									className={`${
										post.status === "PUBLISHED"
											? "bg-green-200 text-green-700"
											: "bg-yellow-200 text-yellow-700"
									} text-xs px-3 py-1 rounded-full`}
								>
									{post.status}
								</span>
								<span className="text-gray-400 text-sm">
									{new Date(
										post.createdAt
									).toLocaleDateString()}
								</span>
							</div>

							{/* Title */}
							<h3 className="font-bold text-lg mt-2">
								{post.title}
							</h3>

							{/* Content preview */}
							<p className="text-gray-600 text-sm mt-1">
								{post.content.length > 120
									? post.content.substring(0, 120) + "..."
									: post.content}
							</p>

							{/* Buttons */}
							<div className="flex gap-3">
								<button
									className="mt-4 bg-green-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl w-full"
									onClick={() => handleEdit(post.id)}
								>
									Edit
								</button>

								<button
									className="mt-4 bg-red-400 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl w-full"
									onClick={() => handleDelete(post.id)}
								>
									Delete
								</button>
							</div>

							<button
								onClick={() => navigate(`/posts/${post.id}`)}
								className="mt-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-400 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl w-full"
							>
								Open
							</button>
						</div>
					))}
				</div>
			</main>
		</div>
	);
};

export default Dashboard;
