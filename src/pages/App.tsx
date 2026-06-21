import { useState } from 'react';
import { Plus, Play, BookOpen, Search, Brain } from 'lucide-react';
import { Button, Modal, Skeleton } from '../components/ui';
import { QuestionForm } from '../components/QuestionForm';
import { QuestionCard } from '../components/QuestionCard';
import { QuizMode } from '../components/QuizMode';
import { useToast } from '../components/ui';
import { useQuestions, useCreateQuestion } from '../hooks/useQuestions';

type View = 'manage' | 'quiz';

export default function App() {
  const [view, setView] = useState<View>('manage');
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const { data: questions, isLoading } = useQuestions();

  const createMutation = useCreateQuestion({
    onSuccess: () => { toast('Question created!'); setCreateOpen(false); },
    onError: (msg) => toast(msg, 'error'),
  });

  const filtered = questions?.filter((q) =>
    q.question_text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
  
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 py-10">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--accent)', boxShadow: '0 0 20px var(--accent-glow)' }}
            >
              <Brain size={18} color="white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Quiznip</h1>
          </div>
          <p className="text-sm text-(--muted) ml-12">Build and play interactive quizzes</p>
        </header>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-(--surface) border border-(--border) mb-8 w-fit">
          <button
            onClick={() => setView('manage')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              view === 'manage'
                ? 'bg-(--accent) text-white shadow-[0_0_12px_var(--accent-glow)]'
                : 'text-(--muted) hover:text-(--text)'
            }`}
          >
            <BookOpen size={14} /> Manage
          </button>
          <button
            onClick={() => setView('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              view === 'quiz'
                ? 'bg-(--accent) text-white shadow-[0_0_12px_var(--accent-glow)]'
                : 'text-(--muted) hover:text-(--text)'
            }`}
          >
            <Play size={14} /> Play Quiz
          </button>
        </div>

        {/* Manage view */}
        {view === 'manage' && (
          <div className="animate-fade-in">
            {/* Toolbar */}
            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted)" />
                <input
                  className="w-full bg-(--surface) border border-(--border) rounded-lg pl-9 pr-4 py-2.5 text-sm text-(--text) placeholder:text-(--muted) outline-none focus:border-(--accent) transition-colors"
                  placeholder="Search questions…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button onClick={() => setCreateOpen(true)} size="md">
                <Plus size={15} /> New Question
              </Button>
            </div>

            {questions && questions.length > 0 && (
              <div className="flex gap-4 mb-6">
                <div className="px-4 py-3 rounded-xl border border-(--border) bg-(--surface) text-center flex-1">
                  <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{questions.length}</p>
                  <p className="text-xs text-(--muted) mt-0.5">Questions</p>
                </div>
                <div
                  className="flex-1 px-4 py-3 rounded-xl border text-center cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ background: 'var(--accent)', borderColor: 'var(--accent)' }}
                  onClick={() => setView('quiz')}
                >
                  <p className="text-2xl font-bold text-white">Play</p>
                  <p className="text-xs text-white/70 mt-0.5">Start quiz</p>
                </div>
              </div>
            )}

            {/* Questions list */}
            {isLoading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : filtered?.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-(--border) rounded-2xl">
                {search ? (
                  <p className="text-(--muted) text-sm">No questions match "{search}"</p>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-(--surface-2) flex items-center justify-center">
                      <BookOpen size={20} style={{ color: 'var(--muted)' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-(--text)">No questions yet</p>
                      <p className="text-sm text-(--muted) mt-1">Add your first question to get started</p>
                    </div>
                    <Button onClick={() => setCreateOpen(true)} size="sm">
                      <Plus size={14} /> Add Question
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered?.map((q, i) => (
                  <QuestionCard key={q.id} question={q} index={i} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quiz view */}
        {view === 'quiz' && (
          <QuizMode onExit={() => setView('manage')} />
        )}
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Question" maxWidth="max-w-2xl">
        <QuestionForm
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setCreateOpen(false)}
          loading={createMutation.isPending}
        />
      </Modal>
    </div>
  );
}
