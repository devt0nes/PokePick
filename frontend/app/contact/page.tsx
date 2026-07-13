'use client';

import { useState } from 'react';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const INITIAL_FORM: ContactForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Name validation
    if (formData.name.trim().length < 2) {
      setValidationError("Name must be at least 2 characters.");
      return;
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setValidationError("Please enter a valid email address.");
      return;
    }
    // Subject validation
    if (!formData.subject) {
      setValidationError("Please select a subject.");
      return;
    }
    // Message validation
    if (formData.message.trim().length < 20) {
      setValidationError("Message must be at least 20 characters.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setValidationError("");
    
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();

        try {
          const result = JSON.parse(text);
          throw new Error(result.error);
        } catch {
            throw new Error("Server error.");
        }
      }

      const result = await response.json();

      setSubmitStatus('success');
      setFormData(INITIAL_FORM);
    } catch (err) {
      console.error('Contact form error:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValidationError("");
    if(submitStatus !== "idle") {
      setSubmitStatus("idle");
    }
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-pixelify-sans font-bold text-[#1a1a1a] dark:text-white mb-4 drop-shadow-lg">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-pixelify-sans">
            Have questions about PokéPick? We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,0px_10px_#00000038,5px_5px_#00000038,-5px_5px_#00000038,inset_0px_5px_#ffffff1f,inset_0px_-5px_#00000030] p-8 border-4 border-[rgb(6,0,78)]">
            <h2 className="text-3xl font-bold text-[rgb(6,0,78)] dark:text-white font-pixelify-sans mb-6 text-center">
              Send us a message
            </h2>

            {validationError && (
              <div
                role="alert"
                className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 rounded-lg"
              >
                {validationError}
              </div>
            )}
            
            {submitStatus === 'success' && (
              <div
                role="status"
                aria-live="polite"
                className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-300 rounded-lg"
              >
                Thank you for your message! We'll get back to you soon.
              </div>
            )}

            {submitStatus === 'error' && (
              <div
                role="alert"
                className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 rounded-lg"
              >
                Failed to send message. Please try again or contact us directly at support@pokepick.com
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="support">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white font-jersey-15 bg-[#6abc3a] px-10 py-4 mb-2 text-lg border-0 shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,0px_10px_#00000038,5px_5px_#00000038,-5px_5px_#00000038,inset_0px_5px_#ffffff36] active:translate-y-[5px] active:shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,inset_0px_5px_#00000038] transition-all"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,0px_10px_#00000038,5px_5px_#00000038,-5px_5px_#00000038,inset_0px_5px_#ffffff1f,inset_0px_-5px_#00000030] p-8 border-4 border-[rgb(6,0,78)]">
              <h2 className="text-2xl font-bold text-[rgb(6,0,78)] dark:text-white font-pixelify-sans mb-6 text-center">
                Get in touch
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email</h3>
                    <a
                      href="mailto:support@pokepick.com"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      support@pokepick.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Response Time</h3>
                    <p className="text-gray-600 dark:text-gray-400">Within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">FAQ</h3>
                    <p className="text-gray-600 dark:text-gray-400">Check our frequently asked questions</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,0px_10px_#00000038,5px_5px_#00000038,-5px_5px_#00000038,inset_0px_5px_#ffffff1f,inset_0px_-5px_#00000030] p-8 border-4 border-[rgb(6,0,78)]">
              <h2 className="text-2xl font-bold text-[rgb(6,0,78)] dark:text-white font-pixelify-sans mb-6 text-center">
                About PokéPick
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                PokéPick is your ultimate Pokémon team builder and browser. Discover, collect, and manage your perfect Pokémon team with our comprehensive database and intuitive tools.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Whether you're a competitive battler or a casual collector, we're here to help you build the team of your dreams.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 