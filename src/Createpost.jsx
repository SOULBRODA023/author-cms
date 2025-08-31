import React, { useState, useEffect } from "react";
import {
	FaBars,
	FaTimes,
	FaBold,
	FaItalic,
	FaListUl,
	FaStrikethrough,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";

const PostForm = ({ mode = "create" }) => {
	const navigate = useNavigate();
	const { id } = useParams(); 

	const [menuOpen, setMenuOpen] = useState(false);
	const [status, setStatus] = useState("DRAFT");
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);

	// 👇 Prefill if editing
	useEffect(() => {
		if (mode === "edit" && id) {
			const fetchPost = async () => {
				const token = localStorage.getItem("token");
				const res = await fetch(
					`http://localhost:4000/api/posts/${id}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				const data = await res.json();
				setTitle(data.title);
				setContent(data.content);
				setStatus(data.status);
			};
			fetchPost();
		}
	}, [id, mode]);

	// Markdown helper
	const insertAtCursor = (syntaxBefore, syntaxAfter = "") => {
		const textarea = document.getElementById("contentBox");
		if (!textarea) return;
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selected = content.substring(start, end);
		const newText =
			content.substring(0, start) +
			syntaxBefore +
			selected +
			syntaxAfter +
			content.substring(end);
		setContent(newText);

		setTimeout(() => {
			textarea.focus();
			textarea.selectionStart = start + syntaxBefore.length;
			textarea.selectionEnd = end + syntaxBefore.length;
		}, 0);
	};

	// Submit handler
	const handleSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("token");

		if (!token) {
			navigate("/");
			return;
		}

		setLoading(true);

		try {
			const url =
				mode === "edit"
					? `http://localhost:4000/api/posts/${id}`
					: "http://localhost:4000/api/posts";

			const method = mode === "edit" ? "PUT" : "POST";

			const res = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ title, content, status }),
			});

			const data = await res.json();

			if (!res.ok) {
				if (data.message === "Invalid or expired token") {
					localStorage.removeItem("token");
					navigate("/");
				}
				return;
			}

			navigate("/dashboard");
		} catch (err) {
			console.error("Error:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-800">
			{/* Navbar (same as before) */}
			<header className="bg-purple-600 text-white px-4 py-3 flex justify-between items-center">
				<div className="flex items-center space-x-2">
					<span className="text-2xl">✨</span>
					<h1 className="font-bold text-lg">OtakuCMS</h1>
				</div>
				<button
					className="md:hidden text-2xl"
					onClick={() => setMenuOpen(!menuOpen)}
				>
					{menuOpen ? <FaTimes /> : <FaBars />}
				</button>
			</header>

			{/* Main */}
			<main className="p-6 flex justify-center">
				<div className="bg-white/10 backdrop-blur-lg border border-white/30 shadow-lg rounded-2xl p-6 w-full max-w-5xl">
					<h2 className="text-xl font-bold text-purple-700 mb-1">
						{mode === "edit" ? "Edit Post" : "Create New Post"}
					</h2>

					<div className="grid md:grid-cols-2 gap-6">
						{/* Left: Form */}
						<div>
							<label className="block text-sm font-medium text-white mb-1">
								Post Title
							</label>
							<input
								type="text"
								placeholder="Enter your post title..."
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className="w-full border rounded-lg px-3 py-2 mb-4"
							/>

							{/* Toolbar */}
							<div className="flex flex-wrap gap-2 mb-2 text-white">
								<button
									onClick={() => insertAtCursor("**", "**")}
									className="p-2 bg-purple-600 rounded"
								>
									<FaBold />
								</button>
								<button
									onClick={() => insertAtCursor("_", "_")}
									className="p-2 bg-purple-600 rounded"
								>
									<FaItalic />
								</button>
								<button
									onClick={() => insertAtCursor("~~", "~~")}
									className="p-2 bg-purple-600 rounded"
								>
									<FaStrikethrough />
								</button>
								<button
									onClick={() => insertAtCursor("- ")}
									className="p-2 bg-purple-600 rounded"
								>
									<FaListUl />
								</button>
							</div>

							{/* Content */}
							<textarea
								id="contentBox"
								placeholder="Write content..."
								rows="10"
								value={content}
								onChange={(e) => setContent(e.target.value)}
								className="w-full border rounded-lg px-3 py-2 mb-4"
							></textarea>

							{/* Status */}
							<div className="flex items-center space-x-4 mb-6 text-white">
								<label className="flex items-center space-x-2">
									<input
										type="radio"
										name="status"
										value="DRAFT"
										checked={status === "DRAFT"}
										onChange={(e) =>
											setStatus(e.target.value)
										}
									/>
									<span>Draft</span>
								</label>
								<label className="flex items-center space-x-2">
									<input
										type="radio"
										name="status"
										value="PUBLISHED"
										checked={status === "PUBLISHED"}
										onChange={(e) =>
											setStatus(e.target.value)
										}
									/>
									<span>Published</span>
								</label>
							</div>

							<button
								className="w-full bg-purple-600 text-white px-4 py-2 rounded-xl mb-3"
								onClick={handleSubmit}
								disabled={loading}
							>
								{loading
									? "Submitting..."
									: mode === "edit"
									? "Update Post"
									: "Create Post"}
							</button>
							<button
								className="w-full bg-purple-400 text-white px-4 py-2 rounded-xl"
								onClick={() => navigate("/dashboard")}
							>
								Cancel
							</button>
						</div>

						{/* Right: Preview */}
						<div className="bg-gray-900 rounded-xl p-4 border border-gray-700 h-[500px] flex flex-col">
							<h3 className="text-lg font-semibold text-purple-400 mb-3">
								Live Preview
							</h3>
							<h1 className="text-xl font-bold text-white mb-2">
								{title || "Your Post Title"}
							</h1>
							<div className="prose prose-invert max-w-none text-gray-400 overflow-y-auto flex-1">
								<ReactMarkdown>
									{content ||
										"Start writing with **Markdown** here!"}
								</ReactMarkdown>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default PostForm;
