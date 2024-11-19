import { useEffect, useState } from 'react';
import supabase from '../supabase';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchProfileData = async () => {
            // Get the logged-in user's ID
            const { data: user, error: userError } = await supabase.auth.getUser();
            if (userError) {
                console.error('Error fetching user:', userError.message);
                return;
            }

            const userId = user?.id;

            // Fetch the user's profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (profileError) {
                console.error('Error fetching profile:', profileError.message);
                return;
            }

            setProfile(profileData);

            // Fetch the user's posts
            const { data: postsData, error: postsError } = await supabase
                .from('posts')
                .select('*')
                .eq('profile_id', userId);

            if (postsError) {
                console.error('Error fetching posts:', postsError.message);
                return;
            }

            setPosts(postsData);

            // Fetch the user's comments
            const { data: commentsData, error: commentsError } = await supabase
                .from('comments')
                .select('*')
                .eq('profile_id', userId);

            if (commentsError) {
                console.error('Error fetching comments:', commentsError.message);
                return;
            }

            setComments(commentsData);
        };

        fetchProfileData();
    }, []);

    return (
        <div className="profile-page">
            {profile && (
                <>
                    <h2>{profile.username}</h2>
                    <img src={profile.avatar_url || 'default-avatar.png'} alt="Avatar" width="100" />
                    <p>Joined: {new Date(profile.created_at).toLocaleDateString()}</p>
                </>
            )}

            <h3>Your Posts</h3>
            {posts.length > 0 ? (
                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>{post.content}</li>
                    ))}
                </ul>
            ) : (
                <p>No posts yet.</p>
            )}

            <h3>Your Comments</h3>
            {comments.length > 0 ? (
                <ul>
                    {comments.map((comment) => (
                        <li key={comment.id}>{comment.content}</li>
                    ))}
                </ul>
            ) : (
                <p>No comments yet.</p>
            )}
        </div>
    );
};

export default Profile;
