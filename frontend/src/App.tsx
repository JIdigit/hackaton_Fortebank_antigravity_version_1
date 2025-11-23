import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Activity, FileText, GitMerge, MessageSquare, Shield } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('diagnosis');

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside className="w-64 glass-panel m-4 flex flex-col" style={{ width: '260px', margin: '16px', display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-2xl"
            style={{ color: 'var(--accent-primary)', background: 'transparent' }}>
            forte
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-xl tracking-tight text-[var(--text-primary)]" style={{ lineHeight: '1' }}>Bank</h1>
            <span className="text-[10px] font-bold text-[var(--accent-secondary)] tracking-widest">AGENT</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <NavButton
            active={activeTab === 'diagnosis'}
            onClick={() => setActiveTab('diagnosis')}
            icon={<Activity size={20} />}
            label="Диагностика (A-1)"
          />
          <NavButton
            active={activeTab === 'requirements'}
            onClick={() => setActiveTab('requirements')}
            icon={<FileText size={20} />}
            label="Требования (R-2)"
          />
          <NavButton
            active={activeTab === 'process'}
            onClick={() => setActiveTab('process')}
            icon={<GitMerge size={20} />}
            label="Процессы (P-2)"
          />
        </nav>

        <div className="mt-auto pt-4 border-t border-[var(--border-color)]" style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
            <div className="w-2 h-2 rounded-full bg-green-500" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div>
            Система онлайн
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 m-4 ml-0 glass-panel relative overflow-hidden flex flex-col" style={{ flex: 1, margin: '16px 16px 16px 0', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <header className="h-16 border-b border-[var(--border-color)] flex items-center px-6 justify-between"
          style={{ height: '64px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between' }}>
          <h2 className="font-semibold text-lg">
            {activeTab === 'diagnosis' && 'Диагностика системы и анализ первопричин'}
            {activeTab === 'requirements' && 'Формализация требований'}
            {activeTab === 'process' && 'Оптимизация процессов'}
          </h2>
          <div className="flex gap-4">
            {/* Header actions could go here */}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {activeTab === 'diagnosis' && <DiagnosisView />}
          {activeTab === 'requirements' && <RequirementsView />}
          {activeTab === 'process' && <ProcessView />}
        </div>
      </main>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left
        ${active ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-blue-500/20' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '12px',
        border: 'none',
        background: active ? 'var(--accent-primary)' : 'transparent',
        color: active ? 'white' : 'var(--text-secondary)',
        cursor: 'pointer',
        fontSize: '0.95rem',
        fontWeight: 500
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function DiagnosisView() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResult('');

    try {
      const response = await fetch('http://localhost:8000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Ты - старший бизнес-аналитик в банке. Проанализируй следующий инцидент и предложи 3-5 наиболее вероятных первопричин, используя метод "5 Почему" или "Диаграмма Исикавы". Ответ должен быть на русском языке. Форматируй вывод четко.\n\nИнцидент: ${input}`,
          max_tokens: 1024,
          temperature: 0.3
        }),
      });

      const data = await response.json();
      setResult(data.response);
    } catch (error) {
      console.error('Error:', error);
      setResult('Ошибка: Не удалось подключиться к AI Агенту. Проверьте, что бэкенд запущен.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">Опишите инцидент</h3>
        <p className="text-[var(--text-secondary)]">AI проанализирует ситуацию и предложит первопричины.</p>
      </div>

      <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input-field min-h-[150px] resize-none"
          placeholder="Например: Успешность входа в мобильное приложение снизилась на 15% после последнего развертывания..."
          style={{ minHeight: '150px', resize: 'vertical' }}
        />
        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Анализируем...
              </>
            ) : (
              <>
                <Activity size={18} />
                Анализировать первопричины
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Area */}
      {(result || loading) && (
        <div className="mt-8 p-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-sm">
          <h4 className="font-semibold mb-4 text-[var(--accent-primary)] flex items-center gap-2">
            <Shield size={18} />
            Отчет об анализе
          </h4>
          <div className="prose prose-sm max-w-none text-[var(--text-primary)] leading-relaxed markdown-content">
            {loading ? 'Генерируем гипотезы...' : <ReactMarkdown>{result}</ReactMarkdown>}
          </div>
        </div>
      )}
    </div>
  );
}

function RequirementsView() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai', content: string }>>([
    { role: 'ai', content: 'Привет! Опишите функционал, который вы хотите создать, и я помогу вам формализовать требования в виде User Stories.' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/requirements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_input: userMessage
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Ошибка: Не удалось подключиться к AI Агенту.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-3xl mx-auto" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex flex-col h-[600px]" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
        <div className="flex-1 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] p-4 mb-4 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div key={idx} className="flex gap-4 mb-4" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: msg.role === 'ai' ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {msg.role === 'ai' ? 'AI' : 'U'}
              </div>
              <div
                className="bg-[var(--bg-primary)] p-3 rounded-2xl max-w-[80%] border border-[var(--border-color)] markdown-content"
                style={{
                  background: 'var(--bg-primary)',
                  padding: '12px',
                  borderRadius: '16px',
                  maxWidth: '80%',
                  border: '1px solid var(--border-color)',
                  borderTopLeftRadius: msg.role === 'ai' ? '4px' : '16px',
                  borderTopRightRadius: msg.role === 'user' ? '4px' : '16px'
                }}
              >
                {msg.role === 'ai' ? (
                  <div className="text-sm">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4 mb-4">
              <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white text-xs font-semibold">AI</div>
              <div className="bg-[var(--bg-primary)] p-3 rounded-2xl rounded-tl-none border border-[var(--border-color)]">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            className="input-field"
            placeholder="Введите ваш запрос..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <button
            className="btn-primary p-3 rounded-lg"
            onClick={handleSend}
            disabled={loading}
            style={{ padding: '12px', borderRadius: '8px' }}
          >
            <MessageSquare size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProcessView() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResult('');

    try {
      const response = await fetch('http://localhost:8000/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          process_description: input
        }),
      });

      const data = await response.json();
      setResult(data.response);
    } catch (error) {
      console.error('Error:', error);
      setResult('Ошибка: Не удалось подключиться к AI Агенту. Проверьте, что бэкенд запущен.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="grid grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 className="font-semibold text-lg">Описание процесса</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-field h-[400px]"
            placeholder="Опишите текущий банковский процесс... (например: Процесс онбординга клиентов, Процесс одобрения кредита и т.д.)"
            style={{ height: '400px' }}
          />
        </div>
        <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 className="font-semibold text-lg">Анализ и рекомендации</h3>
          <div className="h-[400px] border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] p-4 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[var(--text-secondary)]">Анализируем процесс...</p>
                </div>
              </div>
            ) : result ? (
              <div className="markdown-content">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-[var(--text-secondary)]">Анализ появится здесь</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          className="btn-primary"
          onClick={handleGenerate}
          disabled={loading || !input.trim()}
        >
          {loading ? 'Анализируем...' : 'Сгенерировать анализ и рекомендации'}
        </button>
      </div>
    </div>
  );
}

export default App;
