import { useState } from 'react';
import { useERP } from '../context/ERPContext';

export default function Inventory() {
  const { inventory, addInventoryItem, deleteInventoryItem, connectionStatus } = useERP();
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Hardware');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [formFeedback, setFormFeedback] = useState(null); // { type: 'success' | 'error', text: '' }

  const resetForm = () => {
    setName('');
    setPrice('');
    setStock('');
    setCategory('Hardware');
  };

  const showFormFeedback = (type, text) => {
    setFormFeedback({ type, text });
    setTimeout(() => setFormFeedback(null), 3000);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!name || !price || !stock) {
      showFormFeedback('error', 'Please fill out all fields.');
      return;
    }

    const itemPrice = parseFloat(price);
    const itemStock = parseInt(stock, 10);

    if (isNaN(itemPrice) || itemPrice <= 0) {
      showFormFeedback('error', 'Price must be a positive number.');
      return;
    }

    if (isNaN(itemStock) || itemStock < 0) {
      showFormFeedback('error', 'Stock count cannot be negative.');
      return;
    }

    const payload = {
      name,
      category,
      price: itemPrice,
      stock: itemStock
    };

    const success = await addInventoryItem(payload);
    if (success) {
      showFormFeedback('success', `Created stock asset successfully!`);
      resetForm();
    } else {
      showFormFeedback('error', 'Unable to record asset on live node.');
    }
  };

  // Filters the inventory items in real-time
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-grid">
      {/* Left Form Panel */}
      <aside className="sidebar-panel">
        <div className="glass-card">
          <h3 className="panel-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Register New SKU
          </h3>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Submit new parts, server elements, or licenses below. {connectionStatus === 'connected' ? (
              <span style={{ color: 'var(--accent-emerald)', fontWeight: '600' }}>Live Database Active.</span>
            ) : (
              <span style={{ color: 'var(--accent-cyan)', fontWeight: '600' }}>Running locally in sandbox.</span>
            )}
          </p>
          
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label htmlFor="itemName">Item / SKU Name</label>
              <input 
                type="text" 
                id="itemName"
                className="form-control"
                placeholder="e.g. Optic Transceiver Module"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="itemCategory">Category</label>
              <select 
                id="itemCategory"
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Hardware">Hardware</option>
                <option value="Software License">Software License</option>
                <option value="Subscription">Subscription</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Networking">Networking</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="itemPrice">Price ($)</label>
                <input 
                  type="number" 
                  id="itemPrice"
                  className="form-control"
                  placeholder="299.99"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="itemStock">Stock Units</label>
                <input 
                  type="number" 
                  id="itemStock"
                  className="form-control"
                  placeholder="15"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>

            {formFeedback && (
              <div style={{
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                marginBottom: '1rem',
                fontWeight: '600',
                textAlign: 'center',
                background: formFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                color: formFeedback.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                border: formFeedback.type === 'success' ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(244, 63, 94, 0.25)'
              }}>
                {formFeedback.text}
              </div>
            )}

            <button type="submit" className="btn-primary">
              Register Stock SKU
            </button>
          </form>
        </div>
      </aside>

      {/* Right Data Table Panel */}
      <main className="main-panel">
        <div className="glass-card" style={{ flexGrow: 1, minHeight: '450px', display: 'flex', flexDirection: 'column' }}>
          <div className="table-header-container">
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '6px' }}><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path></svg>
              Inventory Resource Matrix
            </h2>
            
            <input 
              type="text"
              placeholder="🔍 Search SKU or Category..."
              className="form-control search-bar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="table-responsive" style={{ flexGrow: 1 }}>
            <table className="erp-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>Asset Name</th>
                  <th>Category</th>
                  <th>Price ($)</th>
                  <th>Available Stock</th>
                  <th style={{ textAlign: 'right', width: '100px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No stock assets match the query.
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map(item => (
                    <tr key={item.id}>
                      <td className="item-id">#{item.id.replace('_local', '')}</td>
                      <td className="item-name">{item.name}</td>
                      <td><span className="category-badge">{item.category}</span></td>
                      <td style={{ fontWeight: '600' }}>${item.price.toFixed(2)}</td>
                      <td>
                        <div className={`stock-status ${item.stock > 10 ? 'in-stock' : 'low-stock'}`}>
                          <div className="stock-dot"></div>
                          {item.stock} units {item.stock <= 10 && '(Low Alert)'}
                        </div>
                      </td>
                      <td className="action-cell">
                        <button 
                          className="btn-delete"
                          onClick={() => deleteInventoryItem(item.id, item.name)}
                          title="Permanently remove asset record"
                        >
                          Purge
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
