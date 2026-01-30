import React from 'react';

export default function ManageBlogsPage() {
  const blogs = [
    { id: 1, title: 'Top 10 Valorant Accounts for Sale', author: 'S. Smith', date: 'Oct 24, 2023', status: 'Published' },
    { id: 2, title: 'How to Secure Your New Account', author: 'S. Smith', date: 'Oct 20, 2023', status: 'Draft' },
    { id: 3, title: 'November Discount Event', author: 'J. Doe', date: 'Oct 15, 2023', status: 'Published' },
  ];

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Manage Blogs</h1>
        <button style={{
          backgroundColor: '#8B5CF6',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          border: 'none',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Create Post
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Search posts..."
          style={{
            flex: 1,
            padding: '0.75rem',
            border: '1px solid #D1D5DB',
            borderRadius: '8px'
          }}
        />
        <select style={{ padding: '0.75rem', border: '1px solid #D1D5DB', borderRadius: '8px' }}>
          <option>All Statuses</option>
          <option>Published</option>
          <option>Draft</option>
        </select>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {blogs.map(blog => (
          <div key={blog.id} style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{blog.title}</h3>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                By {blog.author} • {blog.date}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{
                background: blog.status === 'Published' ? '#DCFCE7' : '#F3F4F6',
                color: blog.status === 'Published' ? '#15803D' : '#374151',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                {blog.status}
              </span>
              <button style={{ color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
