import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { api } from "../../lib/api";

export async function getServerSideProps({ params }) {
    try {
        const post = await api(`/api/posts/${params.id}`); // ← relative path
        return { props: { post } };
    } catch {
        return { notFound: true };
    }
}

export default function Post({ post }) {
    const [title, setTitle] = useState(post.title);
    const [body, setBody] = useState(post.body || "");
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function save() {
        setError("");
        try {
            await api(`/api/posts/${post.id}`, {
                method: "PUT",
                body: JSON.stringify({ title, body }),
            });
            setEditing(false);
            router.replace(router.asPath);
        } catch (e) {
            setError(e.message || "Failed to fetch");
        }
    }

    async function remove() {
        if (!confirm("Delete this post?")) return;
        setError("");
        try {
            await api(`/api/posts/${post.id}`, { method: "DELETE" });
            router.push("/");
        } catch (e) {
            setError(e.message || "Failed to fetch");
        }
    }

    return (
        <main style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
            <p><Link href="/">← Back</Link></p>
            {error && <p style={{ color: "crimson" }}>{error}</p>}
            {editing ? (
                <>
                    <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
                        <label>Title</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
                        <label>Body</label>
                        <textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} />
                    </div>
                    <button onClick={save}>Save</button>
                    <button style={{ marginLeft: 8 }} onClick={() => setEditing(false)}>Cancel</button>
                </>
            ) : (
                <>
                    <h1>{title}</h1>
                    <p>{body}</p>
                    <button onClick={() => setEditing(true)}>Edit</button>
                    <button style={{ marginLeft: 8, color: "crimson" }} onClick={remove}>Delete</button>
                </>
            )}
        </main>
    );
}
