import { useState } from 'react';
import Navbar from '../components/Navbar';

function Contact() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', subject: 'General Inquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  const faqs = [
    { q: 'Is CareerCraft free to use?', a: 'Yes, you can build and download your resume completely free.' },
    { q: 'How does the AI suggestion feature work?', a: 'Our AI reviews your resume content and suggests clearer, more professional phrasing.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 text-center">
        <span className="inline-block text-xs font-semibold tracking-wide text-teal-700 mb-3">GET IN TOUCH</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">We'd Love to Hear From You</h1>
        <p className="text-gray-500 mb-12">
          Have questions about features, templates, or feedback? Reach out anytime!
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6 pb-16">
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-2xl mb-2">📍</div>
            <h3 className="font-semibold text-slate-800">Our Base</h3>
            <p className="text-gray-500 text-sm">Built and maintained remotely, serving job seekers everywhere.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-2xl mb-2">✉️</div>
            <h3 className="font-semibold text-slate-800">Email Us</h3>
            <p className="text-gray-500 text-sm">support@careercraft.com</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-2xl mb-2">💬</div>
            <h3 className="font-semibold text-slate-800">Response Time</h3>
            <p className="text-gray-500 text-sm">We typically reply within 24 hours.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md">
          <h2 className="text-xl font-semibold text-slate-800 mb-1">Send Us a Message</h2>
          <p className="text-gray-500 text-sm mb-5">Fill out the form and we'll get back to you soon.</p>

          {submitted ? (
            <p className="text-teal-700 font-medium">Thanks for reaching out! We'll get back to you soon.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required className="p-2 border rounded" />
                <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required className="p-2 border rounded" />
              </div>
              <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required className="w-full mb-3 p-2 border rounded" />
              <select name="subject" value={form.subject} onChange={handleChange} className="w-full mb-3 p-2 border rounded">
                <option>General Inquiry</option>
                <option>Feature Request</option>
                <option>Bug Report</option>
              </select>
              <textarea name="message" placeholder="How can we help you build a better resume?" value={form.message} onChange={handleChange} required rows="4" className="w-full mb-4 p-2 border rounded" />
              <button type="submit" className="w-full bg-slate-800 text-white py-3 rounded-md font-semibold hover:bg-slate-900">
                Send Message →
              </button>
            </form>
          )}
        </div>
      </div>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-semibold text-slate-800 text-sm">{f.q}</p>
              <p className="text-gray-500 text-sm mt-1">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Contact;