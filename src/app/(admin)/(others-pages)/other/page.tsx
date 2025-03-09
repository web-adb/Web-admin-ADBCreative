import React from 'react';
import {
  FaFigma, FaPaintBrush, FaRobot, FaPalette, FaMagic, FaVectorSquare, FaImage, FaCode, FaCamera, FaVideo, FaMusic, FaBrain,
  FaComment, FaExpand, FaChartLine, FaLanguage, FaFileAlt, FaMicrophone, FaSearch, FaPen, FaBook, FaShieldAlt, FaShoppingCart,
  FaHandsHelping, FaLightbulb, FaUser, FaChartBar, FaCloud, FaMobileAlt, FaGlobe, FaTools
} from 'react-icons/fa';

const AIFeaturesGrid = () => {
  const aiFeatures = [
    {
      name: 'Adobe Firefly',
      icon: <FaFigma className="w-6 h-6 text-white" />,
      link: 'https://www.adobe.com/sensei/generative-ai/firefly.html',
      description: 'Alat AI generatif untuk membuat visual dan desain menakjubkan.',
      iconBg: 'bg-blue-600',
    },
    {
      name: 'Canva AI Tools',
      icon: <FaFigma className="w-6 h-6 text-white" />,
      link: 'https://www.canva.com/ai-tools/',
      description: 'Alat desain berbasis AI untuk kreativitas tanpa effort.',
      iconBg: 'bg-green-500',
    },
    {
      name: 'Figma AI',
      icon: <FaFigma className="w-6 h-6 text-white" />,
      link: 'https://www.figma.com/ai',
      description: 'Fitur AI untuk desain kolaboratif dan prototyping.',
      iconBg: 'bg-purple-600',
    },
    {
      name: 'AI Art Generator',
      icon: <FaPaintBrush className="w-6 h-6 text-white" />,
      link: 'https://www.aiartgenerator.com',
      description: 'Buat karya seni unik dengan alat berbasis AI.',
      iconBg: 'bg-yellow-500',
    },
    {
      name: 'AI Background Remover',
      icon: <FaImage className="w-6 h-6 text-white" />,
      link: 'https://www.remove.bg',
      description: 'Hapus latar belakang gambar secara instan dengan AI.',
      iconBg: 'bg-pink-500',
    },
    {
      name: 'AI Vectorizer',
      icon: <FaVectorSquare className="w-6 h-6 text-white" />,
      link: 'https://www.vectorizer.ai',
      description: 'Konversi gambar raster ke vektor skalabel menggunakan AI.',
      iconBg: 'bg-indigo-500',
    },
    {
      name: 'AI Color Palette Generator',
      icon: <FaPalette className="w-6 h-6 text-white" />,
      link: 'https://www.colormind.io',
      description: 'Hasilkan palet warna yang indah dengan AI.',
      iconBg: 'bg-teal-500',
    },
    {
      name: 'AI Design Assistant',
      icon: <FaMagic className="w-6 h-6 text-white" />,
      link: 'https://www.design.ai',
      description: 'Dapatkan saran desain berbasis AI.',
      iconBg: 'bg-red-500',
    },
    {
      name: 'AI Code Generator',
      icon: <FaCode className="w-6 h-6 text-white" />,
      link: 'https://www.github.com/copilot',
      description: 'Hasilkan snippet kode dan template dengan AI.',
      iconBg: 'bg-gray-700',
    },
    {
      name: 'AI Photo Enhancer',
      icon: <FaCamera className="w-6 h-6 text-white" />,
      link: 'https://www.letsenhance.io',
      description: 'Tingkatkan kualitas foto secara otomatis dengan AI.',
      iconBg: 'bg-blue-500',
    },
    {
      name: 'AI Video Editor',
      icon: <FaVideo className="w-6 h-6 text-white" />,
      link: 'https://www.runwayml.com',
      description: 'Edit video dengan bantuan AI untuk hasil profesional.',
      iconBg: 'bg-purple-500',
    },
    {
      name: 'AI Music Composer',
      icon: <FaMusic className="w-6 h-6 text-white" />,
      link: 'https://www.ampermusic.com',
      description: 'Buat musik orisinal dengan komposer berbasis AI.',
      iconBg: 'bg-green-600',
    },
    {
      name: 'AI Chatbot',
      icon: <FaRobot className="w-6 h-6 text-white" />,
      link: 'https://www.dialogflow.com',
      description: 'Bangun chatbot cerdas dengan teknologi AI.',
      iconBg: 'bg-orange-500',
    },
    {
      name: 'AI Brainstorming',
      icon: <FaBrain className="w-6 h-6 text-white" />,
      link: 'https://www.ideator.ai',
      description: 'Alat brainstorming berbasis AI untuk ide kreatif.',
      iconBg: 'bg-gray-800',
    },
    {
      name: 'ChatGPT',
      icon: <FaComment className="w-6 h-6 text-white" />,
      link: 'https://openai.com/chatgpt',
      description: 'Asisten AI cerdas untuk percakapan dan pemecahan masalah.',
      iconBg: 'bg-green-700',
    },
    {
      name: 'AI Image Scaler',
      icon: <FaExpand className="w-6 h-6 text-white" />,
      link: 'https://www.upscale.media',
      description: 'Tingkatkan resolusi gambar tanpa kehilangan kualitas.',
      iconBg: 'bg-pink-600',
    },
    {
      name: 'AI Data Analyzer',
      icon: <FaChartLine className="w-6 h-6 text-white" />,
      link: 'https://www.tableau.com',
      description: 'Analisis data secara otomatis dengan bantuan AI.',
      iconBg: 'bg-blue-700',
    },
    {
      name: 'AI Language Translator',
      icon: <FaLanguage className="w-6 h-6 text-white" />,
      link: 'https://www.deepl.com',
      description: 'Terjemahkan teks dengan akurasi tinggi menggunakan AI.',
      iconBg: 'bg-indigo-600',
    },
    {
      name: 'AI Document Summarizer',
      icon: <FaFileAlt className="w-6 h-6 text-white" />,
      link: 'https://www.smmry.com',
      description: 'Ringkas dokumen panjang menjadi poin-poin penting.',
      iconBg: 'bg-teal-600',
    },
    {
      name: 'AI Voice Assistant',
      icon: <FaMicrophone className="w-6 h-6 text-white" />,
      link: 'https://www.google.com/assistant',
      description: 'Asisten suara berbasis AI untuk tugas sehari-hari.',
      iconBg: 'bg-purple-700',
    },
    {
      name: 'AI Search Engine',
      icon: <FaSearch className="w-6 h-6 text-white" />,
      link: 'https://www.perplexity.ai',
      description: 'Mesin pencari cerdas berbasis AI untuk hasil yang relevan.',
      iconBg: 'bg-yellow-600',
    },
    {
      name: 'AI Writing Assistant',
      icon: <FaPen className="w-6 h-6 text-white" />,
      link: 'https://www.grammarly.com',
      description: 'Alat penulisan berbasis AI untuk meningkatkan kualitas teks.',
      iconBg: 'bg-red-600',
    },
    {
      name: 'AI Learning Platform',
      icon: <FaBook className="w-6 h-6 text-white" />,
      link: 'https://www.coursera.org',
      description: 'Platform pembelajaran berbasis AI untuk kursus online.',
      iconBg: 'bg-blue-800',
    },
    {
      name: 'AI Cybersecurity',
      icon: <FaShieldAlt className="w-6 h-6 text-white" />,
      link: 'https://www.darktrace.com',
      description: 'Deteksi dan cegah ancaman siber dengan bantuan AI.',
      iconBg: 'bg-gray-900',
    },
    {
      name: 'AI E-commerce Assistant',
      icon: <FaShoppingCart className="w-6 h-6 text-white" />,
      link: 'https://www.salesforce.com/einstein',
      description: 'Tingkatkan penjualan dengan rekomendasi produk berbasis AI.',
      iconBg: 'bg-orange-600',
    },
    {
      name: 'AI Customer Support',
      icon: <FaHandsHelping className="w-6 h-6 text-white" />,
      link: 'https://www.zendesk.com',
      description: 'Layanan dukungan pelanggan otomatis dengan AI.',
      iconBg: 'bg-green-800',
    },
    {
      name: 'AI Idea Generator',
      icon: <FaLightbulb className="w-6 h-6 text-white" />,
      link: 'https://www.ideaconnection.com',
      description: 'Hasilkan ide kreatif dengan bantuan AI.',
      iconBg: 'bg-yellow-700',
    },
    {
      name: 'AI Personalization',
      icon: <FaUser className="w-6 h-6 text-white" />,
      link: 'https://www.personali.com',
      description: 'Personalisasi pengalaman pengguna dengan AI.',
      iconBg: 'bg-pink-700',
    },
    {
      name: 'AI Financial Advisor',
      icon: <FaChartBar className="w-6 h-6 text-white" />,
      link: 'https://www.betterment.com',
      description: 'Manajemen keuangan pribadi dengan bantuan AI.',
      iconBg: 'bg-blue-900',
    },
    {
      name: 'AI Cloud Services',
      icon: <FaCloud className="w-6 h-6 text-white" />,
      link: 'https://www.ibm.com/cloud',
      description: 'Layanan cloud berbasis AI untuk bisnis.',
      iconBg: 'bg-indigo-800',
    },
    {
      name: 'AI Mobile App Development',
      icon: <FaMobileAlt className="w-6 h-6 text-white" />,
      link: 'https://www.appgyver.com',
      description: 'Buat aplikasi mobile dengan bantuan AI.',
      iconBg: 'bg-purple-800',
    },
    {
      name: 'AI Global Trends',
      icon: <FaGlobe className="w-6 h-6 text-white" />,
      link: 'https://www.trendwatching.com',
      description: 'Analisis tren global dengan bantuan AI.',
      iconBg: 'bg-teal-800',
    },
    {
      name: 'AI Productivity Tools',
      icon: <FaTools className="w-6 h-6 text-white" />,
      link: 'https://www.notion.so',
      description: 'Tingkatkan produktivitas dengan alat berbasis AI.',
      iconBg: 'bg-gray-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-6 rounded-lg mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Alat-Alat AI untuk Berbagai Kebutuhan</h1>
        <p className="text-lg">
          Temukan berbagai alat AI terbaik untuk desain, produktivitas, keamanan, dan banyak lagi.
        </p>
      </div>

      {/* Grid Fitur AI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {aiFeatures.map((feature, index) => (
          <a
            key={index}
            href={feature.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center text-center"
          >
            {/* Latar Belakang Ikon */}
            <div className={`${feature.iconBg} p-3 rounded-lg mb-4`}>
              {feature.icon}
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
              {feature.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AIFeaturesGrid;