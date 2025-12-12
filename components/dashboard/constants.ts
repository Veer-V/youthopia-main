
import { EventData } from '../../types';

export const IMAGES = {
    dance: "../image/dancesolo.jpg",
    music: "../image/singing.jpg",
    theatre: "../image/skit.jpg",
    art: "../image/",
    tech: "../image/deck.jpg",
    speaker: "../image/elocution.jpg",
    writing: "../image/writing.jpg",
    wellness: "https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=1000&q=80",
    fun: "../image/treasurehunt.jpg",
    fashion: "../image/fashionshow.jpg",
    Sixthinkinghats: "../image/sixthinkinghats.jpg",
    Arttherpy: "../image/Arttherpy.jpg",
    Wallpainting: "../image/Wallpainting.png",
    wellbeingkit: "../image/wellbeingkit.png",
    stroopeffect: "../image/stroopeffect.png",
    seekinghelp: "../image/seekinghelp.png",
    spinthewheel: "../image/spinthewheel.png",
    MHScore: "../image/MHScore.png",
    Zindaginamascreening: "../image/Zindaginamascreening.png",
    danceTherapy: "../image/danceTherapy.jpg",
    Knowyourconflict: "../image/Knowyourconflict.png"
  };

export const events: EventData[] = [
  {
    id: "13",
    title: "Aurora Couture (Fashion Show)",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Main Stage",
    category: "Intercollegiate",
    imageColor: "from-pink-500 to-rose-500",
    quote: "Style is a way to say who you are without having to speak.",
    description: "A high-energy fashion showcase.",
    rules: [
      "One team per contingent.",
      "3 minutes of preparation time will be provided.",
      "No offensive content or costumes are allowed.",
      "Footwear must be worn, and girls must wear stockings if they are wearing a one-piece outfit.",
      "Props are allowed but must be cleaned up after the performance.",
      "Any use of vulgarity or obscenity during the event will lead to disqualification and negative marking.",
      "Judges' decisions are final and binding.",
      "A USB drive or file containing only 1 track must be submitted at the registration desk.",
      "The committee will not be responsible for any technical glitches that occur during the event in the absence of the USB drive."
    ],
    image: IMAGES.fashion,
    isTeamEvent: true,
    minMembers: 8,
    maxMembers: 12,
    points: 0
  },
  {
    id: "14",
    title: "Aurora Eloquence (Elocution)",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Seminar Hall B",
    category: "Intercollegiate",
    imageColor: "from-blue-500 to-indigo-500",
    quote: "Speech is power: speech is to persuade, to convert, to compel.",
    description: "The art of public speaking.",
    rules: [
      "One participant per contingent.",
      "Topic will be disclosed 1 week prior",
      "The presentation shall be in the form of prose and not a poetry or song.",
      "Paper reading shall not be allowed.",
      "Any type of vulgarity and obscenity during the event leads to disqualification and negative marking.",
      "Judge's decisions will be the final and binding."
    ],
    image: IMAGES.speaker,
    points: 0
  },
  {
    id: "7",
    title: "Chords of Confluence (Singing)",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Main Stage",
    category: "Intercollegiate",
    imageColor: "from-indigo-500 to-purple-500",
    quote: "Where words fail, music speaks.",
    description: "Group singing competition.",
    rules: [
      "One team per contingent.",
      "Live instruments are allowed.",
      "Vulgar gestures, hate speech, or damage to equipment will result in disqualification.",
      "The judges' decisions are final and binding.",
      "Each performance must include a song in a language other than Hindi.",
      "Any genre is allowed, but explicit or offensive content is prohibited.",
      "Groups must register with their list of members, instruments, and song genres."
    ],
    image: IMAGES.music,
    isTeamEvent: true,
    minMembers: 4,
    maxMembers: 6,
    points: 0
  },
  {
    id: "11",
    title: "Clash of Cadence (Dance Battle)",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Open Air Theatre",
    category: "Intercollegiate",
    imageColor: "from-red-500 to-orange-500",
    quote: "Dance to express, not to impress.",
    description: "Solo dance face-off.",
    rules: [
      "Round 1 - Cypher: Each participant gets 45 seconds to showcase their dance.",
      "Final 16 Participants will be selected for Round 2.",
      "Round 2 - Battle One-on-one battles according to the allotment provided by judges.",
      "Vulgar gestures, hate speech, or damage to equipment will lead to disqualification.",
      "Judges decisions are final and binding.",
      "Age Limit - 16 to 30 Years",
      "N.C.P allowed"
    ],
    image: IMAGES.dance,
    points: 0
  },
  {
    id: "17",
    title: "Cluescape (Treasure Hunt)",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Campus Wide",
    category: "Intercollegiate",
    imageColor: "from-green-600 to-teal-600",
    quote: "Not all those who wander are lost.",
    description: "Solve riddles, find clues, win treasure.",
    rules: [
      "One team per contingent.",
      "Team members must include at least 1 boy and 1 girl (compulsory).",
      "The event area is the campus.",
      "Non-compliance will lead to disqualification of the team.",
      "Any attempts at cheating will lead to disqualification.",
      "The decision of the organizing committee is final and binding.",
      "Event-specific rules will be explained prior to the event."
    ],
    image: IMAGES.fun,
    isTeamEvent: true,
    minMembers: 2,
    maxMembers: 2,
    points: 0
  },
  {
    id: "34",
    title: "Dance Therapy",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Badminton Hall",
    category: "Engagement",
    imageColor: "from-pink-400 to-rose-400",
    quote: "Move your body, heal your soul.",
    description: "A rhythm-based group dance session that elevates mood, energizes the body, and strengthens social connections.",
    rules: [
      "Comfortable clothing recommended.",
      "Follow the instructor.",
      "Feel the rhythm!"
    ],
    image: IMAGES.danceTherapy,
    points: 70
  },
  {
    id: "23",
    title: "Thinking Outside the Box",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Student Parking",
    category: "Engagement",
    imageColor: "from-indigo-400 to-purple-400",
    quote: "Think outside the box.",
    description: "A creative puzzle challenge that encourages participants to think beyond patterns. This activity serves as a playful introduction to problem-solving and flexible thinking.",
    rules: [
      "Solve the puzzles provided.",
      "Time limit applies.",
      "Have fun!"
    ],
    image: IMAGES.tech,
    points: 30
  },
  {
    id: "8",
    title: "Dreamcraft Deck (Pitch Deck)",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Conference Room A",
    category: "Intercollegiate",
    imageColor: "from-blue-600 to-cyan-600",
    quote: "The best way to predict the future is to create it.",
    description: "Business idea pitching competition.",
    rules: [
      "One team per contingent.",
      "Each team's presentation and Q&A session will be conducted for 4 to 10 minutes.",
      "Presentations must be submitted via USB drives prior to the event, with proper labeling.",
      "Any use of vulgarity or obscenity during the event will lead to disqualification and negative marking.",
      "Judges' decisions are final and binding."
    ],
    image: IMAGES.tech,
    isTeamEvent: true,
    minMembers: 2,
    maxMembers: 2,
    points: 0
  },
  {
    id: "19",
    title: "Framestorm (Comic Flow)",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Art Gallery",
    category: "Intercollegiate",
    imageColor: "from-yellow-500 to-orange-500",
    quote: "Every picture tells a story.",
    description: "Comic strip creation contest.",
    rules: [
      "One participant per contingent.",
      "Participants must bring their own stationery; sheets will be provided.",
      "Any use of vulgarity or obscenity during the event will lead to disqualification and negative marking.",
      "Reference material is not permitted.",
      "Judges' decisions are final and binding."
    ],
    image: IMAGES.art,
    points: 0
  },
  {
    id: "16",
    title: "Inkside Out (Creative Writing)",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Library Hall",
    category: "Intercollegiate",
    imageColor: "from-slate-600 to-slate-800",
    quote: "Words can change the world.",
    description: "Express your thoughts through writing.",
    rules: [
      "Participants will receive a reference picture on the day of the event.",
      "Participants must write a story based on the picture within 2 hours.",
      "Any use of vulgarity or obscenity during the event will result in disqualification and negative marking.",
      "Judges' decisions are final and binding."
    ],
    image: IMAGES.writing,
    points: 0
  },
  {
    id: "32",
    title: "Joy of Journaling",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "IT 002",
    category: "Engagement",
    imageColor: "from-amber-400 to-orange-400",
    quote: "Write it down, let it go.",
    description: "A reflective journaling corner where students can write positive thoughts, encouraging mindfulness and emotional grounding.",
    rules: [
      "Notebooks provided.",
      "Be honest with yourself.",
      "Keep it private or share."
    ],
    image: IMAGES.writing,
    points: 20
  },
  {
    id: "31",
    title: "Know your conflict",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "NR 005",
    category: "Engagement",
    imageColor: "from-red-400 to-pink-400",
    quote: "Understanding is the first step.",
    description: "A role-play-based exercise that teaches healthier conflict resolution and promotes empathy during tough conversations.",
    rules: [
      "Be open-minded.",
      "Respect others' views.",
      "Participate actively."
    ],
    image: IMAGES.Knowyourconflict,
    points: 50
  },
  {
    id: "27",
    title: "Mental Health Quiz",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Between Main Building and Gymkhana",
    category: "Engagement",
    imageColor: "from-teal-400 to-emerald-400",
    quote: "Emotional intelligence is key.",
    description: "A brief emotional intelligence test that helps students understand their strengths, such as empathy, adaptability, and self-awareness.",
    rules: [
      "Answer truthfully.",
      "Get your score instantly.",
      "Learn about yourself."
    ],
    image: IMAGES.wellness,
    points: 20
  },
  {
    id: "33",
    title: "Well Being Kit",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "IT to Main Building 1st Entrance",
    category: "Engagement",
    imageColor: "from-green-400 to-teal-400",
    quote: "Tools for a better you.",
    description: "A resource station offering QR-based tools, helplines, and practical guides to support ongoing mental wellness (with fun games available too!).",
    rules: [
      "Take what you need.",
      "Share with friends.",
      "Use daily."
    ],
    image: IMAGES.wellbeingkit,
    points: 100
  },
  {
    id: "24",
    title: "Zindaginama Screening",
    date: "Dec 22 & 23",
    time: "Every Hour",
    loc: "Box Office Near Old NR Entrance",
    category: "Engagement",
    imageColor: "from-purple-600 to-indigo-600",
    quote: "Cinema reflects life.",
    description: "A screening of the movie Zindaginama, followed by a guided discussion to explore mental health themes. It combines reflection with entertainment.",
    rules: [
      "Silence during the movie.",
      "Participate in the discussion.",
      "No phones allowed."
    ],
    image: IMAGES.Zindaginamascreening,
    points: 20
  },
  {
    id: "9",
    title: "Motion Mirage (Mime)",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Black Box Theatre",
    category: "Intercollegiate",
    imageColor: "from-gray-700 to-black",
    quote: "Action speaks louder than words.",
    description: "Theatrical performance without words.",
    rules: [
      "One team per contingent.",
      "Background music and live Music are allowed.",
      "The student participants shall wear white/black skin tight dresses and shall have paint faces with raised eyebrows and broadened lips.",
      "Props are allowed but participants have to submit the prop list one day before the event.",
      "Any type of vulgarity and obscenity during the event leads to Disqualification and Negative Marking.",
      "Judge's decisions will be the final and binding."
    ],
    image: IMAGES.theatre,
    points: 0
  },
  {
    id: "18",
    title: "Neuro Muse (Digital Art)",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Computer Lab",
    category: "Intercollegiate",
    imageColor: "from-violet-500 to-purple-500",
    quote: "Technology is the canvas of the future.",
    description: "Create art using digital tools.",
    rules: [
      "Laptops, tablets, styluses, drawing pads, and digital art software are allowed.",
      "The use of AI is prohibited.",
      "Premade templates, clip art, and brushes that affect originality are not allowed.",
      "Plagiarism is strictly prohibited.",
      "Artwork must be exported as PNG/JPEG and named as EventName_CC.",
      "Judges' decisions are final and binding."
    ],
    image: IMAGES.tech,
    points: 0
  },
  {
    id: "15",
    title: "Note to Self (Solo Singing)",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Mini Auditorium",
    category: "Intercollegiate",
    imageColor: "from-teal-500 to-green-500",
    quote: "Sing your heart out.",
    description: "Solo vocal performance.",
    rules: [
      "One participant per contingent.",
      "Both karaoke tracks, tanpura, and live instruments are allowed.",
      "Only one accompanist per participant is permitted.",
      "Participants must submit their audio track at least two days prior to the event via the drive link provided by your Point of Contact (P.O.C.).",
      "Basic audio equipment, including microphones and speakers, will be provided.",
      "Participants must bring their own karaoke tracks or instruments.",
      "Vulgar gestures, hate speech, or any damage to equipment will lead to disqualification and penalties for the respective contingent.",
      "The judges' decisions are final and binding."
    ],
    image: IMAGES.music,
    points: 0
  },
  {
    id: "5",
    title: "Pigments of the Psyche (Canvas Painting)",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Art Gallery",
    category: "Intercollegiate",
    imageColor: "from-pink-500 to-rose-500",
    quote: "Every canvas is a journey all its own.",
    description: "Express emotions through colors.",
    rules: [
      "One participant per contingent.",
      "Participants must bring their own art materials; the canvas will be provided.",
      "Any use of vulgarity or obscenity during the event will lead to disqualification and negative marking.",
      "Judges' decisions are final and binding."
    ],
    image: IMAGES.art,
    points: 0
  },
  {
    id: "1",
    title: "Prism Panel (Debate)",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Seminar Hall A",
    category: "Intercollegiate",
    imageColor: "from-blue-600 to-indigo-600",
    quote: "Raise your words, not your voice.",
    description: "A battle of wits and words.",
    rules: [
      "One team per contingent.",
      "Participants will be given characters 1 week prior to the event and must convince the judge why they deserve the last seat on the ship by debating their case.",
      "Any type of vulgarity and obscenity during the event leads to disqualification and negative marking.",
      "Judge's decisions will be the final and binding.",
      "The event will have 2 rounds:",
      "Round 1: Individual team presentations.",
      "Round 2: Debates between teams"
    ],
    image: IMAGES.speaker,
    isTeamEvent: true,
    minMembers: 2,
    maxMembers: 2,
    points: 0
  },
  {
    id: "6",
    title: "Psyk Exchange (Mock Trading)",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Business Lab",
    category: "Intercollegiate",
    imageColor: "from-emerald-600 to-green-600",
    quote: "Buy low, sell high, stay calm.",
    description: "Stock market simulation game.",
    rules: [
      "One team per contingent.",
      "There will be a total of 4 rounds.",
      "The use of software or electronic devices is prohibited during any round.",
      "All trades and auction bids must be completed within the given time.",
      "Participants must adhere to the instructions and scenarios provided in each round.",
      "Decisions made during trading or auctions are final and cannot be reversed.",
      "Any use of vulgarity or obscenity during the event will lead to disqualification and negative marking.",
      "Judges' decisions are final and binding."
    ],
    image: IMAGES.tech,
    isTeamEvent: true,
    minMembers: 2,
    maxMembers: 2,
    points: 0
  },
  {
    id: "2",
    title: "Pulse Parade (Group Dance)",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Main Stage",
    category: "Intercollegiate",
    imageColor: "from-purple-600 to-pink-600",
    quote: "Sync your steps, sync your hearts.",
    description: "Group dance choreography competition.",
    rules: [
      "One Entry per Contingent.",
      "Tracks should be submitted to the POC prior to the Event.",
      "A pen drive or a file consisting of only 1 track should be submitted at the re-registration desk in .mp3 format.",
      "Any sort of vulgarity/profanity/obscenity will lead to disqualification and the contingent will be awarded negative PR points.",
      "Judge's decision will be final and binding.",
      "In case of a tie, a group dance battle will be conducted as a tie-breaker.",
      "Direct Finale and All dance forms except classical and folk."
    ],
    image: IMAGES.dance,
    isTeamEvent: true,
    minMembers: 6,
    maxMembers: 10,
    points: 0
  },
  {
    id: "4",
    title: "Roots in Reverb (Folk Dance)",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Main Stage",
    category: "Intercollegiate",
    imageColor: "from-orange-500 to-red-500",
    quote: "Culture is the arts elevated to a set of beliefs.",
    description: "Traditional folk dance performance.",
    rules: [
      "One team per contingent.",
      "The dance shall be either primitive Indian tribal or folk dance but it shall not be a classical dance.",
      "A pen drive or a file consisting of only 1 track should be submitted at the re-registration desk in .mp3 format.",
      "Contingents must submit a synopsis of the dance form prior to the event.",
      "The participating team shall remove the sets, property, instruments, etc. used for the Folk Dance within 2 minutes after their performance.",
      "Any sort of vulgarity/profanity/obscenity will lead to disqualification and negative PR points.",
      "Judge's decision will be final and binding."
    ],
    image: IMAGES.dance,
    isTeamEvent: true,
    minMembers: 6,
    maxMembers: 10,
    points: 0
  },
  {
    id: "10",
    title: "Scenezone (Skit)",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Auditorium",
    category: "Intercollegiate",
    imageColor: "from-indigo-600 to-blue-600",
    quote: "All the world's a stage.",
    description: "Group acting performance.",
    rules: [
      "Skit must be in Marathi, English or Hindi.",
      "Timing starts as soon as the announcement begins.",
      "Must maintain decency; any violation leads to disqualification.",
      "No personal attacks, remarks or character assassination.",
      "Avoid vulgarity or bitter insinuations.",
      "Innocent humour or satire allowed.",
      "Makeup, drapery and background music allowed."
    ],
    image: IMAGES.theatre,
    isTeamEvent: true,
    minMembers: 4,
    maxMembers: 6,
    points: 0
  },
  {
    id: "37",
    title: "Seeking Help",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Student Parking / Redemption in Mpower Cell",
    category: "Engagement",
    imageColor: "from-blue-300 to-indigo-300",
    quote: "It's okay to ask for help.",
    description: "Professional counselors available for private chats.",
    rules: [
      "Confidentiality guaranteed.",
      "Safe space.",
      "Professional support."
    ],
    image: IMAGES.seekinghelp,
    points: 0
  },
  {
    id: "12",
    title: "Shadows & Light (Solo Classical Dance)",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Mini Auditorium",
    category: "Intercollegiate",
    imageColor: "from-amber-500 to-yellow-500",
    quote: "Grace in every step.",
    description: "Indian classical dance performance.",
    rules: [
      "One participant per contingent.",
      "The participant may perform any form of Indian classical dance.",
      "Evaluation will be based on qualities such as taal, abhinaya, expressions, costumes, footwork, and overall impression.",
      "A pen drive or file containing only one track must be submitted at the re-registration desk in .mp3 format.",
      "Any form of vulgarity, profanity, or obscenity will lead to disqualification.",
      "The judges' decisions are final and binding."
    ],
    image: IMAGES.dance,
    points: 0
  },
  {
    id: "30",
    title: "Six Thinking Hats",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "NR 009",
    category: "Engagement",
    imageColor: "from-cyan-500 to-blue-500",
    quote: "See things differently.",
    description: "A group activity that uses different “thinking perspectives” to solve problems creatively and collaboratively.",
    rules: [
      "Wear the hat.",
      "Adopt the perspective.",
      "Solve the problem."
    ],
    image: IMAGES.Sixthinkinghats,
    points: 50
  },
  {
    id: "28",
    title: "Spin the Wheel",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Student Parking",
    category: "Engagement",
    imageColor: "from-fuchsia-500 to-pink-500",
    quote: "Spin to win!",
    description: "A playful spin-and-respond game featuring myths, facts, and challenges—making mental health awareness fun and interactive.",
    rules: [
      "Spin the wheel.",
      "Complete the challenge.",
      "Win a prize."
    ],
    image: IMAGES.spinthewheel,
    points: 50
  },
  {
    id: "20",
    title: "Stellar Spoof (Mimicry)",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Open Mic Stage",
    category: "Intercollegiate",
    imageColor: "from-lime-500 to-green-500",
    quote: "Imitation is the sincerest form of flattery.",
    description: "Mimic famous personalities.",
    rules: [
      "No offensive content.",
      "3 minutes time limit.",
      "Entertain the crowd."
    ],
    image: IMAGES.fun,
    points: 0
  },
  {
    id: "29",
    title: "Stroop Effect",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "New Building Before NAMED",
    category: "Engagement",
    imageColor: "from-orange-400 to-red-400",
    quote: "Challenge your brain.",
    description: "A brain-twisting color-word activity that reveals how attention works and why focus can be challenging.",
    rules: [
      "Read the color, not the word.",
      "Beat the timer.",
      "Focus hard!"
    ],
    image: IMAGES.stroopeffect,
    points: 30
  },
  {
    id: "3",
    title: "Unmasking Emotions (Mono Act)",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Black Box Theatre",
    category: "Intercollegiate",
    imageColor: "from-red-600 to-rose-600",
    quote: "One person, many emotions.",
    description: "Solo acting performance.",
    rules: [
      "One participant per contingent.",
      "Background music and live Music are allowed.",
      "Script should be submitted one day before the event.",
      "Props are allowed but participants have to submit the prop list one day before the event.",
      "Any type of vulgarity and obscenity during the event leads to Disqualification and Negative Marking.",
      "Judge's decisions will be the final and binding."
    ],
    image: IMAGES.theatre,
    points: 0
  },
  {
    id: "21",
    title: "Gratitude Wall",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Student Parking",
    category: "Engagement",
    imageColor: "from-yellow-400 to-amber-400",
    quote: "Gratitude turns what we have into enough.",
    description: "A gratitude-writing wall that allows students to reflect, appreciate others, and experience a burst of positivity. A simple act with a big emotional impact.",
    rules: [
      "Write a note.",
      "Stick it on the wall.",
      "Spread positivity."
    ],
    image: "../image/gratitudewall.png",
    points: 30
  },
  {
    id: "25",
    title: "Wall Painting",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "[Not Listed]",
    category: "Engagement",
    imageColor: "from-teal-500 to-blue-500",
    quote: "Make your mark.",
    description: "A collaborative mural project where creativity and teamwork merge into one expressive artwork—offering a therapeutic and community-building experience.",
    rules: [
      "Use provided paints.",
      "Respect the theme.",
      "Have fun."
    ],
    image: IMAGES.Wallpainting,
    points: 0
  },
  {
    id: "26",
    title: "MH Score Check",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "[Not Listed]",
    category: "Engagement",
    imageColor: "from-green-500 to-emerald-500",
    quote: "Health is wealth.",
    description: "A quick digital self-assessment of stress, mood, sleep, and more, giving students a snapshot of their mental well-being.",
    rules: [
      "Complete the survey.",
      "Get instant results.",
      "Consult experts if needed."
    ],
    image: IMAGES.MHScore,
    points: 30
  },
  {
    id: "22",
    title: "Memory Word Recall",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "New Building / Gazebo",
    category: "Engagement",
    imageColor: "from-blue-400 to-cyan-400",
    quote: "How good is your memory?",
    description: "A quick memory test that demonstrates how the brain can distort information. It’s fun, surprising, and great for sparking conversations about perception.",
    rules: [
      "Listen to the words.",
      "Recall as many as possible.",
      "No writing allowed."
    ],
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1000&q=80",
    points: 30
  },
  {
    id: "35",
    title: "Trash the Can'ts",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Student Parking",
    category: "Engagement",
    imageColor: "from-gray-500 to-slate-500",
    quote: "Let go of negativity.",
    description: "Write down your negative thoughts and literally trash them.",
    rules: [
      "Identify a negative thought.",
      "Write it down.",
      "Throw it in the bin."
    ],
    image: IMAGES.wellness,
    points: 50
  },
  {
    id: "36",
    title: "Art Therapy / Mind Mania",
    date: "Dec 22 & 23",
    time: "All Day",
    loc: "Student Parking",
    category: "Engagement",
    imageColor: "from-purple-400 to-pink-400",
    quote: "Create to heal.",
    description: "Engage in artistic activities to express feelings and relax.",
    rules: [
      "Be creative.",
      "No judgment.",
      "Enjoy the process."
    ],
    image: IMAGES.Arttherpy,
    points: 70
  }
];
