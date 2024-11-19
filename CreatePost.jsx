import { useState } from 'react';
import supabase from '../supabase';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleCreatePost = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('Title is required');
            return;
        }

        const { error } = await supabase.from('posts').insert([
            {
                title,
                content,
                image_url: imageUrl,
            },
        ]);

        if (error) {
            console.error('Error creating post:', error.message);
        } else {
            alert('Post created successfully!');
            setTitle('');
            setContent('');
            setImageUrl('');
            window.location.href = '/'; // Redirect to home
        }
    };

    return (
        <main className="create-post">
            <h2>Create a New Post</h2>
            <form onSubmit={handleCreatePost}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Content (Optional)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <input
                    type="text"
                    placeholder="Image URL (Optional)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
                <button type="submit">Create Post</button>
            </form>
        </main>
    );
};

export default CreatePost;
