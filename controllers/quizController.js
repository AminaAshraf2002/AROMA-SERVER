const QuizResult = require('../models/QuizResult');
const User = require('../models/User');

// Full quiz questions and answers
const quizData = [
  {
    "question": "What is the primary solvent used in perfume production?",
    "options": ["Water", "Alcohol", "Oil", "Glycerin"],
    "answer": 1
  },
  {
    "question": "Which note evaporates the fastest?",
    "options": ["Base", "Middle", "Top", "Heart"],
    "answer": 2
  },
  {
    "question": "The process of diluting the concentrated fragrance oils with a solvent (usually alcohol) is crucial for:",
    "options": [
      "Enhancing the color of the perfume",
      "Making the fragrance safe for skin application and controlling its intensity",
      "Preserving the natural essential oils",
      "Increasing the perfume's shelf life indefinitely"
    ],
    "answer": 1
  },
  {
    "question": "The process of distillation, crucial for extracting essential oils, was significantly advanced by:",
    "options": ["The Egyptians", "The Romans", "Arab chemists", "The Chinese"],
    "answer": 2
  },
  {
    "question": "Chanel No. 5 was created in what year?",
    "options": ["1901", "1911", "1921", "1931"],
    "answer": 2
  },
  {
    "question": "Which flower is known as the 'Queen of Flowers' in perfumery?",
    "options": ["Lavender", "Rose", "Jasmine", "Violet"],
    "answer": 1
  },
  {
    "question": "Which spice is often used in oriental perfumes?",
    "options": ["Basil", "Cinnamon", "Dill", "Parsley"],
    "answer": 1
  },
  {
    "question": "The creator of the original 'Eau de Cologne' was:",
    "options": [
      "Jean-François Houbigant",
      "Johann Maria Farina",
      "Pierre-François Lubin",
      "François Coty"
    ],
    "answer": 1
  },
  {
    "question": "Which aromatic ingredient is derived from a whale?",
    "options": ["Musk", "Ambergris", "Civet", "Castoreum"],
    "answer": 1
  },
  {
    "question": "What is the primary reason for using synthetic aroma chemicals in modern perfumery?",
    "options": [
      "They are always cheaper than natural ingredients.",
      "They can replicate scents that are difficult or impossible to extract naturally.",
      "They are inherently safer for the skin than natural oils.",
      "They always provide a more complex and nuanced scent profile."
    ],
    "answer": 1
  },
  {
    "question": "What is the term for a fragrance that smells like the forest floor?",
    "options": ["Powdery", "Earthy", "Citrus", "Gourmand"],
    "answer": 1
  },
  {
    "question": "Which aromatic ingredient is known for its calming, herbaceous scent?",
    "options": ["Lemon", "Lavender", "Cinnamon", "Clove"],
    "answer": 1
  },
  {
    "question": "What is the term for a fragrance that smells like a campfire?",
    "options": ["Fruity", "Smoked", "Marine", "Floral"],
    "answer": 1
  },
  {
    "question": "A prominent Arab chemist credited with significant advancements in perfume making is:",
    "options": ["Avicenna (Ibn Sina)", "Al-Razi (Rhazes)", "Jabir ibn Hayyan (Geber)", "Al-Khwarizmi"],
    "answer": 0
  },
  {
    "question": "Which aromatic ingredient is known for its warm, spicy scent and is often used in winter fragrances?",
    "options": ["Sandalwood", "Ginger", "Vetiver", "Patchouli"],
    "answer": 1
  },
  {
    "question": "Which aromatic ingredient is derived from a grass root?",
    "options": ["Patchouli", "Vetiver", "Sandalwood", "Myrrh"],
    "answer": 1
  },
  {
    "question": "What is the term for a fragrance that smells like the sea?",
    "options": ["Fruity", "Marine/Aquatic", "Spicy", "Floral"],
    "answer": 1
  },
  {
    "question": "Sandalwood essential oil, valued for its creamy and woody scent, traditionally comes from:",
    "options": ["China", "Australia and India", "Argentina", "South Africa"],
    "answer": 1
  },
  {
    "question": "Gas chromatography-mass spectrometry (GC-MS) is a technique used in perfumery to:",
    "options": [
      "Visually analyze the color of perfume ingredients.",
      "Separate and identify the individual chemical components of a fragrance, both natural and synthetic.",
      "Determine the pH level of a perfume formulation.",
      "Measure the sillage and longevity of a perfume on the skin."
    ],
    "answer": 1
  },
  {
    "question": "What are 'essential oils'?",
    "options": [
      "Fatty oils used as a base for perfumes",
      "Concentrated, volatile aromatic compounds extracted from plants",
      "Synthetic aroma chemicals created in a laboratory",
      "Diluted perfume extracts sold at a lower price"
    ],
    "answer": 1
  },
  {
    "question": "Which flower is a key ingredient in many classic perfumes?",
    "options": ["Tulip", "Jasmine", "Daisy", "Sunflower"],
    "answer": 1
  },
  {
    "question": "One of the first commercially successful perfumes to heavily feature synthetic aldehydes was:",
    "options": ["Jicky by Guerlain", "Chanel No. 5", "L'Air du Temps by Nina Ricci", "Shalimar by Guerlain"],
    "answer": 1
  },
  {
    "question": "The evaluation and refinement of a perfume formula often involves a process called:",
    "options": ["Distillation", "Enfleurage", "Olfactive testing or smelling trials", "Maceration"],
    "answer": 2
  },
  {
    "question": "Which woody note is often used as a base note?",
    "options": ["Lime", "Cedarwood", "Mint", "Grapefruit"],
    "answer": 1
  },
  {
    "question": "What is the weakest concentration of perfume?",
    "options": ["Eau de parfum", "Parfum", "Eau de toilette", "Eau de cologne"],
    "answer": 3
  },
  {
    "question": "Applying perfume to which areas of the body tends to make it last longer due to natural body heat?",
    "options": ["Hair and clothing", "Hands and feet", "Pulse points (wrists, neck, behind ears)", "Areas exposed to the open air"],
    "answer": 2
  },
  {
    "question": "What is the meaning of 'eau de parfum'?",
    "options": ["Light perfume", "Strong perfume", "Perfumed water", "Perfumed oil"],
    "answer": 1
  },
  {
    "question": "Which citrus fruit is used for its fresh, zesty scent?",
    "options": ["Cherry", "Orange", "Plum", "Pear"],
    "answer": 1
  },
  {
    "question": "Which aromatic ingredient is known for its sweet, honey-like scent?",
    "options": ["Rose", "Benzoin", "Sandalwood", "Cedarwood"],
    "answer": 1
  },
  {
    "question": "What is the term for the tool used to test perfumes on paper?",
    "options": ["Beaker", "Pipette", "Blotter strip", "Atomizer"],
    "answer": 2
  },
  {
    "question": "Why is oud essential oil often considered a luxurious and highly valued ingredient in perfume creation?",
    "options": [
      "Because it is easily and cheaply synthesized in large quantities.",
      "Due to its light and universally appealing aroma that blends with everything.",
      "Because of its complex scent profile, rarity, and the labor-intensive extraction process.",
      "Because it is primarily used as a cost-effective fragrance extender."
    ],
    "answer": 2
  },
  {
    "question": "Which country is a major global exporter of Lavender essential oil, widely used in perfumery?",
    "options": ["Italy", "Bulgaria", "Spain", "Greece"],
    "answer": 1
  },
  {
    "question": "Patchouli essential oil, with its distinct earthy and musky aroma, is widely imported from:",
    "options": ["Russia", "Indonesia and India", "Canada", "Chile"],
    "answer": 1
  },
  {
    "question": "Lemon essential oil, another popular citrus top note, has significant production in:",
    "options": ["Greece and Italy", "Turkey and Syria", "Argentina and Uruguay", "Australia and New Zealand"],
    "answer": 0
  },
  {
    "question": "What is a primary role of oud essential oil when used as a note in perfumery?",
    "options": [
      "To provide a light and fleeting top note.",
      "To act as a strong and dominant floral heart note.",
      "To offer a deep, long-lasting base note that anchors other scents.",
      "To function as a volatile fixative that quickly evaporates."
    ],
    "answer": 2
  },
  {
    "question": "The sense of smell, which allows us to perceive fragrances, relies on which type of receptors in the nasal cavity?",
    "options": ["Photoreceptors", "Mechanoreceptors", "Chemoreceptors", "Thermoreceptors"],
    "answer": 2
  },
  {
    "question": "Which factor is increasingly influencing consumer choices in the perfume industry?",
    "options": [
      "Solely the brand name and celebrity endorsements.",
      "Primarily the lowest price point available.",
      "A combination of scent profile, brand values, sustainability efforts, and online reviews.",
      "Only traditional advertising through print media."
    ],
    "answer": 2
  },
  {
    "question": "Which aromatic ingredient is derived from a tree's resin and has a smoky scent?",
    "options": ["Lavender", "Frankincense", "Rosemary", "Thyme"],
    "answer": 1
  },
  {
    "question": "Which aromatic ingredient is known for its warm, spicy scent?",
    "options": ["Mint", "Clove", "Lemon", "Apple"],
    "answer": 1
  },
  {
    "question": "Which aromatic ingredient is known for its warm, nutty scent?",
    "options": ["Lemon", "Almond", "Mint", "Apple"],
    "answer": 1
  },
  {
    "question": "Which factor is increasingly influencing consumer choices in the perfume industry?",
    "options": [
      "Solely the brand name and celebrity endorsements.",
      "Primarily the lowest price point available.",
      "A combination of scent profile, brand values, sustainability efforts, and online reviews.",
      "Only traditional advertising through print media."
    ],
    "answer": 2
  },
  {
    "question": "Which aromatic ingredient is derived from a bulb?",
    "options": ["Rose", "Iris", "Lavender", "Violet"],
    "answer": 1
  },
  {
    "question": "Woody fragrance notes in perfumery are primarily derived from which part of plants?",
    "options": ["Flowers", "Fruits", "Bark, roots, and wood", "Leaves"],
    "answer": 2
  },
  {
    "question": "Which of these is a popular woody note used as a base note in many perfumes, known for its creamy and warm aroma?",
    "options": ["Lemon", "Rose", "Sandalwood", "Mint"],
    "answer": 2
  },
  {
    "question": "Which aromatic ingredient is known for its sweet, floral scent and is often used in high-end perfumes?",
    "options": ["Rose", "Ylang-Ylang", "Lavender", "Violet"],
    "answer": 1
  },
  {
    "question": "Which aromatic ingredient is derived from a flower and has a sweet, powdery scent?",
    "options": ["Rose", "Violet", "Lavender", "Iris"],
    "answer": 1
  },
  {
    "question": "The word 'perfume' comes from the Latin phrase:",
    "options": ["per aqua", "per ignis", "per fumum", "per terra"],
    "answer": 2
  },
  {
    "question": "What is a potential concern associated with the use of some synthetic aroma chemicals in perfumes?",
    "options": [
      "They are always more volatile and evaporate too quickly.",
      "Some individuals may experience skin sensitivity or allergic reactions.",
      "They are less stable and degrade the perfume over time.",
      "They cannot be blended effectively with natural ingredients."
    ],
    "answer": 1
  },
  {
    "question": "The use of synthetic aroma chemicals has significantly impacted the perfume industry by:",
    "options": [
      "Making fine fragrances less accessible to the general public.",
      "Limiting the creative palette available to perfumers.",
      "Enabling the creation of a wider range of scents and often making perfumes more affordable.",
      "Eliminating the need for skilled perfumers."
    ],
    "answer": 2
  },
  {
    "question": "Rubbing your wrists together after applying perfume can cause the scent to fade faster because it:",
    "options": [
      "Increases blood flow and evaporates the perfume quickly.",
      "Damages the fragrance molecules due to friction.",
      "Mixes the perfume with natural skin oils, altering the scent.",
      "Prevents the perfume from properly adhering to the skin."
    ],
    "answer": 1
  }
];

