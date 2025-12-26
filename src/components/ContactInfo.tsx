import React from 'react'; // Import React

interface ContactInfoProps {
  variant?: 'default' | 'compact' | 'minimal';
  className?: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ variant = 'default', className = '' }) => {
  if (variant === 'minimal') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-start space-x-3">
          <MapPin className="h-4 w-4 text-primary-600 mt-1 flex-shrink-0" />
          <div className="text-sm text-gray-600">
            <div>Karlavägen 18, 114 31 Stockholm, Sweden</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Mail className="h-4 w-4 text-accent-cyan flex-shrink-0" />
          <span className="text-sm text-gray-600">support@northforce.io</span>
        </div>
        <div className="flex items-center space-x-3">
          <Phone className="h-4 w-4 text-accent-purple flex-shrink-0" />
          <a href="tel:+46103371334" className="text-sm text-gray-600 hover:text-accent-purple transition-colors">
            +46 10 337 13 34
          </a>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-gray-50 rounded-xl p-6 ${className}`}>
        <h3 className="font-heading text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
        <div className="space-y-3"> {/* MapPin */}
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <div className="text-gray-700">
              <div className="font-medium">Stockholm Office</div>
              <div className="text-sm">Karlavägen 18</div>
              <div className="text-sm">114 31 Stockholm, Sweden</div>
            </div>
          </div>
          <div className="flex items-center space-x-3"> {/* Mail */}
            <Mail className="h-5 w-5 text-accent-cyan flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">Email</div>
              <div className="text-sm text-gray-600">support@northforce.io</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-accent-purple flex-shrink-0" /> {/* Phone */}
            <div>
              <div className="font-medium text-gray-900">Phone</div>
              <div className="text-sm text-gray-600">
                <a href="tel:+46103371334" className="hover:text-accent-purple transition-colors">
                  +46 10 337 13 34
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-start space-x-4"> {/* MapPin */}
        <div className="text-blue-600 mt-1">
          <MapPin className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
          <div className="text-gray-700">
            <div>Karlavägen 18</div>
            <div>114 31 Stockholm, Sweden</div>
          </div>
        </div>
      </div>
      
      <div className="flex items-start space-x-4"> {/* Mail */}
        <div className="text-accent-cyan mt-1">
          <Mail className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
          <p className="text-lg text-gray-900">support@northforce.io</p>
        </div>
      </div>
      
      <div className="flex items-start space-x-4"> {/* Phone */}
        <div className="text-accent-purple mt-1">
          <Phone className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
          <p className="text-lg text-gray-900">
            <a href="tel:+46103371334" className="hover:text-accent-purple transition-colors">
              +46 10 337 13 34
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;