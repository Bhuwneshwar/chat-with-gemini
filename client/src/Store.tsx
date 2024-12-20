export interface InitialState {
  user?: {
    id: string;
    sub: string;
    name: string;
    email: string;
    picture: string;
    given_name: string;
    updated_at: number;
    family_name: string;
    email_verified: boolean;
    preferred_username: null;
  };
  markdowns: {
    user: string;
    model: string;
    createdAt: Date;
  }[];
  markdown: string;
}

export const initialState: InitialState = {
  markdowns: [],
  markdown: `A spoken English roadmap typically involves several stages, progressing from foundational skills to advanced fluency.  It's personalized to the individual's needs and current level.  Here's a possible structure:\\n\\n**Stage 1: Foundational Skills**\\n* **Pronunciation:** Mastering basic sounds, intonation, stress, and rhythm. Resources include phonetics guides, pronunciation dictionaries, and apps like Elsa Speak.  Focus on clear articulation and correct vowel/consonant sounds.\\n* **Vocabulary:** Building a core vocabulary of essential words and phrases. Use flashcards, vocabulary-building apps (Memrise, Duolingo), and focus on context-based learning.\\n* **Grammar:** Understanding basic sentence structure, tenses, and parts of speech.  Utilize grammar textbooks, online resources (Grammarly), and practice writing simple sentences.\\n* **Listening Comprehension:** Improving the ability to understand spoken English.  Start with slow, clear audio like podcasts for beginners, gradually increasing the speed and complexity.  Practice active listening techniques.\\n\\n**Stage 2: Intermediate Fluency**\\n* **Conversation Practice:** Engage in regular conversations with native or fluent English speakers.  Language exchange partners, online tutors, or conversation groups are helpful.  Focus on expressing opinions, asking questions, and responding appropriately.\\n* **Reading Comprehension:** Reading English texts like short stories, news articles, and books.  This expands vocabulary and improves understanding of grammar in context.\\n* **Writing:** Practicing writing in English.  Start with journaling, email writing, and progress to more complex writing tasks like essays or reports.\\n* **Expanding Vocabulary and Grammar:** Continue building vocabulary and refining grammatical understanding through more challenging materials.\\n\\n**Stage 3: Advanced Fluency**\\n* **Specialized Vocabulary:** Developing expertise in specific vocabulary relevant to your profession or interests.\\n* **Idioms and Colloquialisms:** Understanding and using idiomatic expressions and informal language to improve fluency and naturalness.\\n* **Debates and Discussions:** Participating in discussions and debates to develop critical thinking skills in English.\\n* **Presentations and Public Speaking:** Practicing presenting and speaking publicly in English to build confidence and improve delivery.\\n\\n**Resources:**\\n* **Language learning apps:** Duolingo, Memrise, Babbel\\n* **Online tutors:** iTalki, Verbling\\n* **Podcasts:** English podcasts for learners, news podcasts\\n* **YouTube channels:** English learning channels, native speaker vlogs\\n* **Books:** Grammar textbooks, novels, short stories\\n* **Language exchange partners:** HelloTalk, Tandem\\n\\n**Important Considerations:**\\n* **Consistency:** Regular practice is key.  Dedicate time each day to improve your English.\\n* **Immersion:** Surrounding yourself with English as much as possible – watching movies, listening to music, reading books.\\n* **Feedback:** Get regular feedback on your pronunciation and grammar to identify areas for improvement.\\n* **Patience:** Learning a language takes time and effort. Don't get discouraged by setbacks.  Celebrate your progress!\"}"
`,
};
