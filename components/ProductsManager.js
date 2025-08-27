import { useState, useEffect } from 'react';
import { productsAPI } from '../lib/api';
import ProductForm from './ProductForm';

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
      alert('Ошибка загрузки товаров');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;
    
    try {
      await productsAPI.delete(id);
      setProducts(products.filter(p => p.id !== id));
      alert('Товар удален');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Ошибка удаления товара');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
    loadProducts();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Управление товарами</h2>
        <button onClick={() => setShowForm(true)}>Добавить товар</button>
      </div>

      {showForm && (
        <ProductForm 
          product={editingProduct} 
          onClose={handleFormClose} 
          onSave={loadProducts}
        />
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Цена</th>
            <th>Местоположение</th>
            <th>Категория</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price} руб.</td>
              <td>{product.location}</td>
              <td>{product.category_id}</td>
              <td>
                <button onClick={() => handleEdit(product)}>Редактировать</button>
                <button onClick={() => deleteProduct(product.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        
        .data-table th,
        .data-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        
        .data-table th {
          background-color: #f4f4f4;
        }
        
        .data-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }
      `}</style>
    </div>
  );
}