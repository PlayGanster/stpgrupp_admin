import { useState } from 'react';
import ProductsManager from './ProductsManager';
import CategoriesManager from './CategoriesManager';
import NewsManager from './NewsManager';
import ReviewsManager from './ReviewsManager';
import QuestionsManager from './QuestionsManager';
import ReelsManager from './ReelsManager';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('products');

  const tabs = [
    { id: 'products', label: 'Товары' },
    { id: 'categories', label: 'Категории' },
    { id: 'news', label: 'Новости' },
    { id: 'reviews', label: 'Отзывы' },
    { id: 'questions', label: 'Вопросы' },
    { id: 'reels', label: 'Reels' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductsManager />;
      case 'categories':
        return <CategoriesManager />;
      case 'news':
        return <NewsManager />;
      case 'reviews':
        return <ReviewsManager />;
      case 'questions':
        return <QuestionsManager />;
      case 'reels':
        return <ReelsManager />;
      default:
        return <ProductsManager />;
    }
  };

  return (
    <div className="admin-panel">
      <h1>Админ-панель</h1>
      
      <nav className="admin-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'active' : ''}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="admin-content">
        {renderContent()}
      </div>

      <style jsx>{`
        .admin-panel {
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        .admin-nav {
          margin-bottom: 20px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .admin-nav button {
          padding: 10px 20px;
          border: 1px solid #ccc;
          background: white;
          cursor: pointer;
          border-radius: 4px;
        }
        
        .admin-nav button.active {
          background: #0070f3;
          color: white;
          border-color: #0070f3;
        }
        
        .admin-content {
          border: 1px solid #ddd;
          padding: 20px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}