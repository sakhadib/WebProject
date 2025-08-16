// data.js
const blogPosts = [
  {
    id: 1,
    category: "Technology",
    readTime: "12 min read",
    publishDate: "Aug 8, 2025",
    title:
      "The Future of Artificial Intelligence: What We Can Expect in the Next Decade",
    author: {
      name: "Alex Chen",
      title: "Senior AI Researcher at TechCorp",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    featuredImage:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop&crop=smart",
    featuredImageCaption:
      "The future of AI holds unprecedented possibilities for humanity",
    content: (
      <>
        <p className="text-xl text-gray-700 leading-relaxed mb-8">
          As we stand at the precipice of a new era in technology, artificial
          intelligence continues to evolve at an unprecedented pace. From
          healthcare to transportation, AI is reshaping every aspect of our
          daily lives, promising both extraordinary opportunities and complex
          challenges that will define the next decade.
        </p>

        <h2 className="text-3xl font-bold text-black mt-12 mb-6">
          The Current State of AI Development
        </h2>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Today's artificial intelligence landscape is characterized by rapid
          advancement in machine learning, natural language processing, and
          computer vision. Major tech companies are investing billions in AI
          research, while startups are finding innovative applications across
          industries.
        </p>

        <blockquote className="border-l-4 border-black pl-6 py-4 my-8 bg-gray-50 italic text-xl text-gray-800">
          "The development of full artificial intelligence could spell the end
          of the human race... but it also could be the greatest thing that's
          ever happened to us."
          <footer className="text-base text-gray-600 mt-2 not-italic">
            — Stephen Hawking
          </footer>
        </blockquote>

        <h2 className="text-3xl font-bold text-black mt-12 mb-6">
          Key Areas of AI Advancement
        </h2>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          The next decade will see significant breakthroughs in several critical
          areas. Let's examine the most promising developments:
        </p>

        <ol className="list-decimal list-inside space-y-3 mb-8 text-lg text-gray-700">
          <li>
            <strong>Autonomous Systems:</strong> Self-driving cars, drones, and
            robots will become mainstream
          </li>
          <li>
            <strong>Healthcare AI:</strong> Personalized medicine and diagnostic
            tools will revolutionize treatment
          </li>
          <li>
            <strong>Natural Language Processing:</strong> AI assistants will
            achieve human-level conversation
          </li>
          <li>
            <strong>Computer Vision:</strong> Real-time image analysis will
            enhance security and automation
          </li>
          <li>
            <strong>Quantum AI:</strong> Quantum computing will exponentially
            increase AI capabilities
          </li>
        </ol>

        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          The implications of these advances will be felt across multiple
          sectors:
        </p>

        <ul className="list-disc list-inside space-y-2 mb-8 text-lg text-gray-700">
          <li>Manufacturing and automation efficiency</li>
          <li>Financial services and fraud detection</li>
          <li>Education and personalized learning</li>
          <li>Entertainment and content creation</li>
          <li>Environmental monitoring and climate change</li>
          <li>Space exploration and research</li>
        </ul>

        <h2 className="text-3xl font-bold text-black mt-12 mb-6">
          Challenges and Considerations
        </h2>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          While the potential of AI is immense, we must address several critical
          challenges:
        </p>

        <blockquote className="border-l-4 border-gray-300 pl-6 py-4 my-8 bg-gray-50 text-lg text-gray-700">
          The question isn't whether AI will change our world—it's how we can
          ensure that change benefits everyone.
        </blockquote>

        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          As we move forward, collaboration between technologists, policymakers,
          and ethicists will be crucial in shaping an AI-powered future that
          serves humanity's best interests.
        </p>
      </>
    ),
    likes: 247,
    comments: [
      {
        author: "Sarah Johnson",
        timeAgo: "2 hours ago",
        content:
          "Excellent analysis! The mathematical foundations you've outlined really help explain why current AI systems are advancing so rapidly. I'm particularly interested in the quantum AI section.",
        likes: 121,
        avatar:
          "https://scontent.fdac183-1.fna.fbcdn.net/v/t39.30808-6/482092283_1360091011833918_6148988500901564510_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGSZPX8Tvq5LNd-jggVPcQT89MyqC843MTz0zKoLzjcxNUi0ep6tBEA-9n_Bm9vC_07-Jn_sX9rwGuhHp8Yd6DQ&_nc_ohc=BXKmvKyQR2YQ7kNvwHV8x-U&_nc_oc=Adm3Mh0D_Ybhh_2YzETbwb-xsCzcYd-_tffGtc-Sk9Rf2UThZtnub_9tL364Jc3gHRA&_nc_zt=23&_nc_ht=scontent.fdac183-1.fna&_nc_gid=5IFG42-fHi-jsiRkxNvPEg&oh=00_AfXVpHUDJTfm2Ow_JE_0B5B_-4JYjqeaDlioknTXcLqVwA&oe=68A47383",
      },
      {
        author: "Michael Rodriguez",
        timeAgo: "4 hours ago",
        content:
          "The code example really helps illustrate the concepts. However, I think we should also discuss the ethical implications more deeply. AI bias is a real concern that needs addressing.",
        likes: 8,
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      },
      {
        author: "Emma Thompson",
        timeAgo: "6 hours ago",
        content:
          "As someone working in healthcare, I'm excited about the medical applications mentioned here. AI-powered diagnostics could revolutionize patient care in ways we're just beginning to understand.",
        likes: 15,
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      },
    ],
    totalComments: 18,
    relatedArticles: [
      {
        title: "Machine Learning Fundamentals Every Developer Should Know",
        description: "Understanding the core concepts behind modern AI systems",
        date: "Aug 1, 2025",
        readTime: "8 min read",
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop&crop=smart",
      },
      {
        title: "Deep Learning: From Perceptrons to Transformers",
        description: "A comprehensive journey through neural network evolution",
        date: "Jul 28, 2025",
        readTime: "15 min read",
        image:
          "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=300&fit=crop&crop=smart",
      },
    ],
  },
  {
    id: 2,
    category: "Health",
    readTime: "8 min read",
    publishDate: "Jul 25, 2025",
    title: "Mindfulness in the Digital Age: A Guide to Unplugging",
    author: {
      name: "Jane Doe",
      title: "Wellness Coach",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
    featuredImage:
      "https://images.unsplash.com/photo-1754907107629-ee2b421ff7da?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    featuredImageCaption:
      "Eita ekta caption",
    content:
      "eita post er main body. Shundor na?",
    likes: 150,
    comments: [],
    totalComments: 10,
    relatedArticles: [],
  },
];

export default blogPosts;
