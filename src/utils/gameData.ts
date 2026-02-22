
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

export const READING_PASSAGE = `Artificial intelligence, or AI, is the development of computer systems that can carry out tasks that normally require human intelligence, such as interpretation and decision-making. Using complex mathematical rules called algorithms, AI enables machines to process large amounts of information and imitate real human brain functions. The amazing accuracy and efficiency of AI have resulted in its widespread use in a variety of areas, and there are already a number of different applications for the technology.

Nowadays, AI-powered robots are becoming increasingly common. Industrial robots, for instance, are widely used to perform tasks related to manufacturing like painting and product assembly. Experts have said that these robots are designed to work with a high level of accuracy and speed, which improves productivity in factories. There are also AI-equipped rescue robots that can be used to help save lives in emergency situations. These machines can make intelligent choices to avoid obstacles in dangerous environments. This makes them perfect for use in disaster zones.

At the same time, AI is also being used to power gadgets that help us in our daily lives. Private digital assistants, for example, can understand and respond to users' voice commands, which makes them useful for simple tasks like looking up information online and scheduling appointments. AI-powered navigation apps can use real-time data processing to help us find the quickest and most efficient routes to our destinations when we are travelling. A diet tracker is another type of AI application that can provide users with nutrition recommendations based on their specific needs. In this way, AI is changing our routines and personal habits.

AI is a rapidly developing technology that is not only transforming industries but also changing our daily lives and doing tasks that used to be considered impossible for machines. In the years to come, we can surely expect more innovative and amazing AI applications.`;

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
];

export const QUESTIONS: Question[] = [
    // Stage 1 - MCQ
    {
        id: 'q1',
        type: 'mcq',
        question: 'According to paragraph 1, what can AI do?',
        options: [
            'It can perform tasks that require it to make choices.',
            'It can produce complex mathematical rules.',
            'It can interpret real human brain functions.',
            'It can create applications for different technologies.'
        ],
        answer: 'It can perform tasks that require it to make choices.'
    },
    // Stage 2 - TFD
    {
        id: 'q2',
        type: 'tfd',
        question: 'AI is widely used because it can process large amounts of data and imitate human brain functions.',
        options: ['True', 'False'],
        answer: 'True'
    },
    // Stage 3 - TFD
    {
        id: 'q3',
        type: 'tfd',
        question: 'Industrial robots are mainly designed to help people with their daily household chores.',
        options: ['True', 'False'],
        answer: 'False'
    },
    // Stage 4 - TFD
    {
        id: 'q4',
        type: 'tfd',
        question: 'The high speed and accuracy of AI-powered robots help to improve productivity in factories.',
        options: ['True', 'False'],
        answer: 'True'
    },
    // Stage 5 - TFD
    {
        id: 'q5',
        type: 'tfd',
        question: 'Rescue robots are unable to make their own choices when they meet obstacles.',
        options: ['True', 'False'],
        answer: 'False'
    },
    // Stage 6 - MCQ
    {
        id: 'q6',
        type: 'mcq',
        question: 'What does the word "them" in paragraph 2 refer to?',
        options: ['choices', 'machines', 'obstacles', 'environments'],
        answer: 'machines'
    },
    // Stage 7 - TFD
    {
        id: 'q7',
        type: 'tfd',
        question: 'AI gadgets like digital assistants, navigation apps, and diet trackers are changing our personal habits.',
        options: ['True', 'False'],
        answer: 'True'
    },
    // Stage 8 - MCQ
    {
        id: 'q8',
        type: 'mcq',
        question: 'According to paragraph 3, which of the following is TRUE?',
        options: [
            'Navigation apps can recognise human speech.',
            'Diet tracker apps can help users to search for different sources of information.',
            'Digital assistant apps can provide specific, personalised advice for individual users.',
            'Navigation apps can process and update information to provide the best directions.'
        ],
        answer: 'Navigation apps can process and update information to provide the best directions.'
    },
    // Stage 9 - MCQ
    {
        id: 'q9',
        type: 'mcq',
        question: 'What can be inferred from the last paragraph of the text?',
        options: [
            'There is a limited number of AI applications in the present day.',
            'There will be more AI applications in daily life than in industries.',
            'Applications that make use of AI are being developed at a rapid pace.',
            'The next applications for AI technology are easy to predict.'
        ],
        answer: 'Applications that make use of AI are being developed at a rapid pace.'
    }
];

// Return questions in fixed stage order
export const getRandomQuestions = (): Question[] => {
    return [...QUESTIONS];
};