// Extract just the answers into an array for easier scoring
const correctAnswers = quizData.map(q => q.answer);

// Get quiz questions
exports.getQuizQuestions = async (req, res) => {
  try {
    // Check if user has paid
    if (!req.user.hasPaid) {
      return res.status(403).json({ 
        success: false,
        message: 'Payment required to access quiz' 
      });
    }
    
    // Check if user already has a quiz in progress
    const existingInProgressQuiz = await QuizResult.findOne({ 
      userId: req.user._id,
      status: 'in-progress'
    });
    
    // If there's an in-progress quiz, use that
    if (existingInProgressQuiz) {
      // Strip answers from questions before sending to client
      const questionsWithoutAnswers = quizData.map(q => ({
        question: q.question,
        options: q.options
      }));
      
      return res.json({
        success: true,
        quizId: existingInProgressQuiz._id,
        questions: questionsWithoutAnswers,
        startedAt: existingInProgressQuiz.startedAt
      });
    }
    
    // Check if user already completed a quiz
    const completedQuiz = await QuizResult.findOne({
      userId: req.user._id,
      status: 'completed'
    });
    
    if (completedQuiz) {
      return res.status(400).json({
        success: false,
        message: 'Quiz already completed',
        result: {
          score: completedQuiz.score,
          correctAnswers: completedQuiz.correctAnswers,
          totalQuestions: completedQuiz.totalQuestions,
          certificateId: completedQuiz.certificateId,
          passed: completedQuiz.passed
        }
      });
    }
    
    // Create a new quiz attempt
    const user = await User.findById(req.user._id);
    const newQuizResult = new QuizResult({
      userId: req.user._id,
      userName: user.name || 'Student',
      status: 'in-progress'
    });
    
    await newQuizResult.save();
    
    // Strip answers from questions before sending to client
    const questionsWithoutAnswers = quizData.map(q => ({
      question: q.question,
      options: q.options
    }));
    
    res.json({
      success: true,
      quizId: newQuizResult._id,
      questions: questionsWithoutAnswers,
      startedAt: newQuizResult.startedAt
    });
  } catch (error) {
    console.error('Quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get quiz questions',
      error: error.message
    });
  }
};

