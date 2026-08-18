import Navbar from '../components/Navbar';

function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-700">📧 Email: support@careercraft.com</p>
      </div>
    </div>
  );
}

export default Contact;