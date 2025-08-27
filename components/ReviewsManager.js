import { useState, useEffect } from 'react';
import { reviewsAPI, productsAPI } from '../lib/api';

export default function ReviewsManager() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    customer_name: '', 
    description: '', 
    date: new Date().toISOString().split('T')[0],
    product_id: '',
    rating: 5,
    images: ''
  });

  const loadReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewsAPI.getAll();
      setReviews(response.data);
    } catch (error) {
      console.error('Error loading reviews:', error);
      alert('Ошибка загрузки отзывов');
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
      await reviewsAPI.create(formData);
      setShowForm(false);
      setFormData({ 
        customer_name: '', 
        description: '', 
        date: new Date().toISOString().split('T')[0],
        product_id: '',
        rating: 5,
        images: ''
      });
      loadReviews();
      alert('Отзыв создан');
    } catch (error) {
      console.error('Error creating review:', error);
      alert('Ошибка создания отзыва');
    }
  };

  const deleteReview = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) return;
    
    try {
      await reviewsAPI.delete(id);
      setReviews(reviews.filter(r => r.id !== id));
      alert('Отзыв удален');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Ошибка удаления отзыва');
    }
  };

  useEffect(() => {
    loadReviews();
    loadProducts();
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Управление отзывами</h2>
        <button onClick={() => setShowForm(true)}>Добавить отзыв</button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h3>Новый отзыв</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label>Имя клиента:</label>
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
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
                required
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
                <option value="">Выберите товар</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Рейтинг (1-5):</label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                style={{ padding: '8px' }}
              />
            </div>
            <div>
              <label>Изображения (URL через запятую):</label>
              <input
                type="text"
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                style={{ width: '100%', padding: '8px' }}
              />
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
            <th>Клиент</th>
            <th>Описание</th>
            <th>Рейтинг</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id}>
              <td>{review.id}</td>
              <td>{review.customer_name}</td>
              <td>{review.description?.substring(0, 100)}...</td>
              <td>{'★'.repeat(review.rating)}</td>
              <td>{review.date}</td>
              <td>
                <button onClick={() => deleteReview(review.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}