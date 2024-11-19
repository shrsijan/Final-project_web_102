import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../supabase';

const PostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editedContent, setEditedContent] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
            if (error) {
                console.error('Error fetching post:', error.message);
            } else {
                setPost(data);
                setEditedContent(data.content || '');
            }
        };

        const fetchComments = async () => {
            const { data, error } = await supabase.from('comments').select('*').eq('post_id', id);
            if (error) {
                console.error('Error fetching comments:', error.message);
            } else {
                setComments(data);
            }
        };

        fetchPost();
        fetchComments();
    }, [id]);

    const handleUpvote = async () => {
        if (!post) return;

        const { error } = await supabase
            .from('posts')
            .update({ upvotes: (post.upvotes || 0) + 1 })
            .eq('id', id);

        if (error) {
            console.error('Error upvoting post:', error.message);
        } else {
            setPost((prev) => ({ ...prev, upvotes: (prev.upvotes || 0) + 1 }));
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        if (!newComment.trim()) return;

        const { error } = await supabase
            .from('comments')
            .insert([{ post_id: id, content: newComment }]);

        if (error) {
            console.error('Error adding comment:', error.message);
        } else {
            alert('Comment added successfully!');
            window.location.href = '/'; // Redirect to the home page after adding the comment
        }
    };

    const handleDeletePost = async () => {
        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (error) {
            console.error('Error deleting post:', error.message);
        } else {
            alert('Post deleted successfully');
            navigate('/');
        }
    };

    const handleSaveEdit = async () => {
        const { error } = await supabase.from('posts').update({ content: editedContent }).eq('id', id);
        if (error) {
            console.error('Error editing post:', error.message);
        } else {
            setPost((prev) => ({ ...prev, content: editedContent }));
            setEditMode(false); // Exit edit mode
        }
    };

    return (
        <main className="post-page">
            {post && (
                <>
                    <h1>{post.title}</h1>
                    {post.image_url && <img src={post.image_url} alt={post.title} />}
                    {!editMode ? (
                        <p>{post.content}</p>
                    ) : (
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                        />
                    )}
                    <button onClick={handleUpvote}>👍 Upvote ({post.upvotes || 0})</button>
                    {editMode ? (
                        <button onClick={handleSaveEdit}>Save</button>
                    ) : (
                        <button onClick={() => setEditMode(true)}>Edit</button>
                    )}
                    <button onClick={handleDeletePost}>Delete</button>
                </>
            )}

            <div className="comments-section">
                <h3>Comments</h3>
                {comments.map((comment) => (
                    <p key={comment.id}>{comment.content}</p>
                ))}
                <form onSubmit={handleAddComment}>
                    <textarea
                        value={newComment}
                        placeholder="Add a comment..."
                        onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <button type="submit">Post Comment</button>
                </form>
            </div>
        </main>
    );
};

export default PostPage;
