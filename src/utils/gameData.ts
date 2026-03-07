
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

export const READING_PASSAGE = "";

export const STAGES: Stage[] = [
    { id: 1, name: 'Animals 1', icon: '🐶' },
    { id: 2, name: 'Animals 2', icon: '🐱' },
    { id: 3, name: 'Fruit 1', icon: '🍎' },
    { id: 4, name: 'Fruit 2', icon: '🍌' },
    { id: 5, name: 'Nature 1', icon: '🌲' },
];


export const MATCHING_ITEMS: MatchingItem[] = [
    // Stage 1: Animals
    { id: 'm1', image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop', word1: 'Dog', word2: 'Con chó' },
    { id: 'm2', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop', word1: 'Cat', word2: 'Con mèo' },
    { id: 'm3', image: 'https://images.unsplash.com/photo-1554692998-1e38925ba63c?w=200&h=200&fit=crop', word1: 'Elephant', word2: 'Con voi' },

    // Stage 2: More Animals
    { id: 'm4', image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=200&h=200&fit=crop', word1: 'Lion', word2: 'Sư tử' },
    { id: 'm5', image: 'https://images.unsplash.com/photo-1574068468668-a05a11f871da?w=200&h=200&fit=crop', word1: 'Giraffe', word2: 'Hươu cao cổ' },
    { id: 'm6', image: 'https://images.unsplash.com/photo-1501705388883-4ed8a543392c?w=200&h=200&fit=crop', word1: 'Horse', word2: 'Con ngựa' },

    // Stage 3: Fruits
    { id: 'm7', image: 'https://images.unsplash.com/photo-1571771894821-ad996211fdf4?w=200&h=200&fit=crop', word1: 'Banana', word2: 'Quả chuối' },
    { id: 'm8', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop', word1: 'Apple', word2: 'Quả táo' },
    { id: 'm9', image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=200&h=200&fit=crop', word1: 'Orange', word2: 'Quả cam' },

    // Stage 4: More Fruits
    { id: 'm10', image: 'https://images.unsplash.com/photo-1528825831134-472b8344552b?w=200&h=200&fit=crop', word1: 'Grape', word2: 'Quả nho' },
    { id: 'm11', image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=200&h=200&fit=crop', word1: 'Strawberry', word2: 'Quả dâu tây' },
    { id: 'm12', image: 'https://images.unsplash.com/photo-1550258114-b834e70e9be1?w=200&h=200&fit=crop', word1: 'Pineapple', word2: 'Quả dứa' },

    // Stage 5: Nature
    { id: 'm13', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=200&fit=crop', word1: 'Mountain', word2: 'Ngọn núi' },
    { id: 'm14', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop', word1: 'Ocean', word2: 'Đại dương' },
    { id: 'm15', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop', word1: 'Forest', word2: 'Khu rừng' },
];

export const getItemsForStage = (stageId: number): MatchingItem[] => {
    const start = (stageId - 1) * 3;
    return MATCHING_ITEMS.slice(start, start + 3);
};



