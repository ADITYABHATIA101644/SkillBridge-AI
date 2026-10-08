const interviewQuestions = {
  "Machine Learning": [
    {
      question:
        "What is overfitting in machine learning?",
      options: [
        "The model performs well on training data but poorly on unseen data",
        "The model performs poorly on both training and testing data",
        "The model has too few parameters",
        "The model does not contain any features",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Model Fundamentals",
    },

    {
      question:
        "Which technique is commonly used to reduce overfitting?",
      options: [
        "Regularization",
        "Removing validation data",
        "Increasing noise in the target variable",
        "Always increasing model complexity",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Model Fundamentals",
    },

    {
      question:
        "What is the purpose of splitting data into training and testing sets?",
      options: [
        "To evaluate how well the model generalizes to unseen data",
        "To make the dataset larger",
        "To remove all categorical variables",
        "To guarantee 100% model accuracy",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Model Evaluation",
    },

    {
      question:
        "Which metric is especially useful when false positives and false negatives have different costs?",
      options: [
        "Precision and recall",
        "Mean only",
        "Standard deviation only",
        "R-squared only",
      ],
      answer: 0,
      difficulty: "Medium",
      skill: "Model Evaluation",
    },

    {
      question:
        "What does cross-validation help estimate?",
      options: [
        "Model performance across different subsets of the data",
        "The number of columns in a dataset",
        "The file size of a dataset",
        "The programming language used to train a model",
      ],
      answer: 0,
      difficulty: "Medium",
      skill: "Model Evaluation",
    },

    {
      question:
        "Which algorithm is commonly used for classification and regression?",
      options: [
        "Decision Tree",
        "HTML",
        "CSS",
        "MongoDB",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Algorithms",
    },

    {
      question:
        "What is gradient descent primarily used for?",
      options: [
        "Optimizing model parameters",
        "Creating database tables",
        "Compressing images",
        "Sorting strings alphabetically",
      ],
      answer: 0,
      difficulty: "Medium",
      skill: "Optimization",
    },

    {
      question:
        "What is the main purpose of feature scaling?",
      options: [
        "To bring features into comparable numerical ranges",
        "To delete the target variable",
        "To increase the number of classes",
        "To convert every model into a neural network",
      ],
      answer: 0,
      difficulty: "Medium",
      skill: "Data Preprocessing",
    },

    {
      question:
        "Which problem occurs when a classifier performs very well on one class but poorly on another because the classes are highly imbalanced?",
      options: [
        "Class imbalance",
        "Underflow",
        "Data serialization",
        "Compilation",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Data Preprocessing",
    },

    {
      question:
        "What is the bias-variance tradeoff concerned with?",
      options: [
        "Balancing underfitting and overfitting",
        "Choosing between SQL and NoSQL",
        "Choosing a programming language",
        "Reducing network latency",
      ],
      answer: 0,
      difficulty: "Hard",
      skill: "Model Fundamentals",
    },
  ],

  "Data Scientist": [
    {
      question:
        "Which measure is generally less affected by extreme outliers?",
      options: [
        "Median",
        "Mean",
        "Variance",
        "Maximum",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Statistics",
    },

    {
      question:
        "What does a p-value help evaluate in hypothesis testing?",
      options: [
        "Evidence against the null hypothesis",
        "The number of rows in a dataset",
        "The size of a database",
        "The number of machine learning features",
      ],
      answer: 0,
      difficulty: "Medium",
      skill: "Statistics",
    },

    {
      question:
        "What is the difference between correlation and causation?",
      options: [
        "Correlation shows association, while causation implies a cause-effect relationship",
        "They always mean exactly the same thing",
        "Causation only applies to databases",
        "Correlation can only be used for categorical variables",
      ],
      answer: 0,
      difficulty: "Medium",
      skill: "Statistics",
    },

    {
      question:
        "Which SQL clause is used to group rows for aggregate calculations?",
      options: [
        "GROUP BY",
        "ORDER BY",
        "INSERT",
        "DROP",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "SQL",
    },

    {
      question:
        "What is feature engineering?",
      options: [
        "Creating or transforming variables to improve model usefulness",
        "Deleting the entire dataset",
        "Designing a website",
        "Installing Python",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Data Preparation",
    },

    {
      question:
        "What is data leakage?",
      options: [
        "When information unavailable at prediction time influences model training",
        "When a CSV file is renamed",
        "When data is stored in a database",
        "When a model has too few parameters",
      ],
      answer: 0,
      difficulty: "Hard",
      skill: "Data Preparation",
    },

    {
      question:
        "Which visualization is commonly used to understand the distribution of a numerical variable?",
      options: [
        "Histogram",
        "Login form",
        "Navigation bar",
        "Database schema",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Data Visualization",
    },

    {
      question:
        "What is the purpose of an A/B test?",
      options: [
        "To compare two variants using measured outcomes",
        "To compress a dataset",
        "To train a neural network without data",
        "To create database indexes",
      ],
      answer: 0,
      difficulty: "Medium",
      skill: "Experimentation",
    },

    {
      question:
        "Which SQL function can calculate the average of a numerical column?",
      options: [
        "AVG()",
        "COUNTFILE()",
        "AVERAGEFILE()",
        "MEANROW()",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "SQL",
    },

    {
      question:
        "Why is exploratory data analysis performed before modeling?",
      options: [
        "To understand distributions, relationships, missing values and anomalies",
        "To guarantee perfect accuracy",
        "To remove the need for testing",
        "To eliminate all categorical variables",
      ],
      answer: 0,
      difficulty: "Medium",
      skill: "Data Analysis",
    },
  ],

  "AI Engineer": [
    {
      question:
        "What is an artificial neural network inspired by?",
      options: [
        "The structure and information-processing principles of biological neural systems",
        "Relational database tables",
        "Web browser navigation",
        "Operating system kernels",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "AI Fundamentals",
    },

    {
      question:
        "What is an embedding?",
      options: [
        "A numerical representation of data that captures useful relationships",
        "A database password",
        "A CSS component",
        "A network cable",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Generative AI",
    },

    {
      question:
        "What does RAG stand for in generative AI?",
      options: [
        "Retrieval-Augmented Generation",
        "Random AI Generation",
        "Recursive Algorithmic Graph",
        "Real-time Automated Gradient",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Generative AI",
    },

    {
      question:
        "What is the main purpose of a vector database in an AI application?",
      options: [
        "To efficiently store and search vector representations",
        "To replace the operating system",
        "To compile Python code",
        "To host CSS files",
      ],
      answer: 0,
      difficulty: "Medium",
      skill: "AI Systems",
    },

    {
      question:
        "What is attention in transformer architectures mainly used for?",
      options: [
        "Modeling relationships between tokens in a sequence",
        "Creating database tables",
        "Compressing source code",
        "Rendering HTML pages",
      ],
      answer: 0,
      difficulty: "Medium",
      skill: "Deep Learning",
    },

    {
      question:
        "What is fine-tuning?",
      options: [
        "Further training a pretrained model on a specific dataset or task",
        "Deleting a pretrained model",
        "Converting Python into HTML",
        "Creating a database schema",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Generative AI",
    },

    {
      question:
        "What is a common issue with large language model outputs?",
      options: [
        "Hallucination",
        "Guaranteed factual correctness",
        "Automatic database normalization",
        "Zero computational cost",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Generative AI",
    },

    {
      question:
        "Why are evaluation datasets important for AI systems?",
      options: [
        "They help measure system performance on representative tasks",
        "They eliminate the need for training data",
        "They guarantee that a model never fails",
        "They replace all human evaluation",
      ],
      answer: 0,
      difficulty: "Medium",
      skill: "AI Evaluation",
    },

    {
      question:
        "What does tokenization do in language processing?",
      options: [
        "Breaks text into smaller units that a model can process",
        "Encrypts a database",
        "Creates network packets",
        "Converts SQL into JavaScript",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Natural Language Processing",
    },

    {
      question:
        "Why can retrieval improve an AI assistant's responses?",
      options: [
        "It can provide relevant external context to the generation process",
        "It removes the need for any model",
        "It guarantees every generated answer is correct",
        "It automatically increases GPU memory",
      ],
      answer: 0,
      difficulty: "Medium",
      skill: "AI Systems",
    },
  ],

  "Software Engineer": [
    {
      question:
        "What is the typical time complexity of binary search on a sorted array?",
      options: [
        "O(log n)",
        "O(n)",
        "O(n²)",
        "O(1) always",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Data Structures & Algorithms",
    },

    {
      question:
        "Which data structure follows LIFO?",
      options: [
        "Stack",
        "Queue",
        "Graph",
        "Heap only",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Data Structures",
    },

    {
      question:
        "Which data structure follows FIFO?",
      options: [
        "Queue",
        "Stack",
        "Tree",
        "Hash table",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Data Structures",
    },

    {
      question:
        "What is the average lookup complexity of a hash table?",
      options: [
        "O(1)",
        "O(n²)",
        "O(log n) always",
        "O(n!)",
      ],
      answer: 0,
      difficulty: "Medium",
      skill: "Data Structures",
    },

    {
      question:
        "What is encapsulation in object-oriented programming?",
      options: [
        "Bundling data and methods while controlling access to internal details",
        "Deleting objects from memory",
        "Sorting an array",
        "Connecting two servers",
      ],
      answer: 0,
      difficulty: "Medium",
      skill: "Object-Oriented Programming",
    },

    {
      question:
        "What is recursion?",
      options: [
        "A function calling itself directly or indirectly",
        "A database query",
        "A networking protocol",
        "A sorting algorithm only",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Programming Fundamentals",
    },

    {
      question:
        "Which HTTP status code usually indicates a successful request?",
      options: [
        "200",
        "404",
        "500",
        "301",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Web Fundamentals",
    },

    {
      question:
        "What is the primary purpose of unit testing?",
      options: [
        "To test small units of code independently",
        "To replace all system testing",
        "To increase database storage",
        "To deploy an application",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Software Engineering",
    },

    {
      question:
        "What is Git primarily used for?",
      options: [
        "Version control",
        "Database hosting",
        "Image compression",
        "Machine learning training",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Software Engineering",
    },

    {
      question:
        "What is the worst-case time complexity of merge sort?",
      options: [
        "O(n log n)",
        "O(n)",
        "O(n²)",
        "O(log n)",
      ],
      answer: 0,
      difficulty: "Medium",
      skill: "Data Structures & Algorithms",
    },
  ],

  "Full Stack Developer": [
    {
      question:
        "What does REST commonly refer to in web development?",
      options: [
        "An architectural style for designing networked APIs",
        "A database engine",
        "A CSS framework",
        "A programming language",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Backend",
    },

    {
      question:
        "Which HTTP method is commonly used to retrieve data?",
      options: [
        "GET",
        "POST",
        "DELETE",
        "PATCH",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Web Fundamentals",
    },

    {
      question:
        "Which React hook is commonly used to manage component state?",
      options: [
        "useState",
        "useServer",
        "useDatabase",
        "useHTML",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "React",
    },

    {
      question:
        "What is JWT commonly used for?",
      options: [
        "Authentication and transmitting signed claims",
        "Styling web pages",
        "Image compression",
        "Database normalization",
      ],
      answer: 0,
      difficulty: "Medium",
      skill: "Authentication",
    },

    {
      question:
        "What is CORS?",
      options: [
        "A mechanism controlling cross-origin HTTP requests",
        "A database query language",
        "A React state manager",
        "A CSS animation system",
      ],
      answer: 0,
      difficulty: "Medium",
      skill: "Web Fundamentals",
    },

    {
      question:
        "Which technology is commonly used to build server-side applications with JavaScript?",
      options: [
        "Node.js",
        "HTML",
        "CSS",
        "Figma",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Backend",
    },

    {
      question:
        "Which database is a document-oriented NoSQL database?",
      options: [
        "MongoDB",
        "MySQL",
        "PostgreSQL",
        "Oracle Database",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Databases",
    },

    {
      question:
        "What does asynchronous JavaScript allow?",
      options: [
        "Operations such as I/O to proceed without blocking the main execution flow",
        "JavaScript to stop executing permanently",
        "HTML to replace JavaScript",
        "Databases to require no queries",
      ],
      answer: 0,
      difficulty: "Medium",
      skill: "JavaScript",
    },

    {
      question:
        "What does HTTP status code 404 usually mean?",
      options: [
        "The requested resource was not found",
        "The request succeeded",
        "The server restarted",
        "Authentication succeeded",
      ],
      answer: 0,
      difficulty: "Easy",
      skill: "Web Fundamentals",
    },

    {
      question:
        "Why is input validation important in a full-stack application?",
      options: [
        "It helps maintain data quality and reduces invalid or potentially harmful input",
        "It makes all applications offline",
        "It eliminates the need for authentication",
        "It guarantees zero bugs",
      ],
      answer: 0,
      difficulty: "Medium",
      skill: "Security",
    },
  ],
};

export default interviewQuestions;