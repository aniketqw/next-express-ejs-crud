import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { API_BASE, api } from '../../lib/api';

export async function getServerSideProps(ctx) {
  const { id } = ctx.params;
  const res = await fetch(`${API_BASE}/posts/${id}`);
  if (res.status !== 200) return { notFound: true };
  const post = await res.json();
  return { props: { post } };
}

export default function Post({ post }) {
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body || '');
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function save() {
    try {
      const updated = await api(`/posts/${post.id}`, { method: 'PUT', body: JSON.stringify({ title, body }) });
      setEditing(false);
      router.replace(router.asPath);
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove() {
    if (!confirm('Delete this post?')) return;
    try {
      await api(`/posts/${post.id}`, { method: 'DELETE' });
      router.push('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main style={{maxWidth:700, margin:'0 auto', padding:20}}>
      <p><Link href="/">← Back</Link></p>
      {error && <p style={{color:'crimson'}}>{error}</p>}
      {editing ? (
        <>
          <div style={{display:'flex', flexDirection:'column', marginBottom:12}}>
            <label>Title</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} />
          </div>
          <div style={{display:'flex', flexDirection:'column', marginBottom:12}}>
            <label>Body</label>
            <textarea rows={8} value={body} onChange={e=>setBody(e.target.value)} />
          </div>
          <button onClick={save}>Save</button>
          <button style={{marginLeft:8}} onClick={()=>setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h1>{title}</h1>
          <p>{body}</p>
          <button onClick={()=>setEditing(true)}>Edit</button>
          <button style={{marginLeft:8, color:'crimson'}} onClick={remove}>Delete</button>
        </>
      )}
    </main>
  );
}
