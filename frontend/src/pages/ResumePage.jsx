import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { getResumeEntries } from '../services/resumeService';

const ResumePage = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: "Cedrick Carter",
    title: "Software Developer",
    summary: "Versatile software developer adept at documentation comprehension, automation, and seamless code integration using diverse coding tools. Driven by entrepreneurial initiative and enthusiasm for machine learning, I excel at problem-solving, API integrations, AI-powered solutions, and low-code/no-code development.",
    email: "cartercedrick35@gmail.com",
    phone: "(502) 830-7701",
    location: "Willing to relocate - U.S. or remote",
    linkedin: "linkedin.com/in/cedrick-carter-5b41b4315/",
    github: "github.com/ceddto100",
  });

  const [workExperience, setWorkExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [skills, setSkills] = useState({
    technical: [],
    soft: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching resume data...');
        const response = await getResumeEntries();
        console.log('Resume API response:', response);

        if (!response.success) {
          throw new Error(response.error || 'Failed to fetch resume data');
        }

        if (!Array.isArray(response.data)) {
          console.error('Invalid response format:', response);
          throw new Error('Invalid response format from API');
        }

        console.log('Processing resume data...');
        // Process the resume entries
        const workExp = response.data.filter(entry => entry.type === 'work');
        const edu = response.data.filter(entry => entry.type === 'education');
        const certs = response.data.filter(entry => entry.type === 'certification');

        console.log('Work Experience:', workExp);
        console.log('Education:', edu);
        console.log('Certifications:', certs);

        // Extract skills from work experience
        const technicalSkills = new Set();
        const softSkills = new Set();

        workExp.forEach(job => {
          if (job.skills) {
            job.skills.forEach(skill => {
              // Assuming all skills in the API response are technical
              technicalSkills.add(skill);
            });
          }
        });

        setWorkExperience(workExp);
        setEducation(edu);
        setCertifications(certs);
        setSkills({
          technical: Array.from(technicalSkills),
          soft: Array.from(softSkills)
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching resume data:', err);
        setError(err.message || 'Failed to load resume data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumeData();
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header / Personal Info */}
      <AnimatedSection>
        <div className="bg-white rounded-lg shadow-md p-8 mb-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">{personalInfo.name}</h1>
              <h2 className="text-2xl text-blue-600 mt-1">{personalInfo.title}</h2>
            </div>
            <div className="mt-4 md:mt-0 space-y-1 text-gray-600">
              <p>{personalInfo.email}</p>
              <p>{personalInfo.phone}</p>
              <p>{personalInfo.location}</p>
              <div className="flex space-x-4 mt-2">
                <a href={`https://${personalInfo.linkedin}`} className="text-blue-600 hover:text-blue-800 flex items-center">
                  <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  LinkedIn
                </a>
                <a
                  href={`https://${personalInfo.github}`}
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Professional Summary</h3>
            <p className="text-gray-600">{personalInfo.summary}</p>
          </div>
        </div>
      </AnimatedSection>

      {/* Work Experience */}
      <section className="mb-12">
        <AnimatedSection>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mb-6 border-b pb-2">Work Experience</h2>
        </AnimatedSection>
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative border-l-2 border-blue-500 pl-8 ml-4"
        >
          {workExperience.map((job) => (
            <AnimatedSection key={job._id}>
              <div className="relative mb-12">
                <div className="absolute -left-12 mt-1.5 h-7 w-7 rounded-full border-2 border-blue-500 bg-white flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">{job.jobTitle}</h3>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-1">
                    <p className="text-blue-600 font-medium">{job.company}</p>
                    <p className="text-gray-500">{new Date(job.startDate).toLocaleDateString()} - {job.endDate ? new Date(job.endDate).toLocaleDateString() : 'Present'}</p>
                  </div>
                  <p className="mt-3 text-gray-600">{job.description}</p>
                  <ul className="mt-3 space-y-1">
                    {job.achievements.map((achievement, index) => (
                      <li key={index} className="text-gray-600 flex items-start">
                        <span className="inline-block h-5 w-5 text-blue-500 mr-2">•</span>
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
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mb-6 border-b pb-2">Education</h2>
        </AnimatedSection>
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative border-l-2 border-blue-500 pl-8 ml-4"
        >
          {education.map((edu) => (
            <AnimatedSection key={edu._id}>
              <div className="relative mb-12">
                <div className="absolute -left-12 mt-1.5 h-7 w-7 rounded-full border-2 border-blue-500 bg-white flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">{edu.degree}</h3>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-1">
                    <p className="text-blue-600 font-medium">{edu.institution}</p>
                    <p className="text-gray-500">{edu.period}</p>
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
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mb-6 border-b pb-2">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mb-4">Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.technical.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mb-4">Soft Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.soft.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
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
      {certifications.length > 0 && (
        <section>
          <AnimatedSection>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mb-6 border-b pb-2">Certifications</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <ul className="space-y-2">
                {certifications.map((cert, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{cert.title}</span>
                    {cert.year && (
                      <span className="text-sm text-gray-500 ml-2">({cert.year})</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </section>
      )}
    </div>
  );
};

export default ResumePage;
