// web/pages/index.js
import Link from "next/link";
import PostList from "../components/PostList";
import { api, API_BASE } from "../lib/api";

export default function Home({ posts }) {
    return (
        <main style={{maxWidth:900, margin:"0 auto", padding:20}}>
            <h1>Next.js Posts</h1>
            <p>
                Backend API at <code>{API_BASE}/api</code> &nbsp;|&nbsp;
                <Link href="/posts/new">Create new</Link> &nbsp;|&nbsp;
                <a href="http://localhost:4000/posts" target="_blank" rel="noreferrer">Open EJS version</a>
            </p>
            <PostList posts={posts} />
        </main>
    );
}

export async function getServerSideProps() {
    try {
        const posts = await api("/api/posts");
        return { props: { posts } };
    } catch (err) {
        console.error("Failed to fetch posts:", err.message);
        return { props: { posts: [] } };
    }
}
