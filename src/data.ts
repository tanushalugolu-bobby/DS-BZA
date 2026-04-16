export interface Member {
  id: string;
  name: string;
  pfNumber: string;
  role: string;
  bio: string;
  image: string;
  documents: {
    name: string;
    url: string;
    date: string;
  }[];
  details: {
    label: string;
    value: string;
  }[];
}

export const staff: Member[] = [
  {
    id: 's1',
    name: 'Dr. Sarah Wilson',
    pfNumber: '24409813001',
    role: 'Lead Veterinarian',
    bio: 'With over 15 years of experience, Dr. Wilson specializes in small animal surgery and holistic care.',
    image: 'https://picsum.photos/seed/staff1/600/800',
    documents: [],
    details: [
      { label: 'Experience', value: '15+ Years' },
      { label: 'Specialty', value: 'Surgery' },
      { label: 'Favorite Animal', value: 'Golden Retrievers' }
    ]
  },
  {
    id: 's2',
    name: 'James Miller',
    pfNumber: '24409813002',
    role: 'Practice Manager',
    bio: 'James keeps everything running smoothly. He has a background in business administration and a passion for animal welfare.',
    image: 'https://picsum.photos/seed/staff2/600/800',
    documents: [],
    details: [
      { label: 'Joined', value: '2018' },
      { label: 'Focus', value: 'Operations' },
      { label: 'Pets', value: '2 Cats' }
    ]
  },
  {
    id: 's3',
    name: 'Elena Rodriguez',
    pfNumber: '24409813003',
    role: 'Senior Vet Technician',
    bio: 'Elena is our emergency care specialist. She has a magic touch with nervous pets.',
    image: 'https://picsum.photos/seed/staff3/600/800',
    documents: [],
    details: [
      { label: 'Certification', value: 'LVT' },
      { label: 'Expertise', value: 'Emergency Care' },
      { label: 'Hobbies', value: 'Hiking' }
    ]
  },
  {
    id: 's4',
    name: 'David Chen',
    pfNumber: '24409813004',
    role: 'Veterinary Assistant',
    bio: 'David is currently studying to become a vet. He assists in all clinical procedures with great care.',
    image: 'https://picsum.photos/seed/staff4/600/800',
    documents: [],
    details: [
      { label: 'Education', value: 'Pre-Vet Student' },
      { label: 'Started', value: '2021' },
      { label: 'Favorite Task', value: 'Lab Work' }
    ]
  },
  {
    id: 's5',
    name: 'Sophie Thompson',
    pfNumber: '24409813005',
    role: 'Receptionist',
    bio: 'Sophie is the first friendly face you see. She loves greeting every pet that walks through the door.',
    image: 'https://picsum.photos/seed/staff5/600/800',
    documents: [],
    details: [
      { label: 'Experience', value: '5 Years' },
      { label: 'Loves', value: 'Customer Service' },
      { label: 'Fun Fact', value: 'Speaks 3 languages' }
    ]
  },
  {
    id: 's6',
    name: 'Marcus Thorne',
    pfNumber: '24409813006',
    role: 'Animal Behaviorist',
    bio: 'Marcus helps pets and owners communicate better. He specializes in anxiety and aggression management.',
    image: 'https://picsum.photos/seed/staff6/600/800',
    documents: [],
    details: [
      { label: 'Degree', value: 'Animal Psychology' },
      { label: 'Method', value: 'Positive Reinforcement' },
      { label: 'Experience', value: '10 Years' }
    ]
  },
  {
    id: 's7',
    name: 'Lisa Park',
    pfNumber: '24409813007',
    role: 'Grooming Specialist',
    bio: 'Lisa makes sure every pet leaves looking their absolute best. She has won several grooming awards.',
    image: 'https://picsum.photos/seed/staff7/600/800',
    documents: [],
    details: [
      { label: 'Specialty', value: 'Poodle Cuts' },
      { label: 'Awards', value: 'Best in Show 2022' },
      { label: 'Pets', value: '3 Dogs' }
    ]
  },
  {
    id: 's8',
    name: 'Robert Vance',
    pfNumber: '24409813008',
    role: 'Night Care Coordinator',
    bio: 'Robert oversees the overnight recovery of our surgical patients, ensuring they are comfortable and safe.',
    image: 'https://picsum.photos/seed/staff8/600/800',
    documents: [],
    details: [
      { label: 'Shift', value: 'Night' },
      { label: 'Focus', value: 'Recovery' },
      { label: 'Background', value: 'EMT' }
    ]
  },
  {
    id: 's9',
    name: 'Chloe Bennett',
    pfNumber: '24409813009',
    role: 'Pharmacy Tech',
    bio: 'Chloe manages our in-house pharmacy and ensures all prescriptions are accurately filled.',
    image: 'https://picsum.photos/seed/staff9/600/800',
    documents: [],
    details: [
      { label: 'Certification', value: 'CPhT' },
      { label: 'Accuracy', value: '100%' },
      { label: 'Loves', value: 'Organization' }
    ]
  },
  {
    id: 's10',
    name: 'Kevin Hart',
    pfNumber: '24409813010',
    role: 'Facility Maintenance',
    bio: 'Kevin ensures our clinic is always clean, safe, and welcoming for both humans and animals.',
    image: 'https://picsum.photos/seed/staff10/600/800',
    documents: [],
    details: [
      { label: 'Role', value: 'Maintenance' },
      { label: 'Started', value: '2015' },
      { label: 'Favorite Dog', value: 'Bulldogs' }
    ]
  },
  {
    id: 's11',
    name: 'Maya Gupta',
    pfNumber: '24409813011',
    role: 'Client Liaison',
    bio: 'Maya works closely with pet owners to navigate complex treatment plans and insurance.',
    image: 'https://picsum.photos/seed/staff11/600/800',
    documents: [],
    details: [
      { label: 'Focus', value: 'Client Care' },
      { label: 'Expertise', value: 'Insurance' },
      { label: 'Pets', value: '1 Parrot' }
    ]
  },
  {
    id: 's12',
    name: 'Tom Baker',
    pfNumber: '24409813012',
    role: 'Junior Vet Tech',
    bio: 'Tom is a rising star in our tech team, known for his patience and technical skills.',
    image: 'https://picsum.photos/seed/staff12/600/800',
    documents: [],
    details: [
      { label: 'Education', value: 'Vet Tech Degree' },
      { label: 'Started', value: '2023' },
      { label: 'Hobby', value: 'Photography' }
    ]
  }
];

