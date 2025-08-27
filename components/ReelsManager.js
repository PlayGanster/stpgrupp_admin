import { useState, useEffect } from 'react';
import { reelsAPI, productsAPI } from '../lib/api';

export default function ReelsManager() {
  const [reels, setReels] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    image: '', 
    description: '', 
    date: new Date().toISOString().split('T')[0],
    product_id: ''
  });

  const loadReels = async () => {
    setLoading(true);
    try {
      const response = await reelsAPI.getAll();
      setReels(response.data);
    } catch (error) {
      console.error('Error loading reels:', error);
      alert('Ошибка загрузки reels');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await reelsAPI.create(formData);
      setShowForm(false);
      setFormData({ 
        image: '', 
        description: '', 
        date: new Date().toISOString().split('T')[0],
        product_id: ''
      });
      loadReels();
      alert('Reel создан');
    } catch (error) {
      console.error('Error creating reel:', error);
      alert('Ошибка создания reel');
    }
  };

  const deleteReel = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этот reel?')) return;
    
    try {
      await reelsAPI.delete(id);
      setReels(reels.filter(r => r.id !== id));
      alert('Reel удален');
    } catch (error) {
      console.error('Error deleting reel:', error);
      alert('Ошибка удаления reel');
    }
  };

  useEffect(() => {
    loadReels();
    loadProducts();
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Управление Reels</h2>
        <button onClick={() => setShowForm(true)}>Добавить Reel</button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h3>Новый Reel</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label>URL изображения:</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <div>
              <label>Описание:</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="4"
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <div>
              <label>Дата:</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                style={{ padding: '8px' }}
              />
            </div>
            <div>
              <label>Товар:</label>
              <select
                value={formData.product_id}
                onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                style={{ padding: '8px', width: '100%' }}
              >
                <option value="">Выберите товар (опционально)</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit">Создать</button>
              <button type="button" onClick={() => setShowForm(false)}>Отмена</button>
            </div>
          </form>
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Изображение</th>
            <th>Описание</th>
            <th>Дата</th>
            <th>Товар</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {reels.map((reel) => (
            <tr key={reel.id}>
              <td>{reel.id}</td>
              <td>
                {reel.image && (
                  <img 
                    src={reel.image} 
                    alt="Reel" 
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                )}
              </td>
              <td>{reel.description?.substring(0, 100)}...</td>
              <td>{reel.date}</td>
              <td>{reel.product_id}</td>
              <td>
                <button onClick={() => deleteReel(reel.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}