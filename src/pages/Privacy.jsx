import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Lock, Eye, Users, Database, 
  Cookie, Mail, Phone, MapPin, ArrowLeft,
  CheckCircle, AlertCircle, Server, UserCheck
} from 'lucide-react';

const Privacy = () => {
  const lastUpdated = 'June 25, 2026';

  const sections = [
    {
      icon: Shield,
      title: 'Information We Collect',
      content: `We collect information you provide directly, such as when you create an account, list a property, or contact us. This includes:
        • Personal identification information (name, email, phone number)
        • Property listing details
        • Communication history with agents and other users
        • Payment and transaction information
        • Device and usage information when you interact with our platform`
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: `We use the information we collect to:
        • Provide, maintain, and improve our services
        • Connect buyers, sellers, and agents
        • Process transactions and send related information
        • Send you technical notices, updates, and marketing communications
        • Respond to your comments and questions
        • Monitor and analyze trends, usage, and activities
        • Detect, investigate, and prevent fraudulent transactions and other illegal activities`
    },
    {
      icon: Users,
      title: 'Information Sharing',
      content: `We may share your information in the following circumstances:
        • With property agents and landlords when you express interest in a property
        • With service providers who perform services on our behalf
        • When required by law or to protect rights and safety
        • In connection with a business transfer (merger, acquisition, or sale)
        • With your consent or at your direction
        • We do not sell your personal information to third parties`
    },
    {
      icon: Database,
      title: 'Data Security',
      content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These include:
        • Encryption of data in transit and at rest
        • Secure server infrastructure
        • Regular security audits and vulnerability assessments
        • Access controls and authentication mechanisms
        • Staff training on data protection and privacy`
    },
    {
      icon: Cookie,
      title: 'Cookies and Tracking',
      content: `We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies help us:
        • Remember your preferences and settings
        • Understand how you interact with our platform
        • Provide personalized content and recommendations
        • Analyze site traffic and performance
        You can control cookie preferences through your browser settings.`
    },
    {
      icon: UserCheck,
      title: 'Your Rights',
      content: `You have the following rights regarding your personal information:
        • Access: Request a copy of your personal data
        • Correction: Update or correct inaccurate data
        • Deletion: Request deletion of your personal data
        • Object: Object to certain types of processing
        • Portability: Request transfer of your data
        • Withdraw consent: Withdraw consent at any time
        To exercise these rights, please contact us using the information below.`
    },
    {
      icon: AlertCircle,
      title: 'Data Retention',
      content: `We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. We may also retain information as required by law, for tax and accounting purposes, or to protect our legal interests. When we no longer need your information, we will securely delete or anonymize it.`
    },
    {
      icon: CheckCircle,
      title: 'Children\'s Privacy',
      content: `Our platform is not intended for children under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us. We will take steps to remove that information from our systems.`
    }
  ];

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-900 via-primary-800 to-primary-950 text-white py-12 sm:py-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-white/10">
              <Lock className="w-4 h-4" />
              <span>Privacy Policy</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-3">
              Privacy Policy
            </h1>
            <p className="text-primary-100/80 text-lg">
              Your privacy matters to us. Learn how we protect your data
            </p>
            <p className="text-primary-100/60 text-sm mt-2">
              Last Updated: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container-custom py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">
                On This Page
              </h3>
              <ul className="space-y-2 text-sm">
                {sections.map((section, index) => (
                  <li key={index}>
                    <a
                      href={`#section-${index}`}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center space-x-2"
                    >
                      <section.icon className="w-3.5 h-3.5" />
                      <span>{section.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to="/"
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm flex items-center space-x-1 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 md:p-10">
              {/* Introduction */}
              <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  At PrimeEstate, we respect your privacy and are committed to protecting your personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
                  you visit our platform. Please read this privacy policy carefully. If you do not agree with the 
                  terms of this privacy policy, please do not access the platform.
                </p>
              </div>

              {/* Sections */}
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div
                    key={index}
                    id={`section-${index}`}
                    className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700 last:border-0 last:mb-0 last:pb-0 scroll-mt-24"
                  >
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="bg-primary-50 dark:bg-primary-900/20 p-2 rounded-lg flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {section.title}
                      </h2>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 leading-relaxed ml-0 sm:ml-11 whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                );
              })}

              {/* Contact Section */}
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Contact Us
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                    <span>privacy@primeestate.ng</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                    <span>+234 800 123 4567</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                    <span>Victoria Island, Lagos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;