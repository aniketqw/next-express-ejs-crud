import Link from 'next/link';
import { API_BASE } from '../lib/api';

export async function getServerSideProps() {
  const res = await fetch(`${API_BASE}/posts`);
  const posts = await res.json();
  return { props: { posts } };
}

export default function Home({ posts }) {
  return (
    <main style={{maxWidth:900, margin:'0 auto', padding:20}}>
      <h1>Next.js Posts</h1>
      <p>
        Backend API at <code>http://localhost:4000/api</code> &nbsp;|&nbsp;
        <Link href="/posts/new">Create new</Link> &nbsp;|&nbsp;
        <a href="http://localhost:4000/posts" target="_blank" rel="noreferrer">Open EJS version</a>
      </p>
      {posts.length === 0 ? (
        <p>No posts yet</p>
      ) : (
        <ul style={{listStyle:'none', padding:0, display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:12}}>
          {posts.map(p => (
            <li key={p.id} style={{background:'#fff', border:'1px solid #eee', borderRadius:12, padding:12}}>
              <h3><Link href={`/posts/${p.id}`}>{p.title}</Link></h3>
              <p>{(p.body || '').slice(0,120)}...</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
