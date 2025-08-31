import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function PostDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [post, setPost] = useState(null);
	const [author, setAuthor] = useState(null);

	useEffect(() => {
		const fetchPost = async () => {
			try {
				const res = await fetch(
					`https://anime-blog-production-cfed.up.railway.app/api/posts/${id}`
				);
				const data = await res.json();
				setPost(data);

				// fetch author details by id
				if (data.author) {
					try {
						const authorRes = await fetch(
							`https://anime-blog-production-cfed.up.railway.app/api/users/${data.author}`
						);
						if (authorRes.ok) {
							const authorData = await authorRes.json();
							setAuthor(authorData);
						} else {
							setAuthor({ name: "Unknown Author" });
						}
					} catch {
						setAuthor({ name: "Unknown Author" });
					}
				}
			} catch (err) {
				console.error("Error fetching post:", err);
			}
		};
		fetchPost();
	}, [id]);

	const onBack = () => navigate("/dashboard");

	const formatPostDate = (dateString) =>
		new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});

	if (!post) return <div className="p-8">Loading...</div>;

	return (
		<div className="min-h-screen bg-gray-700 text-gray-300">
			{/* Header with back button */}
			<div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
				<div className="max-w-4xl mx-auto p-4 sm:p-6">
					<button onClick={onBack}>← Back to Posts</button>
				</div>
			</div>

			{/* Post Content */}
			<div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
				<div className="mb-6 sm:mb-8">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
						<span
							className={`inline-flex px-3 py-1 rounded-full text-xs font-medium w-fit ${
								post.status === "PUBLISHED"
									? "bg-accent text-accent-foreground"
									: "bg-muted text-muted-foreground"
							}`}
						>
							{post.status}
						</span>
						<div className="text-sm text-muted-foreground">
							{formatPostDate(post.createdAt)} •{" "}
							{post.readTime || "5 min read"}
						</div>
					</div>

					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary font-[family-name:var(--font-rubik)] mb-4 text-balance">
						{post.title}
					</h1>

					{/* Author Section */}
					{author && (
						<div className="flex items-center space-x-3 text-sm text-muted-foreground">
							<div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-medium">
								{author.name?.charAt(0).toUpperCase() || "?"}
							</div>
							<span>By {author.name}</span>
						</div>
					)}
				</div>

				{/* Post Body with Markdown */}
				<div className="prose prose-invert prose-lg max-w-none">
					<ReactMarkdown remarkPlugins={[remarkGfm]}>
						{post.content}
					</ReactMarkdown>
				</div>
			</div>
		</div>
	);
}
