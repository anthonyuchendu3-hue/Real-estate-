import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, FileText, Scale, Users, Building2, 
  Home, Clock, AlertCircle, CheckCircle, ArrowLeft,
  Mail, Phone, MapPin
} from 'lucide-react';

const Terms = () => {
  const lastUpdated = 'June 25, 2026';

  const sections = [
    {
      icon: Scale,
      title: 'Acceptance of Terms',
      content: `By using PrimeEstate ("we", "us", "our"), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. These terms apply to all visitors, users, and others who access or use the service.`
    },
    {
      icon: Users,
      title: 'User Accounts',
      content: `To access certain features of the platform, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.`
    },
    {
      icon: Building2,
      title: 'Property Listings',
      content: `All property listings on PrimeEstate are provided by third-party agents, landlords, and property owners. While we strive to ensure accuracy, we do not guarantee the accuracy, completeness, or reliability of any listing information. Users should verify all property details independently before making any decisions.`
    },
    {
      icon: Home,
      title: 'Transactions and Payments',
      content: `PrimeEstate facilitates connections between property seekers and providers but is not a party to any transaction. All payments, deposits, and agreements are between the user and the property provider. We recommend users conduct thorough due diligence before entering into any property transaction.`
    },
    {
      icon: Clock,
      title: 'User Conduct',
      content: `Users agree to use the platform responsibly and lawfully. Prohibited activities include: fraudulent behavior, spamming, harassment, posting false or misleading information, attempting to bypass security measures, and any activity that disrupts the platform's functionality.`
    },
    {
      icon: Shield,
      title: 'Intellectual Property',
      content: `All content on PrimeEstate, including text, graphics, logos, images, and software, is the property of PrimeEstate or its content suppliers and is protected by Nigerian and international copyright laws. Users may not reproduce, distribute, or create derivative works without explicit permission.`
    },
    {
      icon: AlertCircle,
      title: 'Disclaimer of Warranties',
      content: `The platform is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the platform will be uninterrupted, secure, or error-free. Your use of the platform is at your sole risk.`
    },
    {
      icon: CheckCircle,
      title: 'Limitation of Liability',
      content: `To the fullest extent permitted by law, PrimeEstate shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the platform. This includes damages for loss of profits, data, or other intangible losses.`
    }
  ];

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-900 via-primary-800 to-primary-950 text-white py-12 sm:py-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-white/10">
              <FileText className="w-4 h-4" />
              <span>Terms of Service</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-3">
              Terms of Service
            </h1>
            <p className="text-primary-100/80 text-lg">
              Please read these terms carefully before using PrimeEstate
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
                  Welcome to PrimeEstate. These Terms of Service govern your use of our platform and services. 
                  By accessing or using PrimeEstate, you agree to be bound by these terms. If you are using 
                  our platform on behalf of an organization, you represent that you have the authority to 
                  bind that organization to these terms.
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
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed ml-0 sm:ml-11">
                      {section.content}
                    </p>
                  </div>
                );
              })}

              {/* Contact Section */}
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Contact Us
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                    <span>legal@primeestate.ng</span>
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

export default Terms;