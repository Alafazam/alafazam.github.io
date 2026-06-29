import React from 'react';

export interface FaqItem {
  question: string;
  answer: string;
}

// Keep these in sync with the FAQPage JSON-LD in index.html so the visible
// DOM matches the structured data crawlers read.
export const faqItems: FaqItem[] = [
  {
    question: 'What does Alaf Azam Khan do?',
    answer:
      'Alaf Azam Khan is Director of Engineering & Product at Increff, where he leads both engineering and product for a next-generation retail merchandising analytics platform. He grew with Increff from SDE to Director over 9+ years, scaling a SaaS product suite to $12M+ ARR.',
  },
  {
    question: 'What is Increff?',
    answer:
      'Increff is a retail-tech SaaS company (Sequoia-backed, Series B) building warehouse management, order management, and merchandising software for retailers and brands. Its platform manages 200M+ SKUs and processes 8M+ orders monthly for 100+ enterprise clients.',
  },
  {
    question: 'What is a dual Engineering and Product Director?',
    answer:
      'A dual Engineering and Product Director owns both the technical architecture and the product strategy for a product line under a single mandate. Alaf manages engineers and writes product specs, combining deep technical depth (ex-SDE3) with product leadership to reduce hand-off friction and accelerate delivery.',
  },
  {
    question: 'What is the Increff Merchandising Platform?',
    answer:
      'The Increff Merchandising Platform is a next-generation retail merchandising analytics product — a one-stop, highly customizable, high-performance solution for configuring any retail workflow (assortment, OTB, markdown, replenishment), powered by Increff algorithms and AI agents.',
  },
  {
    question: 'Is Alaf available for advisory or consulting?',
    answer:
      'Alaf is open to selective advisory conversations in retail-tech, product leadership, and AI-native product development. The best way to reach him is via LinkedIn at linkedin.com/in/alafazam.',
  },
];

const Faq: React.FC = () => {
  return (
    <section className="mb-8 mt-4" aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="text-xl text-gray-700 dark:text-gray-300 mb-3 mt-2"
      >
        Frequently Asked Questions
      </h2>
      <div className="space-y-2">
        {faqItems.map((item) => (
          <details
            key={item.question}
            className="group border-b border-gray-200 dark:border-gray-700 pb-2"
          >
            <summary className="cursor-pointer font-medium text-gray-800 dark:text-gray-200 py-1 list-none flex items-center justify-between">
              <span>{item.question}</span>
              <span className="ml-2 text-gray-400 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
};

export default Faq;
