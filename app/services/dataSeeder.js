import firestoreService from "./firestoreService.js";
import JobPostings from "../models/JobPostings.js";

/**
 * Seed Firestore with initial data for the DoneWithIt job-seeking app
 */
class DataSeeder {
  constructor() {
    this.firestoreService = firestoreService;
  }

  /**
   * Seed all initial data
   */
  async seedAll() {
    try {
      console.log("🌱 Starting database seeding...");

      const employerIds = await this.seedUsers();
      await this.seedJobPostings(employerIds);

      console.log("✅ Database seeding completed successfully!");
    } catch (error) {
      console.error("❌ Error seeding database:", error);
      throw error;
    }
  }

  /**
   * Seed users (employers and applicants)
   */
  async seedUsers() {
    console.log("👥 Seeding users...");

    const users = [
      {
        email: "employer@techcorp.com",
        name: "John Smith",
        password: "password123",
        userType: "employer",
        bio: "TechCorp CEO passionate about building great products",
        location: "San Francisco, CA",
        rating: 4.8,
        totalSales: 0,
      },
      {
        email: "employer@startupxyz.com",
        name: "Sarah Johnson",
        password: "password123",
        userType: "employer",
        bio: "Startup founder looking for talented developers",
        location: "Austin, TX",
        rating: 4.5,
        totalSales: 0,
      },
      {
        email: "applicant1@example.com",
        name: "Alice Developer",
        password: "password123",
        userType: "applicant",
        bio: "Full-stack developer with 3 years experience",
        location: "New York, NY",
        rating: 0,
        totalSales: 0,
      },
      {
        email: "applicant2@example.com",
        name: "Bob Engineer",
        password: "password123",
        userType: "applicant",
        bio: "Software engineer specializing in React and Node.js",
        location: "Los Angeles, CA",
        rating: 0,
        totalSales: 0,
      },
    ];

    const employerIds = [];

    for (const userData of users) {
      try {
        const userId = await this.firestoreService.createUser(userData);
        console.log(
          `   ✅ Created user: ${userData.name} (${userData.userType})`
        );

        if (userData.userType === "employer") {
          employerIds.push(userId);
        }
      } catch (error) {
        console.error(`   ❌ Error creating user ${userData.name}:`, error);
      }
    }

    console.log(
      `   📊 Created ${employerIds.length} employers and ${
        users.length - employerIds.length
      } applicants`
    );
    return employerIds;
  }

