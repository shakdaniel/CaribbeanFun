export interface TriviaQuestion {
  q: string;
  options: string[];
  answer: number; // index into options
  fact?: string;
}

export const triviaQuestions: TriviaQuestion[] = [
  {
    q: "Which Caribbean country is the birthplace of reggae music?",
    options: ["Barbados", "Jamaica", "Trinidad & Tobago", "Cuba"],
    answer: 1,
    fact: "Reggae developed in Jamaica in the late 1960s, evolving from ska and rocksteady.",
  },
  {
    q: "The steelpan (steel drum) originated on which island?",
    options: ["Trinidad", "Grenada", "Antigua", "Dominica"],
    answer: 0,
    fact: "The steelpan was developed in Trinidad in the 1930s–40s and is the only acoustic instrument invented in the 20th century.",
  },
  {
    q: "Which island is known as the 'Spice Isle'?",
    options: ["Saint Lucia", "Grenada", "Jamaica", "Aruba"],
    answer: 1,
    fact: "Grenada is a leading producer of nutmeg and mace — it even appears on the national flag.",
  },
  {
    q: "'Soca' music, born in Trinidad, is a blend of soul and which other style?",
    options: ["Calypso", "Merengue", "Reggae", "Zouk"],
    answer: 0,
    fact: "Soca = the 'soul of calypso', pioneered by Lord Shorty in the 1970s.",
  },
  {
    q: "Which dish is considered the national dish of Jamaica?",
    options: ["Roti", "Ackee and saltfish", "Pelau", "Cou-cou"],
    answer: 1,
    fact: "Ackee and saltfish pairs the ackee fruit with salted cod.",
  },
  {
    q: "Usain Bolt, the fastest man in history, is from which country?",
    options: ["Bahamas", "Jamaica", "Trinidad", "Barbados"],
    answer: 1,
    fact: "Bolt holds the 100m world record at 9.58 seconds, set in 2009.",
  },
  {
    q: "The Pitons, two iconic volcanic peaks, are found on which island?",
    options: ["Saint Lucia", "Montserrat", "St. Kitts", "Tobago"],
    answer: 0,
    fact: "Gros Piton and Petit Piton are a UNESCO World Heritage Site.",
  },
  {
    q: "Which currency is used in much of the Eastern Caribbean?",
    options: [
      "Caribbean Guilder",
      "East Caribbean Dollar",
      "Jamaican Dollar",
      "Florin",
    ],
    answer: 1,
    fact: "The EC Dollar is shared by 8 nations of the OECS.",
  },
  {
    q: "Carnival in Trinidad culminates on which days before Lent?",
    options: [
      "Friday & Saturday",
      "Monday & Tuesday",
      "Sunday & Monday",
      "Thursday & Friday",
    ],
    answer: 1,
    fact: "Carnival Monday and Tuesday feature J'ouvert and the masquerade 'mas' bands.",
  },
  {
    q: "Which sport is by far the most popular across the English-speaking Caribbean?",
    options: ["Cricket", "Baseball", "Rugby", "Ice hockey"],
    answer: 0,
    fact: "The West Indies cricket team represents a federation of Caribbean nations.",
  },
  {
    q: "The Blue Mountains, famous for coffee, are located in which country?",
    options: ["Haiti", "Jamaica", "Dominican Republic", "Cuba"],
    answer: 1,
    fact: "Jamaican Blue Mountain Coffee is among the most prized in the world.",
  },
  {
    q: "Which Caribbean island is an overseas territory and uses the US dollar?",
    options: ["Puerto Rico", "Martinique", "Curaçao", "Anguilla"],
    answer: 0,
    fact: "Puerto Rico is a U.S. territory; its residents are U.S. citizens.",
  },
];

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
