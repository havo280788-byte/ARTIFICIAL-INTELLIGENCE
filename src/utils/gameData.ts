
export interface Question {
    id: string;
    type: 'mcq' | 'tfd';
    question: string;
    options?: string[];
    answer: string;
}

export interface Stage {
    id: number;
    name: string;
    icon: string;
}

export const STAGES: Stage[] = [
    { id: 1, name: 'AI Basics', icon: '🔍' },
    { id: 2, name: 'Learning', icon: '🧠' },
    { id: 3, name: 'Data', icon: '📊' },
    { id: 4, name: 'Vision', icon: '👁' },
    { id: 5, name: 'Voice', icon: '🎤' },
    { id: 6, name: 'Tools', icon: '⚙️' },
    { id: 7, name: 'Ethics', icon: '⚖️' },
    { id: 8, name: 'Education', icon: '🎓' },
    { id: 9, name: 'Careers', icon: '💼' },
    { id: 10, name: 'Future', icon: '🚀' },
];

export const QUESTION_POOL: Question[] = [
    // MCQ Questions
    {
        id: 'm1',
        type: 'mcq',
        question: 'What does AI stand for?',
        options: ['Artificial Intelligence', 'Automated Interface', 'Advanced Integration', 'All-around Information'],
        answer: 'Artificial Intelligence'
    },
    {
        id: 'm2',
        type: 'mcq',
        question: 'Which of the following is an example of Machine Learning?',
        options: ['Spam filters in email', 'A simple calculator', 'A manual clock', 'A basic light switch'],
        answer: 'Spam filters in email'
    },
    {
        id: 'm3',
        type: 'mcq',
        question: 'What is "Big Data" refers to?',
        options: ['Extremely large data sets', 'A big hard drive', 'Data stored in a big room', 'High-quality photos'],
        answer: 'Extremely large data sets'
    },
    {
        id: 'm4',
        type: 'mcq',
        question: 'Which AI field focuses on understanding human language?',
        options: ['Natural Language Processing', 'Computer Vision', 'Robotics', 'Quantum Computing'],
        answer: 'Natural Language Processing'
    },
    {
        id: 'm5',
        type: 'mcq',
        question: 'What is a "Neural Network" inspired by?',
        options: ['The human brain', 'A spider web', 'Computer circuitry', 'A social network'],
        answer: 'The human brain'
    },
    // TFD Questions (True/False/Doesn't say)
    {
        id: 't1',
        type: 'tfd',
        question: 'AI will eventually replace all human teachers.',
        options: ['True', 'False', "Doesn't say"],
        answer: 'False'
    },
    {
        id: 't2',
        type: 'tfd',
        question: 'Modern AI can learn and improve on its own without any initial data.',
        options: ['True', 'False', "Doesn't say"],
        answer: 'False'
    },
    {
        id: 't3',
        type: 'tfd',
        question: 'AI Ethics is the study of how to make AI programs faster.',
        options: ['True', 'False', "Doesn't say"],
        answer: 'False'
    },
    {
        id: 't4',
        type: 'tfd',
        question: 'Computer Vision allows AI to "see" and interpret visual information.',
        options: ['True', 'False', "Doesn't say"],
        answer: 'True'
    },
    {
        id: 't5',
        type: 'tfd',
        question: 'The term "Artificial Intelligence" was coined in the 19th century.',
        options: ['True', 'False', "Doesn't say"],
        answer: 'False'
    }
];

// Helper to get 10 random questions (5 MCQ and 5 TFD)
export const getRandomQuestions = () => {
    const mcqs = QUESTION_POOL.filter(q => q.type === 'mcq').sort(() => Math.random() - 0.5);
    const tfds = QUESTION_POOL.filter(q => q.type === 'tfd').sort(() => Math.random() - 0.5);

    // For this example, we take all 5 of each as we have exactly 5 in pool.
    // In a real scenario with more, we'd slice them.
    return [...mcqs.slice(0, 5), ...tfds.slice(0, 5)].sort(() => Math.random() - 0.5);
};
