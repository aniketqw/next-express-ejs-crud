import { useState } from 'react';
import { api } from '../../lib/api';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { API_BASE } from "../../lib/api";
export default function NewPost() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

    async function onSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${API_BASE}/api/posts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, body }),
            });

            const isJson =
                (res.headers.get("content-type") || "").includes("application/json");

            if (!res.ok) {
                const text = isJson ? JSON.stringify(await res.json()) : await res.text();
                throw new Error(text.slice(0, 200));
            }

            const created = await res.json(); // {id, title, body, ...}
            router.push(`/posts/${created.id}`);
        } catch (err) {
            setError(err.message || "Create failed");
        }
    }

  return (
    <main style={{maxWidth:700, margin:'0 auto', padding:20}}>
      <h1>New Post</h1>
      {error && <p style={{color:'crimson'}}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div style={{display:'flex', flexDirection:'column', marginBottom:12}}>
          <label>Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} required />
        </div>
        <div style={{display:'flex', flexDirection:'column', marginBottom:12}}>
          <label>Body</label>
          <textarea rows={8} value={body} onChange={e=>setBody(e.target.value)} />
        </div>
        <button type="submit">Create</button>
        <span style={{marginLeft:12}}><Link href="/">Cancel</Link></span>
      </form>
    </main>
  );
}
