
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

export const READING_PASSAGE = `🛡️ LỜI HIỆU TRIỆU: ĐÁNH BẠI LÀN KHÓI ẢO 

⚡ 1. Vượt qua 10 chặng thử thách, phá tan ma trận làn khói ảo!

🛡️ 2. Kích hoạt bản lĩnh thép, kiên quyết nói "KHÔNG" để làm chủ tương lai!`;

export const QUESTIONS: Question[] = [
    {
        id: 'q1',
        question: 'Giai đoạn 2019–2023, tỷ lệ học sinh 13–17 tuổi tại Việt Nam dùng thuốc lá điện tử tăng từ 2,6% lên mức bao nhiêu?',
        options: ['4,5%', '6,2%', '8,1%', '10,5%'],
        answer: '8,1%',
        type: 'mcq'
    },
    {
        id: 'q2',
        question: 'Đâu là những vật dụng thường được thuốc lá điện tử sử dụng để ngụy trang đánh lừa học sinh?',
        options: ['Sách vở, hộp bút, thước kẻ.', 'USB, thỏi son, bút dạ quang, hộp sữa.', 'Điện thoại, tai nghe, đồng hồ.', 'Cặp sách, bình nước, hộp cơm.'],
        answer: 'USB, thỏi son, bút dạ quang, hộp sữa.',
        type: 'mcq'
    },
    {
        id: 'q3',
        question: 'Nhiều bạn trẻ lầm tưởng khói thuốc lá điện tử chỉ là " hơi nước sạch" không gây hại. Sự thật đằng sau những làn khói thơm này là gì?',
        options: ['Là hơi nước tinh khiết 100%.', 'Là không khí có mùi trái cây vô hại.', 'Là hỗn hợp "sol khí" chứa Nicotine gây nghiện và nhiều hóa chất độc hại.', 'Là tinh dầu giúp làm sạch phổi.'],
        answer: 'Là hỗn hợp "sol khí" chứa Nicotine gây nghiện và nhiều hóa chất độc hại.',
        type: 'mcq'
    },
    {
        id: 'q4',
        question: 'Nicotine tác động trực tiếp vào hệ thần kinh trung ương để kích thích giải phóng Dopamine gây nghiện sau bao nhiêu giây?',
        options: ['1 giây.', '10 giây.', '30 giây.', '60 giây.'],
        answer: '10 giây.',
        type: 'mcq'
    },
    {
        id: 'q5',
        question: 'Formaldehyde và Nitrosamines trong khói thuốc gây ra tổn thương nghiêm trọng nào ở cấp độ tế bào?',
        options: ['Làm tăng nhịp tim tạm thời.', 'Gây cảm giác buồn ngủ.', 'Đứt gãy cấu trúc ADN và hình thành khối u.', 'Làm da bị khô và bong tróc.'],
        answer: 'Đứt gãy cấu trúc ADN và hình thành khối u.',
        type: 'mcq'
    },
    {
        id: 'q6',
        question: 'Tại sao rác thải từ các thiết bị thuốc lá điện tử dùng một lần (Pod) lại được coi là "khủng hoảng mới" đối với môi trường?',
        options: ['Vì chúng làm từ quá nhiều giấy vụn.', 'Vì chúng chứa pin và vi mạch điện tử phát tán kim loại nặng kịch độc vào đất và nước.', 'Vì chúng có mùi thơm thu hút côn trùng đến phá hoại.', 'Vì chúng quá nhẹ nên dễ bị gió thổi bay đi khắp nơi.'],
        answer: 'Vì chúng chứa pin và vi mạch điện tử phát tán kim loại nặng kịch độc vào đất và nước.',
        type: 'mcq'
    },
    {
        id: 'q7',
        question: 'Theo Nghị định 90/2026/NĐ-CP, hành vi nào sau đây liên quan đến thuốc lá điện tử và thuốc lá nung nóng sẽ bị xử phạt nặng từ 5.000.000đ đến 10.000.000đ?',
        options: ['Chỉ sử dụng thuốc lá điện tử tại nơi công cộng.', 'Chứa chấp, lôi kéo người khác sử dụng thuốc lá điện tử, thuốc lá nung nóng.', 'Mang thuốc lá điện tử theo người nhưng không sử dụng.', 'Tìm hiểu thông tin về thuốc lá điện tử trên mạng xã hội.'],
        answer: 'Chứa chấp, lôi kéo người khác sử dụng thuốc lá điện tử, thuốc lá nung nóng.',
        type: 'mcq'
    },
    {
        id: 'q8',
        question: 'Theo Nghị định 90/2026/NĐ-CP, mức xử phạt đối với hành vi SỬ DỤNG thuốc lá điện tử, thuốc lá nung nóng là bao nhiêu?',
        options: ['500.000đ – 1.000.000đ.', '1.000.000đ – 2.000.000đ.', '3.000.000đ – 5.000.000đ.', '5.000.000đ – 10.000.000đ.'],
        answer: '3.000.000đ – 5.000.000đ.',
        type: 'mcq'
    },
    {
        id: 'q9',
        question: 'Khi bị bạn bè rủ rê hoặc ép buộc thử thuốc lá điện tử, bước đầu tiên và quan trọng nhất là gì?',
        options: ['Im lặng và bỏ qua.', 'Cố gắng giải thích về tác hại y khoa.', 'Nói "KHÔNG" dứt khoát, không mơ hồ.', 'Thử một chút để không bị coi là "nhát gan".'],
        answer: 'Nói "KHÔNG" dứt khoát, không mơ hồ.',
        type: 'mcq'
    },
    {
        id: 'q10',
        question: 'Thông điệp cốt lõi của bài giảng "Hành trình Bản lĩnh" muốn gửi gắm đến học sinh là gì?',
        options: ['Thuốc lá điện tử ít hại hơn thuốc lá truyền thống.', 'Chỉ nên hút khi cảm thấy căng thẳng.', 'Pháp luật chỉ cấm, không bảo vệ học sinh.', 'Bản lĩnh thật sự là làm chủ chính mình và nói không đúng lúc.'],
        answer: 'Bản lĩnh thật sự là làm chủ chính mình và nói không đúng lúc.',
        type: 'mcq'
    }
];

export const STAGES: Stage[] = [
    { id: 1,  name: 'TRUY QUÉT TẦN SỐ',     icon: '🛰️' },
    { id: 2,  name: 'ẢO ẢNH NGỤY TRANG',    icon: '🎭' },
    { id: 3,  name: 'CÔNG THỨC HỦY DIỆT',    icon: '🧪' },
    { id: 4,  name: 'HÀNG RÀO TÂM TRÍ',      icon: '🧠' },
    { id: 5,  name: 'HỆ THỐNG SUY KIỆT',     icon: '🫁' },
    { id: 6,  name: 'MIỀN TRẮNG HỆ LỤY',     icon: '🏚️' },
    { id: 7,  name: 'LẬP TRÌNH LÁ CHẮN',    icon: '⚖️' },
    { id: 8,  name: 'GIỚI HẠN SINH TỒN',    icon: '⛔' },
    { id: 9,  name: 'LỆNH TỪ CHỐI',         icon: '🛡️' },
    { id: 10, name: 'BẢN LĨNH TỐI THƯỢNG', icon: '🏆' },
];


export const MATCHING_ITEMS: MatchingItem[] = [];

export const getItemsForStage = (stageId: number): MatchingItem[] => {
    return [];
};
