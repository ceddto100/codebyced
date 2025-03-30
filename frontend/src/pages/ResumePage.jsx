import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ResumePage = () => {
  // Mock data - replace with your actual information
  const personalInfo = {
    name: "Cedrick Carter",
    title: "Software Developer",
    summary: "Versatile software developer adept at documentation comprehension, automation, and seamless code integration using diverse coding tools. Driven by entrepreneurial initiative and enthusiasm for machine learning, I excel at problem-solving, API integrations, AI-powered solutions, and low-code/no-code development.",
    email: "cartercedrick35@gmail.com",
    phone: "(502) 830-7701",
    location: "Willing to relocate - U.S. or remote",
    linkedin: "linkedin.com/in/cedrick-carter-5b41b4315/",
    github: "github.com/ceddto100",
  };

  const workExperience = [
    {
      id: 1,
      role: "Developer",
      company: "ChazzTalk Conversational AI",
      period: "2025 - Ongoing",
      description: "Developed an AI-powered customer service chatbot leveraging conversational AI technologies.",
      achievements: [
        "Developed an AI-powered customer service chatbot leveraging conversational AI technologies",
        "Integrated APIs and automation workflows to enhance customer interactions and streamline support",
        "Utilized various AI tools, including GitHub Copilot and Eleven Labs, for debugging and optimizing chatbot functionalities"
      ]
    },
    {
      id: 2,
      role: "Developer",
      company: "K-LooseThreads Embroidery Business",
      period: "2025 - Ongoing",
      description: "Developed, managed, and improved software integrations to automate embroidery business operations.",
      achievements: [
        "Developed, managed, and improved software integrations to automate embroidery business operations"
      ]
    }
  ];

  const education = [
    {
      id: 1,
      degree: "Bachelor of Science in Computer Science",
      institution: "University of Phoenix",
      period: "Expected 2026",
      description: "Relevant Coursework: Data Structures & Algorithms, Object-Oriented Programming (OOP), Machine Learning, Web Development, Database Management, Software Engineering"
    }
  ];

  const skills = {
    technical: [
      "Python", "JavaScript", "HTML & CSS", "SQL (Basic)",
      "Flask", "Pandas", "NumPy", "TensorFlow", "Scikit-learn (Basic)",
      "MongoDB", "Git", "GitHub", "Eleven Labs", "Runway ML"
    ],
    soft: [
      "Problem Solving", "API Integration", "Business Automation",
      "AI Solutions", "Low-code/No-code Development"
    ]
  };

  const certifications = [
    "Make.com (Business automation)",
    "OpenAI GPT-4",
    "Eleven Labs API",
    "Stripe API"
  ];

  // Animation controls
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Function to animate elements when they come into view
  const AnimatedSection = ({ children }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
      threshold: 0.1,
      triggerOnce: true
    });

    useEffect(() => {
      if (inView) {
        controls.start('visible');
      }
    }, [controls, inView]);

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={fadeInUp}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 relative">
      {/* Static Background Elements */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-blue-500/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-indigo-500/5 rounded-full filter blur-3xl"></div>
      
      {/* Wave Divider - Top */}
      <div className="w-full h-16 overflow-hidden mb-12">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-blue-50"></path>
        </svg>
      </div>
      
      {/* Header / Personal Info */}
      <AnimatedSection>
        <div className="backdrop-blur-sm bg-white/90 rounded-lg shadow-md p-8 mb-10 border border-gray-100 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/5 rounded-full"></div>
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-center relative z-10">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">{personalInfo.name}</h1>
              <div className="relative">
                <h2 className="text-2xl text-blue-600 mt-1">{personalInfo.title}</h2>
                <div className="absolute bottom-0 left-0 w-16 h-0.5 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 space-y-1 text-gray-600">
              <p className="flex items-center">
                <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {personalInfo.email}
              </p>
              <p className="flex items-center">
                <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {personalInfo.phone}
              </p>
              <p className="flex items-center">
                <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {personalInfo.location}
              </p>
              <div className="flex space-x-4 mt-2">
                <a href={`https://${personalInfo.linkedin}`} className="text-blue-600 hover:text-blue-800 flex items-center group">
                  <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  LinkedIn
                  <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                </a>
                <a href={`https://${personalInfo.github}`} className="text-blue-600 hover:text-blue-800 flex items-center group">
                  <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                  <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-6 relative z-10">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Professional Summary</h3>
            <p className="text-gray-600">{personalInfo.summary}</p>
          </div>
        </div>
      </AnimatedSection>

      {/* Wave Divider - Middle */}
      <div className="w-full h-16 overflow-hidden my-12 transform rotate-180">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-indigo-50"></path>
        </svg>
      </div>

      {/* Work Experience */}
      <section className="mb-12">
        <AnimatedSection>
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Work Experience</h2>
            <div className="absolute bottom-0 left-0 w-24 h-1 bg-blue-500 rounded-full"></div>
          </div>
        </AnimatedSection>
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative border-l-2 border-blue-500 pl-8 ml-4"
        >
          {workExperience.map((job) => (
            <AnimatedSection key={job.id}>
              <div className="relative mb-12">
                <div className="absolute -left-12 mt-1.5 h-7 w-7 rounded-full border-2 border-blue-500 bg-white flex items-center justify-center shadow-md">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                </div>
                <div className="backdrop-blur-sm bg-white/90 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100">
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">{job.role}</h3>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-1">
                    <p className="text-blue-600 font-medium">{job.company}</p>
                    <p className="text-gray-500 flex items-center">
                      <svg className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {job.period}
                    </p>
                  </div>
                  <p className="mt-3 text-gray-600">{job.description}</p>
                  <ul className="mt-3 space-y-2">
                    {job.achievements.map((achievement, index) => (
                      <li key={index} className="text-gray-600 flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </motion.div>
      </section>

      {/* Education */}
      <section className="mb-12">
        <AnimatedSection>
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Education</h2>
            <div className="absolute bottom-0 left-0 w-20 h-1 bg-blue-500 rounded-full"></div>
          </div>
        </AnimatedSection>
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative border-l-2 border-blue-500 pl-8 ml-4"
        >
          {education.map((edu) => (
            <AnimatedSection key={edu.id}>
              <div className="relative mb-12">
                <div className="absolute -left-12 mt-1.5 h-7 w-7 rounded-full border-2 border-blue-500 bg-white flex items-center justify-center shadow-md">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                </div>
                <div className="backdrop-blur-sm bg-white/90 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100">
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">{edu.degree}</h3>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-1">
                    <p className="text-blue-600 font-medium">{edu.institution}</p>
                    <p className="text-gray-500 flex items-center">
                      <svg className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {edu.period}
                    </p>
                  </div>
                  <p className="mt-3 text-gray-600">{edu.description}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </motion.div>
      </section>

      {/* Skills */}
      <section className="mb-12">
        <AnimatedSection>
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Skills</h2>
            <div className="absolute bottom-0 left-0 w-16 h-1 bg-blue-500 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="backdrop-blur-sm bg-white/90 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full"></div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mb-4 relative z-10">Technical Skills</h3>
              <div className="flex flex-wrap gap-2 relative z-10">
                {skills.technical.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 transition-all duration-200 hover:bg-blue-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="backdrop-blur-sm bg-white/90 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/5 rounded-full"></div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mb-4 relative z-10">Soft Skills</h3>
              <div className="flex flex-wrap gap-2 relative z-10">
                {skills.soft.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200 transition-all duration-200 hover:bg-green-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Certifications */}
      <section>
        <AnimatedSection>
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Certifications</h2>
            <div className="absolute bottom-0 left-0 w-24 h-1 bg-blue-500 rounded-full"></div>
          </div>
          <div className="backdrop-blur-sm bg-white/90 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/5 rounded-full"></div>
            
            <ul className="space-y-3 relative z-10">
              {certifications.map((cert, index) => (
                <li key={index} className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 shadow-sm">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </AnimatedSection>
      </section>
      
      {/* Footer Wave Divider */}
      <div className="w-full h-16 overflow-hidden mt-16">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-blue-50"></path>
        </svg>
      </div>
    </div>
  );
};

export default ResumePage;
