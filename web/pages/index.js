import Link from "next/link";
import PostList from "../components/PostList";
import { api } from "../lib/api";

export default function Home({ posts }) {
    return (
        <main style={{maxWidth:900, margin:"0 auto", padding:20}}>
            <h1>Next.js Posts</h1>
            <p>
                <Link href="/posts/new">Create new</Link>{" "}
                | <a href="http://localhost:4000/posts" target="_blank" rel="noreferrer">Open EJS version</a>
            </p>
            <PostList posts={posts} />
        </main>
    );
}

export async function getServerSideProps() {
    try {
        const posts = await api("/api/posts");       // ← relative path hits Next proxy
        return { props: { posts } };
    } catch (err) {
        console.error("Failed to fetch posts:", err);
        return { props: { posts: [] } };
    }
}
