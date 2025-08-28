import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { api } from "../../lib/api";

export default function NewPost() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            const created = await api("/api/posts", {
                method: "POST",
                body: JSON.stringify({ title, body }),
            });
            router.push(`/posts/${created.id}`);
        } catch (e) {
            setError(e.message || "Create failed");
        }
    }

    return (
        <main style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
            <h1>New Post</h1>
            {error && <p style={{ color: "crimson" }}>{error}</p>}
            <form onSubmit={onSubmit}>
                <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
                    <label>Title</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
                    <label>Body</label>
                    <textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} />
                </div>
                <button type="submit">Create</button>
                <span style={{ marginLeft: 12 }}><Link href="/">Cancel</Link></span>
            </form>
        </main>
    );
}
