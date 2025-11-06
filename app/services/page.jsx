"use client";
import { motion } from "framer-motion";
import { 
  FaCode, 
  FaServer, 
  FaMobile, 
  FaPython, 
  FaDocker, 
  FaDatabase, 
  FaShieldAlt,
  FaRocket,
} from "react-icons/fa";
import { useRouter } from 'next/navigation';

const servicesList = [
  {
    id: 1,
    icon: FaCode,
    title: 'Frontend Development',
    description: 'Modern, responsive web applications with cutting-edge technologies',
    features: ['React & Next.js', 'Tailwind CSS', 'TypeScript', 'Framer Motion'],
    color: 'from-blue-500 to-cyan-500',
    text: 'Creating stunning, interactive user interfaces with React, Next.js, and modern CSS frameworks. I specialize in building responsive, accessible, and performant web applications that deliver exceptional user experiences across all devices.'
  },
  {
    id: 2,
    icon: FaServer,
    title: 'Backend Development',
    description: 'Scalable server-side solutions and API development',
    features: ['Node.js & Express', 'RESTful APIs', 'GraphQL', 'Microservices'],
    color: 'from-green-500 to-emerald-500',
    text: 'Building robust, scalable backend systems using Node.js, Express.js, and MongoDB. I develop secure APIs, implement authentication systems, and create efficient database architectures that power modern web applications.'
  },
  {
    id: 3,
    icon: FaMobile,
    title: 'Mobile App Development',
    description: 'Cross-platform mobile applications for iOS and Android',
    features: ['React Native', 'Flutter', 'iOS & Android', 'App Store Deployment'],
    color: 'from-purple-500 to-pink-500',
    text: 'Developing feature-rich mobile applications using React Native and Flutter. I create cross-platform solutions that provide native performance while maintaining code reusability across iOS and Android platforms.'
  },
  {
    id: 4,
    icon: FaPython,
    title: 'Python Development',
    description: 'Powerful Python applications and data solutions',
    features: ['Django & Flask', 'Data Analysis', 'Machine Learning', 'Automation'],
    color: 'from-yellow-500 to-orange-500',
    text: 'Building efficient Python applications using Django and Flask frameworks. I specialize in data analysis, automation scripts, and machine learning implementations that solve complex business problems.'
  },
  {
    id: 5,
    icon: FaDocker,
    title: 'DevOps & Cloud',
    description: 'Infrastructure automation and cloud deployment solutions',
    features: ['Docker & Kubernetes', 'AWS & Azure', 'CI/CD Pipelines', 'Monitoring'],
    color: 'from-indigo-500 to-blue-500',
    text: 'Implementing DevOps practices with Docker, Kubernetes, and cloud platforms. I automate deployment pipelines, set up monitoring systems, and ensure high availability and scalability of applications in production environments.'
  },
  {
    id: 6,
    icon: FaDatabase,
    title: 'Database Solutions',
    description: 'Database design, optimization, and management',
    features: ['MongoDB & PostgreSQL', 'Database Design', 'Query Optimization', 'Data Migration'],
    color: 'from-teal-500 to-cyan-500',
    text: 'Designing and optimizing database architectures for both SQL and NoSQL systems. I ensure data integrity, performance optimization, and implement efficient data management strategies for scalable applications.'
  },
  {
    id: 7,
    icon: FaShieldAlt,
    title: 'Security & Compliance',
    description: 'Application security and compliance implementation',
    features: ['Security Audits', 'Data Protection', 'GDPR Compliance', 'Penetration Testing'],
    color: 'from-red-500 to-pink-500',
    text: 'Implementing comprehensive security measures to protect applications and data. I conduct security audits, implement authentication systems, and ensure compliance with industry standards and regulations.'
  },
  {
    id: 8,
    icon: FaRocket,
    title: 'Performance Optimization',
    description: 'Application performance tuning and optimization',
    features: ['Speed Optimization', 'Caching Strategies', 'CDN Implementation', 'Load Testing'],
    color: 'from-emerald-500 to-green-500',
    text: 'Optimizing application performance through code optimization, caching strategies, and infrastructure improvements. I ensure applications load quickly and handle high traffic efficiently.'
  }
]

const Services = () => {
  const router = useRouter();
  return (
    <section className="min-h-screen py-4 bg-gradient-to-br from-primary via-primary to-primary/90">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            My <span className="text-accent">Services</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Comprehensive technology solutions tailored to your business needs. 
            From concept to deployment, I deliver exceptional results.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {servicesList.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full hover:bg-white/10 transition-all duration-300 hover:border-accent/50">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="text-2xl text-white" />
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors duration-300">
                      {service.title}
                    </h3>
                    
                    <p className="text-white/70 text-sm leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-accent rounded-full"></div>
                          <span className="text-white/60 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-accent/20 to-accent/10 rounded-2xl p-8 border border-accent/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Let's discuss how I can help bring your ideas to life with cutting-edge technology solutions.
            </p>
            <motion.button
              onClick={() => router.push('/contact')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-accent to-accent/80 text-primary font-semibold px-8 py-3 rounded-full hover:shadow-lg hover:shadow-accent/25 transition-all duration-300"
            >
              Get In Touch
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Services;