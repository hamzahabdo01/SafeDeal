import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  Lock, 
  ArrowRight, 
  Star,
  Zap,
  Globe,
  Award,
  Play,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { APP_CONFIG } from '../utils/constants';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Shield,
      title: 'Bank-Grade Security',
      description: 'Your funds are protected with military-grade encryption and multi-layer security protocols.',
      color: 'blue',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Complete transactions in seconds with our optimized blockchain infrastructure.',
      color: 'yellow',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Trade safely with anyone, anywhere in the world with multi-currency support.',
      color: 'green',
    },
    {
      icon: Award,
      title: 'Trusted by Thousands',
      description: 'Join over 50,000+ users who trust SafeDeal for their secure transactions.',
      color: 'purple',
    },
  ];

  const stats = [
    { number: '50K+', label: 'Happy Users' },
    { number: '$10M+', label: 'Secured' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'E-commerce Seller',
      content: 'SafeDeal transformed how I handle online payments. The security and ease of use are unmatched!',
      rating: 5,
      avatar: '👩‍💼',
    },
    {
      name: 'Michael Chen',
      role: 'Freelancer',
      content: 'I\'ve used many escrow services, but SafeDeal\'s speed and reliability keep me coming back.',
      rating: 5,
      avatar: '👨‍💻',
    },
    {
      name: 'Emily Davis',
      role: 'Small Business Owner',
      content: 'The peace of mind SafeDeal provides is invaluable. Highly recommend for any online business.',
      rating: 5,
      avatar: '👩‍🚀',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-32">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-800 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 mb-4">
                <Zap className="w-4 h-4 mr-2" />
                Trusted by 50,000+ users worldwide
              </span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Secure Escrow
              <br />
              <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                Made Simple
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
            >
              The world's most trusted escrow platform. Protect your money, secure your deals, 
              and trade with confidence. Join millions who choose SafeDeal for safe transactions.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg group">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg group">
                      Start Free Today
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg border-2 hover:bg-gray-50 dark:hover:bg-gray-800">
                      Watch Demo
                      <Play className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={floatingVariants}
                  animate="animate"
                  style={{ animationDelay: `${index * 0.5}s` }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Why Choose {APP_CONFIG.NAME}?
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              We provide the most secure, fast, and user-friendly escrow platform 
              designed for modern digital transactions.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
                yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
                green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
                purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
              };

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Card className="h-full text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                    <CardContent className="p-8">
                      <motion.div 
                        className="flex justify-center mb-6"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <div className={`flex items-center justify-center w-16 h-16 rounded-2xl ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                          <Icon className="h-8 w-8" />
                        </div>
                      </motion.div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              How It Works
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              Simple, secure, and transparent process in just three easy steps.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
          >
            {[
              {
                step: '01',
                title: 'Create Escrow',
                description: 'Set up your escrow with transaction details, terms, and conditions in minutes.',
                icon: Shield,
              },
              {
                step: '02',
                title: 'Secure Payment',
                description: 'Buyer funds the escrow account. Money is held securely until conditions are met.',
                icon: Lock,
              },
              {
                step: '03',
                title: 'Release Funds',
                description: 'Once conditions are satisfied, funds are automatically released to the seller.',
                icon: CheckCircle,
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center group"
                >
                  <motion.div 
                    className="relative mb-8"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                          <Icon className="h-10 w-10" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {item.step}
                        </div>
                      </div>
                    </div>
                    {index < 2 && (
                      <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-transparent"></div>
                    )}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              What Our Users Say
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              Join thousands of satisfied customers who trust SafeDeal for their secure transactions.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">{testimonial.avatar}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="py-20 lg:py-32 bg-gradient-to-r from-primary-600 via-blue-600 to-indigo-600 relative overflow-hidden"
        >
          {/* Background Animation */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-600/90 to-blue-600/90"></div>
                         <motion.div
               animate={{
                 scale: [1, 1.1, 1],
                 rotate: [0, 5, 0],
               }}
               transition={{
                 duration: 8,
                 repeat: Infinity,
               }}
               className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full"
             ></motion.div>
             <motion.div
               animate={{
                 scale: [1.1, 1, 1.1],
                 rotate: [5, 0, 5],
               }}
               transition={{
                 duration: 10,
                 repeat: Infinity,
               }}
               className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full"
             ></motion.div>
          </div>

          <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold text-white mb-6"
            >
              Ready to Get Started?
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-primary-100 mb-8 leading-relaxed"
            >
              Join over 50,000 users who trust {APP_CONFIG.NAME} for secure, 
              fast, and reliable escrow services. Start your first transaction today!
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/register">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full sm:w-auto px-8 py-4 text-lg bg-white text-primary-600 hover:bg-gray-50 group"
                >
                  Create Free Account
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto px-8 py-4 text-lg border-2 border-white text-white hover:bg-white/10"
                >
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default Home;