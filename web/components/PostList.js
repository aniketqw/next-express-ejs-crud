// import Link from 'next/link';
// export default function PostList({posts=[]}){
//     if (!posts.length) return <p>No posts yet.</p>;
//
//     return (
//         <ul>
//             {posts.map(p => (
//                 <li key={p.id} style={{ marginBottom: 8 }}>
//                     <Link href={`/posts/${p.id}`}>{p.title}</Link>
//                 </li>
//             ))}
//         </ul>
//     );
// }
import Link from "next/link";

export default function PostList({ posts = [] }) {
    if (!posts.length) return <p style={{ color: "#666" }}>No posts yet.</p>;

    return (
        <ul
            style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 16,
            }}
        >
            {posts.map((p) => (
                <li
                    key={p.id}
                    style={{
                        background: "#fff",
                        border: "1px solid #e5e5e5",
                        borderRadius: 12,
                        padding: 16,
                        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                        transition: "transform 0.15s ease",
                    }}
                >
                    <h3 style={{ marginTop: 0, fontSize: "1.1rem" }}>
                        <Link
                            href={`/posts/${p.id}`}
                            style={{ textDecoration: "none", color: "#0070f3" }}
                        >
                            {p.title}
                        </Link>
                    </h3>
                    <p style={{ color: "#555", fontSize: "0.9rem" }}>
                        {(p.body || "").slice(0, 100)}…
                    </p>
                </li>
            ))}
        </ul>
    );
}