// Submit quiz answers
exports.submitQuiz = async (req, res) => {
  try {
    // Check if user has paid
    if (!req.user.hasPaid) {
      return res.status(403).json({ 
        success: false,
        message: 'Payment required to submit quiz' 
      });
    }
    
    const { answers, quizId } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Valid answers array is required'
      });
    }
    
    // Find the quiz result
    let quizResult;
    if (quizId) {
      quizResult = await QuizResult.findOne({ 
        _id: quizId,
        userId: req.user._id,
        status: 'in-progress'
      });
    } else {
      quizResult = await QuizResult.findOne({ 
        userId: req.user._id,
        status: 'in-progress'
      });
    }
    
    if (!quizResult) {
      return res.status(404).json({
        success: false,
        message: 'Active quiz not found'
      });
    }
    
    // Calculate score
    let correct = 0;
    answers.forEach((answer, index) => {
      if (index < correctAnswers.length && answer === correctAnswers[index]) {
        correct++;
      }
    });
    
    const score = Math.round((correct / Math.min(answers.length, correctAnswers.length)) * 100);
    const passed = score >= 70;
    
    // Update quiz result
    quizResult.answers = answers;
    quizResult.score = score;
    quizResult.correctAnswers = correct;
    quizResult.totalQuestions = Math.min(answers.length, correctAnswers.length);
    quizResult.status = 'completed';
    quizResult.passed = passed;
    quizResult.completedAt = new Date();
    
    // Generate certificate ID for all users regardless of pass/fail
    const certificateId = 'ARC-' + Math.floor(100000 + Math.random() * 900000) + '-L1';
    quizResult.certificateId = certificateId;
    
    // Calculate time spent
    if (quizResult.startedAt) {
      quizResult.timeSpent = Math.floor((quizResult.completedAt - quizResult.startedAt) / 1000);
    }
    
    // Save quiz result
    await quizResult.save();
    
    // Update user
    await User.findByIdAndUpdate(req.user._id, { 
      quizCompleted: true,
      quizPassed: passed
    });
    
    res.json({
      success: true,
      result: {
        score,
        correctAnswers: correct,
        totalQuestions: Math.min(answers.length, correctAnswers.length),
        certificateId: quizResult.certificateId,
        passed,
        userName: quizResult.userName
      }
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz',
      error: error.message
    });
  }
};

