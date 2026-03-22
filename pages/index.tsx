import React from 'react';
import { motion } from 'framer-motion';

const LandingPage = ({ posts }) => {
    return (
        <div>
            <h1>Welcome to Our Blog</h1>
            <div className="post-list">
                {posts.map((post) => (
                    <motion.div key={post.id} className="post" exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <img src={post.image} alt={post.title} />
                        <h2>{post.title}</h2>
                        <p>{post.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default LandingPage;