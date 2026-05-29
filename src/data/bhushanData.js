// =============================================
// BHUSHAN CHATURBHUJ — PERSONAL DATA
// Used by AI Chat Sidebar and static sections
// =============================================

export const BHUSHAN_DATA = {
  name: "Bhushan Chaturbhuj",
  dob: "23 September 2004",
  location: "Kopargaon, Maharashtra, India",

  education: [
    {
      degree: "MCA (Master of Computer Applications)",
      institution: "Sanjivani University, Kopargaon",
      year: "2025–Present",
    },
    {
      degree: "BBA-CA",
      institution: "Sanjivani University, Kopargaon",
      year: "Completed",
      cgpa: 7.89,
    },
  ],

  experience: [
    {
      title: "LLM Post-Training Intern",
      company: "Ethara AI (Green Rider Technology LLP)",
      type: "Remote",
      period: "2025–Present",
      description: "SFT and RLHF workflows on large language models",
      isCurrent: true,
    },
    {
      title: "Creative Director",
      company: "Sanjivani University Innovation Cell",
      type: "On-site",
      period: "2025–Present",
      description: "Leading creative direction for university innovation events and campaigns",
      isCurrent: true,
    },
    {
      title: "T&P Coordinator",
      company: "MCA Department, Sanjivani University",
      type: "On-site",
      period: "2025–Present",
      description: "Training & Placement coordination for MCA batch",
      isCurrent: true,
    },
  ],

  skills: {
    frontend: ["React.js", "Next.js", "HTML5", "CSS3", "Tailwind CSS", "GSAP", "Three.js", "TypeScript"],
    backend: ["Node.js", "Express.js", "REST APIs"],
    database: ["MongoDB", "Supabase", "Firebase"],
    aiml: ["LLM Fine-tuning", "SFT", "RLHF", "Python", "TensorFlow"],
    tools: ["Git", "GitHub", "Vite", "Vercel", "Cloudinary", "Fast2SMS API"],
    specialties: ["Web AR (MindAR, AR.js)", "Video Editing", "Photo Editing"],
  },

  projects: [
    {
      id: 1,
      name: "EVSync",
      description: "EV Buying Assistant Platform — helps users compare and purchase electric vehicles with intelligent recommendations.",
      stack: ["React", "Node.js", "MongoDB"],
      tag: "Full Stack",
      featured: true,
      github: "https://github.com/BhushanC23",
    },
    {
      id: 2,
      name: "Bajrang Dal District Platform",
      description: "District-level membership management system with image uploads, SMS notifications, and admin CMS.",
      stack: ["React+Vite", "Node.js", "MongoDB", "Cloudinary", "Fast2SMS"],
      tag: "Full Stack + CMS",
      featured: false,
      github: "https://github.com/BhushanC23",
    },
    {
      id: 3,
      name: "Ziply",
      description: "Ephemeral file and text sharing app with auto-expiring links — privacy-first utility tool.",
      stack: ["React", "Node.js", "MongoDB"],
      tag: "Utility Tool",
      featured: false,
      github: "https://github.com/BhushanC23",
    },
    {
      id: 4,
      name: "Web AR — Indian Heritage Monuments",
      description: "Augmented Reality cultural platform that brings Indian heritage monuments to life in browser-based AR.",
      stack: ["React", "TypeScript", "MindAR", "A-Frame"],
      tag: "AR / Web XR",
      featured: true,
      github: "https://github.com/BhushanC23",
    },
    {
      id: 5,
      name: "Sanskriti",
      description: "Web AR cultural platform celebrating Indian traditions and festivals through immersive augmented reality experiences.",
      stack: ["React", "TypeScript", "MindAR"],
      tag: "AR",
      featured: false,
      github: "https://github.com/BhushanC23",
    },
    {
      id: 6,
      name: "Handwritten Alphabet Classifier",
      description: "Deep Learning CNN model that classifies handwritten alphabets with high accuracy using TensorFlow.",
      stack: ["TensorFlow", "Python", "Google Colab"],
      tag: "AI/ML",
      featured: false,
      github: "https://github.com/BhushanC23",
    },
  ],

  achievements: [
    {
      icon: "🥇",
      title: "National Rank 52 — NEC 2025",
      desc: "E-Cell, IIT Bombay — National Entrepreneurship Challenge",
    },
    {
      icon: "🎓",
      title: "JPMorgan Chase Software Engineering",
      desc: "Forage Virtual Experience Program",
    },
    {
      icon: "🤖",
      title: "NASSCOM Generative AI Fluency Certification",
      desc: "Certified in Generative AI concepts and applications",
    },
    {
      icon: "🏢",
      title: "MSME Entrepreneurship Awareness Certification",
      desc: "Ministry of MSME, Government of India",
    },
    {
      icon: "☁️",
      title: "Google Cloud Arcade Workshop",
      desc: "Participant in Google Cloud skill-building arcade",
    },
  ],

  social: {
    github: "https://github.com/BhushanC23",
    linkedin: "https://www.linkedin.com/in/bhushan-chaturbhuj/",
    instagram: "https://instagram.com/bhushxnn.in",
    email: "bhushan.chaturbhuj_25pca@sanjivani.edu.in",
  },

  stats: [
    { value: 3, suffix: "+", label: "Years Building" },
    { value: 10, suffix: "+", label: "Projects" },
    { value: 52, suffix: "", label: "NEC National Rank" },
    { value: 7.89, suffix: "", label: "CGPA" },
  ],
};

export const BHUSHAN_SYSTEM_PROMPT = `You are Bhushan Chaturbhuj's personal AI assistant embedded in his portfolio website. You only answer questions about Bhushan.
If asked anything unrelated, politely redirect to Bhushan-related topics.

Here is everything about Bhushan:

NAME: Bhushan Chaturbhuj
DOB: 23 September 2004, Kopargaon, Maharashtra
EDUCATION: MCA at Sanjivani University, Kopargaon (2025–present), BBA-CA (CGPA 7.89)
CURRENT ROLE: LLM Post-Training Intern at Ethara AI (SFT, RLHF workflows)
OTHER ROLES: Creative Director - Sanjivani University Innovation Cell; T&P Coordinator - MCA Dept
ACHIEVEMENT: National Rank 52 at NEC 2025 (IIT Bombay E-Cell)

SKILLS: React.js, Node.js, MongoDB, Express.js, Tailwind CSS, GSAP, Three.js, 
Next.js, Supabase, Python, TensorFlow, Web AR (MindAR, AR.js), TypeScript,
LLM fine-tuning (SFT, RLHF), Video Editing, Photo Editing

PROJECTS:
- EVSync: EV buying assistant (React, Node.js, MongoDB)
- Bajrang Dal Platform: District membership management (React, Node, MongoDB, Cloudinary)
- Ziply: Ephemeral file/text sharing app
- Web AR Heritage: AR platform for Indian monuments (MindAR, A-Frame)
- Sanskriti: Web AR cultural platform (React, TypeScript)
- Handwritten Alphabet Classifier: CNN model (TensorFlow, Python)

CERTIFICATIONS: JPMorgan Chase (Forage), NASSCOM Gen AI Fluency, MSME Entrepreneurship
INSTAGRAM: @bhushxnn.in
INTERESTS: AI/ML, Full Stack Development, Web AR, Video Editing, Spirituality

Keep answers short, friendly, and impressive. Make Bhushan sound like a 
talented and driven developer. Respond in English.`;

export const QUICK_QUESTIONS = [
  "Who is Bhushan?",
  "What projects has he built?",
  "What are his skills?",
  "Is he available for work?",
];
