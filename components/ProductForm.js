import { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../lib/api';

export default function ProductForm({ product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    location: '',
    category_id: '',
    images: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        location: product.location || '',
        category_id: product.category_id || '',
        images: product.images || ''
      });
    }
  }, [product]);

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (product) {
        await productsAPI.update(product.id, formData);
        alert('Товар обновлен');
      } else {
        await productsAPI.create(formData);
        alert('Товар создан');
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Ошибка сохранения товара');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{product ? 'Редактировать' : 'Добавить'} товар</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Описание:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Цена:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Местоположение:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Категория:</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
            >
              <option value="">Выберите категорию</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Изображения (URL через запятую):</label>
            <input
              type="text"
              name="images"
              value={formData.images}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose}>Отмена</button>
            <button type="submit" disabled={loading}>
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          
          .modal {
            background: white;
            padding: 20px;
            border-radius: 8px;
            width: 500px;
            max-width: 90%;
          }
          
          .form-group {
            margin-bottom: 15px;
          }
          
          .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
          }
          
          .form-group input,
          .form-group textarea,
          .form-group select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          
          .form-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 20px;
          }
        `}</style>
      </div>
    </div>
  );
}