  /**
   * Seed job postings
   */
  async seedJobPostings(employerIds) {
    console.log("💼 Seeding job postings...");

    const jobPostings = [
      {
        jobTitle: "Senior Software Engineer",
        companyName: "TechCorp Inc.",
        companyRating: 4.5,
        companyReviewsCount: 1250,
        location: "San Francisco, CA",
        workSetup: "Hybrid",
        department: "Engineering",
        employmentType: "Full-time",
        salary: "$120,000 - $160,000",
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        applicationVolume: "High",
        skills: ["JavaScript", "React", "Node.js", "Python", "AWS"],
        responsibilities: [
          "Design and develop scalable web applications",
          "Collaborate with cross-functional teams",
          "Mentor junior developers",
          "Participate in code reviews and technical discussions",
        ],
        requirements: [
          "5+ years of software development experience",
          "Strong proficiency in JavaScript and modern frameworks",
          "Experience with cloud platforms (AWS/Azure/GCP)",
          "Bachelor's degree in Computer Science or related field",
        ],
        educationRequirement:
          "Bachelor's degree in Computer Science or related field",
        experienceRequirement: "5+ years",
        benefits: [
          "Health Insurance",
          "401k Matching",
          "Flexible PTO",
          "Remote Work Stipend",
        ],
        additionalNotes:
          "Join our innovative team building the future of enterprise software.",
        employerId: employerIds[0], // TechCorp employer
      },
      {
        jobTitle: "Frontend Developer",
        companyName: "StartupXYZ",
        companyRating: 4.2,
        companyReviewsCount: 89,
        location: "Austin, TX",
        workSetup: "Remote",
        department: "Product",
        employmentType: "Full-time",
        salary: "$80,000 - $110,000",
        postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        applicationVolume: "Medium",
        skills: ["React", "TypeScript", "CSS", "HTML", "Git"],
        responsibilities: [
          "Build responsive user interfaces",
          "Implement pixel-perfect designs",
          "Optimize application performance",
          "Work closely with UX/UI designers",
        ],
        requirements: [
          "3+ years of frontend development experience",
          "Proficiency in React and modern JavaScript",
          "Experience with CSS preprocessors",
          "Understanding of web accessibility standards",
        ],
        educationRequirement: "Bachelor's degree preferred",
        experienceRequirement: "3+ years",
        benefits: [
          "Health Insurance",
          "Stock Options",
          "Learning Budget",
          "Flexible Hours",
        ],
        additionalNotes:
          "Fast-paced startup environment with growth opportunities.",
        employerId: employerIds[1], // StartupXYZ employer
      },
      {
        jobTitle: "Product Manager",
        companyName: "InnovateLabs",
        companyRating: 4.7,
        companyReviewsCount: 456,
        location: "New York, NY",
        workSetup: "Onsite",
        department: "Product",
        employmentType: "Full-time",
        salary: "$130,000 - $170,000",
        postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        applicationVolume: "High",
        skills: [
          "Product Strategy",
          "Data Analysis",
          "Agile",
          "User Research",
          "SQL",
        ],
        responsibilities: [
          "Define product vision and strategy",
          "Conduct market research and competitive analysis",
          "Work with engineering teams to deliver features",
          "Analyze product metrics and user feedback",
        ],
        requirements: [
          "4+ years of product management experience",
          "Experience with agile development methodologies",
          "Strong analytical and problem-solving skills",
          "Excellent communication and leadership abilities",
        ],
        educationRequirement: "MBA or equivalent experience",
        experienceRequirement: "4+ years",
        benefits: [
          "Health Insurance",
          "401k Matching",
          "Performance Bonus",
          "Professional Development",
        ],
        additionalNotes:
          "Lead product initiatives that impact millions of users.",
      },
      {
        jobTitle: "Data Scientist",
        companyName: "DataDriven Co.",
        companyRating: 4.4,
        companyReviewsCount: 234,
        location: "Seattle, WA",
        workSetup: "Hybrid",
        department: "Analytics",
        employmentType: "Full-time",
        salary: "$110,000 - $140,000",
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        applicationVolume: "Medium",
        skills: [
          "Python",
          "R",
          "SQL",
          "Machine Learning",
          "Statistics",
          "Tableau",
        ],
        responsibilities: [
          "Analyze large datasets to extract insights",
          "Build predictive models and algorithms",
          "Create data visualizations and reports",
          "Collaborate with business stakeholders",
        ],
        requirements: [
          "3+ years of data science experience",
          "Proficiency in Python and statistical analysis",
          "Experience with machine learning techniques",
          "Strong communication skills",
        ],
        educationRequirement:
          "Master's degree in Data Science, Statistics, or related field",
        experienceRequirement: "3+ years",
        benefits: [
          "Health Insurance",
          "401k Matching",
          "Conference Budget",
          "Flexible PTO",
        ],
        additionalNotes:
          "Work on cutting-edge AI projects with real-world impact.",
      },
      {
        jobTitle: "UX/UI Designer",
        companyName: "DesignStudio",
        companyRating: 4.6,
        companyReviewsCount: 178,
        location: "Los Angeles, CA",
        workSetup: "Onsite",
        department: "Design",
        employmentType: "Full-time",
        salary: "$90,000 - $120,000",
        postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        applicationVolume: "Medium",
        skills: [
          "Figma",
          "Sketch",
          "Adobe Creative Suite",
          "Prototyping",
          "User Research",
        ],
        responsibilities: [
          "Create user-centered designs and prototypes",
          "Conduct user research and usability testing",
          "Collaborate with product and engineering teams",
          "Maintain design systems and guidelines",
        ],
        requirements: [
          "3+ years of UX/UI design experience",
          "Proficiency in design tools and prototyping",
          "Strong portfolio demonstrating design process",
          "Understanding of user-centered design principles",
        ],
        educationRequirement:
          "Bachelor's degree in Design, HCI, or related field",
        experienceRequirement: "3+ years",
        benefits: [
          "Health Insurance",
          "Creative Tools Budget",
          "Flexible Hours",
          "Design Conference Attendance",
        ],
        additionalNotes: "Shape the user experience for millions of users.",
      },
      {
        jobTitle: "DevOps Engineer",
        companyName: "CloudTech Solutions",
        companyRating: 4.3,
        companyReviewsCount: 312,
        location: "Denver, CO",
        workSetup: "Remote",
        department: "Infrastructure",
        employmentType: "Full-time",
        salary: "$100,000 - $130,000",
        postedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        applicationVolume: "Low",
        skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux"],
        responsibilities: [
          "Design and maintain cloud infrastructure",
          "Implement CI/CD pipelines",
          "Monitor system performance and reliability",
          "Automate deployment and scaling processes",
        ],
        requirements: [
          "4+ years of DevOps or infrastructure experience",
          "Strong experience with cloud platforms",
          "Proficiency in infrastructure as code",
          "Knowledge of containerization technologies",
        ],
        educationRequirement:
          "Bachelor's degree in Computer Science or related field",
        experienceRequirement: "4+ years",
        benefits: [
          "Health Insurance",
          "401k Matching",
          "Home Office Stipend",
          "Learning Budget",
        ],
        additionalNotes: "Build and maintain scalable cloud infrastructure.",
      },
      {
        jobTitle: "Marketing Manager",
        companyName: "GrowthAgency",
        companyRating: 4.1,
        companyReviewsCount: 145,
        location: "Chicago, IL",
        workSetup: "Hybrid",
        department: "Marketing",
        employmentType: "Full-time",
        salary: "$85,000 - $115,000",
        postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        applicationVolume: "Medium",
        skills: [
          "Digital Marketing",
          "SEO",
          "Google Analytics",
          "Content Strategy",
          "Social Media",
        ],
        responsibilities: [
          "Develop and execute marketing campaigns",
          "Analyze campaign performance and ROI",
          "Manage social media presence",
          "Collaborate with sales and product teams",
        ],
        requirements: [
          "3+ years of digital marketing experience",
          "Experience with marketing analytics tools",
          "Strong understanding of SEO and SEM",
          "Excellent written and verbal communication",
        ],
        educationRequirement:
          "Bachelor's degree in Marketing, Business, or related field",
        experienceRequirement: "3+ years",
        benefits: [
          "Health Insurance",
          "Performance Bonus",
          "Professional Development",
          "Flexible PTO",
        ],
        additionalNotes: "Drive growth initiatives for B2B SaaS products.",
      },
      {
        jobTitle: "Mobile App Developer",
        companyName: "AppWorks Studio",
        companyRating: 4.8,
        companyReviewsCount: 267,
        location: "Miami, FL",
        workSetup: "Onsite",
        department: "Mobile",
        employmentType: "Full-time",
        salary: "$95,000 - $125,000",
        postedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
        applicationVolume: "High",
        skills: ["React Native", "iOS", "Android", "JavaScript", "Firebase"],
        responsibilities: [
          "Develop cross-platform mobile applications",
          "Implement native features and integrations",
          "Optimize app performance and user experience",
          "Collaborate with design and backend teams",
        ],
        requirements: [
          "3+ years of mobile development experience",
          "Proficiency in React Native or Flutter",
          "Experience with native iOS/Android development",
          "Understanding of mobile UI/UX principles",
        ],
        educationRequirement:
          "Bachelor's degree in Computer Science or related field",
        experienceRequirement: "3+ years",
        benefits: [
          "Health Insurance",
          "Device Allowance",
          "Flexible Hours",
          "Team Retreats",
        ],
        additionalNotes:
          "Build amazing mobile experiences for millions of users.",
      },
      {
        jobTitle: "Security Engineer",
        companyName: "SecureNet Systems",
        companyRating: 4.5,
        companyReviewsCount: 198,
        location: "Boston, MA",
        workSetup: "Hybrid",
        department: "Security",
        employmentType: "Full-time",
        salary: "$115,000 - $145,000",
        postedDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
        applicationVolume: "Low",
        skills: [
          "Cybersecurity",
          "Network Security",
          "Penetration Testing",
          "SIEM",
          "Compliance",
        ],
        responsibilities: [
          "Implement and maintain security measures",
          "Conduct security assessments and audits",
          "Respond to security incidents",
          "Develop security policies and procedures",
        ],
        requirements: [
          "4+ years of cybersecurity experience",
          "Knowledge of security frameworks and standards",
          "Experience with security tools and technologies",
          "Strong analytical and problem-solving skills",
        ],
        educationRequirement:
          "Bachelor's degree in Cybersecurity or related field",
        experienceRequirement: "4+ years",
        benefits: [
          "Health Insurance",
          "Security Certifications Paid",
          "Flexible PTO",
          "Professional Development",
        ],
        additionalNotes:
          "Protect critical systems and data from cyber threats.",
      },
      {
        jobTitle: "QA Engineer",
        companyName: "QualityFirst Software",
        companyRating: 4.2,
        companyReviewsCount: 156,
        location: "Portland, OR",
        workSetup: "Remote",
        department: "Quality Assurance",
        employmentType: "Full-time",
        salary: "$75,000 - $100,000",
        postedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        applicationVolume: "Medium",
        skills: [
          "Test Automation",
          "Selenium",
          "Jest",
          "API Testing",
          "Bug Tracking",
        ],
        responsibilities: [
          "Create and execute test plans and cases",
          "Develop automated test scripts",
          "Identify and document software defects",
          "Collaborate with development teams",
        ],
        requirements: [
          "2+ years of QA testing experience",
          "Experience with test automation frameworks",
          "Knowledge of software development lifecycle",
          "Attention to detail and analytical skills",
        ],
        educationRequirement:
          "Bachelor's degree in Computer Science or related field",
        experienceRequirement: "2+ years",
        benefits: [
          "Health Insurance",
          "401k Matching",
          "Flexible Hours",
          "Remote Work Stipend",
        ],
        additionalNotes: "Ensure software quality and user satisfaction.",
      },
      {
        jobTitle: "Business Analyst",
        companyName: "AnalyticsPro",
        companyRating: 4.4,
        companyReviewsCount: 203,
        location: "Atlanta, GA",
        workSetup: "Onsite",
        department: "Business Intelligence",
        employmentType: "Full-time",
        salary: "$80,000 - $105,000",
        postedDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000), // 11 days ago
        applicationVolume: "Medium",
        skills: [
          "Business Analysis",
          "Requirements Gathering",
          "SQL",
          "Excel",
          "Data Visualization",
        ],
        responsibilities: [
          "Gather and document business requirements",
          "Analyze business processes and workflows",
          "Create functional specifications",
          "Support project implementation and testing",
        ],
        requirements: [
          "3+ years of business analysis experience",
          "Strong analytical and problem-solving skills",
          "Experience with requirement management tools",
          "Excellent communication and interpersonal skills",
        ],
        educationRequirement:
          "Bachelor's degree in Business, Computer Science, or related field",
        experienceRequirement: "3+ years",
        benefits: [
          "Health Insurance",
          "401k Matching",
          "Professional Development",
          "Flexible PTO",
        ],
        additionalNotes: "Bridge the gap between business and technology.",
      },
      {
        jobTitle: "Full Stack Developer",
        companyName: "WebSolutions Inc.",
        companyRating: 4.3,
        companyReviewsCount: 289,
        location: "Phoenix, AZ",
        workSetup: "Hybrid",
        department: "Development",
        employmentType: "Full-time",
        salary: "$90,000 - $120,000",
        postedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
        applicationVolume: "High",
        skills: [
          "JavaScript",
          "React",
          "Node.js",
          "MongoDB",
          "Express",
          "REST APIs",
        ],
        responsibilities: [
          "Develop full-stack web applications",
          "Design and implement APIs",
          "Optimize application performance",
          "Participate in agile development process",
        ],
        requirements: [
          "3+ years of full-stack development experience",
          "Proficiency in JavaScript and modern frameworks",
          "Experience with databases and APIs",
          "Understanding of web security principles",
        ],
        educationRequirement:
          "Bachelor's degree in Computer Science or related field",
        experienceRequirement: "3+ years",
        benefits: [
          "Health Insurance",
          "401k Matching",
          "Flexible PTO",
          "Remote Work Options",
        ],
        additionalNotes: "Build end-to-end solutions for diverse clients.",
      },
      {
        jobTitle: "Technical Writer",
        companyName: "DocuTech",
        companyRating: 4.0,
        companyReviewsCount: 98,
        location: "Raleigh, NC",
        workSetup: "Remote",
        department: "Documentation",
        employmentType: "Full-time",
        salary: "$65,000 - $85,000",
        postedDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000), // 13 days ago
        applicationVolume: "Low",
        skills: [
          "Technical Writing",
          "Documentation",
          "API Documentation",
          "Markdown",
          "Git",
        ],
        responsibilities: [
          "Create clear and comprehensive documentation",
          "Write user guides and API documentation",
          "Collaborate with engineering teams",
          "Maintain documentation standards",
        ],
        requirements: [
          "2+ years of technical writing experience",
          "Strong writing and communication skills",
          "Experience with documentation tools",
          "Understanding of software development",
        ],
        educationRequirement:
          "Bachelor's degree in English, Technical Writing, or related field",
        experienceRequirement: "2+ years",
        benefits: [
          "Health Insurance",
          "Flexible Hours",
          "Remote Work Stipend",
          "Professional Development",
        ],
        additionalNotes: "Make complex technology accessible to users.",
      },
      {
        jobTitle: "System Administrator",
        companyName: "InfraTech Solutions",
        companyRating: 4.1,
        companyReviewsCount: 167,
        location: "Salt Lake City, UT",
        workSetup: "Onsite",
        department: "IT Operations",
        employmentType: "Full-time",
        salary: "$70,000 - $95,000",
        postedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        applicationVolume: "Medium",
        skills: [
          "Linux",
          "Windows Server",
          "Networking",
          "VMware",
          "Active Directory",
        ],
        responsibilities: [
          "Manage and maintain IT infrastructure",
          "Monitor system performance and availability",
          "Implement security measures and policies",
          "Provide technical support to users",
        ],
        requirements: [
          "3+ years of system administration experience",
          "Proficiency in Linux and Windows environments",
          "Knowledge of networking and virtualization",
          "Strong troubleshooting skills",
        ],
        educationRequirement:
          "Bachelor's degree in Computer Science or related field",
        experienceRequirement: "3+ years",
        benefits: [
          "Health Insurance",
          "401k Matching",
          "Certification Reimbursement",
          "Flexible PTO",
        ],
        additionalNotes: "Keep our systems running smoothly and securely.",
      },
      {
        jobTitle: "Machine Learning Engineer",
        companyName: "AI Innovations",
        companyRating: 4.6,
        companyReviewsCount: 345,
        location: "San Diego, CA",
        workSetup: "Hybrid",
        department: "AI/ML",
        employmentType: "Full-time",
        salary: "$130,000 - $170,000",
        postedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        applicationVolume: "High",
        skills: [
          "Python",
          "TensorFlow",
          "PyTorch",
          "Machine Learning",
          "Deep Learning",
          "MLOps",
        ],
        responsibilities: [
          "Design and implement ML models and algorithms",
          "Deploy ML models to production",
          "Optimize model performance and accuracy",
          "Research new ML techniques and applications",
        ],
        requirements: [
          "4+ years of machine learning experience",
          "Strong proficiency in Python and ML frameworks",
          "Experience with model deployment and MLOps",
          "PhD or Master's in ML/AI preferred",
        ],
        educationRequirement:
          "Master's or PhD in Machine Learning, AI, or related field",
        experienceRequirement: "4+ years",
        benefits: [
          "Health Insurance",
          "401k Matching",
          "Research Budget",
          "Conference Attendance",
        ],
        additionalNotes: "Push the boundaries of AI and machine learning.",
      },
      {
        jobTitle: "Customer Success Manager",
        companyName: "ClientFirst SaaS",
        companyRating: 4.4,
        companyReviewsCount: 221,
        location: "Nashville, TN",
        workSetup: "Remote",
        department: "Customer Success",
        employmentType: "Full-time",
        salary: "$75,000 - $100,000",
        postedDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000), // 16 days ago
        applicationVolume: "Medium",
        skills: [
          "Customer Success",
          "CRM",
          "Data Analysis",
          "Communication",
          "Problem Solving",
        ],
        responsibilities: [
          "Manage customer relationships and satisfaction",
          "Onboard new customers and ensure adoption",
          "Identify upsell and expansion opportunities",
          "Collaborate with product and support teams",
        ],
        requirements: [
          "3+ years of customer success or account management experience",
          "Strong interpersonal and communication skills",
          "Experience with SaaS products preferred",
          "Analytical mindset with data-driven approach",
        ],
        educationRequirement: "Bachelor's degree in Business or related field",
        experienceRequirement: "3+ years",
        benefits: [
          "Health Insurance",
          "401k Matching",
          "Commission Structure",
          "Flexible PTO",
        ],
        additionalNotes:
          "Help customers achieve their goals with our platform.",
      },
      {
        jobTitle: "Blockchain Developer",
        companyName: "CryptoTech Labs",
        companyRating: 4.2,
        companyReviewsCount: 134,
        location: "Las Vegas, NV",
        workSetup: "Remote",
        department: "Blockchain",
        employmentType: "Full-time",
        salary: "$110,000 - $150,000",
        postedDate: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000), // 17 days ago
        applicationVolume: "Low",
        skills: [
          "Solidity",
          "Ethereum",
          "Web3",
          "Smart Contracts",
          "DeFi",
          "Cryptography",
        ],
        responsibilities: [
          "Develop smart contracts and blockchain applications",
          "Implement decentralized applications (dApps)",
          "Conduct security audits of blockchain code",
          "Research emerging blockchain technologies",
        ],
        requirements: [
          "3+ years of blockchain development experience",
          "Proficiency in Solidity and Web3 technologies",
          "Understanding of cryptography and consensus mechanisms",
          "Experience with DeFi protocols",
        ],
        educationRequirement:
          "Bachelor's degree in Computer Science or related field",
        experienceRequirement: "3+ years",
        benefits: [
          "Health Insurance",
          "Crypto Bonus",
          "Flexible Hours",
          "Conference Budget",
        ],
        additionalNotes: "Build the future of decentralized finance and Web3.",
      },
      {
        jobTitle: "Scrum Master",
        companyName: "AgileWorks",
        companyRating: 4.5,
        companyReviewsCount: 187,
        location: "Minneapolis, MN",
        workSetup: "Hybrid",
        department: "Agile",
        employmentType: "Full-time",
        salary: "$95,000 - $125,000",
        postedDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), // 18 days ago
        applicationVolume: "Medium",
        skills: [
          "Scrum",
          "Agile",
          "Facilitation",
          "Coaching",
          "Jira",
          "Team Leadership",
        ],
        responsibilities: [
          "Facilitate Scrum ceremonies and processes",
          "Coach teams on agile principles and practices",
          "Remove impediments to team progress",
          "Promote continuous improvement and retrospectives",
        ],
        requirements: [
          "3+ years of Scrum Master experience",
          "Certified Scrum Master (CSM) certification",
          "Strong facilitation and coaching skills",
          "Experience with agile tools and metrics",
        ],
        educationRequirement: "Bachelor's degree preferred",
        experienceRequirement: "3+ years",
        benefits: [
          "Health Insurance",
          "401k Matching",
          "Professional Development",
          "Flexible PTO",
        ],
        additionalNotes:
          "Guide teams to deliver high-quality software efficiently.",
      },
      {
        jobTitle: "Database Administrator",
        companyName: "DataCore Systems",
        companyRating: 4.3,
        companyReviewsCount: 198,
        location: "Columbus, OH",
        workSetup: "Onsite",
        department: "Database",
        employmentType: "Full-time",
        salary: "$85,000 - $115,000",
        postedDate: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000), // 19 days ago
        applicationVolume: "Medium",
        skills: [
          "SQL",
          "PostgreSQL",
          "MySQL",
          "Database Design",
          "Performance Tuning",
          "Backup/Recovery",
        ],
        responsibilities: [
          "Design and maintain database schemas",
          "Optimize database performance and queries",
          "Implement backup and recovery procedures",
          "Monitor database security and access controls",
        ],
        requirements: [
          "4+ years of database administration experience",
          "Proficiency in SQL and relational databases",
          "Experience with database performance tuning",
          "Knowledge of backup and recovery best practices",
        ],
        educationRequirement:
          "Bachelor's degree in Computer Science or related field",
        experienceRequirement: "4+ years",
        benefits: [
          "Health Insurance",
          "401k Matching",
          "Certification Support",
          "Flexible PTO",
        ],
        additionalNotes:
          "Ensure data integrity and optimal database performance.",
      },
      {
        jobTitle: "Content Marketing Specialist",
        companyName: "ContentCreators Inc.",
        companyRating: 4.1,
        companyReviewsCount: 145,
        location: "Orlando, FL",
        workSetup: "Remote",
        department: "Content",
        employmentType: "Full-time",
        salary: "$60,000 - $80,000",
        postedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        applicationVolume: "Medium",
        skills: [
          "Content Marketing",
          "SEO",
          "Copywriting",
          "Social Media",
          "Content Strategy",
        ],
        responsibilities: [
          "Create engaging content for various channels",
          "Develop content marketing strategies",
          "Optimize content for search engines",
          "Analyze content performance and engagement",
        ],
        requirements: [
          "2+ years of content marketing experience",
          "Strong writing and editing skills",
          "Experience with SEO and content analytics",
          "Creative thinking and strategic mindset",
        ],
        educationRequirement:
          "Bachelor's degree in Marketing, Communications, or related field",
        experienceRequirement: "2+ years",
        benefits: [
          "Health Insurance",
          "Flexible Hours",
          "Remote Work Stipend",
          "Creative Freedom",
        ],
        additionalNotes:
          "Create compelling content that drives engagement and growth.",
      },
      {
        jobTitle: "Network Engineer",
        companyName: "NetConnect Solutions",
        companyRating: 4.2,
        companyReviewsCount: 176,
        location: "Tampa, FL",
        workSetup: "Onsite",
        department: "Network Operations",
        employmentType: "Full-time",
        salary: "$80,000 - $110,000",
        postedDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
        applicationVolume: "Low",
        skills: [
          "Cisco",
          "Network Security",
          "Routing/Switching",
          "VPN",
          "Firewall",
          "MPLS",
        ],
        responsibilities: [
          "Design and maintain network infrastructure",
          "Implement network security measures",
          "Troubleshoot network issues and outages",
          "Monitor network performance and capacity",
        ],
        requirements: [
          "3+ years of network engineering experience",
          "CCNA or equivalent certification",
          "Experience with Cisco networking equipment",
          "Knowledge of network security principles",
        ],
        educationRequirement:
          "Bachelor's degree in Computer Science or related field",
        experienceRequirement: "3+ years",
        benefits: [
          "Health Insurance",
          "401k Matching",
          "Certification Reimbursement",
          "Flexible PTO",
        ],
        additionalNotes: "Build and maintain robust network infrastructure.",
      },
      {
        jobTitle: "Game Developer",
        companyName: "GameStudio Pro",
        companyRating: 4.7,
        companyReviewsCount: 298,
        location: "Austin, TX",
        workSetup: "Hybrid",
        department: "Game Development",
        employmentType: "Full-time",
        salary: "$85,000 - $115,000",
        postedDate: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000), // 22 days ago
        applicationVolume: "High",
        skills: [
          "Unity",
          "C#",
          "Game Design",
          "3D Modeling",
          "Animation",
          "Unreal Engine",
        ],
        responsibilities: [
          "Develop game mechanics and features",
          "Create engaging gameplay experiences",
          "Collaborate with artists and designers",
          "Optimize game performance across platforms",
        ],
        requirements: [
          "3+ years of game development experience",
          "Proficiency in Unity or Unreal Engine",
          "Strong programming skills in C# or C++",
          "Passion for gaming and creative problem-solving",
        ],
        educationRequirement:
          "Bachelor's degree in Game Development or Computer Science",
        experienceRequirement: "3+ years",
        benefits: [
          "Health Insurance",
          "Game Library Access",
          "Flexible Hours",
          "Team Building Events",
        ],
        additionalNotes:
          "Create amazing gaming experiences for players worldwide.",
      },
      {
        jobTitle: "HR Business Partner",
        companyName: "PeopleFirst Corp",
        companyRating: 4.3,
        companyReviewsCount: 189,
        location: "Charlotte, NC",
        workSetup: "Onsite",
        department: "Human Resources",
        employmentType: "Full-time",
        salary: "$90,000 - $120,000",
        postedDate: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000), // 23 days ago
        applicationVolume: "Medium",
        skills: [
          "HR Business Partnership",
          "Employee Relations",
          "Talent Management",
          "Change Management",
        ],
        responsibilities: [
          "Partner with business leaders on HR initiatives",
          "Support organizational development and change",
          "Manage employee relations and performance",
          "Drive talent acquisition and retention strategies",
        ],
        requirements: [
          "5+ years of HR business partner experience",
          "Strong business acumen and strategic thinking",
          "Excellent interpersonal and communication skills",
          "Experience with HR systems and processes",
        ],
        educationRequirement:
          "Bachelor's degree in Human Resources or Business Administration",
        experienceRequirement: "5+ years",
        benefits: [
          "Health Insurance",
          "401k Matching",
          "Professional Development",
          "Flexible PTO",
        ],
        additionalNotes:
          "Shape the employee experience and organizational culture.",
      },
      {
        jobTitle: "Cybersecurity Analyst",
        companyName: "SecureGuard Inc.",
        companyRating: 4.4,
        companyReviewsCount: 234,
        location: "Washington, DC",
        workSetup: "Hybrid",
        department: "Cybersecurity",
        employmentType: "Full-time",
        salary: "$95,000 - $125,000",
        postedDate: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000), // 24 days ago
        applicationVolume: "Medium",
        skills: [
          "Cybersecurity",
          "Threat Analysis",
          "Incident Response",
          "SIEM",
          "Vulnerability Assessment",
        ],
        responsibilities: [
          "Monitor and analyze security threats",
          "Investigate security incidents and breaches",
          "Conduct vulnerability assessments",
          "Develop security recommendations and reports",
        ],
        requirements: [
          "3+ years of cybersecurity analysis experience",
          "Knowledge of security tools and frameworks",
          "Strong analytical and problem-solving skills",
          "Security certifications (CISSP, CEH) preferred",
        ],
        educationRequirement:
          "Bachelor's degree in Cybersecurity or related field",
        experienceRequirement: "3+ years",
        benefits: [
          "Health Insurance",
          "Security Clearance",
          "Professional Development",
          "Flexible PTO",
        ],
        additionalNotes:
          "Protect against evolving cyber threats and vulnerabilities.",
      },
      {
        jobTitle: "E-commerce Manager",
        companyName: "ShopSmart Online",
        companyRating: 4.0,
        companyReviewsCount: 156,
        location: "Dallas, TX",
        workSetup: "Remote",
        department: "E-commerce",
        employmentType: "Full-time",
        salary: "$75,000 - $100,000",
        postedDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
        applicationVolume: "Medium",
        skills: [
          "E-commerce",
          "Shopify",
          "Digital Marketing",
          "Analytics",
          "Customer Experience",
        ],
        responsibilities: [
          "Manage online store operations and performance",
          "Optimize conversion rates and user experience",
          "Implement marketing campaigns and promotions",
          "Analyze sales data and customer behavior",
        ],
        requirements: [
          "3+ years of e-commerce management experience",
          "Experience with e-commerce platforms",
          "Strong analytical and marketing skills",
          "Understanding of online retail best practices",
        ],
        educationRequirement:
          "Bachelor's degree in Business, Marketing, or related field",
        experienceRequirement: "3+ years",
        benefits: [
          "Health Insurance",
          "Performance Bonus",
          "Flexible Hours",
          "Remote Work Stipend",
        ],
        additionalNotes: "Drive online sales and customer satisfaction.",
      },
      {
        jobTitle: "Embedded Systems Engineer",
        companyName: "IoT Solutions Ltd.",
        companyRating: 4.5,
        companyReviewsCount: 201,
        location: "Detroit, MI",
        workSetup: "Onsite",
        department: "Hardware",
        employmentType: "Full-time",
        salary: "$95,000 - $125,000",
        postedDate: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000), // 26 days ago
        applicationVolume: "Low",
        skills: [
          "Embedded C/C++",
          "Microcontrollers",
          "RTOS",
          "IoT",
          "Hardware Design",
        ],
        responsibilities: [
          "Design and develop embedded systems",
          "Implement firmware for IoT devices",
          "Optimize power consumption and performance",
          "Integrate hardware and software components",
        ],
        requirements: [
          "4+ years of embedded systems experience",
          "Proficiency in C/C++ for embedded systems",
          "Experience with microcontrollers and RTOS",
          "Knowledge of IoT protocols and standards",
        ],
        educationRequirement:
          "Bachelor's degree in Electrical Engineering or Computer Science",
        experienceRequirement: "4+ years",
        benefits: [
          "Health Insurance",
          "401k Matching",
          "Hardware Allowance",
          "Professional Development",
        ],
        additionalNotes:
          "Build the next generation of IoT devices and systems.",
      },
      {
        jobTitle: "Data Engineer",
        companyName: "BigData Corp",
        companyRating: 4.6,
        companyReviewsCount: 312,
        location: "Palo Alto, CA",
        workSetup: "Hybrid",
        department: "Data Engineering",
        employmentType: "Full-time",
        salary: "$115,000 - $150,000",
        postedDate: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000), // 27 days ago
        applicationVolume: "High",
        skills: ["Python", "SQL", "Apache Spark", "Kafka", "Airflow", "AWS"],
        responsibilities: [
          "Design and build data pipelines",
          "Process large-scale datasets",
          "Implement data warehousing solutions",
          "Ensure data quality and reliability",
        ],
        requirements: [
          "4+ years of data engineering experience",
          "Strong proficiency in Python and SQL",
          "Experience with big data technologies",
          "Knowledge of cloud data platforms",
        ],
        educationRequirement:
          "Bachelor's degree in Computer Science or related field",
        experienceRequirement: "4+ years",
        benefits: [
          "Health Insurance",
          "401k Matching",
          "Stock Options",
          "Learning Budget",
        ],
        additionalNotes:
          "Build the data infrastructure that powers our AI systems.",
      },
      {
        jobTitle: "UX Researcher",
        companyName: "UserInsight Labs",
        companyRating: 4.4,
        companyReviewsCount: 178,
        location: "San Francisco, CA",
        workSetup: "Remote",
        department: "Research",
        employmentType: "Full-time",
        salary: "$100,000 - $130,000",
        postedDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // 28 days ago
        applicationVolume: "Medium",
        skills: [
          "User Research",
          "Usability Testing",
          "Qualitative Research",
          "Quantitative Research",
          "Persona Development",
        ],
        responsibilities: [
          "Conduct user research studies and interviews",
          "Analyze user behavior and feedback",
          "Create user personas and journey maps",
          "Collaborate with design and product teams",
        ],
        requirements: [
          "3+ years of UX research experience",
          "Strong qualitative and quantitative research skills",
          "Experience with research methodologies",
          "Excellent communication and presentation skills",
        ],
        educationRequirement:
          "Master's degree in Human-Computer Interaction, Psychology, or related field",
        experienceRequirement: "3+ years",
        benefits: [
          "Health Insurance",
          "Research Budget",
          "Flexible Hours",
          "Professional Development",
        ],
        additionalNotes:
          "Understand users deeply to create exceptional experiences.",
      },
      {
        jobTitle: "Solutions Architect",
        companyName: "Enterprise Solutions",
        companyRating: 4.5,
        companyReviewsCount: 267,
        location: "New York, NY",
        workSetup: "Hybrid",
        department: "Architecture",
        employmentType: "Full-time",
        salary: "$140,000 - $180,000",
        postedDate: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), // 29 days ago
        applicationVolume: "Low",
        skills: [
          "Solution Architecture",
          "Cloud Architecture",
          "System Design",
          "Enterprise Software",
          "Technical Leadership",
        ],
        responsibilities: [
          "Design comprehensive technology solutions",
          "Architect enterprise-scale applications",
          "Provide technical leadership and guidance",
          "Evaluate and recommend technology choices",
        ],
        requirements: [
          "7+ years of software architecture experience",
          "Deep knowledge of enterprise systems and cloud platforms",
          "Strong technical leadership and communication skills",
          "Experience with large-scale system design",
        ],
        educationRequirement:
          "Bachelor's degree in Computer Science or related field",
        experienceRequirement: "7+ years",
        benefits: [
          "Health Insurance",
          "401k Matching",
          "Executive Bonus",
          "Professional Development",
        ],
        additionalNotes:
          "Design the technology foundation for enterprise success.",
      },
      {
        jobTitle: "Technical Support Engineer",
        companyName: "HelpDesk Pro",
        companyRating: 4.0,
        companyReviewsCount: 145,
        location: "Indianapolis, IN",
        workSetup: "Remote",
        department: "Support",
        employmentType: "Full-time",
        salary: "$55,000 - $75,000",
        postedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        applicationVolume: "High",
        skills: [
          "Technical Support",
          "Troubleshooting",
          "Customer Service",
          "Ticketing Systems",
          "Documentation",
        ],
        responsibilities: [
          "Provide technical support to customers",
          "Troubleshoot and resolve technical issues",
          "Document solutions and best practices",
          "Escalate complex issues to engineering teams",
        ],
        requirements: [
          "2+ years of technical support experience",
          "Strong problem-solving and communication skills",
          "Experience with support ticketing systems",
          "Technical background in software or IT",
        ],
        educationRequirement: "Associate's degree or equivalent experience",
        experienceRequirement: "2+ years",
        benefits: [
          "Health Insurance",
          "401k Matching",
          "Flexible Hours",
          "Remote Work Stipend",
        ],
        additionalNotes:
          "Help customers succeed with our products and services.",
      },
    ];

    // For debugging, only seed the first job posting
    const jobPostingsToSeed = jobPostings.slice(0, 1);

    for (const jobData of jobPostingsToSeed) {
      try {
        // Create a minimal test job posting
        const minimalJobData = {
          jobTitle: jobData.jobTitle,
          companyName: jobData.companyName,
          location: jobData.location,
          employmentType: jobData.employmentType,
        };

        console.log(
          "Minimal firestore data:",
          JSON.stringify(minimalJobData, null, 2)
        );

        // Get the existing Firebase app instead of initializing a new one
        const { getApps, getApp } = await import("firebase/app");
        const { getFirestore, collection, addDoc, Timestamp } = await import(
          "firebase/firestore"
        );

        let app;
        if (getApps().length > 0) {
          console.log("Using existing Firebase app");
          app = getApp();
        } else {
          console.log("No existing Firebase app found");
          // This shouldn't happen in the seeder context
          return;
        }

        const db = getFirestore(app);

        console.log("Testing write to test collection...");
        const testRef = await addDoc(collection(db, "test"), {
          message: "Test from seeder using existing app",
          timestamp: Timestamp.now(),
        });
        console.log("✅ Test collection write successful, ID:", testRef.id);

        // Now try the job posting
        const docRef = await addDoc(collection(db, "jobPostings"), {
          ...minimalJobData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        console.log(
          `  ✓ Created minimal job posting: ${jobData.jobTitle} at ${jobData.companyName} (ID: ${docRef.id})`
        );
      } catch (error) {
        console.error(
          `  ❌ Error creating job posting ${jobData.jobTitle}:`,
          error.message
        );
        // Continue with next job posting instead of stopping
      }
    }
  }
  async clearAll() {
    console.log("🗑️  Clearing all data...");

    const collections = ["jobPostings"];

    for (const collectionName of collections) {
      try {
        const documents = await this.firestoreService.getAll(collectionName);
        for (const doc of documents) {
          await this.firestoreService.delete(collectionName, doc.id);
        }
        console.log(
          `  ✓ Cleared ${documents.length} documents from ${collectionName}`
        );
      } catch (error) {
        console.error(`  ❌ Error clearing ${collectionName}:`, error);
      }
    }

    console.log("✅ All data cleared!");
  }
}

// Export a singleton instance
const dataSeeder = new DataSeeder();
export default dataSeeder;
