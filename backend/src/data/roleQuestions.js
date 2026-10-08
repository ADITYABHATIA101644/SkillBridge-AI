const roleQuestions = {
  "Machine Learning Engineer": [
    {
      id: "mle-1",
      question:
        "Which algorithm is commonly used for binary classification?",
      options: [
        "Linear Regression",
        "Logistic Regression",
        "K-Means",
        "PCA",
      ],
      answer: 1,
      skill: "Machine Learning",
      difficulty: "Easy",
    },
    {
      id: "mle-2",
      question:
        "What is the primary purpose of a validation dataset?",
      options: [
        "Train the model",
        "Tune and evaluate model choices",
        "Store the final model",
        "Increase the dataset size",
      ],
      answer: 1,
      skill: "Model Evaluation",
      difficulty: "Easy",
    },
    {
      id: "mle-3",
      question:
        "Which technique is commonly used to reduce overfitting?",
      options: [
        "Regularization",
        "Removing validation data",
        "Increasing noise",
        "Removing all features",
      ],
      answer: 0,
      skill: "Model Optimization",
      difficulty: "Medium",
    },
    {
      id: "mle-4",
      question:
        "What does gradient descent attempt to minimize?",
      options: [
        "Training time",
        "Loss function",
        "Number of features",
        "Dataset size",
      ],
      answer: 1,
      skill: "Optimization",
      difficulty: "Medium",
    },
    {
      id: "mle-5",
      question:
        "Which metric is particularly useful for imbalanced binary classification?",
      options: [
        "Accuracy only",
        "F1-score",
        "Mean Squared Error",
        "R-squared",
      ],
      answer: 1,
      skill: "Model Evaluation",
      difficulty: "Medium",
    },
    {
      id: "mle-6",
      question:
        "What does a Random Forest consist of?",
      options: [
        "A single decision tree",
        "Multiple decision trees",
        "Only neural networks",
        "Only linear models",
      ],
      answer: 1,
      skill: "Machine Learning",
      difficulty: "Easy",
    },
    {
      id: "mle-7",
      question:
        "Which method transforms features to have zero mean and unit variance?",
      options: [
        "Standardization",
        "One-hot encoding",
        "Label encoding",
        "Bagging",
      ],
      answer: 0,
      skill: "Data Preprocessing",
      difficulty: "Easy",
    },
    {
      id: "mle-8",
      question:
        "What is cross-validation mainly used for?",
      options: [
        "Increasing GPU memory",
        "Estimating model generalization",
        "Deleting outliers",
        "Creating labels",
      ],
      answer: 1,
      skill: "Model Evaluation",
      difficulty: "Medium",
    },
    {
      id: "mle-9",
      question:
        "Which neural-network activation function is commonly used in hidden layers?",
      options: [
        "ReLU",
        "Softmax only",
        "Argmax",
        "Identity only",
      ],
      answer: 0,
      skill: "Deep Learning",
      difficulty: "Easy",
    },
    {
      id: "mle-10",
      question:
        "What is the purpose of a test dataset?",
      options: [
        "Final unbiased evaluation",
        "Parameter initialization",
        "Feature creation",
        "Data collection",
      ],
      answer: 0,
      skill: "Model Evaluation",
      difficulty: "Easy",
    },
  ],

  "Data Scientist": [
    {
      id: "ds-1",
      question:
        "Which language is widely used for data science?",
      options: [
        "Python",
        "HTML",
        "CSS",
        "XML",
      ],
      answer: 0,
      skill: "Python",
      difficulty: "Easy",
    },
    {
      id: "ds-2",
      question:
        "Which SQL clause filters rows?",
      options: [
        "GROUP BY",
        "WHERE",
        "ORDER BY",
        "JOIN",
      ],
      answer: 1,
      skill: "SQL",
      difficulty: "Easy",
    },
    {
      id: "ds-3",
      question:
        "Which measure represents the middle value of ordered data?",
      options: [
        "Mean",
        "Median",
        "Variance",
        "Range",
      ],
      answer: 1,
      skill: "Statistics",
      difficulty: "Easy",
    },
    {
      id: "ds-4",
      question:
        "Which technique can be used to reduce dimensionality?",
      options: [
        "PCA",
        "JOIN",
        "Sorting",
        "Hashing",
      ],
      answer: 0,
      skill: "Statistics",
      difficulty: "Medium",
    },
    {
      id: "ds-5",
      question:
        "What is the purpose of exploratory data analysis?",
      options: [
        "Understand patterns and relationships",
        "Deploy servers",
        "Write CSS",
        "Encrypt passwords",
      ],
      answer: 0,
      skill: "Data Analysis",
      difficulty: "Easy",
    },
    {
      id: "ds-6",
      question:
        "Which library is commonly used for tabular data in Python?",
      options: [
        "Pandas",
        "React",
        "Express",
        "Jest",
      ],
      answer: 0,
      skill: "Python",
      difficulty: "Easy",
    },
    {
      id: "ds-7",
      question:
        "What does correlation measure?",
      options: [
        "Relationship between variables",
        "Database size",
        "CPU speed",
        "File size",
      ],
      answer: 0,
      skill: "Statistics",
      difficulty: "Medium",
    },
    {
      id: "ds-8",
      question:
        "Which visualization is useful for showing the distribution of numerical data?",
      options: [
        "Histogram",
        "Pie chart only",
        "Network diagram",
        "Flowchart",
      ],
      answer: 0,
      skill: "Data Visualization",
      difficulty: "Easy",
    },
    {
      id: "ds-9",
      question:
        "Which SQL operation combines rows from related tables?",
      options: [
        "JOIN",
        "DROP",
        "DELETE",
        "TRUNCATE",
      ],
      answer: 0,
      skill: "SQL",
      difficulty: "Easy",
    },
    {
      id: "ds-10",
      question:
        "What is an outlier?",
      options: [
        "A value substantially different from other observations",
        "A missing column",
        "A duplicate table",
        "A database key",
      ],
      answer: 0,
      skill: "Data Analysis",
      difficulty: "Easy",
    },
  ],

  "AI Engineer": [
    {
      id: "ai-1",
      question:
        "What does NLP stand for?",
      options: [
        "Natural Language Processing",
        "Neural Logic Programming",
        "Network Learning Protocol",
        "Natural Learning Pipeline",
      ],
      answer: 0,
      skill: "Artificial Intelligence",
      difficulty: "Easy",
    },
    {
      id: "ai-2",
      question:
        "What is a transformer primarily designed to process?",
      options: [
        "Sequential or contextual data",
        "Only images",
        "Only databases",
        "Only audio hardware",
      ],
      answer: 0,
      skill: "Generative AI",
      difficulty: "Medium",
    },
    {
      id: "ai-3",
      question:
        "What is an embedding?",
      options: [
        "A vector representation of information",
        "A database password",
        "A programming language",
        "A network cable",
      ],
      answer: 0,
      skill: "Generative AI",
      difficulty: "Medium",
    },
    {
      id: "ai-4",
      question:
        "What does RAG commonly stand for?",
      options: [
        "Retrieval-Augmented Generation",
        "Random AI Generation",
        "Rapid Algorithm Growth",
        "Recursive Agent Graph",
      ],
      answer: 0,
      skill: "Generative AI",
      difficulty: "Medium",
    },
    {
      id: "ai-5",
      question:
        "Which language is commonly used for AI development?",
      options: [
        "Python",
        "HTML",
        "CSS",
        "Markdown",
      ],
      answer: 0,
      skill: "Python",
      difficulty: "Easy",
    },
    {
      id: "ai-6",
      question:
        "What is fine-tuning?",
      options: [
        "Adapting a pretrained model to a specific task",
        "Deleting a model",
        "Compressing a database",
        "Creating a network",
      ],
      answer: 0,
      skill: "Deep Learning",
      difficulty: "Medium",
    },
    {
      id: "ai-7",
      question:
        "What is an LLM?",
      options: [
        "Large Language Model",
        "Low-Level Machine",
        "Learning Logic Module",
        "Large Linear Matrix",
      ],
      answer: 0,
      skill: "Generative AI",
      difficulty: "Easy",
    },
    {
      id: "ai-8",
      question:
        "What is inference in machine learning?",
      options: [
        "Using a trained model to make predictions",
        "Training the dataset",
        "Deleting features",
        "Cleaning a database",
      ],
      answer: 0,
      skill: "Machine Learning",
      difficulty: "Easy",
    },
    {
      id: "ai-9",
      question:
        "What is hallucination in generative AI?",
      options: [
        "A model producing unsupported or incorrect information",
        "GPU overheating",
        "Database failure",
        "A compiler error",
      ],
      answer: 0,
      skill: "Generative AI",
      difficulty: "Easy",
    },
    {
      id: "ai-10",
      question:
        "What is prompt engineering?",
      options: [
        "Designing instructions to guide an AI model",
        "Building computer hardware",
        "Writing SQL indexes",
        "Compressing images",
      ],
      answer: 0,
      skill: "Generative AI",
      difficulty: "Easy",
    },
  ],

  "Full Stack Developer": [
    {
      id: "fs-1",
      question:
        "Which technology is commonly used to build React applications?",
      options: [
        "JavaScript",
        "SQL only",
        "Python only",
        "C only",
      ],
      answer: 0,
      skill: "JavaScript",
      difficulty: "Easy",
    },
    {
      id: "fs-2",
      question:
        "What is REST?",
      options: [
        "An architectural style for networked APIs",
        "A database",
        "A CSS framework",
        "A programming language",
      ],
      answer: 0,
      skill: "APIs",
      difficulty: "Easy",
    },
    {
      id: "fs-3",
      question:
        "Which HTTP method is commonly used to create a resource?",
      options: [
        "GET",
        "POST",
        "DELETE",
        "HEAD",
      ],
      answer: 1,
      skill: "APIs",
      difficulty: "Easy",
    },
    {
      id: "fs-4",
      question:
        "Which technology is commonly used for backend JavaScript development?",
      options: [
        "Node.js",
        "Figma",
        "Photoshop",
        "HTML",
      ],
      answer: 0,
      skill: "Backend Development",
      difficulty: "Easy",
    },
    {
      id: "fs-5",
      question:
        "What does CRUD stand for?",
      options: [
        "Create Read Update Delete",
        "Code Run Upload Download",
        "Create Render Use Deploy",
        "Connect Read Upload Debug",
      ],
      answer: 0,
      skill: "Backend Development",
      difficulty: "Easy",
    },
    {
      id: "fs-6",
      question:
        "Which HTTP status code represents a successful request?",
      options: [
        "200",
        "404",
        "500",
        "301",
      ],
      answer: 0,
      skill: "APIs",
      difficulty: "Easy",
    },
    {
      id: "fs-7",
      question:
        "What is a component in React?",
      options: [
        "Reusable UI building block",
        "Database table",
        "HTTP protocol",
        "Server process",
      ],
      answer: 0,
      skill: "React",
      difficulty: "Easy",
    },
    {
      id: "fs-8",
      question:
        "What does middleware commonly do in Express?",
      options: [
        "Processes requests between stages of the server pipeline",
        "Creates CSS",
        "Compiles React",
        "Stores images only",
      ],
      answer: 0,
      skill: "Backend Development",
      difficulty: "Medium",
    },
    {
      id: "fs-9",
      question:
        "Which database is commonly used with Node.js applications?",
      options: [
        "MongoDB",
        "HTML",
        "CSS",
        "Webpack",
      ],
      answer: 0,
      skill: "Databases",
      difficulty: "Easy",
    },
    {
      id: "fs-10",
      question:
        "What is authentication?",
      options: [
        "Verifying a user's identity",
        "Changing CSS",
        "Sorting an array",
        "Compressing files",
      ],
      answer: 0,
      skill: "Security",
      difficulty: "Easy",
    },
  ],

  "Data Analyst": [
    {
      id: "da-1",
      question:
        "Which SQL clause filters rows?",
      options: [
        "WHERE",
        "GROUP BY",
        "ORDER BY",
        "JOIN",
      ],
      answer: 0,
      skill: "SQL",
      difficulty: "Easy",
    },
    {
      id: "da-2",
      question:
        "Which SQL clause groups records?",
      options: [
        "GROUP BY",
        "WHERE",
        "LIMIT",
        "VALUES",
      ],
      answer: 0,
      skill: "SQL",
      difficulty: "Easy",
    },
    {
      id: "da-3",
      question:
        "Which chart is useful for comparing categories?",
      options: [
        "Bar chart",
        "Scatter plot only",
        "Histogram only",
        "Network graph",
      ],
      answer: 0,
      skill: "Data Visualization",
      difficulty: "Easy",
    },
    {
      id: "da-4",
      question:
        "What does KPI stand for?",
      options: [
        "Key Performance Indicator",
        "Key Programming Interface",
        "Known Processing Index",
        "Kernel Performance Input",
      ],
      answer: 0,
      skill: "Business Intelligence",
      difficulty: "Easy",
    },
    {
      id: "da-5",
      question:
        "What is data cleaning?",
      options: [
        "Correcting or handling inaccurate, missing or inconsistent data",
        "Deleting the database",
        "Encrypting every column",
        "Creating a website",
      ],
      answer: 0,
      skill: "Data Analysis",
      difficulty: "Easy",
    },
    {
      id: "da-6",
      question:
        "Which measure is less affected by extreme values?",
      options: [
        "Median",
        "Mean",
        "Sum",
        "Variance",
      ],
      answer: 0,
      skill: "Statistics",
      difficulty: "Medium",
    },
    {
      id: "da-7",
      question:
        "What is a dashboard?",
      options: [
        "A visual interface for monitoring important metrics",
        "A database engine",
        "A programming language",
        "An operating system",
      ],
      answer: 0,
      skill: "Data Visualization",
      difficulty: "Easy",
    },
    {
      id: "da-8",
      question:
        "Which Python library is widely used for data analysis?",
      options: [
        "Pandas",
        "React",
        "Express",
        "Socket.IO",
      ],
      answer: 0,
      skill: "Python",
      difficulty: "Easy",
    },
    {
      id: "da-9",
      question:
        "What does a JOIN do in SQL?",
      options: [
        "Combines related rows from tables",
        "Deletes rows",
        "Creates CSS",
        "Encrypts values",
      ],
      answer: 0,
      skill: "SQL",
      difficulty: "Easy",
    },
    {
      id: "da-10",
      question:
        "What is an outlier?",
      options: [
        "An unusually distant observation",
        "A database key",
        "A chart title",
        "A SQL command",
      ],
      answer: 0,
      skill: "Statistics",
      difficulty: "Easy",
    },
  ],

  "Software Engineer": [
    {
      id: "se-1",
      question:
        "Which data structure follows LIFO?",
      options: [
        "Stack",
        "Queue",
        "Graph",
        "Heap only",
      ],
      answer: 0,
      skill: "Data Structures",
      difficulty: "Easy",
    },
    {
      id: "se-2",
      question:
        "Which data structure follows FIFO?",
      options: [
        "Stack",
        "Queue",
        "Tree",
        "Graph",
      ],
      answer: 1,
      skill: "Data Structures",
      difficulty: "Easy",
    },
    {
      id: "se-3",
      question:
        "Average lookup time in a hash table is typically:",
      options: [
        "O(1)",
        "O(n²)",
        "O(log n)",
        "O(n!)",
      ],
      answer: 0,
      skill: "Algorithms",
      difficulty: "Medium",
    },
    {
      id: "se-4",
      question:
        "Which algorithm is commonly used for shortest paths with non-negative edge weights?",
      options: [
        "Dijkstra's algorithm",
        "Binary Search",
        "Merge Sort",
        "DFS only",
      ],
      answer: 0,
      skill: "Algorithms",
      difficulty: "Medium",
    },
    {
      id: "se-5",
      question:
        "What does O(n) describe?",
      options: [
        "Time or space growth proportional to input size",
        "Constant memory only",
        "Database size",
        "CPU frequency",
      ],
      answer: 0,
      skill: "Algorithms",
      difficulty: "Easy",
    },
    {
      id: "se-6",
      question:
        "Which principle hides implementation details?",
      options: [
        "Encapsulation",
        "Inheritance",
        "Recursion",
        "Sorting",
      ],
      answer: 0,
      skill: "OOP",
      difficulty: "Easy",
    },
    {
      id: "se-7",
      question:
        "Which keyword creates a class in Java?",
      options: [
        "class",
        "struct",
        "object",
        "define",
      ],
      answer: 0,
      skill: "Programming",
      difficulty: "Easy",
    },
    {
      id: "se-8",
      question:
        "Which database language is used to query relational databases?",
      options: [
        "SQL",
        "CSS",
        "HTML",
        "JSON",
      ],
      answer: 0,
      skill: "Databases",
      difficulty: "Easy",
    },
    {
      id: "se-9",
      question:
        "What is recursion?",
      options: [
        "A function calling itself",
        "A database join",
        "A CSS property",
        "A network protocol",
      ],
      answer: 0,
      skill: "Programming",
      difficulty: "Easy",
    },
    {
      id: "se-10",
      question:
        "What is unit testing?",
      options: [
        "Testing individual pieces of software",
        "Testing an entire company",
        "Deploying a database",
        "Designing UI colors",
      ],
      answer: 0,
      skill: "Software Engineering",
      difficulty: "Easy",
    },
  ],
};

export default roleQuestions;