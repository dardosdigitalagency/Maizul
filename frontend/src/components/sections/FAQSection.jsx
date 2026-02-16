import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

export const FAQSection = () => {
  const { tObj, language } = useLanguage();
  const faq = tObj('faq') || {};
  const questions = faq.questions || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="section-padding bg-gradient-to-b from-white to-[#FDFCF8] overflow-hidden" data-testid="faq-section">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-[#FFEC76]/30 text-[#3B56B0] px-5 py-2.5 rounded-full mb-6"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <HelpCircle className="h-5 w-5" />
            <span className="font-semibold">FAQ</span>
          </motion.div>
          
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800"
            style={{ fontFamily: 'Fraunces, serif' }}
            data-testid="faq-title"
          >
            {faq.title}
          </h2>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {questions.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-white rounded-2xl border border-slate-100 px-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                  data-testid={`faq-item-${index}`}
                >
                  <AccordionTrigger className="text-left text-slate-800 font-medium hover:text-[#3B56B0] py-5 text-base md:text-lg">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 pb-5 leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-slate-500 mb-4">
            {language === 'es' 
              ? '¿Tienes otra pregunta? Escríbenos por WhatsApp' 
              : 'Have another question? Message us on WhatsApp'}
          </p>
          <motion.a
            href={`https://wa.me/523221393087`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#3B56B0] font-semibold hover:underline"
            whileHover={{ scale: 1.05 }}
          >
            +52 322 139 3087 →
          </motion.a>
        </motion.div>

        {/* SEO Schema hidden for FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: questions.map((item) => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: item.a,
                },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
};
