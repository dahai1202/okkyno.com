import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What plants do you recommend for beginners?",
    answer: "We recommend starting with low-maintenance plants like pothos, snake plants, ZZ plants, and peace lilies. These plants are forgiving and adapt well to various lighting conditions."
  },
  {
    question: "How often should I water my plants?",
    answer: "Watering frequency depends on the plant type, season, and environment. Generally, most houseplants prefer to dry out slightly between waterings. Check the soil moisture by inserting your finger 1-2 inches deep."
  },
  {
    question: "Do you offer plant care support?",
    answer: "Yes! We provide care guides with every plant purchase and offer ongoing support through our blog and customer service team. Feel free to contact us with any plant care questions."
  },
  {
    question: "What is your shipping policy?",
    answer: "We ship plants carefully packaged to ensure they arrive healthy. Standard shipping takes 3-5 business days, express shipping 1-2 days. We offer free shipping on orders over $75."
  },
  {
    question: "Can I return a plant if it doesn't survive?",
    answer: "We offer a 14-day guarantee on all plants. If your plant arrives damaged or doesn't survive within 14 days with proper care, we'll replace it or provide a full refund."
  },
  {
    question: "Do you have a loyalty program?",
    answer: "Yes! Join our Plant Parent Rewards program to earn points on every purchase, get exclusive discounts, and receive first access to new plant arrivals."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for your convenience."
  },
  {
    question: "How do I track my order?",
    answer: "Once your order ships, you'll receive a tracking number via email. You can also check your order status by logging into your account on our website."
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600">
              Find answers to common questions about our plants and services
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-gray-50">
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <div className="bg-green-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Still Have Questions?
              </h3>
              <p className="text-gray-600 mb-6">
                Our plant experts are here to help you succeed with your green journey.
              </p>
              <a 
                href="/contact" 
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}