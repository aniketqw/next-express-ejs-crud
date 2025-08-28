import Link from 'next/link';
export default function PostList({posts=[]}){
    if (!posts.length) return <p>No posts yet.</p>;

    return (
        <ul>
            {posts.map(p => (
                <li key={p.id} style={{ marginBottom: 8 }}>
                    <Link href={`/posts/${p.id}`}>{p.title}</Link>
                </li>
            ))}
        </ul>
    );
}