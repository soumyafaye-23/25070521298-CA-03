export type MenuItem = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: 'Appetizers' | 'Mains' | 'Desserts' | 'Breads';
    image: string;
    featured?: boolean;
};

export const menuItems: MenuItem[] = [
    {
        id: '1',
        name: 'Chole Bhature',
        description: 'Spicy chickpea curry served with fried bread.',
        price: 350,
        category: 'Mains',
        image: '/images/Chole-Bhature-01.jpg',
        featured: true,
    },
    {
        id: '2',
        name: 'Maharashtrian Bhindi Masala',
        description: 'Okra stir-fried with spices and coconut.',
        price: 280,
        category: 'Mains',
        image: '/images/Maharashtrian-style-Bhindi-Masala-1.jpg',
    },
    {
        id: '3',
        name: 'Palak Paneer Bhurji',
        description: 'Scrambled cottage cheese with spinach and spices.',
        price: 380,
        category: 'Mains',
        image: '/images/Palak-Paneer-Bhurji-MOP-New.webp',
    },
    {
        id: '4',
        name: 'Paneer Lababdar',
        description: 'Cottage cheese cubes in a creamy tomato gravy.',
        price: 400,
        category: 'Mains',
        image: '/images/Paneer_Lababdar.webp',
        featured: true,
    },
    {
        id: '5',
        name: 'Shrikhand',
        description: 'Sweetened strained yogurt flavored with saffron and cardamom.',
        price: 150,
        category: 'Desserts',
        image: '/images/Shrikhand-Featured.jpg',
    },
    {
        id: '6',
        name: 'Cabbage Manchurian',
        description: 'Crispy cabbage balls tossed in a spicy sauce.',
        price: 220,
        category: 'Appetizers',
        image: '/images/cabbage_manchurian_dry.webp',
    },
    {
        id: '7',
        name: 'Ice Cream',
        description: 'Classic vanilla ice cream.',
        price: 120,
        category: 'Desserts',
        image: '/images/ice cream.jpg',
    },
    {
        id: '8',
        name: 'Naan Roti',
        description: 'Leavened flatbread baked in a clay oven.',
        price: 60,
        category: 'Breads',
        image: '/images/nan roti.jpg',
    },
    {
        id: '9',
        name: 'Paneer Bhurji',
        description: 'Spiced scrambled cottage cheese.',
        price: 360,
        category: 'Mains',
        image: '/images/paneer bhurji.jpg',
    },
    {
        id: '10',
        name: 'Pav Bhaji',
        description: 'Spicy vegetable mash served with buttered bread rolls.',
        price: 250,
        category: 'Mains',
        image: '/images/pav bhaji.jpg',
        featured: true,
    },
    {
        id: '11',
        name: 'Tandoori Roti',
        description: 'Whole wheat flatbread baked in a clay oven.',
        price: 40,
        category: 'Breads',
        image: '/images/tanduri roti.webp',
    },
    {
        id: '12',
        name: 'Veg Crispy',
        description: 'Crispy fried vegetables tossed in sauces.',
        price: 240,
        category: 'Appetizers',
        image: '/images/veg crispy.webp',
    },
];
