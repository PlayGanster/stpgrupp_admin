import { useState, useEffect } from 'react';
import { categoriesAPI } from '../lib/api';

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    slug: '', 
    image: null 
  });
  const [imagePreview, setImagePreview] = useState(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
      alert('Ошибка загрузки категорий');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      
      // Создаем превью изображения
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Создаем FormData для отправки файла
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('slug', formData.slug);
    if (formData.image) {
      submitData.append('image', formData.image);
    }

    try {
      await categoriesAPI.create(submitData);
      setShowForm(false);
      setFormData({ name: '', slug: '', image: null });
      setImagePreview(null);
      loadCategories();
      alert('Категория создана');
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Ошибка создания категории');
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить эту категорию?')) return;
    
    try {
      await categoriesAPI.delete(id);
      setCategories(categories.filter(c => c.id !== id));
      alert('Категория удалена');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Ошибка удаления категории');
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setFormData({ name: '', slug: '', image: null });
    setImagePreview(null);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Управление категориями</h2>
        <button onClick={() => setShowForm(true)}>Добавить категорию</button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h3>Новая категория</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <div>
                <label>Название:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ padding: '8px' }}
                />
              </div>
              <div>
                <label>Slug:</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  style={{ padding: '8px' }}
                />
              </div>
            </div>
            
            <div>
              <label>Изображение категории:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ padding: '8px' }}
              />
              {imagePreview && (
                <div style={{ marginTop: '10px' }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '200px', 
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }} 
                  />
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit">Создать</button>
              <button type="button" onClick={cancelForm}>Отмена</button>
            </div>
          </form>
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Slug</th>
            <th>Изображение</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>{category.slug}</td>
              <td>
                {category.image && (
                  <img 
                    src={category.image} 
                    alt={category.name}
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }} 
                  />
                )}
              </td>
              <td>
                <button onClick={() => deleteCategory(category.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}