// Get certificate
exports.getCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    
    if (!certificateId) {
      return res.status(400).json({
        success: false,
        message: 'Certificate ID is required'
      });
    }
    
    const quizResult = await QuizResult.findOne({ certificateId });
    
    if (!quizResult) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }
    
    // Get user details
    const user = await User.findById(quizResult.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      certificate: {
        certificateId: quizResult.certificateId,
        userName: quizResult.userName || user.name || 'Student',
        score: quizResult.score,
        correctAnswers: quizResult.correctAnswers,
        totalQuestions: quizResult.totalQuestions,
        completedAt: quizResult.completedAt,
        passed: quizResult.passed
      }
    });
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get certificate',
      error: error.message
    });
  }
};

// Download certificate
exports.downloadCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    
    if (!certificateId) {
      return res.status(400).json({
        success: false,
        message: 'Certificate ID is required'
      });
    }
    
    const quizResult = await QuizResult.findOne({ certificateId });
    
    if (!quizResult) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }
    
    // Get user details
    const user = await User.findById(quizResult.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // In a real app, you would generate a PDF here
    // This is just a placeholder response
    res.json({
      success: true,
      message: 'Certificate download initiated',
      certificate: {
        certificateId: quizResult.certificateId,
        userName: quizResult.userName || user.name || 'Student',
        score: quizResult.score,
        completedAt: quizResult.completedAt,
        passed: quizResult.passed
      }
    });
  } catch (error) {
    console.error('Download certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download certificate',
      error: error.message
    });
  }
};