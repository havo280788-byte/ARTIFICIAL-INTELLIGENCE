
export interface MatchingItem {
    id: string;
    image: string;
    word1: string;
    word2: string;
}

export interface Stage {
    id: number;
    name: string;
    icon: string;
}

export interface Question {
    id: string;
    question: string;
    options?: string[];
    answer: string;
    type?: string;
}

export const READING_PASSAGE = `Artificial Intelligence (AI) is the intelligence of machines or software, as opposed to the intelligence of humans or animals. It is a field of study in computer science that develops and studies intelligent machines. Such machines may be called AIs.

AI technology is widely used throughout industry, government, and science. Some high-profile applications are: advanced web search engines (e.g., Google Search), recommendation systems (used by YouTube, Amazon, and Netflix), understanding human speech (such as Siri and Alexa), self-driving cars (e.g., Waymo), generative or creative tools (ChatGPT and AI art), and playing games at the highest level (such as chess and Go).

Many AI developers are concerned about the risks of AI. They worry that AI could be used to create deepfakes to influence elections, or that it could lead to job losses as machines replace human workers. However, many people also believe that AI can be used for good, such as helping to solve climate change or improving healthcare.

In the future, AI is likely to become even more advanced. It may be used to create new types of robots that can help us in our daily lives, or to develop new treatments for diseases. The possibilities are endless, but it is important to use AI responsibly and to consider the potential risks.`;

export const QUESTIONS: Question[] = [
    {
        id: 'q1',
        question: 'What is Artificial Intelligence (AI)?',
        options: ['The intelligence of machines or software', 'The intelligence of humans', 'A type of hardware', 'A new search engine'],
        answer: 'The intelligence of machines or software',
        type: 'mcq'
    },
    {
        id: 'q2',
        question: 'Which of the following is NOT a high-profile application of AI mentioned?',
        options: ['Google Search', 'Netflix recommendations', 'Waymo self-driving cars', 'Traditional calculators'],
        answer: 'Traditional calculators',
        type: 'mcq'
    },
    {
        id: 'q3',
        question: 'What are some concerns many AI developers have?',
        options: ['AI is too expensive', 'Deepfakes and job losses', 'AI is not intelligent enough', 'AI takes too long to develop'],
        answer: 'Deepfakes and job losses',
        type: 'mcq'
    },
    {
        id: 'q4',
        question: 'According to the passage, how can AI be used for good?',
        options: ['Playing games', 'Solving climate change', 'Creating art', 'Generating text'],
        answer: 'Solving climate change',
        type: 'mcq'
    },
    {
        id: 'q5',
        question: 'What is likely to happen to AI in the future?',
        options: ['It will disappear', 'It will become even more advanced', 'It will be used only for games', 'It will be banned'],
        answer: 'It will become even more advanced',
        type: 'mcq'
    },
    {
        id: 'q6',
        question: 'What does the passage say is important when using AI?',
        options: ['Using it as much as possible', 'Using it for profit', 'Using it responsibly', 'Using it only for research'],
        answer: 'Using it responsibly',
        type: 'mcq'
    },
    {
        id: 'q7',
        question: 'AI stands for...',
        options: ['Actual Intelligence', 'Artificial Information', 'Artificial Intelligence', 'Automatic Intelligence'],
        answer: 'Artificial Intelligence',
        type: 'mcq'
    },
    {
        id: 'q8',
        question: 'What can Siri and Alexa do?',
        options: ['Drive cars', 'Understand human speech', 'Solve climate change', 'Play Go'],
        answer: 'Understand human speech',
        type: 'mcq'
    },
    {
        id: 'q9',
        question: 'What is the main topic of the passage?',
        options: ['The history of computers', 'The impact of AI on society', 'How to build a robot', 'The future of the internet'],
        answer: 'The impact of AI on society',
        type: 'mcq'
    },
    {
        id: 'q10',
        question: 'Which company is mentioned for advanced web search?',
        options: ['Apple', 'Netflix', 'Google', 'Waymo'],
        answer: 'Google',
        type: 'mcq'
    }
];

export const STAGES: Stage[] = [
    { id: 1,  name: 'QUÉT RADAR',           icon: '🛰️' },
    { id: 2,  name: 'BẪY NGỤY TRANG',       icon: '🎭' },
    { id: 3,  name: 'COCKTAIL ĐỘC TỐ',      icon: '🧪' },
    { id: 4,  name: 'THAO TÚNG THẦN KINH',   icon: '🧠' },
    { id: 5,  name: 'PHẾ NANG RẠN NỨT',      icon: '🫁' },
    { id: 6,  name: 'VÒNG TRÒN HỆ LỤY',     icon: '🏚️' },
    { id: 7,  name: 'LÁ CHẮN THÉP',          icon: '⚖️' },
    { id: 8,  name: 'RANH GIỚI ĐỎ',          icon: '⛔' },
    { id: 9,  name: 'PHẢN ĐÒN BẢN LĨNH',    icon: '🛡️' },
    { id: 10, name: 'ĐỈNH CAO TỈNH TÁO',    icon: '🏆' },
];


export const MATCHING_ITEMS: MatchingItem[] = [];

export const getItemsForStage = (stageId: number): MatchingItem[] => {
    return [];
};
