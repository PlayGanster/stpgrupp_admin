import { useState, useEffect } from 'react';
import { newsAPI } from '../lib/api';

export default function NewsManager() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    image: '', 
    description: '', 
    date: new Date().toISOString().split('T')[0] 
  });

  const loadNews = async () => {
    setLoading(true);
    try {
      const response = await newsAPI.getAll();
      setNews(response.data);
    } catch (error) {
      console.error('Error loading news:', error);
      alert('Ошибка загрузки новостей');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await newsAPI.create(formData);
      setShowForm(false);
      setFormData({ image: '', description: '', date: new Date().toISOString().split('T')[0] });
      loadNews();
      alert('Новость создана');
    } catch (error) {
      console.error('Error creating news:', error);
      alert('Ошибка создания новости');
    }
  };

  const deleteNews = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить эту новость?')) return;
    
    try {
      await newsAPI.delete(id);
      setNews(news.filter(n => n.id !== id));
      alert('Новость удалена');
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('Ошибка удаления новости');
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Управление новостями</h2>
        <button onClick={() => setShowForm(true)}>Добавить новость</button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h3>Новая новость</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label>URL изображения:</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
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
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {news.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                {item.image && (
                  <img 
                    src={item.image} 
                    alt="News" 
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                )}
              </td>
              <td>{item.description?.substring(0, 100)}...</td>
              <td>{item.date}</td>
              <td>
                <button onClick={() => deleteNews(item.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}