import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../supabase';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [sortOrder, setSortOrder] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            let query = supabase.from('posts').select('*');
            if (sortOrder === 'popular') {
                query = query.order('upvotes', { ascending: false });
            } else {
                query = query.order('created_at', { ascending: false });
            }

            if (searchQuery) {
                query = query.ilike('title', `%${searchQuery}%`);
            }

            const { data, error } = await query;
            if (error) {
                console.error('Error fetching posts:', error.message);
            } else {
                setPosts(data);
            }
        };

        fetchPosts();
    }, [sortOrder, searchQuery]);

    const handleLike = async (id, currentLikes) => {
        const { error } = await supabase
            .from('posts')
            .update({ upvotes: currentLikes + 1 })
            .eq('id', id);

        if (error) {
            console.error('Error liking post:', error.message);
        } else {
            setPosts((prev) =>
                prev.map((post) =>
                    post.id === id ? { ...post, upvotes: currentLikes + 1 } : post
                )
            );
        }
    };

    return (
        <main className="home-feed">
            <div className="search-sort">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="sorting-options">
                    <span>Order by:</span>
                    <button
                        onClick={() => setSortOrder('newest')}
                        className={sortOrder === 'newest' ? 'active' : ''}
                    >
                        Newest
                    </button>
                    <button
                        onClick={() => setSortOrder('popular')}
                        className={sortOrder === 'popular' ? 'active' : ''}
                    >
                        Most Popular
                    </button>
                </div>
            </div>

            <div className="posts">
                {posts.map((post) => (
                    <div key={post.id} className="post">
                        <Link to={`/post/${post.id}`}>
                            <h3>{post.title}</h3>
                        </Link>
                        <p>{new Date(post.created_at).toLocaleString()}</p>
                        <p>
                            <button onClick={() => handleLike(post.id, post.upvotes || 0)}>
                                👍 Like ({post.upvotes || 0})
                            </button>
                        </p>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default Home;
