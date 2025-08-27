import { useState, useEffect } from 'react';
import { questionsAPI } from '../lib/api';

export default function QuestionsManager() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const response = await questionsAPI.getAll();
      setQuestions(response.data);
    } catch (error) {
      console.error('Error loading questions:', error);
      alert('Ошибка загрузки вопросов');
    } finally {
      setLoading(false);
    }
  };

  const updateAnswer = async (id, answer) => {
    try {
      await questionsAPI.update(id, { answer });
      setQuestions(questions.map(q => q.id === id ? { ...q, answer } : q));
      setEditingQuestion(null);
      alert('Ответ сохранен');
    } catch (error) {
      console.error('Error updating question:', error);
      alert('Ошибка сохранения ответа');
    }
  };

  const deleteQuestion = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этот вопрос?')) return;
    
    try {
      await questionsAPI.delete(id);
      setQuestions(questions.filter(q => q.id !== id));
      alert('Вопрос удален');
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Ошибка удаления вопроса');
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Управление вопросами</h2>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Вопрос</th>
            <th>Ответ</th>
            <th>Дата создания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.id}>
              <td>{question.id}</td>
              <td>{question.question}</td>
              <td>
                {editingQuestion === question.id ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <textarea
                      defaultValue={question.answer || ''}
                      ref={ref => ref && ref.focus()}
                      style={{ padding: '8px', flex: 1 }}
                      rows="3"
                    />
                    <button onClick={(e) => {
                      const answer = e.target.previousSibling.value;
                      updateAnswer(question.id, answer);
                    }}>
                      Сохранить
                    </button>
                    <button onClick={() => setEditingQuestion(null)}>Отмена</button>
                  </div>
                ) : (
                  <div>
                    {question.answer || 'Нет ответа'}
                    <button 
                      onClick={() => setEditingQuestion(question.id)}
                      style={{ marginLeft: '10px' }}
                    >
                      {question.answer ? 'Изменить' : 'Добавить ответ'}
                    </button>
                  </div>
                )}
              </td>
              <td>{new Date(question.created_at).toLocaleDateString()}</td>
              <td>
                <button onClick={() => deleteQuestion(question.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}