export const dogs: Member[] = [
  {
    id: 'd1',
    name: 'Buddy',
    pfNumber: '24409813101',
    role: 'Golden Retriever',
    bio: 'Buddy is our clinic mascot. He loves belly rubs and greeting everyone with a wagging tail.',
    image: 'https://picsum.photos/seed/dog1/600/800',
    documents: [],
    details: [
      { label: 'Age', value: '4 Years' },
      { label: 'Temperament', value: 'Friendly' },
      { label: 'Favorite Treat', value: 'Peanut Butter' }
    ]
  },
  {
    id: 'd2',
    name: 'Luna',
    pfNumber: '24409813102',
    role: 'Border Collie',
    bio: 'Luna is super smart and energetic. She loves playing fetch and learning new tricks.',
    image: 'https://picsum.photos/seed/dog2/600/800',
    documents: [],
    details: [
      { label: 'Age', value: '2 Years' },
      { label: 'Energy', value: 'High' },
      { label: 'Skill', value: 'Agility' }
    ]
  },
  {
    id: 'd3',
    name: 'Max',
    pfNumber: '24409813103',
    role: 'German Shepherd',
    bio: 'Max is a gentle giant. He is very protective and loyal to his family.',
    image: 'https://picsum.photos/seed/dog3/600/800',
    documents: [],
    details: [
      { label: 'Age', value: '6 Years' },
      { label: 'Role', value: 'Guardian' },
      { label: 'Favorite Activity', value: 'Long Walks' }
    ]
  },
  {
    id: 'd4',
    name: 'Bella',
    pfNumber: '24409813104',
    role: 'French Bulldog',
    bio: 'Bella is the queen of the clinic. She spends most of her day napping in the sun.',
    image: 'https://picsum.photos/seed/dog4/600/800',
    documents: [],
    details: [
      { label: 'Age', value: '3 Years' },
      { label: 'Vibe', value: 'Chill' },
      { label: 'Favorite Spot', value: 'Reception Desk' }
    ]
  },
  {
    id: 'd5',
    name: 'Cooper',
    pfNumber: '24409813105',
    role: 'Beagle',
    bio: 'Cooper has a nose for trouble! He is always sniffing around for snacks.',
    image: 'https://picsum.photos/seed/dog5/600/800',
    documents: [],
    details: [
      { label: 'Age', value: '5 Years' },
      { label: 'Trait', value: 'Curious' },
      { label: 'Sound', value: 'Howling' }
    ]
  },
  {
    id: 'd6',
    name: 'Daisy',
    pfNumber: '24409813106',
    role: 'Poodle',
    bio: 'Daisy is elegant and poised. She loves being groomed and wearing fancy bandanas.',
    image: 'https://picsum.photos/seed/dog6/600/800',
    documents: [],
    details: [
      { label: 'Age', value: '1 Year' },
      { label: 'Style', value: 'Fashionista' },
      { label: 'Loves', value: 'Attention' }
    ]
  }
];
